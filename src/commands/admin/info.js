export default {
  name: 'grupo',
  aliases: ['groupinfo'],
  description: 'Mostra informações básicas do grupo.',
  adminOnly: true,
  groupOnly: true,
  execute: async ({ sock, jid, groupMetadata }) => {
    await sock.sendMessage(jid, {
      text: [
        '╭───〔 GRUPO 〕───╮',
        `│ Nome: ${groupMetadata.subject || 'Sem nome'}`,
        `│ Membros: ${groupMetadata.participants?.length || 0}`,
        '╰─────────────────╯'
      ].join('\\n')
    })
  }
}
