const PREFIX = 'aia.v1.'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage unavailable or full – app still works in-memory */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

export function exportAll(): string {
  const out: Record<string, unknown> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k)!)
    }
  } catch {
    /* ignore */
  }
  return JSON.stringify(out, null, 2)
}

export function importAll(json: string): void {
  const obj = JSON.parse(json) as Record<string, unknown>
  for (const [k, v] of Object.entries(obj)) save(k, v)
}
