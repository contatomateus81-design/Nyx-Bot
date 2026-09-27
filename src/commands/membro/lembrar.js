import { createReminder, listReminders, cancelReminder } from '../../services/reminders.js'

function parseDateTime(value) {
  const match = value?.match(/^(\\d{4})-(\\d{2})-(\\d{2})[ T](\\d{2}):(\\d{2})$/)
  if (!match) return NaN

  const [, year, month, day, hour, minute] = match
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime()
}

export default {
  name: 'lembrar',
  aliases: ['lembrete', 'reminder'],
  description: 'Cria, lista ou cancela lembretes.',
  execute: async ({ sock, jid, args, rawArgs }) => {
    if (args[0]?.toLowerCase() === 'listar') {
      const items = await listReminders(jid)
      if (!items.length) {
        await sock.sendMessage(jid, { text: '⏰ Você não tem lembretes pendentes.' })
        return
      }

      const lines = items.map((item, index) =>
        `${index + 1}. ${new Date(item.at).toLocaleString('pt-BR')} — ${item.text}\nID: ${item.id.slice(0, 8)}`
      )

      await sock.sendMessage(jid, { text: `⏰ Lembretes\n\n${lines.join('\n\n')}` })
      return
    }

    if (args[0]?.toLowerCase() === 'cancelar') {
      const id = args[1]
      const ok = id ? await cancelReminder(jid, id) : false
      await sock.sendMessage(jid, {
        text: ok ? '✅ Lembrete cancelado.' : '❌ Não encontrei esse lembrete.'
      })
      return
    }

    const dateTime = parseDateTime(args[0])
    const text = rawArgs.slice(args[0]?.length || 0).trim()

    if (!Number.isFinite(dateTime) || !text) {
      await sock.sendMessage(jid, {
        text: '⏰ Uso:\n!lembrar 2026-09-30 18:30 estudar\n!lembrar listar\n!lembrar cancelar ID'
      })
      return
    }

    try {
      const reminder = await createReminder({ jid, text, at: dateTime })
      await sock.sendMessage(jid, {
        text: `✅ Lembrete criado para ${new Date(reminder.at).toLocaleString('pt-BR')}.`
      })
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ ${error.message}` })
    }
  }
}
