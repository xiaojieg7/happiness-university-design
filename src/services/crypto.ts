const SALT = 'happiness-university-2026'
const ANSWER_SALT = 'happiness-security-answer-2026'

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + SALT)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(pin)
  return hash === storedHash
}

// ========== 密保答案加密 ==========

export async function hashSecurityAnswer(answer: string): Promise<string> {
  const normalized = answer.trim().toLowerCase()
  const encoder = new TextEncoder()
  const data = encoder.encode(normalized + ANSWER_SALT)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifySecurityAnswer(answer: string, storedHash: string): Promise<boolean> {
  const hash = await hashSecurityAnswer(answer)
  return hash === storedHash
}
