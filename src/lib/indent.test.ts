import { describe, expect, it } from 'vitest'
import { applyEdit, indentEdit } from './indent'

const run = (v: string, s: number, e: number, shift = false) => {
  const ed = indentEdit(v, s, e, shift)
  return { value: applyEdit(v, ed), s: ed.selStart, e: ed.selEnd }
}

describe('indentEdit', () => {
  it('Tab inserts an indent at the caret', () => {
    expect(run('ab', 1, 1)).toEqual({ value: 'a  b', s: 3, e: 3 })
  })
  it('Tab with a single-line selection replaces it with an indent', () => {
    expect(run('hello', 1, 4)).toEqual({ value: 'h  o', s: 3, e: 3 })
  })
  it('Tab on a multi-line selection indents every touched line', () => {
    const v = 'a\nb\nc'
    expect(run(v, 0, 3)).toEqual({ value: '  a\n  b\nc', s: 2, e: 7 })
  })
  it('selection ending right after a newline does not indent the next line', () => {
    expect(run('a\nb\nc', 0, 4).value).toBe('  a\n  b\nc')
  })
  it('Shift+Tab removes up to one indent from the line at the caret', () => {
    expect(run('    x', 6, 6, true)).toEqual({ value: '  x', s: 4, e: 4 })
    expect(run(' x', 2, 2, true).value).toBe('x')
    expect(run('x', 1, 1, true).value).toBe('x')
  })
  it('Shift+Tab outdents several lines and handles tabs', () => {
    expect(run('  a\n\tb\nc', 0, 7, true).value).toBe('a\nb\nc')
  })
  it('keeps the caret inside the line when outdenting near the start', () => {
    const r = run('  ab', 1, 1, true)
    expect(r.value).toBe('ab')
    expect(r.s).toBe(0)
  })
})
