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
  /** khâu trên bản đồ của buổi (`MapStage.k`) mà khái niệm thuộc về */
  stage?: string
  /** chi tiết công cụ / tham số: hiện trong phần "Đào sâu" thu gọn */
  deep?: boolean
  /** hình minh hoạ tĩnh (khoá trong FIGS của sổ) và chú thích của nó */
  fig?: string
  figCap?: string
}

export interface Formula {
  /** LaTeX */
  tex: string
  /** đọc công thức bằng lời */
  read: string
  ex: string
  deep?: boolean
}

/** Khái niệm của buổi trước cần nắm trước khi đọc buổi này. */
export interface Prereq {
  /** id buổi để mở lại */
  day: string
  t: string
  d: string
}

/** Một khâu trên bản đồ của buổi: tên tiếng Anh, tiếng Việt, việc làm, ví dụ trên ví dụ xuyên suốt. */
export interface MapStage {
  k: string
  en: string
  vi: string
  does: string
  eg: string
  /** buổi học kỹ khâu này */
  next?: string
}

export interface LessonMap {
  title: string
  note: string
  stages: MapStage[]
}

export interface Lesson {
  id: string
  /** phần đề tương ứng (chỉ sổ Phase 2 có; đề giữa kỳ chia theo chủ đề, không theo buổi) */
  part?: Part
  n: number
  title: string
  question: string
  prereq?: Prereq[]
  analogy: string
  why: string
  /** ví dụ xuyên suốt nhiều buổi (sổ Phase 1 từ Day 7: ShopBot) */
  thread?: { name: string; text: string }
  /** bản đồ các khâu; có thì hiện thay cho `steps` */
  map?: LessonMap
  steps: string[]
  concepts: Concept[]
  formulas: Formula[]
  /** ô bảng có thể chứa công thức inline "$...$" */
  table: { title: string; cols: string[]; rows: string[][]; deep?: boolean }
  traps: string[]
  /** bẫy khi dùng công cụ cụ thể, nằm trong phần "Đào sâu" */
  deepTraps?: string[]
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

/** [thuật ngữ tiếng Việt, thuật ngữ tiếng Anh]: lần đầu trên trang hiển thị thành "English (tiếng Việt)" */
export type VIEntry = [string, string]

export interface SimUI {
  controls: HTMLElement
  fig: HTMLElement
  out: HTMLElement
  slider(o: { label: string; min: number; max: number; step: number; value: number; fmt: (v: number) => string }, cb: (v: number) => void): HTMLInputElement
  select(label: string, options: string[], value: string, cb: (v: string) => void): HTMLSelectElement
  button(label: string, cb: () => void): void
  svg(w: number, h: number): SVGSVGElement
}

export interface SimSpec {
  title: string
  intro: string
  tries: string[]
  build(ui: SimUI): void
}
