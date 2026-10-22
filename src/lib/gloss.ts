import type { GlossEntry, VIEntry } from '../data/lessons/types'

/** Một mẩu văn bản sau khi chú giải: chữ thường, thuật ngữ kèm giải thích, hoặc công thức inline. */
export type Seg = { k: 'text'; v: string } | { k: 'term'; v: string; def: string } | { k: 'math'; tex: string }

interface Rule {
  key: string
  re: RegExp
  /** chú giải tiếng Anh → giải thích */
  def?: string
  /** thuật ngữ tiếng Việt → đổi thành tiếng Anh này, tiếng Việt vào ngoặc */
  en?: string
}

const quote = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Chú giải thuật ngữ: lần đầu một thuật ngữ xuất hiện trên trang thì gắn kèm giải thích ngắn.
 * - thuật ngữ dài khớp trước (ví dụ "focal loss" trước "loss");
 * - bỏ qua nếu ngay trước là "(" hoặc ngay sau là "(" (văn bản đã tự giải thích);
 * - "$...$" là công thức inline, không chú giải bên trong;
 * - `vi`: thuật ngữ đang viết bằng tiếng Việt thì lần đầu hiển thị thành "English (tiếng Việt)".
 * `seen` là tập thuật ngữ đã giải thích trên trang hiện tại, truyền theo thứ tự đọc.
 */
export function makeAnnotator(entries: GlossEntry[], vi: VIEntry[] = []) {
  const viRules: Rule[] = vi
    .map(([v, en]) => ({ key: en.toLowerCase(), en, len: v.length, re: new RegExp('(?<![\\p{L}\\p{N}_])' + quote(v) + '(?![\\p{L}\\p{N}_])', 'giu') }))
    .sort((a, b) => b.len - a.len)
  const enRules: Rule[] = entries
    .map(([term, def, flags, look]) => ({
      key: term.toLowerCase(),
      def,
      re: new RegExp('(?<![\\p{L}\\p{N}_\\-./])' + quote(term) + '(?![\\p{L}\\p{N}_])' + (look ?? ''), 'gu' + (flags === 'i' ? 'i' : '')),
    }))
    .sort((a, b) => b.key.length - a.key.length)
  const rules = [...viRules, ...enRules]

  function annotateText(text: string, seen: Set<string>): Seg[] {
    // thay mỗi chỗ khớp bằng ký hiệu giữ chỗ để thuật ngữ ngắn không khớp lại vào bên trong thuật ngữ dài
    const holes: Seg[] = []
    let s = text
    for (const r of rules) {
      s = s.replace(r.re, (m: string, ...rest: unknown[]) => {
        const off = rest[rest.length - 2] as number
        const str = rest[rest.length - 1] as string
        const after = str.slice(off + m.length)
        const before = str.charAt(off - 1)
        if (seen.has(r.key) || /^\s?\(/.test(after) || before === '(') holes.push({ k: 'text', v: m })
        else {
          seen.add(r.key)
          if (r.en) {
            const upper = m.charAt(0) !== m.charAt(0).toLowerCase()
            holes.push({ k: 'term', v: upper ? r.en.charAt(0).toUpperCase() + r.en.slice(1) : r.en, def: m.toLowerCase() })
          } else holes.push({ k: 'term', v: m, def: r.def! })
        }
        // ký tự vùng dùng riêng (U+E000/U+E001) không xuất hiện trong nội dung bài học
        return '' + (holes.length - 1) + ''
      })
    }
    const out: Seg[] = []
    for (const part of s.split(/(\d+)/)) {
      if (!part) continue
      const m = /^(\d+)$/.exec(part)
      const seg = m ? holes[+m[1]] : ({ k: 'text', v: part } as Seg)
      const last = out[out.length - 1]
      if (seg.k === 'text' && last?.k === 'text') last.v += seg.v
      else out.push({ ...seg })
    }
    return out
  }

  return {
    annotate(text: string, seen: Set<string>): Seg[] {
      return text.split(/(\$[^$]+\$)/).flatMap((p, i): Seg[] => (i % 2 ? [{ k: 'math', tex: p.slice(1, -1) }] : annotateText(p, seen)))
    },
    /** đánh dấu các thuật ngữ đã được giải thích sẵn (ví dụ tên khái niệm) để không chú giải lại */
    markSeen(names: string[], seen: Set<string>) {
      const set = new Set(names.map((n) => n.toLowerCase()))
      for (const r of rules) if (set.has(r.key)) seen.add(r.key)
    },
  }
}

export type Annotator = ReturnType<typeof makeAnnotator>
