export default {
  name: 'menu',
  aliases: ['help', 'ajuda'],
  description: 'Exibe os comandos disponíveis.',
  execute: async ({ sock, jid, commands, prefix }) => {
    const unique = [...commands.values()].filter(
      (command, index, list) =>
        list.findIndex((item) => item.name === command.name) === index
    )

    const sections = {
      membro: [],
      admin: [],
      dono: []
    }

    for (const command of unique) {
      sections[command.category]?.push(command)
    }

    const lines = [
      '╭───〔 NYX-BOT 〕───╮',
      '│ 🤖 Bot de WhatsApp MD',
      '╰──────────────────╯',
      ''
    ]

    for (const [category, items] of Object.entries(sections)) {
      if (!items.length) continue
      lines.push(`〔 ${category.toUpperCase()} 〕`)
      for (const item of items) {
        lines.push(`• ${prefix}${item.name} — ${item.description || 'Sem descrição.'}`)
      }
      lines.push('')
    }

    await sock.sendMessage(jid, { text: lines.join('\\n').trim() })
  }
}
