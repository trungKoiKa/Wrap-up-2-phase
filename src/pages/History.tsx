import { useNavigate } from 'react-router-dom'
import { BY_ID, QUESTIONS } from '../data'
import { useApp } from '../store/AppContext'
import { PART_LABEL, type Part } from '../types'
import { fmt } from './Quiz'

export default function History() {
  const { history, wrong, startSession, seen } = useApp()
  const nav = useNavigate()
  const wrongList = Object.entries(wrong).sort((a, b) => b[1].wrongCount - a[1].wrongCount)

  const partStats: Record<number, { t: number; p: number }> = {}
  history.forEach((h) =>
    Object.entries(h.perPart).forEach(([p, e]) => {
      const x = (partStats[Number(p)] ??= { t: 0, p: 0 })
      x.t += e.total
      x.p += e.points
    }),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Tiến độ</h1>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Độ chính xác theo phần</h2>
        {history.length === 0 && <p className="text-muted">Chưa có dữ liệu. Hãy làm một lượt bài!</p>}
        {[1, 2, 3, 4].map((p) => {
          const e = partStats[p]
          if (!e) return null
          const pct = Math.round((e.p / e.t) * 100)
          return (
            <div key={p}>
              <div className="flex justify-between text-sm">
                <span>{PART_LABEL[p as Part]}</span>
                <span className="text-muted">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface2">
                <div className={'h-full ' + (pct >= 80 ? 'bg-ok' : pct >= 50 ? 'bg-warn' : 'bg-bad')} style={{ width: pct + '%' }} />
              </div>
            </div>
          )
        })}
        <p className="text-sm text-muted">
          Đã gặp {new Set(seen).size}/{QUESTIONS.length} câu.
        </p>
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center gap-3">
          <h2 className="font-bold">Sổ câu sai ({wrongList.length})</h2>
          <button
            className="btn btn-primary ml-auto"
            disabled={wrongList.length === 0}
            onClick={() => {
              startSession('Ôn câu sai', Object.keys(wrong), 'practice')
              nav('/quiz')
            }}
          >
            Ôn ngay
          </button>
        </div>
        {wrongList.length === 0 && <p className="text-muted">Chưa có câu sai nào.</p>}
        <ul className="divide-y divide-line">
          {wrongList.map(([id, e]) => (
            <li key={id} className="flex items-center gap-3 py-2 text-sm">
              <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">{id}</span>
              <span className="flex-1">{BY_ID[id]?.prompt.slice(0, 110)}</span>
              <span className="text-bad">sai {e.wrongCount}×</span>
              <span className="text-muted">chuỗi đúng {e.streak}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="mb-3 font-bold">Lịch sử các lượt</h2>
        {history.length === 0 && <p className="text-muted">Trống.</p>}
        <ul className="divide-y divide-line">
          {history.map((h) => {
            const pct = Math.round((h.points / h.total) * 100)
            return (
              <li key={h.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm">
                <span className="flex-1 font-medium">{h.title}</span>
                <span className="text-muted">{new Date(h.at).toLocaleString('vi-VN')}</span>
                <span className="text-muted">{fmt(h.durationMs)}</span>
                <b className={pct >= 80 ? 'text-ok' : pct >= 50 ? 'text-warn' : 'text-bad'}>
                  {h.points}/{h.total} ({pct}%)
                </b>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
