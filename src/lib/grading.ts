import type { Answer, Question } from '../types'

export type Result = 'correct' | 'wrong' | 'partial' | 'unanswered'

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[`"'“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function parseNum(s: string): number | null {
  const t = s.toLowerCase().replace(/triệu|tr|%|\s/g, '').replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null
  return parseFloat(t)
}

export function isAnswered(q: Question, a?: Answer): boolean {
  if (!a) return false
  switch (a.t) {
    case 'single': return a.v !== ''
    case 'multi': return a.v.length > 0
    case 'truefalse': return true
    case 'fill': return a.v.trim() !== ''
    case 'matching': return a.v.some((x) => x !== null)
    case 'ordering': return true
    case 'open': return a.v.trim() !== '' || a.self !== null
  }
  void q
}

export function grade(q: Question, a?: Answer): Result {
  if (!a || !isAnswered(q, a)) return 'unanswered'
  if (q.type === 'single' && a.t === 'single') return a.v === q.answer ? 'correct' : 'wrong'
  if (q.type === 'truefalse' && a.t === 'truefalse') return a.v === q.answer ? 'correct' : 'wrong'
  if (q.type === 'multi' && a.t === 'multi') {
    const want = new Set(q.answers)
    const got = new Set(a.v)
    const same = want.size === got.size && [...want].every((x) => got.has(x))
    return same ? 'correct' : 'wrong'
  }
  if (q.type === 'fill' && a.t === 'fill') {
    const n = parseNum(a.v)
    const ok = q.answers.some((x) => {
      if (n !== null) {
        const m = parseNum(x)
        if (m !== null) return Math.abs(n - m) < 0.001
      }
      return norm(x) === norm(a.v)
    })
    return ok ? 'correct' : 'wrong'
  }
  if (q.type === 'matching' && a.t === 'matching') {
    return q.pairs.every((p, i) => a.v[i] === p) ? 'correct' : 'wrong'
  }
  if (q.type === 'ordering' && a.t === 'ordering') {
    return q.items.every((x, i) => a.v[i] === x) ? 'correct' : 'wrong'
  }
  if (q.type === 'open' && a.t === 'open') {
    if (a.self === 'right') return 'correct'
    if (a.self === 'partial') return 'partial'
    if (a.self === 'wrong') return 'wrong'
    return 'unanswered'
  }
  return 'wrong'
}

/** score in [0,1]; partial open answers count half */
export function score(r: Result): number {
  return r === 'correct' ? 1 : r === 'partial' ? 0.5 : 0
}
