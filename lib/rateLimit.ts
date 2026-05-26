const store = new Map<string, { count: number; resetAt: number }>()

function nextMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return midnight.getTime()
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: nextMidnightUTC() })
    return true
  }

  if (entry.count >= 5) return false

  entry.count++
  return true
}
