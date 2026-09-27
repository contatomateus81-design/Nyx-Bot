import 'dotenv/config'

const splitNumbers = (value = '') =>
  value
    .split(',')
    .map((number) => number.trim().replace(/\D/g, ''))
    .filter(Boolean)

export const config = {
  prefix: process.env.PREFIX || '!',
  phoneNumber: (process.env.PHONE_NUMBER || '').replace(/\D/g, ''),
  ownerNumbers: splitNumbers(process.env.OWNER_NUMBERS),
  sessionDir: process.env.SESSION_DIR || './sessions/nyx'
}

if (!config.ownerNumbers.length && config.phoneNumber) {
  config.ownerNumbers.push(config.phoneNumber)
}
