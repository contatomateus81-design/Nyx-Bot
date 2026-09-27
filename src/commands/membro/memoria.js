import { clearMemory, getHistory } from '../../services/memory.js'

export default {
  name: 'memoria',
  aliases: ['memory'],
  description: 'Mostra ou apaga a memória desta conversa.',
  menuCategory: 'principal',
  execute: async ({ sock, jid, args }) => {
    if (args[0]?.toLowerCase() === 'limpar') {
      await clearMemory(jid)
      await sock.sendMessage(jid, { text: '🧹 A memória desta conversa foi apagada.' })
      return
    }

    const history = getHistory(jid)
    await sock.sendMessage(jid, {
      text: history.length
        ? `🧠 Tenho ${history.length} mensagens recentes no contexto desta conversa.\nUse !memoria limpar para apagar.`
        : '🧠 Ainda não tenho memória salva desta conversa.'
    })
  }
}
