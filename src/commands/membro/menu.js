import { menuMessage } from '../../menu.js'

export default {
  name: 'menu',
  aliases: ['help', 'ajuda'],
  description: 'Exibe o menu da Nyx.',
  menuCategory: 'principal',
  execute: async ({ sock, jid, commands, prefix }) => {
    await sock.sendMessage(jid, { text: await menuMessage(commands, prefix) })
  }
}
