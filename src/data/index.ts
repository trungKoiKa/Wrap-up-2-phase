import type { Question } from '../types'
import { part1 } from './part1'
import { part2 } from './part2'
import { part3 } from './part3'
import { part4 } from './part4'
import { WHY } from './explanations'

export const QUESTIONS: Question[] = [...part1, ...part2, ...part3, ...part4].map((q) => {
  const why = WHY[q.id]
  if (!why || q.type === 'open') return q
  const extra = q.explanation && q.explanation !== why ? '\n\n' + q.explanation : ''
  return { ...q, explanation: why + extra }
})
export const BY_ID: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]))
