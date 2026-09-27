import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BOT_EMOJI, BOT_NAME, PREFIX } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function getVersion() {
  try {
    const pkg = JSON.parse(await readFile(path.resolve(__dirname, '..', 'package.json'), 'utf8'))
    return pkg.version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

const categories = [
  ['dono', 'DONO', '🌌'],
  ['admin', 'ADMINS', '⭐'],
  ['principal', 'PRINCIPAL', '🚀'],
  ['ia', 'IA', '🧠']
]

export async function menuMessage(commands, prefix = PREFIX) {
  const date = new Date()
  const version = await getVersion()
  const unique = [...commands.values()].filter((command, index, list) =>
    list.findIndex((item) => item.name === command.name) === index
  )

  const lines = [
    '╭━━⪩ BEM-VINDA! ⪨━━',
    '▢',
    `▢ • ${BOT_EMOJI} ${BOT_NAME}`,
    `▢ • Data: ${date.toLocaleDateString('pt-BR')}`,
    `▢ • Hora: ${date.toLocaleTimeString('pt-BR')}`,
    `▢ • Prefixo: ${prefix}`,
    `▢ • Versão: ${version}`,
    '▢',
    '╰━━─「🟣」─━━',
    ''
  ]

  for (const [key, title, emoji] of categories) {
    const items = unique.filter((command) => command.menuCategory === key)
    if (!items.length) continue
    lines.push(`╭━━⪩ ${title} ⪨━━`, '▢')
    for (const item of items) {
      lines.push(`▢ • ${prefix}${item.name} — ${item.description || 'Sem descrição.'}`)
    }
    lines.push('▢', `╰━━─「${emoji}」─━━`, '')
  }

  lines.push(
    '╭━━⪩ EM BREVE ⪨━━',
    '▢',
    '▢ • Novos recursos da Nyx serão adicionados aqui.',
    '▢',
    '╰━━─「✨」─━━'
  )

  return lines.join('\n')
}
