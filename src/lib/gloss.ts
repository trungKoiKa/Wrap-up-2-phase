import type { GlossEntry } from '../data/lessons/types'

/** Một mẩu văn bản sau khi chú giải: chữ thường, thuật ngữ kèm giải thích, hoặc công thức inline. */
export type Seg = { k: 'text'; v: string } | { k: 'term'; v: string; def: string } | { k: 'math'; tex: string }

interface Rule {
  key: string
  def: string
  re: RegExp
}

/**
 * Chú giải thuật ngữ: lần đầu một thuật ngữ xuất hiện trên trang thì gắn kèm giải thích ngắn.
 * - thuật ngữ dài khớp trước (ví dụ "focal loss" trước "loss");
 * - bỏ qua nếu ngay trước là "(" hoặc ngay sau là "(" (văn bản đã tự giải thích);
 * - "$...$" là công thức inline, không chú giải bên trong.
 * `seen` là tập thuật ngữ đã giải thích trên trang hiện tại, truyền theo thứ tự đọc.
 */
export function makeAnnotator(entries: GlossEntry[]) {
  const rules: Rule[] = entries
    .map(([term, def, flags, look]) => {
      const q = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return {
        key: term.toLowerCase(),
        def,
        re: new RegExp('(?<![\\p{L}\\p{N}_\\-./])' + q + '(?![\\p{L}\\p{N}_])' + (look ?? ''), 'gu' + (flags === 'i' ? 'i' : '')),
      }
    })
    .sort((a, b) => b.key.length - a.key.length)

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
          holes.push({ k: 'term', v: m, def: r.def })
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
