import { OPENAI_API_KEY, OPENAI_MODEL } from '../config.js'

const API_URL = 'https://api.openai.com/v1/responses'

function getKey() {
  return OPENAI_API_KEY?.trim()
}

export function aiEnabled() {
  return Boolean(getKey())
}

export async function askAI({ prompt, context = [], system = '' }) {
  const apiKey = getKey()
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada em src/config.js.')

  const input = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...context.map((item) => ({ role: item.role, content: item.content })),
    { role: 'user', content: prompt }
  ]

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: OPENAI_MODEL, input })
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error('OpenAI HTTP ' + response.status + ': ' + details.slice(0, 500))
  }

  const data = await response.json()
  return data.output_text?.trim() || 'Não consegui gerar uma resposta agora.'
}
