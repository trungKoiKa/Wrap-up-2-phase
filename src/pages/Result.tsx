import { CheckCircle2, CircleDashed, MinusCircle, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import QuestionView from '../components/QuestionView'
import ScoreRing from '../components/ScoreRing'
import { BY_ID } from '../data'
import { grade, score, type Result as R } from '../lib/grading'
import { useApp } from '../store/AppContext'
import { PART_LABEL, type Part } from '../types'
import { fmt } from './Quiz'

const ICON: Record<R, { el: typeof XCircle; cls: string; label: string }> = {
  correct: { el: CheckCircle2, cls: 'text-ok', label: 'Đúng' },
  partial: { el: MinusCircle, cls: 'text-warn', label: 'Gần đúng' },
  wrong: { el: XCircle, cls: 'text-bad', label: 'Sai' },
  unanswered: { el: CircleDashed, cls: 'text-muted', label: 'Chưa làm' },
}

export default function Result() {
  const { lastResult, wrong, startSession } = useApp()
  const nav = useNavigate()
  const [filter, setFilter] = useState<'all' | 'bad'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  if (!lastResult) return <Navigate to="/" replace />

  const rows = lastResult.questionIds.map((id) => ({ id, q: BY_ID[id], r: grade(BY_ID[id], lastResult.answers[id]) }))
  const points = rows.reduce((a, x) => a + score(x.r), 0)
  const total = rows.length
  const pct = Math.round((points / total) * 100)
  const counts = { correct: 0, partial: 0, wrong: 0, unanswered: 0 } as Record<R, number>
  rows.forEach((x) => counts[x.r]++)
  const perPart: Record<number, { t: number; p: number }> = {}
  rows.forEach((x) => {
    const e = (perPart[x.q.part] ??= { t: 0, p: 0 })
    e.t++
    e.p += score(x.r)
  })
  const badIds = rows.filter((x) => x.r !== 'correct').map((x) => x.id)
  const shown = filter === 'bad' ? rows.filter((x) => x.r !== 'correct') : rows

  return (
    <div className="space-y-6">
      <section className="card card-raised p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <ScoreRing pct={pct} />
          <div>
            <p className="text-sm font-medium text-muted">{lastResult.title}</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              {pct >= 80 ? 'Rất tốt! Bạn nắm chắc rồi' : pct >= 50 ? 'Khá ổn, ôn thêm một chút' : 'Cần ôn lại kỹ hơn'}
            </h1>
            <p className="tabular mt-1 text-lg text-muted">
              {points % 1 === 0 ? points : points.toFixed(1)}/{total} điểm · {fmt(lastResult.elapsedMs)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {(Object.keys(counts) as R[]).map((k) => {
            const { el: Icon, cls, label } = ICON[k]
            return (
              <span key={k} className="flex items-center gap-1.5">
                <Icon size={16} className={cls} /> {label}: <b>{counts[k]}</b>
              </span>
            )
          })}
        </div>
        <div className="mt-5 space-y-2">
          {Object.entries(perPart).map(([p, e]) => (
            <div key={p}>
              <div className="flex justify-between text-sm">
                <span>{PART_LABEL[Number(p) as Part]}</span>
                <span className="text-muted">
                  {e.p}/{e.t}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--primary-2), var(--primary))', width: `${(e.p / e.t) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/" className="btn">
            Về trang chủ
          </Link>
          <button
            className="btn btn-primary"
            disabled={badIds.length === 0}
            onClick={() => {
              startSession('Làm lại câu sai', badIds, 'practice')
              nav('/quiz')
            }}
          >
            <RotateCcw size={16} /> Làm lại {badIds.length} câu chưa đúng
          </button>
          <span className="self-center text-sm text-muted">Sổ câu sai hiện có {Object.keys(wrong).length} câu.</span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Xem lại từng câu</h2>
          <div className="ml-auto flex rounded-xl border border-line bg-surface p-0.5 text-sm">
            {(
              [
                ['all', 'Tất cả'],
                ['bad', 'Chưa đúng'],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={'rounded-lg px-3 py-1 ' + (filter === k ? 'bg-primary text-primary-fg' : 'text-muted')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {shown.map(({ id, q, r }, i) => {
          const { el: Icon, cls, label } = ICON[r]
          const open = openId === id
          return (
            <div key={id} className="card">
              <button
                className="flex w-full items-center gap-3 p-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : id)}
              >
                <Icon size={20} className={cls + ' shrink-0'} aria-label={label} />
                <span className="flex-1 text-sm font-medium">
                  {i + 1}. {q.prompt.length > 140 ? q.prompt.slice(0, 140) + '…' : q.prompt}
                </span>
                <span className={'text-xs ' + cls}>{label}</span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-line p-4">
                  <p className="pre font-semibold">{q.prompt}</p>
                  <QuestionView
                    q={q}
                    answer={lastResult.answers[id]}
                    order={lastResult.orders[id]}
                    onChange={() => {}}
                    checked
                    locked
                  />
                  {q.explanation && <p className="pre rounded-lg bg-surface2 p-3 text-sm">{q.explanation}</p>}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
