import { describe, expect, it } from 'vitest'
import { GLOSSARY } from '../data/lessons'
import { makeAnnotator, type Seg } from './gloss'

const ann = makeAnnotator([
  ['IoU', 'độ chồng lấn'],
  ['GIoU', 'IoU mở rộng'],
  ['focal loss', 'mất mát cho mẫu khó', 'i'],
  ['precision', 'tỉ lệ báo đúng', 'i'],
  ['recall', 'tỉ lệ tìm được', 'i'],
  ['log', 'bản ghi', 'i', '(?!\\s*[0-9σp\\\\])'],
])
const terms = (segs: Seg[]) => segs.filter((s) => s.k === 'term').map((s) => (s as { v: string }).v)
const text = (segs: Seg[]) => segs.map((s) => (s.k === 'math' ? `$${s.tex}$` : s.v)).join('')

describe('gloss annotator', () => {
  it('explains a term only the first time on a page', () => {
    const seen = new Set<string>()
    expect(terms(ann.annotate('IoU cao thì tốt.', seen))).toEqual(['IoU'])
    expect(terms(ann.annotate('IoU thấp thì tệ.', seen))).toEqual([])
  })

  it('keeps the original text intact', () => {
    const s = 'Dùng GIoU thay IoU khi hai hộp không chạm.'
    expect(text(ann.annotate(s, new Set()))).toBe(s)
  })

  it('does not match a short term inside a longer one', () => {
    expect(terms(ann.annotate('GIoU', new Set()))).toEqual(['GIoU'])
  })

  it('skips "log" when it means a logarithm', () => {
    expect(terms(ann.annotate('tràn số, log 0, log σ', new Set()))).toEqual([])
    expect(terms(ann.annotate('tìm cảnh trong log', new Set()))).toEqual(['log'])
  })

  it('skips terms that already have an explanation in parentheses', () => {
    expect(terms(ann.annotate('IoU (giao chia hợp)', new Set()))).toEqual([])
    expect(terms(ann.annotate('chỉ số (IoU) quen thuộc', new Set()))).toEqual([])
  })

  it('leaves inline math alone', () => {
    const segs = ann.annotate('chi phí $O(n^2)$ với IoU', new Set())
    expect(segs.some((s) => s.k === 'math' && s.tex === 'O(n^2)')).toBe(true)
    expect(terms(segs)).toEqual(['IoU'])
  })

  it('explains both halves of "precision–recall" and is case-insensitive when flagged', () => {
    expect(terms(ann.annotate('đường precision–recall', new Set()))).toEqual(['precision', 'recall'])
    expect(terms(ann.annotate('Focal loss giảm mẫu dễ', new Set()))).toEqual(['Focal loss'])
  })

  it('markSeen suppresses terms already named by a concept', () => {
    const seen = new Set<string>()
    ann.markSeen(['IoU', 'Intersection over Union'], seen)
    expect(terms(ann.annotate('IoU', seen))).toEqual([])
  })

  it('the real glossary compiles and has no duplicate terms', () => {
    const real = makeAnnotator(GLOSSARY)
    expect(() => real.annotate('backbone, BEV, NMS, log 0', new Set())).not.toThrow()
    const keys = GLOSSARY.map((g) => g[0].toLowerCase())
    expect(new Set(keys).size).toBe(keys.length)
  })
})
