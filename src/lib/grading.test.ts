import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../data'
import { grade } from './grading'
import { pickRandom, pickRemaining, remainingIds } from './sets'
import type { Question } from '../types'

const find = (id: string) => QUESTIONS.find((q) => q.id === id) as Question

describe('grading', () => {
  it('single', () => {
    const q = find('1') as Extract<Question, { type: 'single' }>
    expect(grade(q, { t: 'single', v: q.answer })).toBe('correct')
    expect(grade(q, { t: 'single', v: q.distractors[0] })).toBe('wrong')
    expect(grade(q, undefined)).toBe('unanswered')
  })
  it('multi needs exact set', () => {
    const q = find('33') as Extract<Question, { type: 'multi' }>
    expect(grade(q, { t: 'multi', v: [...q.answers].reverse() })).toBe('correct')
    expect(grade(q, { t: 'multi', v: q.answers.slice(1) })).toBe('wrong')
    expect(grade(q, { t: 'multi', v: [...q.answers, q.distractors[0]] })).toBe('wrong')
  })
  it('fill: case-insensitive, aliases, numeric', () => {
    expect(grade(find('22'), { t: 'fill', v: ' Top_P ' })).toBe('correct')
    expect(grade(find('22'), { t: 'fill', v: 'top k' })).toBe('wrong')
    expect(grade(find('58'), { t: 'fill', v: '61,8 triệu' })).toBe('correct')
    expect(grade(find('60'), { t: 'fill', v: '142.5%' })).toBe('correct')
    expect(grade(find('60'), { t: 'fill', v: '140' })).toBe('wrong')
  })
  it('matching and ordering', () => {
    const m = find('27') as Extract<Question, { type: 'matching' }>
    expect(grade(m, { t: 'matching', v: m.pairs })).toBe('correct')
    expect(grade(m, { t: 'matching', v: [0, 1, 2, 3, 4] })).toBe('wrong')
    const o = find('29') as Extract<Question, { type: 'ordering' }>
    expect(grade(o, { t: 'ordering', v: o.items })).toBe('correct')
    expect(grade(o, { t: 'ordering', v: [...o.items].reverse() })).toBe('wrong')
  })
  it('open uses self grading', () => {
    const q = find('61')
    expect(grade(q, { t: 'open', v: '', self: 'partial' })).toBe('partial')
    expect(grade(q, { t: 'open', v: 'x', self: null })).toBe('unanswered')
  })
})

describe('question bank integrity', () => {
  it('ids are unique', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
  it('single has 3+ distractors distinct from the answer', () => {
    for (const q of QUESTIONS) {
      if (q.type !== 'single') continue
      expect(q.distractors.length, q.id).toBeGreaterThanOrEqual(3)
      expect(q.distractors.includes(q.answer), q.id).toBe(false)
    }
  })
  it('multi, matching and ordering are well formed', () => {
    for (const q of QUESTIONS) {
      if (q.type === 'multi') expect(q.answers.length, q.id).toBeGreaterThan(1)
      if (q.type === 'matching') {
        expect(q.pairs.length, q.id).toBe(q.left.length)
        expect(new Set(q.pairs).size, q.id).toBe(q.pairs.length)
      }
      if (q.type === 'ordering') expect(new Set(q.items).size, q.id).toBe(q.items.length)
    }
  })
})

describe('pickRemaining', () => {
  const all = QUESTIONS.map((q) => q.id)
  it('excludes seen ids and returns only the rest', () => {
    const seen = new Set(pickRandom(50, 3, {}, new Set()))
    const rest = pickRemaining(50, 1, seen)
    expect(rest.length).toBe(all.length - seen.size)
    expect(rest.some((id) => seen.has(id))).toBe(false)
    expect(new Set(rest).size).toBe(rest.length)
  })
  it('caps at N and is deterministic per seed', () => {
    const a = pickRemaining(10, 9, new Set())
    expect(a.length).toBe(10)
    expect(pickRemaining(10, 9, new Set())).toEqual(a)
  })
  it('returns empty when everything is seen, respects parts', () => {
    expect(pickRemaining(50, 1, new Set(all))).toEqual([])
    expect(remainingIds(new Set(), [2]).every((id) => QUESTIONS.find((q) => q.id === id)!.part === 2)).toBe(true)
  })
})

describe('pickRandom', () => {
  it('returns N unique ids, deterministic per seed', () => {
    const a = pickRandom(50, 7, {}, new Set())
    expect(a.length).toBe(Math.min(50, QUESTIONS.length))
    expect(new Set(a).size).toBe(a.length)
    expect(pickRandom(50, 7, {}, new Set())).toEqual(a)
  })
})
