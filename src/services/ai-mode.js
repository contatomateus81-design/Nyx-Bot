import { AI_AUTO } from '../config.js'

let enabled = AI_AUTO

export function isAutoAIEnabled() {
  return enabled
}

export function setAutoAI(value) {
  enabled = Boolean(value)
  return enabled
}
