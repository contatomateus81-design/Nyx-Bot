import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ================================
// IDENTIDADE DA NYX
// ================================

export const BOT_NAME = 'Nyx-Bot'
export const BOT_EMOJI = '🟣'

// Número que será vinculado ao WhatsApp.
// Formato internacional, somente números, sem +, espaços ou hífens.
// Exemplo: 55XXXXXXXXXXX
export const PHONE_NUMBER = ''

// Número(s) do dono da Nyx.
export const OWNER_NUMBERS = [
  ''
].map((number) => number.replace(/\D/g, '')).filter(Boolean)

export const PREFIX = '!'

// ================================
// IA (OPCIONAL)
// ================================
// Não coloque uma chave real da OpenAI neste arquivo enquanto o
// repositório for público. Deixe vazio para manter a IA desativada.
export const OPENAI_API_KEY = ''
export const OPENAI_MODEL = 'gpt-5.6-luna'
export const OPENAI_TRANSCRIBE_MODEL = 'gpt-4o-mini-transcribe'
export const AI_AUTO = false

// ================================
// DIRETÓRIOS E SESSÃO
// ================================

export const COMMANDS_DIR = path.join(__dirname, 'commands')
export const DATABASE_DIR = path.resolve(__dirname, '..', 'database')
export const ASSETS_DIR = path.resolve(__dirname, '..', 'assets')
export const TEMP_DIR = path.resolve(ASSETS_DIR, 'temp')

// A sessão fica fora do código e nunca é enviada ao GitHub.
export const SESSION_DIR = path.resolve(__dirname, '..', 'sessions', 'nyx')

export const MEMORY_FILE = path.join(SESSION_DIR, 'memory.json')
export const REMINDERS_FILE = path.join(SESSION_DIR, 'reminders.json')

// ================================
// COMPORTAMENTO
// ================================

export const DEVELOPER_MODE = false
export const TIMEOUT_IN_MILLISECONDS_BY_EVENT = 500
export const ONLY_GROUP_ID = ''

export const config = {
  botName: BOT_NAME,
  botEmoji: BOT_EMOJI,
  prefix: PREFIX,
  phoneNumber: PHONE_NUMBER,
  ownerNumbers: OWNER_NUMBERS,
  openaiApiKey: OPENAI_API_KEY,
  openaiModel: OPENAI_MODEL,
  openaiTranscribeModel: OPENAI_TRANSCRIBE_MODEL,
  aiAuto: AI_AUTO,
  commandsDir: COMMANDS_DIR,
  databaseDir: DATABASE_DIR,
  assetsDir: ASSETS_DIR,
  tempDir: TEMP_DIR,
  sessionDir: SESSION_DIR,
  memoryFile: MEMORY_FILE,
  remindersFile: REMINDERS_FILE,
  developerMode: DEVELOPER_MODE,
  eventTimeoutMs: TIMEOUT_IN_MILLISECONDS_BY_EVENT,
  onlyGroupId: ONLY_GROUP_ID
}
