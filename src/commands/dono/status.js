export default {
  name: 'status',
  aliases: ['bot'],
  description: 'Mostra o status do Nyx-Bot.',
  ownerOnly: true,
  execute: async ({ sock, jid }) => {
    await sock.sendMessage(jid, {
      text: '🟣 Nyx-Bot está online e funcionando.'
    })
  }
}
