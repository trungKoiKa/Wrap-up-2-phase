export type Part = 1 | 2 | 3 | 4

export const PART_LABEL: Record<Part, string> = {
  1: 'Kiến thức nền tảng',
  2: 'Track 1 · Business & Product',
  3: 'Track 2 · Infra & FinOps',
  4: 'Track 3 · App Build & Agents',
}

interface Base {
  id: string
  part: Part
  prompt: string
  explanation?: string
}

export interface SingleQ extends Base {
  type: 'single'
  answer: string
  distractors: string[]
}
export interface MultiQ extends Base {
  type: 'multi'
  answers: string[]
  distractors: string[]
}
export interface TrueFalseQ extends Base {
  type: 'truefalse'
  answer: boolean
}
export interface FillQ extends Base {
  type: 'fill'
  answers: string[]
}
export interface MatchingQ extends Base {
  type: 'matching'
  left: string[]
  right: string[]
  /** pairs[i] = index in `right` that matches left[i] */
  pairs: number[]
}
export interface OrderingQ extends Base {
  type: 'ordering'
  /** items in the correct order */
  items: string[]
}
export interface OpenQ extends Base {
  type: 'open'
  modelAnswer: string
}

export type Question = SingleQ | MultiQ | TrueFalseQ | FillQ | MatchingQ | OrderingQ | OpenQ

/** User answer shape per question type (JSON-serialisable). */
export type Answer =
  | { t: 'single'; v: string }
  | { t: 'multi'; v: string[] }
  | { t: 'truefalse'; v: boolean }
  | { t: 'fill'; v: string }
  | { t: 'matching'; v: (number | null)[] }
  | { t: 'ordering'; v: string[] }
  | { t: 'open'; v: string; self: 'right' | 'partial' | 'wrong' | null }

export type Mode = 'exam' | 'practice'

export interface Session {
  id: string
  title: string
  mode: Mode
  questionIds: string[]
  answers: Record<string, Answer>
  /** per-question option order for display, so shuffles survive reload */
  orders: Record<string, string[]>
  flagged: string[]
  revealed: string[]
  current: number
  startedAt: number
  /** accumulated active ms (excludes paused time) */
  elapsedMs: number
  limitMs: number | null
  paused: boolean
  submitted: boolean
  submittedAt?: number
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  palette: 'ocean' | 'ghibli'
  secondsPerQuestion: number
  shuffleQuestions: boolean
  shuffleOptions: boolean
  wrongStreakToClear: number
  instantFeedback: boolean
}

export interface WrongEntry {
  wrongCount: number
  streak: number
  lastSeen: number
}
