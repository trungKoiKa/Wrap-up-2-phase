import type { Part } from '../../types'

export interface Concept {
  /** tên tiếng Việt */
  t: string
  /** tên tiếng Anh / thuật ngữ gốc */
  en: string
  /** giải thích bằng lời thường */
  d: string
  /** ví dụ cụ thể */
  ex: string
}

export interface Formula {
  /** LaTeX */
  tex: string
  /** đọc công thức bằng lời */
  read: string
  ex: string
}

export interface Lesson {
  id: string
  part: Part
  n: number
  title: string
  question: string
  analogy: string
  why: string
  steps: string[]
  concepts: Concept[]
  formulas: Formula[]
  /** ô bảng có thể chứa công thức inline "$...$" */
  table: { title: string; cols: string[]; rows: string[][] }
  traps: string[]
  remember: string[]
  /** [câu hỏi, đáp án] */
  cards: [string, string][]
}

export interface Overview {
  intro: string
  flow: { day: string; label: string; text: string }[]
  howto: string[]
  /** [tiếng Việt, tiếng Anh, hiểu nhanh] */
  glossary: [string, string, string][]
}

/** [thuật ngữ, giải thích, 'i' nếu không phân biệt hoa thường, lookahead thêm (regex) nếu cần] */
export type GlossEntry = [string, string] | [string, string, string] | [string, string, string, string]

export interface SimUI {
  controls: HTMLElement
  fig: HTMLElement
  out: HTMLElement
  slider(o: { label: string; min: number; max: number; step: number; value: number; fmt: (v: number) => string }, cb: (v: number) => void): HTMLInputElement
  select(label: string, options: string[], value: string, cb: (v: string) => void): void
  button(label: string, cb: () => void): void
  svg(w: number, h: number): SVGSVGElement
}

export interface SimSpec {
  title: string
  intro: string
  tries: string[]
  build(ui: SimUI): void
}
