import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { SIMS } from '../../lessons/sims.js'
import { BANK_PARTS } from '../../types'
import { LESSON_BY_ID, LESSONS, OVERVIEW } from './index'

const inlineTex = (s: string) => [...s.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])

describe('lessons', () => {
  it('cover exactly the Phase 2 parts, in order', () => {
    expect(LESSONS.map((d) => d.part)).toEqual(BANK_PARTS.cv)
    for (const d of LESSONS) expect(d.id).toBe(`day${d.part}`)
  })

  it('every lesson is complete', () => {
    for (const d of LESSONS) {
      expect(d.question.length, d.id).toBeGreaterThan(20)
      expect(d.steps.length, d.id).toBeGreaterThanOrEqual(4)
      expect(d.concepts.length, d.id).toBeGreaterThanOrEqual(6)
      for (const c of d.concepts) expect(c.t && c.en && c.d && c.ex, `${d.id} ${c.t}`).toBeTruthy()
      expect(d.formulas.length, d.id).toBeGreaterThanOrEqual(4)
      for (const f of d.formulas) expect(f.tex && f.read && f.ex, d.id).toBeTruthy()
      expect(d.remember, d.id).toHaveLength(3)
      expect(d.cards.length, d.id).toBeGreaterThanOrEqual(6)
      for (const r of d.table.rows) expect(r, d.id).toHaveLength(d.table.cols.length)
    }
  })

  it('every formula renders with KaTeX', () => {
    const all = LESSONS.flatMap((d) => [
      ...d.formulas.map((f) => [d.id, f.tex, true] as const),
      ...[d.question, d.analogy, d.why, ...d.steps, ...d.traps, ...d.remember, ...d.table.rows.flat(), ...d.cards.flat()]
        .flatMap(inlineTex)
        .map((t) => [d.id, t, false] as const),
    ])
    expect(all.length).toBeGreaterThan(50)
    for (const [id, tex, display] of all) {
      expect(() => katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore' }), `${id}: ${tex}`).not.toThrow()
    }
  })

  it('every lesson has a simulation', () => {
    for (const d of LESSONS) {
      const s = SIMS[d.id]
      expect(s, d.id).toBeDefined()
      expect(s.tries.length, d.id).toBeGreaterThan(0)
      expect(typeof s.build, d.id).toBe('function')
    }
  })

  it('overview links to real lessons', () => {
    for (const f of OVERVIEW.flow) expect(LESSON_BY_ID[f.day], f.day).toBeDefined()
  })
})
