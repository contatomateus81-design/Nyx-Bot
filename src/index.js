import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import pino from 'pino'

import { config } from './config.js'
import { loadCommands } from './commands/loader.js'
import { getCommandText, parseCommand } from './utils/command.js'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir)
  const commands = await loadCommands()
  let pairingRequested = false

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu('Nyx-Bot'),
    markOnlineOnConnect: false,
    logger
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (
      !state.creds.registered &&
      config.phoneNumber &&
      !pairingRequested &&
      (connection === 'connecting' || qr)
    ) {
      pairingRequested = true

      try {
        const code = await sock.requestPairingCode(config.phoneNumber)
        logger.info(`Pairing code: ${code}`)
      } catch (error) {
        pairingRequested = false
        logger.error({ err: error }, 'Nao foi possivel gerar o pairing code.')
      }
    }

    if (!state.creds.registered && !config.phoneNumber && qr) {
      logger.info('Escaneie o QR code abaixo para conectar o WhatsApp:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      logger.info('Nyx-Bot conectado ao WhatsApp.')
      return
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut

      logger.warn({ statusCode, shouldReconnect }, 'Conexao encerrada.')

      if (shouldReconnect) {
        await startBot()
      } else {
        logger.error('Sessao encerrada. Apague a pasta de sessao para vincular novamente.')
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
        const commandData = parseCommand(text, config.prefix)
        if (!commandData) continue

        const command = commands.get(commandData.name)
        if (!command) continue

        const isGroup = jid.endsWith('@g.us')
        const sender = message.key.participant || message.key.remoteJid || ''
        const senderNumber = sender.split('@')[0].replace(/\\D/g, '')
        const isOwner = config.ownerNumbers.includes(senderNumber)

        if (command.ownerOnly && !isOwner) {
          await sock.sendMessage(jid, { text: '⛔ Este comando é exclusivo do dono do bot.' })
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
          prefix: config.prefix,
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
  logger.error({ err: error }, 'Falha fatal ao iniciar o Nyx-Bot.')
  process.exit(1)
})
