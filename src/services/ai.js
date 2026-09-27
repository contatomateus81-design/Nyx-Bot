const API_URL = 'https://api.openai.com/v1/responses'

function getKey() {
  return process.env.OPENAI_API_KEY?.trim()
}

export function aiEnabled() {
  return Boolean(getKey())
}

export async function askAI({ prompt, context = [], system = '' }) {
  const apiKey = getKey()
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada.')
  }

  const input = [
    ...(system ? [{ role: 'system', content: system }] : []),
    ...context.map((item) => ({
      role: item.role,
      content: item.content
    })),
    { role: 'user', content: prompt }
  ]

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      input
    })
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`OpenAI HTTP ${response.status}: ${details.slice(0, 500)}`)
  }

  const data = await response.json()
  return data.output_text?.trim() || 'Não consegui gerar uma resposta agora.'
}
