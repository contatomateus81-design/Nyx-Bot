import { Buffer } from 'node:buffer'
import { OPENAI_API_KEY, OPENAI_TRANSCRIBE_MODEL } from '../config.js'

const API_URL = 'https://api.openai.com/v1/audio/transcriptions'

async function streamToBuffer(stream) {
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export function transcriptionEnabled() {
  return Boolean(OPENAI_API_KEY?.trim())
}

export async function transcribeAudio({ downloadContentFromMessage, audioMessage }) {
  if (!transcriptionEnabled()) {
    throw new Error('OPENAI_API_KEY não configurada em src/config.js.')
  }

  const stream = await downloadContentFromMessage(audioMessage, 'audio')
  const buffer = await streamToBuffer(stream)

  const form = new FormData()
  form.append(
    'file',
    new Blob([buffer], { type: audioMessage.mimetype || 'audio/ogg' }),
    'audio.ogg'
  )
  form.append('model', OPENAI_TRANSCRIBE_MODEL)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + OPENAI_API_KEY.trim()
    },
    body: form
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error('Transcrição HTTP ' + response.status + ': ' + details.slice(0, 500))
  }

  const data = await response.json()
  return data.text?.trim() || 'Não consegui identificar fala nesse áudio.'
}
