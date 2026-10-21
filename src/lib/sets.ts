import { QUESTIONS } from '../data'
import type { Part, Prio, Question, WrongEntry } from '../types'
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

/** Phạm vi ôn: các phần được chọn và (nếu có) các mức ưu tiên được chọn. */
export interface Scope {
  parts?: Part[]
  prios?: Prio[]
}

/** Câu không có mức ưu tiên (đề giữa kỳ) không bị bộ lọc ưu tiên loại. */
export function inScope(q: Question, scope?: Scope): boolean {
  if (scope?.parts && !scope.parts.includes(q.part)) return false
  if (scope?.prios && q.prio !== undefined && !scope.prios.includes(q.prio)) return false
  return true
}

/** Ids in scope that have never appeared in a submitted session. */
export function remainingIds(seen: Set<string>, scope?: Scope): string[] {
  return QUESTIONS.filter((q) => inScope(q, scope) && !seen.has(q.id)).map((q) => q.id)
}

/** Pick up to N random never-seen question ids. */
export function pickRemaining(n: number, seed: number, seen: Set<string>, scope?: Scope): string[] {
  return shuffle(remainingIds(seen, scope), rng(seed)).slice(0, n)
}

/** Pick N random question ids; weight wrong/never-seen questions higher. */
export function pickRandom(
  n: number,
  seed: number,
  wrong: Record<string, WrongEntry>,
  seen: Set<string>,
  scope?: Scope,
): string[] {
  const pool = QUESTIONS.filter((q) => inScope(q, scope))
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
