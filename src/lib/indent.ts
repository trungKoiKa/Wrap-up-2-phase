export const INDENT = '  '

export interface Edit {
  /** replace value[from, to) with `text` */
  from: number
  to: number
  text: string
  /** selection after the edit, in the new value's coordinates */
  selStart: number
  selEnd: number
}

/**
 * Text-editor style Tab handling for a textarea.
 * - Tab, no newline in selection: replace the selection with one indent.
 * - Tab, selection spanning lines: indent every touched line.
 * - Shift+Tab: remove up to one indent (or a tab) from every touched line.
 */
export function indentEdit(value: string, start: number, end: number, shift: boolean): Edit {
  const multiline = value.slice(start, end).includes('\n')
  if (!shift && !multiline) {
    return { from: start, to: end, text: INDENT, selStart: start + INDENT.length, selEnd: start + INDENT.length }
  }

  // widen to whole lines; a selection ending right after "\n" does not touch the next line
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const effEnd = end > start && value[end - 1] === '\n' ? end - 1 : end
  const nl = value.indexOf('\n', effEnd)
  const lineEnd = nl === -1 ? value.length : nl
  const lines = value.slice(lineStart, lineEnd).split('\n')

  if (!shift) {
    return {
      from: lineStart,
      to: lineEnd,
      text: lines.map((l) => INDENT + l).join('\n'),
      selStart: start + INDENT.length,
      selEnd: end + INDENT.length * lines.length,
    }
  }

  const removed = lines.map((l) => {
    if (l.startsWith('\t')) return 1
    let n = 0
    while (n < INDENT.length && l[n] === ' ') n++
    return n
  })
  const text = lines.map((l, i) => l.slice(removed[i])).join('\n')
  const total = removed.reduce((a, b) => a + b, 0)
  const selStart = Math.max(lineStart, start - removed[0])
  return { from: lineStart, to: lineEnd, text, selStart, selEnd: Math.max(selStart, end - total) }
}

export function applyEdit(value: string, e: Edit): string {
  return value.slice(0, e.from) + e.text + value.slice(e.to)
}
