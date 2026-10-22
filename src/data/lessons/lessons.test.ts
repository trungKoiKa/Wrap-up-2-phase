import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { SIMS as SIMS_CV } from '../../lessons/sims.js'
import { SIMS as SIMS_P1 } from '../../lessons/sims-p1.js'
import { BANK_PARTS } from '../../types'
import { BOOK_BY_ID, BOOK_OF_LESSON, BOOKS, LESSON_BY_ID, LESSONS } from './index'

const inlineTex = (s: string) => [...s.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])
const SIMS = { ...SIMS_CV, ...SIMS_P1 }

describe('lesson books', () => {
  it('Phase 2 covers exactly the CV parts, in order', () => {
    expect(LESSONS).toBe(BOOK_BY_ID.cv.lessons)
    expect(LESSONS.map((d) => d.part)).toEqual(BANK_PARTS.cv)
    for (const d of LESSONS) expect(d.id).toBe(`day${d.part}`)
  })

  it('Phase 1 covers Day 1–15 without Day 6', () => {
    expect(BOOK_BY_ID.p1.lessons.map((d) => d.n)).toEqual([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    for (const d of BOOK_BY_ID.p1.lessons) expect(d.id).toBe(`day${d.n}`)
  })

  it('lesson ids are unique across books', () => {
    const ids = BOOKS.flatMap((b) => b.lessons.map((d) => d.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(BOOK_OF_LESSON[id].lessons).toContain(LESSON_BY_ID[id])
  })

  for (const book of BOOKS) {
    describe(book.id, () => {
      it('every lesson is complete', () => {
        for (const d of book.lessons) {
          expect(d.question.length, d.id).toBeGreaterThan(20)
          expect(d.steps.length, d.id).toBeGreaterThanOrEqual(4)
          expect(d.concepts.length, d.id).toBeGreaterThanOrEqual(6)
          for (const c of d.concepts) expect(c.t && c.en && c.d && c.ex, `${d.id} ${c.t}`).toBeTruthy()
          expect(d.formulas.length, d.id).toBeGreaterThanOrEqual(3)
          for (const f of d.formulas) expect(f.tex && f.read && f.ex, d.id).toBeTruthy()
          expect(d.remember, d.id).toHaveLength(3)
          expect(d.cards.length, d.id).toBeGreaterThanOrEqual(6)
          for (const r of d.table.rows) expect(r, d.id).toHaveLength(d.table.cols.length)
        }
      })

      it('every formula renders with KaTeX', () => {
        const all = book.lessons.flatMap((d) => [
          ...d.formulas.map((f) => [d.id, f.tex, true] as const),
          ...[d.question, d.analogy, d.why, ...d.steps, ...d.traps, ...d.remember, ...d.table.rows.flat(), ...d.cards.flat()]
            .flatMap(inlineTex)
            .map((t) => [d.id, t, false] as const),
        ])
        expect(all.length).toBeGreaterThan(40)
        for (const [id, tex, display] of all) {
          expect(() => katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore' }), `${id}: ${tex}`).not.toThrow()
        }
      })

      it('every lesson has a simulation', () => {
        for (const d of book.lessons) {
          const s = SIMS[d.id]
          expect(s, d.id).toBeDefined()
          expect(s.tries.length, d.id).toBeGreaterThan(0)
          expect(typeof s.build, d.id).toBe('function')
        }
      })

      it('overview links to lessons of the same book', () => {
        for (const f of book.overview.flow) expect(BOOK_OF_LESSON[f.day]?.id, f.day).toBe(book.id)
      })
    })
  }
})
