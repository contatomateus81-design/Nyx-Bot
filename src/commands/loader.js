import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const commandsDir = fileURLToPath(new URL('.', import.meta.url))

export async function loadCommands() {
  const categories = ['membro', 'admin', 'dono']
  const commands = new Map()

  for (const category of categories) {
    const categoryDir = join(commandsDir, category)

    let entries
    try {
      entries = await readdir(categoryDir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.js')) continue

      const module = await import(pathToFileURL(join(categoryDir, entry.name)).href)
      const command = module.default

      if (!command?.name || typeof command.execute !== 'function') continue

      commands.set(command.name.toLowerCase(), {
        ...command,
        category
      })

      for (const alias of command.aliases || []) {
        commands.set(alias.toLowerCase(), {
          ...command,
          category
        })
      }
    }
  }

  return commands
}
