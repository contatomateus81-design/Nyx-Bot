export default {
  name: 'ping',
  aliases: ['p'],
  description: 'Verifica se o Nyx-Bot está respondendo.',
  execute: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: '🏓 Pong! Nyx-Bot está online.' })
  }
}
