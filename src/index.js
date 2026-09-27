import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import readline from 'node:readline/promises'

import { BOT_NAME, OWNER_NUMBERS, PHONE_NUMBER, PREFIX, SESSION_DIR } from './config.js'
import { loadCommands } from './commands/loader.js'
import { getCommandText, parseCommand } from './utils/command.js'
import { initMemory, getHistory, addMessage } from './services/memory.js'
import { initReminders } from './services/reminders.js'
import { aiEnabled, askAI } from './services/ai.js'
import { isAutoAIEnabled } from './services/ai-mode.js'

const logger = pino({ level: 'error' })

async function askForPhoneNumber() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    const answer = (await rl.question('Nyx ativada! Digite seu numero para conectar (555599999999): ')).trim()
    return answer.replace(/\D/g, '')
  } finally {
    rl.close()
  }
}

async function startBot(savedPhoneNumber = '') {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)
  await initMemory()

  let phoneNumber = savedPhoneNumber || PHONE_NUMBER

  if (!state.creds.registered && !phoneNumber) {
    phoneNumber = await askForPhoneNumber()

    if (!phoneNumber) {
      console.log('Nenhum número informado. Execute npm start novamente.')
      return
    }
  }

  const commands = await loadCommands()
  let pairingRequested = false

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu(BOT_NAME),
    markOnlineOnConnect: false,
    logger
  })

  await initReminders((jid, content) => sock.sendMessage(jid, content))
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (
      !state.creds.registered &&
      !pairingRequested &&
      (connection === 'connecting' || qr)
    ) {
      pairingRequested = true

      try {
        const code = await sock.requestPairingCode(phoneNumber)
        const formattedCode = code.length === 8
          ? code.slice(0, 4) + '-' + code.slice(4)
          : code

        console.log('')
        console.log('Solicitação bem sucedida.')
        console.log('Clique na notificação')
        console.log('ou')
        console.log('WhatsApp > Configurações > Dispositivos conectados > Conectar com um número de telefone')
        console.log('E cole este código: ' + formattedCode)
        console.log('')
      } catch (error) {
        pairingRequested = false
        logger.error({ err: error }, 'Não foi possível gerar o pairing code.')
      }
    }

    if (connection === 'open') {
      console.log('Nyx conectada ao WhatsApp.')
      return
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut

      if (shouldReconnect) {
        await startBot(phoneNumber)
      } else {
        console.log('Sessão encerrada. Apague a pasta sessions/nyx para vincular novamente.')
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue

      try {
        const jid = message.key.remoteJid
        if (!jid) continue

        const text = getCommandText(message)
        const commandData = parseCommand(text, PREFIX)

        if (!commandData) {
          if (isAutoAIEnabled() && aiEnabled() && !jid.endsWith('@g.us') && text) {
            try {
              const history = getHistory(jid).slice(-12)
              const answer = await askAI({
                prompt: text,
                context: history,
                system: 'Você é Nyx, uma persona feminina e uma assistente de WhatsApp amigável, natural e objetiva. Responda em português do Brasil, a menos que o usuário peça outro idioma.'
              })

              await addMessage(jid, 'user', text)
              await addMessage(jid, 'assistant', answer)
              await sock.sendMessage(jid, { text: '🟣 Nyx\\n\\n' + answer })
            } catch (error) {
              logger.error({ err: error }, 'Erro no modo IA automático.')
            }
          }
          continue
        }

        const command = commands.get(commandData.name)
        if (!command) continue

        const isGroup = jid.endsWith('@g.us')
        const sender = message.key.participant || message.key.remoteJid || ''
        const senderNumber = sender.split('@')[0].replace(/\D/g, '')
        const isOwner = OWNER_NUMBERS.includes(senderNumber)

        if (command.ownerOnly && !isOwner) {
          await sock.sendMessage(jid, { text: '⛔ Este comando é exclusivo do dono da Nyx.' })
          continue
        }

        if (command.groupOnly && !isGroup) {
          await sock.sendMessage(jid, { text: '⚠️ Este comando só pode ser usado em grupos.' })
          continue
        }

        let groupMetadata = null
        let isAdmin = false

        if (isGroup && command.adminOnly) {
          groupMetadata = await sock.groupMetadata(jid)
          const participant = groupMetadata.participants.find(
            (item) => item.id === sender
          )
          isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin'

          if (!isAdmin && !isOwner) {
            await sock.sendMessage(jid, { text: '⛔ Este comando é exclusivo para administradores.' })
            continue
          }
        }

        if (isGroup && !groupMetadata) {
          try {
            groupMetadata = await sock.groupMetadata(jid)
          } catch {
            groupMetadata = null
          }
        }

        await command.execute({
          sock,
          message,
          jid,
          sender,
          senderNumber,
          args: commandData.args,
          rawArgs: commandData.rawArgs,
          commands,
          prefix: PREFIX,
          isGroup,
          isOwner,
          isAdmin,
          groupMetadata
        })
      } catch (error) {
        logger.error({ err: error }, 'Erro ao processar mensagem.')
      }
    }
  })
}

startBot().catch((error) => {
  logger.error({ err: error }, 'Falha fatal ao iniciar o ' + BOT_NAME + '.')
  process.exit(1)
})
