import type { Part, Prio, Question } from '../../types'

/**
 * Gọn hoá việc khai báo câu hỏi cho các bài giảng Phase 2.
 * Id có dạng `d<ngày>-<số>`; giữ cố định để lịch sử và Sổ câu sai không bị lệch.
 * Mọi câu đều có giải thích (tham số cuối) lấy từ chính bài giảng.
 */
export function maker(part: Part) {
  const id = (n: string) => `d${part}-${n}`
  return {
    single: (n: string, prio: Prio, prompt: string, answer: string, distractors: string[], explanation: string): Question => ({
      id: id(n), part, prio, type: 'single', prompt, answer, distractors, explanation,
    }),
    multi: (n: string, prio: Prio, prompt: string, answers: string[], distractors: string[], explanation: string): Question => ({
      id: id(n), part, prio, type: 'multi', prompt, answers, distractors, explanation,
    }),
    tf: (n: string, prio: Prio, prompt: string, answer: boolean, explanation: string): Question => ({
      id: id(n), part, prio, type: 'truefalse', prompt, answer, explanation,
    }),
    fill: (n: string, prio: Prio, prompt: string, answers: string[], explanation: string): Question => ({
      id: id(n), part, prio, type: 'fill', prompt, answers, explanation,
    }),
    /** pairs: [vế trái, vế phải đúng]; thứ tự vế phải được xáo khi làm bài */
    match: (n: string, prio: Prio, prompt: string, pairs: [string, string][], explanation: string): Question => ({
      id: id(n), part, prio, type: 'matching', prompt,
      left: pairs.map((p) => p[0]), right: pairs.map((p) => p[1]), pairs: pairs.map((_, i) => i), explanation,
    }),
    /** items theo đúng thứ tự */
    order: (n: string, prio: Prio, prompt: string, items: string[], explanation: string): Question => ({
      id: id(n), part, prio, type: 'ordering', prompt, items, explanation,
    }),
  }
}
