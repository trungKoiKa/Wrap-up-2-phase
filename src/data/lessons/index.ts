import { DAYS } from './days'
import type { Lesson } from './types'

export { GLOSSARY } from './glossary'
export { OVERVIEW } from './overview'
export type { Lesson } from './types'

export const LESSONS: Lesson[] = DAYS
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(DAYS.map((d) => [d.id, d]))
/** bài học ứng với một phần đề Phase 2 (part = số ngày) */
export const LESSON_BY_PART: Record<number, Lesson> = Object.fromEntries(DAYS.map((d) => [d.part, d]))
