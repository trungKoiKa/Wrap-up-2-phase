import { QUESTIONS } from '../data'
import type { Part, WrongEntry } from '../types'
import { rng, shuffle } from './shuffle'

export interface HistoryItem {
  id: string
  title: string
  at: number
  total: number
  points: number
  durationMs: number
  perPart: Record<number, { total: number; points: number }>
}

/** Ids in scope that have never appeared in a submitted session. */
export function remainingIds(seen: Set<string>, parts?: Part[]): string[] {
  return QUESTIONS.filter((q) => (!parts || parts.includes(q.part)) && !seen.has(q.id)).map((q) => q.id)
}

/** Pick up to N random never-seen question ids. */
export function pickRemaining(n: number, seed: number, seen: Set<string>, parts?: Part[]): string[] {
  return shuffle(remainingIds(seen, parts), rng(seed)).slice(0, n)
}

/** Pick N random question ids; weight wrong/never-seen questions higher. */
export function pickRandom(
  n: number,
  seed: number,
  wrong: Record<string, WrongEntry>,
  seen: Set<string>,
  parts?: Part[],
): string[] {
  const pool = QUESTIONS.filter((q) => !parts || parts.includes(q.part))
  const rand = rng(seed)
  const keyed = pool.map((q) => {
    let w = 1
    if (!seen.has(q.id)) w += 1
    if (wrong[q.id]) w += 2
    // weighted random key (Efraimidis–Spirakis)
    return { id: q.id, k: Math.pow(rand(), 1 / w) }
  })
  keyed.sort((a, b) => b.k - a.k)
  return shuffle(keyed.slice(0, Math.min(n, keyed.length)).map((x) => x.id), rand)
}
