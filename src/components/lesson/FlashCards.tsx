import { useState } from 'react'
import type { Seg } from '../../lib/gloss'
import Rich from './Rich'

/** Thẻ tự kiểm tra: tự trả lời trước, mở đáp án, đánh dấu thẻ đã nhớ. */
export default function FlashCards({
  id,
  cards,
  known,
  onToggleKnown,
}: {
  id: string
  cards: [Seg[], Seg[]][]
  known: Record<string, boolean>
  onToggleKnown: (key: string) => void
}) {
  const [open, setOpen] = useState<Record<number, boolean>>({})
  const allOpen = cards.every((_, i) => open[i])
  const k = cards.filter((_, i) => known[`${id}:${i}`]).length

  return (
    <section className="lsec">
      <h3>
        Tự kiểm tra <small>{k}/{cards.length} thẻ đã nhớ</small>
      </h3>
      <div className="lbar">
        <button className="btn" onClick={() => setOpen(allOpen ? {} : Object.fromEntries(cards.map((_, i) => [i, true])))}>
          {allOpen ? 'Ẩn mọi đáp án' : 'Hiện mọi đáp án'}
        </button>
        <span>Tự trả lời trước, rồi mới mở đáp án.</span>
      </div>
      <div className="fcards">
        {cards.map(([q, a], i) => {
          const key = `${id}:${i}`
          const isK = !!known[key]
          return (
            <div key={key} className={'fcard' + (isK ? ' known' : '')}>
              <div className="q">
                <Rich segs={q} />
              </div>
              {open[i] && (
                <div className="a">
                  <Rich segs={a} />
                </div>
              )}
              <div className="row">
                <button className="btn" onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))} aria-expanded={!!open[i]}>
                  {open[i] ? 'Ẩn đáp án' : 'Xem đáp án'}
                </button>
                <button className="btn" aria-pressed={isK} onClick={() => onToggleKnown(key)}>
                  {isK ? 'Đã nhớ ✓' : 'Đánh dấu đã nhớ'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
