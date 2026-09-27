import { aiEnabled, askAI } from '../../services/ai.js'
import { getHistory, addMessage } from '../../services/memory.js'

export default {
  name: 'ia',
  aliases: ['ai', 'chat'],
  description: 'Conversa com a inteligência do Nyx.',
  execute: async ({ sock, jid, rawArgs }) => {
    if (!aiEnabled()) {
      await sock.sendMessage(jid, {
        text: '⚠️ A IA ainda não está configurada. Defina OPENAI_API_KEY no .env.'
      })
      return
    }

    if (!rawArgs) {
      await sock.sendMessage(jid, {
        text: '💬 Escreva algo depois do comando. Ex.: !ia O que você acha de...'
      })
      return
    }

    const history = getHistory(jid).slice(-12)

    try {
      const answer = await askAI({
        prompt: rawArgs,
        context: history,
        system: 'Você é Nyx, um assistente de WhatsApp amigável, natural e objetivo. Responda em português do Brasil, a menos que o usuário peça outro idioma.'
      })

      await addMessage(jid, 'user', rawArgs)
      await addMessage(jid, 'assistant', answer)
      await sock.sendMessage(jid, { text: `🟣 Nyx\n\n${answer}` })
    } catch (error) {
      await sock.sendMessage(jid, {
        text: `❌ Não consegui falar com a IA agora.\n\n${error.message}`
      })
    }
  }
}
