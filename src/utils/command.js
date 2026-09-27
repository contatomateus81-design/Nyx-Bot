export function parseCommand(text, prefix) {
  if (!text || !text.startsWith(prefix)) return null

  const body = text.slice(prefix.length).trim()
  if (!body) return null

  const [name, ...args] = body.split(/\\s+/)

  return {
    name: name.toLowerCase(),
    args,
    rawArgs: args.join(' ')
  }
}

export function getCommandText(message) {
  const messageContent = message?.message
  if (!messageContent) return ''

  return (
    messageContent.conversation ||
    messageContent.extendedTextMessage?.text ||
    messageContent.imageMessage?.caption ||
    messageContent.videoMessage?.caption ||
    ''
  ).trim()
}
