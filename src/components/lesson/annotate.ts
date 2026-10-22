import { BOOKS, type BookId } from '../../data/lessons'
import type { Lesson, Overview, SimSpec } from '../../data/lessons/types'
import { makeAnnotator, type Annotator, type Seg } from '../../lib/gloss'

/** Mỗi sổ một bộ chú giải riêng (thuật ngữ và giải thích khác nhau giữa Phase 1 và Phase 2). */
export const annotators = Object.fromEntries(BOOKS.map((b) => [b.id, makeAnnotator(b.glossary, b.vi)])) as Record<BookId, Annotator>

/** Bài học sau khi chú giải: mọi đoạn văn thành Seg[], theo đúng thứ tự đọc trên trang. */
export interface AnnotatedLesson {
  question: Seg[]
  analogy: Seg[]
  why: Seg[]
  steps: Seg[][]
  concepts: { d: Seg[]; ex: Seg[] }[]
  sim: { intro: Seg[]; tries: Seg[][] } | null
  formulas: { read: Seg[]; ex: Seg[] }[]
  rows: Seg[][][]
  traps: Seg[][]
  remember: Seg[][]
  cards: [Seg[], Seg[]][]
}

/**
 * Chú giải cả trang một lần (gọi trong useMemo). Một Set mới cho mỗi lần gọi nên kết quả không phụ
 * thuộc số lần React render; thứ tự gọi bên dưới chính là thứ tự các phần xuất hiện trên trang.
 */
export function annotateLesson(d: Lesson, sim: SimSpec | undefined, annotator: Annotator): AnnotatedLesson {
  const seen = new Set<string>()
  const a = (s: string) => annotator.annotate(s, seen)
  return {
    question: a(d.question),
    analogy: a(d.analogy),
    why: a(d.why),
    steps: d.steps.map(a),
    concepts: d.concepts.map((c) => {
      annotator.markSeen([c.t, c.en, ...c.en.split(/\s*[/,]\s*/)], seen)
      return { d: a(c.d), ex: a(c.ex) }
    }),
    sim: sim ? { intro: a(sim.intro), tries: sim.tries.map(a) } : null,
    formulas: d.formulas.map((f) => ({ read: a(f.read), ex: a(f.ex) })),
    rows: d.table.rows.map((r) => r.map(a)),
    traps: d.traps.map(a),
    remember: d.remember.map(a),
    cards: d.cards.map(([q, ans]): [Seg[], Seg[]] => [a(q), a(ans)]),
  }
}

export function annotateOverview(o: Overview, annotator: Annotator) {
  const seen = new Set<string>()
  const a = (s: string) => annotator.annotate(s, seen)
  return { intro: a(o.intro), flow: o.flow.map((f) => a(f.text)), howto: o.howto.map(a) }
}
