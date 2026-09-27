import { BOT_EMOJI, BOT_NAME } from '../../config.js'

export default {
  name: 'status',
  aliases: ['bot'],
  description: 'Mostra o status da Nyx.',
  menuCategory: 'dono',
  ownerOnly: true,
  execute: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: `${BOT_EMOJI} ${BOT_NAME} está online e funcionando.` })
  }
}
