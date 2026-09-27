import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const file = process.env.MEMORY_FILE || './sessions/nyx/memory.json'
const maxMessages = 40

let memory = {}

async function save() {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(memory, null, 2), 'utf8')
}

export async function initMemory() {
  try {
    memory = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    memory = {}
    await save()
  }
}

export function getHistory(jid) {
  return memory[jid]?.messages || []
}

export async function addMessage(jid, role, content) {
  if (!content?.trim()) return

  if (!memory[jid]) memory[jid] = { messages: [] }

  memory[jid].messages.push({
    role,
    content: content.trim(),
    timestamp: Date.now()
  })

  memory[jid].messages = memory[jid].messages.slice(-maxMessages)
  await save()
}

export async function clearMemory(jid) {
  delete memory[jid]
  await save()
}
