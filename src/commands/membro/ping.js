export default {
  name: 'ping',
  aliases: ['p'],
  description: 'Verifica se a Nyx está respondendo.',
  menuCategory: 'principal',
  execute: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: '🏓 Pong! A Nyx está online.' })
  }
}
