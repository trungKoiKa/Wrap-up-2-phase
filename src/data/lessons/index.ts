import { DAYS } from './days'
import { GLOSSARY } from './glossary'
import { OVERVIEW } from './overview'
import { P1_DAYS } from './p1/days'
import { P1_GLOSSARY, P1_VI } from './p1/glossary'
import { P1_OVERVIEW } from './p1/overview'
import type { GlossEntry, Lesson, Overview, VIEntry } from './types'

export type { Lesson } from './types'
export { GLOSSARY, OVERVIEW }

/** Sổ Phase 2 (CV & Perception), giữ tên cũ cho các chỗ đang dùng */
export const LESSONS: Lesson[] = DAYS

export type BookId = 'p1' | 'cv'

/** Một cuốn sổ ôn: danh sách buổi, trang tổng quan và bảng thuật ngữ riêng. */
export interface Book {
  id: BookId
  /** nhãn ngắn trên nút chuyển sổ */
  tab: string
  name: string
  /** tiêu đề trang Tổng quan */
  heading: string
  lessons: Lesson[]
  overview: Overview
  glossary: GlossEntry[]
  vi: VIEntry[]
  /** tên khái niệm hiển thị tiếng Anh trước, tiếng Việt bên dưới */
  enFirst: boolean
}

export const BOOKS: Book[] = [
  {
    id: 'p1',
    tab: 'Phase 1',
    name: 'Nền tảng AI',
    heading: 'Mười bốn buổi, từ một lời gọi API tới agent chạy thật',
    lessons: P1_DAYS,
    overview: P1_OVERVIEW,
    glossary: P1_GLOSSARY,
    vi: P1_VI,
    enFirst: true,
  },
  {
    id: 'cv',
    tab: 'Phase 2',
    name: 'CV & Perception',
    heading: 'Mười hai buổi, một chiếc xe biết nhìn',
    lessons: DAYS,
    overview: OVERVIEW,
    glossary: GLOSSARY,
    vi: [],
    enFirst: false,
  },
]

export const BOOK_BY_ID = Object.fromEntries(BOOKS.map((b) => [b.id, b])) as Record<BookId, Book>
/** id bài học là duy nhất giữa các sổ (day1…day15 và day16…day27) */
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(BOOKS.flatMap((b) => b.lessons.map((d) => [d.id, d])))
export const BOOK_OF_LESSON: Record<string, Book> = Object.fromEntries(BOOKS.flatMap((b) => b.lessons.map((d) => [d.id, b])))
