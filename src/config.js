import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const splitNumbers = (value = '') =>
  value.split(',').map((number) => number.trim().replace(/\D/g, '')).filter(Boolean)

// Identidade da Nyx.
export const BOT_NAME = process.env.BOT_NAME || 'Nyx-Bot'
export const BOT_EMOJI = process.env.BOT_EMOJI || '🟣'

// Configuração principal.
export const PREFIX = process.env.PREFIX || '!'
export const PHONE_NUMBER = (process.env.PHONE_NUMBER || '').replace(/\D/g, '')
export const OWNER_NUMBERS = splitNumbers(process.env.OWNER_NUMBERS)

if (!OWNER_NUMBERS.length && PHONE_NUMBER) OWNER_NUMBERS.push(PHONE_NUMBER)

// Diretórios.
export const COMMANDS_DIR = path.join(__dirname, 'commands')
export const DATABASE_DIR = path.resolve(__dirname, '..', 'database')
export const ASSETS_DIR = path.resolve(__dirname, '..', 'assets')
export const TEMP_DIR = path.resolve(ASSETS_DIR, 'temp')
export const SESSION_DIR = process.env.SESSION_DIR || path.resolve(__dirname, '..', 'sessions', 'nyx')

// Persistência.
export const MEMORY_FILE = process.env.MEMORY_FILE || path.join(SESSION_DIR, 'memory.json')
export const REMINDERS_FILE = process.env.REMINDERS_FILE || path.join(SESSION_DIR, 'reminders.json')

// Comportamento.
export const DEVELOPER_MODE = process.env.DEVELOPER_MODE === 'true'
export const TIMEOUT_IN_MILLISECONDS_BY_EVENT = Number(process.env.EVENT_TIMEOUT_MS || 500)
export const ONLY_GROUP_ID = process.env.ONLY_GROUP_ID || ''

// Compatibilidade com módulos existentes.
export const config = {
  botName: BOT_NAME, botEmoji: BOT_EMOJI, prefix: PREFIX,
  phoneNumber: PHONE_NUMBER, ownerNumbers: OWNER_NUMBERS,
  commandsDir: COMMANDS_DIR, databaseDir: DATABASE_DIR,
  assetsDir: ASSETS_DIR, tempDir: TEMP_DIR, sessionDir: SESSION_DIR,
  memoryFile: MEMORY_FILE, remindersFile: REMINDERS_FILE,
  developerMode: DEVELOPER_MODE, eventTimeoutMs: TIMEOUT_IN_MILLISECONDS_BY_EVENT,
  onlyGroupId: ONLY_GROUP_ID
}