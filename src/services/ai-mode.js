let enabled = process.env.AI_AUTO === 'true'

export function isAutoAIEnabled() {
  return enabled
}

export function setAutoAI(value) {
  enabled = Boolean(value)
  return enabled
}
