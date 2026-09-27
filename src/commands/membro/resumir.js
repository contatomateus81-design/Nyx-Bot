import { aiEnabled, askAI } from '../../services/ai.js'
import { getHistory } from '../../services/memory.js'

export default {
  name: 'resumir',
  aliases: ['resumo', 'summary'],
  description: 'Resume o contexto recente salvo pelo Nyx.',
  execute: async ({ sock, jid }) => {
    if (!aiEnabled()) {
      await sock.sendMessage(jid, {
        text: '⚠️ A IA ainda não está configurada. Defina OPENAI_API_KEY no .env.'
      })
      return
    }

    const history = getHistory(jid)
    if (!history.length) {
      await sock.sendMessage(jid, { text: '📝 Ainda não tenho mensagens suficientes para resumir.' })
      return
    }

    try {
      const answer = await askAI({
        prompt: 'Faça um resumo curto e organizado do contexto abaixo, destacando assuntos, decisões e pendências. Não invente informações.',
        context: history,
        system: 'Você é um resumidor de conversas. Responda em português do Brasil.'
      })

      await sock.sendMessage(jid, { text: `📝 Resumo\n\n${answer}` })
    } catch (error) {
      await sock.sendMessage(jid, { text: `❌ Não consegui gerar o resumo.\n\n${error.message}` })
    }
  }
}
