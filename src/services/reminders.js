import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'

const file = process.env.REMINDERS_FILE || './sessions/nyx/reminders.json'
let reminders = []
let sendMessage = null
const timers = new Map()

async function save() {
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(reminders, null, 2), 'utf8')
}

function schedule(reminder) {
  const delay = reminder.at - Date.now()
  if (delay <= 0) return false

  const timer = setTimeout(async () => {
    timers.delete(reminder.id)

    if (reminder.at - Date.now() > 0) {
      schedule(reminder)
      return
    }

    try {
      await sendMessage(reminder.jid, {
        text: `⏰ Lembrete: ${reminder.text}`
      })
    } finally {
      reminders = reminders.filter((item) => item.id !== reminder.id)
      await save()
    }
  }, Math.min(delay, 2_147_483_647))

  timers.set(reminder.id, timer)
  return true
}

export async function initReminders(messageSender) {
  sendMessage = messageSender

  try {
    reminders = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    reminders = []
    await save()
  }

  for (const reminder of reminders) {
    if (reminder.at > Date.now()) schedule(reminder)
  }
}

export async function createReminder({ jid, text, at }) {
  if (!text?.trim()) throw new Error('Texto do lembrete vazio.')
  if (!Number.isFinite(at) || at <= Date.now()) {
    throw new Error('A data do lembrete precisa estar no futuro.')
  }

  const reminder = {
    id: randomUUID(),
    jid,
    text: text.trim(),
    at
  }

  reminders.push(reminder)
  await save()
  schedule(reminder)
  return reminder
}

export async function listReminders(jid) {
  return reminders
    .filter((item) => item.jid === jid && item.at > Date.now())
    .sort((a, b) => a.at - b.at)
}

export async function cancelReminder(jid, id) {
  const reminder = reminders.find((item) => item.id === id && item.jid === jid)
  if (!reminder) return false

  clearTimeout(timers.get(id))
  timers.delete(id)
  reminders = reminders.filter((item) => item.id !== id)
  await save()
  return true
}
