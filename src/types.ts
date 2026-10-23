/** 1–4: đề giữa kỳ; 16–27: bài giảng Phase 2 (số = ngày học) */
export type Part = 1 | 2 | 3 | 4 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27

export const PART_LABEL: Record<Part, string> = {
  1: 'Kiến thức nền tảng',
  2: 'Track 1 · Business & Product',
  3: 'Track 2 · Infra & FinOps',
  4: 'Track 3 · App Build & Agents',
  16: 'Day 16 · Mạng nơ-ron & huấn luyện',
  17: 'Day 17 · Kiến trúc thị giác',
  18: 'Day 18 · 2D Perception',
  19: 'Day 19 · Cảm biến, hiệu chuẩn & đồng bộ thời gian',
  20: 'Day 20 · Kalman & hợp nhất xác suất',
  21: 'Day 21 · 3D từ point cloud',
  22: 'Day 22 · Tracking',
  23: 'Day 23 · 3D, BEV & Sensor fusion',
  24: 'Day 24 · Data & Annotation',
  25: 'Day 25 · VLM & VLA',
  26: 'Day 26 · Synthetic & Trajectory data',
  27: 'Day 27 · Replay & Closed-loop',
}

/** Nhóm đề: mỗi nhóm là một môn/đợt ôn riêng. */
export type Bank = 'midterm' | 'cv'

export const BANK_LABEL: Record<Bank, string> = {
  midterm: 'Giữa kỳ · AI In Action',
  cv: 'Phase 2 · CV & Perception',
}

export const BANK_PARTS: Record<Bank, Part[]> = {
  midterm: [1, 2, 3, 4],
  cv: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
}

/** Mức ưu tiên khi ôn: 1 cốt lõi (phải nắm), 2 quan trọng, 3 chi tiết/số liệu. */
export type Prio = 1 | 2 | 3

export const PRIO_LABEL: Record<Prio, string> = {
  1: 'Cốt lõi',
  2: 'Quan trọng',
  3: 'Chi tiết',
}

interface Base {
  id: string
  part: Part
  prompt: string
  explanation?: string
  prio?: Prio
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
