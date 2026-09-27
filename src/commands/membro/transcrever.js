import { downloadContentFromMessage } from '@whiskeysockets/baileys'
import { transcriptionEnabled, transcribeAudio } from '../../services/transcription.js'

function getAudioMessage(message) {
  const direct = message?.message?.audioMessage
  if (direct) return direct

  const quoted = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage
  return quoted?.audioMessage || null
}

export default {
  name: 'transcrever',
  aliases: ['transcricao', 'audio'],
  description: 'Transcreve um áudio enviado ou respondido.',
  execute: async ({ sock, jid, message }) => {
    if (!transcriptionEnabled()) {
      await sock.sendMessage(jid, {
        text: '⚠️ A transcrição ainda não está configurada. Defina OPENAI_API_KEY no .env.'
      })
      return
    }

    const audioMessage = getAudioMessage(message)

    if (!audioMessage) {
      await sock.sendMessage(jid, {
        text: '🎙️ Envie um áudio com !transcrever ou responda a um áudio usando !transcrever.'
      })
      return
    }

    try {
      await sock.sendMessage(jid, { text: '🎙️ Transcrevendo o áudio...' })

      const text = await transcribeAudio({
        downloadContentFromMessage,
        audioMessage
      })

      await sock.sendMessage(jid, {
        text: `📝 Transcrição\n\n${text}`
      })
    } catch (error) {
      await sock.sendMessage(jid, {
        text: `❌ Não consegui transcrever esse áudio.\n\n${error.message}`
      })
    }
  }
}
