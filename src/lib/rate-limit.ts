const rateMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxAttempts: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: maxAttempts - 1 }
  }
  entry.count++
  if (entry.count > maxAttempts) return { ok: false, remaining: 0 }
  return { ok: true, remaining: maxAttempts - entry.count }
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    rateMap.forEach((val, key) => {
      if (now > val.resetAt) rateMap.delete(key)
    })
  }, 5 * 60 * 1000).unref?.()
}
