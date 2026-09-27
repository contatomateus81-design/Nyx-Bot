import { setAutoAI } from '../../services/ai-mode.js'

export default {
  name: 'modoia',
  aliases: ['autoia'],
  description: 'Liga ou desliga respostas automáticas da IA em conversas privadas.',
  ownerOnly: true,
  execute: async ({ sock, jid, args }) => {
    const value = args[0]?.toLowerCase()

    if (!['on', 'off'].includes(value)) {
      await sock.sendMessage(jid, {
        text: '🤖 Uso: !modoia on ou !modoia off\n\nQuando ligado, o Nyx responde automaticamente em conversas privadas.'
      })
      return
    }

    const enabled = setAutoAI(value === 'on')

    await sock.sendMessage(jid, {
      text: enabled
        ? '🟢 Modo IA automático ligado para conversas privadas.'
        : '⚪ Modo IA automático desligado.'
    })
  }
}
