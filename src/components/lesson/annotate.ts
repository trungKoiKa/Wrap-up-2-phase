import { BOOKS, type BookId } from '../../data/lessons'
import type { Lesson, Overview, SimSpec } from '../../data/lessons/types'
import { makeAnnotator, type Annotator, type Seg } from '../../lib/gloss'

/** Mỗi sổ một bộ chú giải riêng (thuật ngữ và giải thích khác nhau giữa Phase 1 và Phase 2). */
export const annotators = Object.fromEntries(BOOKS.map((b) => [b.id, makeAnnotator(b.glossary, b.vi)])) as Record<BookId, Annotator>

/** Bài học sau khi chú giải: mọi đoạn văn thành Seg[]; mảng giữ đúng chỉ số của dữ liệu gốc. */
export interface AnnotatedLesson {
  question: Seg[]
  prereq: Seg[][]
  analogy: Seg[]
  why: Seg[]
  thread: Seg[]
  map: { does: Seg[]; eg: Seg[] }[]
  steps: Seg[][]
  concepts: { d: Seg[]; ex: Seg[] }[]
  sim: { intro: Seg[]; tries: Seg[][] } | null
  formulas: { read: Seg[]; ex: Seg[] }[]
  rows: Seg[][][]
  traps: Seg[][]
  remember: Seg[][]
  deepTraps: Seg[][]
  cards: [Seg[], Seg[]][]
}

/** Buổi có phần "Đào sâu" không (khái niệm, công thức, bảng hoặc bẫy được đánh dấu deep). */
export function hasDeep(d: Lesson) {
  return d.concepts.some((c) => c.deep) || d.formulas.some((f) => f.deep) || !!d.table.deep || !!d.deepTraps?.length
}

/**
 * Chú giải cả trang một lần (gọi trong useMemo). Một Set mới cho mỗi lần gọi nên kết quả không phụ
 * thuộc số lần React render. Các câu lệnh bên dưới chạy đúng thứ tự các phần xuất hiện trên trang
 * (phần Cốt lõi trước, phần Đào sâu sau), để mỗi thuật ngữ được giải thích ở lần đọc thấy đầu tiên.
 */
export function annotateLesson(d: Lesson, sim: SimSpec | undefined, annotator: Annotator): AnnotatedLesson {
  const seen = new Set<string>()
  const a = (s: string) => annotator.annotate(s, seen)
  const concepts: AnnotatedLesson['concepts'] = []
  const formulas: AnnotatedLesson['formulas'] = []
  const doConcepts = (deep: boolean) =>
    d.concepts.forEach((c, i) => {
      if (!!c.deep !== deep) return
      annotator.markSeen([c.t, c.en, ...c.en.split(/\s*[/,]\s*/)], seen)
      concepts[i] = { d: a(c.d), ex: a(c.ex) }
    })
  const doFormulas = (deep: boolean) =>
    d.formulas.forEach((f, i) => {
      if (!!f.deep === deep) formulas[i] = { read: a(f.read), ex: a(f.ex) }
    })

  const question = a(d.question)
  const prereq = (d.prereq ?? []).map((p) => {
    annotator.markSeen([p.t], seen)
    return a(p.d)
  })
  const analogy = a(d.analogy)
  const why = a(d.why)
  const thread = d.thread ? a(d.thread.text) : []
  const map = (d.map?.stages ?? []).map((s) => ({ does: a(s.does), eg: a(s.eg) }))
  // buổi có bản đồ thì bản đồ thay cho lộ trình, nên không chú giải (và không hiện) steps
  const steps = d.map ? [] : d.steps.map(a)
  doConcepts(false)
  const simText = sim ? { intro: a(sim.intro), tries: sim.tries.map(a) } : null
  doFormulas(false)
  let rows = d.table.deep ? [] : d.table.rows.map((r) => r.map(a))
  const traps = d.traps.map(a)
  const remember = d.remember.map(a)
  doConcepts(true)
  doFormulas(true)
  if (d.table.deep) rows = d.table.rows.map((r) => r.map(a))
  const deepTraps = (d.deepTraps ?? []).map(a)
  const cards = d.cards.map(([q, ans]): [Seg[], Seg[]] => [a(q), a(ans)])

  return { question, prereq, analogy, why, thread, map, steps, concepts, sim: simText, formulas, rows, traps, remember, deepTraps, cards }
}

export function annotateOverview(o: Overview, annotator: Annotator) {
  const seen = new Set<string>()
  const a = (s: string) => annotator.annotate(s, seen)
  return { intro: a(o.intro), flow: o.flow.map((f) => a(f.text)), howto: o.howto.map(a) }
}
