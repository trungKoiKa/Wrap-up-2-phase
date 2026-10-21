import { CheckCircle2, ChevronLeft, ChevronRight, Flag, Lightbulb, Pause, Play, Send, XCircle } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import QuestionView from '../components/QuestionView'
import { BY_ID, sourceLabel } from '../data'
import { grade, isAnswered } from '../lib/grading'
import { useApp } from '../store/AppContext'
import { PART_LABEL, PRIO_LABEL } from '../types'

export function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function Quiz() {
  const nav = useNavigate()
  const { settings, session, setAnswer, toggleFlag, reveal, goTo, tick, setPaused, submit } = useApp()
  const finishing = useRef(false)
  const tickRef = useRef(tick)
  tickRef.current = tick

  const finish = useCallback(() => {
    finishing.current = true
    submit()
    nav('/result', { replace: true })
  }, [submit, nav])

  // timer
  const running = !!session && !session.paused
  useEffect(() => {
    if (!running) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      tickRef.current(now - last)
      last = now
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  // auto submit when time is up
  const timeUp = !!session && session.limitMs !== null && session.elapsedMs >= session.limitMs
  useEffect(() => {
    if (timeUp && !finishing.current) finish()
  }, [timeUp, finish])

  // keyboard shortcuts
  useEffect(() => {
    if (!session) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || e.ctrlKey || e.metaKey || e.altKey) return
      const id = session.questionIds[session.current]
      const q = BY_ID[id]
      if (e.key === 'ArrowRight') goTo(session.current + 1)
      else if (e.key === 'ArrowLeft') goTo(session.current - 1)
      else if (e.key.toLowerCase() === 'f') toggleFlag(id)
      else if (/^[1-4]$/.test(e.key) && !session.revealed.includes(id)) {
        const i = Number(e.key) - 1
        if (q.type === 'single') {
          const opts = session.orders[id]
          if (opts[i]) pick(id, { t: 'single', v: opts[i] })
        } else if (q.type === 'truefalse' && i < 2) pick(id, { t: 'truefalse', v: i === 0 })
      }
    }
    const pick = (id: string, a: Parameters<typeof setAnswer>[1]) => {
      setAnswer(id, a)
      if (session.mode === 'practice' || settings.instantFeedback) reveal(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [session, settings.instantFeedback, goTo, toggleFlag, setAnswer, reveal])

  if (!session) return finishing.current ? null : <Navigate to="/" replace />

  const total = session.questionIds.length
  const id = session.questionIds[session.current]
  const q = BY_ID[id]
  const answer = session.answers[id]
  const revealed = session.revealed.includes(id)
  const practice = session.mode === 'practice'
  const answeredCount = session.questionIds.filter((x) => isAnswered(BY_ID[x], session.answers[x])).length
  const remaining = session.limitMs !== null ? session.limitMs - session.elapsedMs : null
  const low = remaining !== null && remaining < 5 * 60 * 1000

  const instant = practice || settings.instantFeedback
  const verdict = revealed ? grade(q, answer) : null
  const autoCheck = instant && (q.type === 'single' || q.type === 'truefalse')
  const checked = revealed
  const locked = revealed && q.type !== 'open'

  function onChange(a: Parameters<typeof setAnswer>[1]) {
    setAnswer(id, a)
    if (autoCheck) reveal(id)
  }

  function onSubmit() {
    const left = total - answeredCount
    const msg = left > 0 ? `Còn ${left} câu chưa trả lời. Vẫn nộp bài?` : 'Nộp bài và xem kết quả?'
    if (confirm(msg)) finish()
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div className="card card-raised flex flex-wrap items-center gap-3 p-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{session.title}</p>
            <p className="text-xs text-muted">
              {practice ? 'Luyện tập' : 'Thi thử'} · đã trả lời {answeredCount}/{total}
            </p>
          </div>
          <div
            className={'tabular rounded-xl px-3.5 py-1.5 text-lg font-extrabold ' + (low ? 'bg-bad-soft text-bad' : 'bg-surface2')}
            role="timer"
            aria-label={remaining !== null ? 'Thời gian còn lại' : 'Thời gian đã làm'}
          >
            {remaining !== null ? fmt(remaining) : fmt(session.elapsedMs)}
          </div>
          <button className="btn" onClick={() => setPaused(!session.paused)} aria-label={session.paused ? 'Tiếp tục' : 'Tạm dừng'}>
            {session.paused ? <Play size={16} /> : <Pause size={16} />}
            <span className="hidden sm:inline">{session.paused ? 'Tiếp tục' : 'Tạm dừng'}</span>
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            <Send size={16} /> Nộp bài
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answeredCount}>
          <div className="h-full rounded-full transition-all" style={{ background: 'linear-gradient(90deg, var(--primary-2), var(--primary))', width: `${(answeredCount / total) * 100}%` }} />
        </div>

        {session.paused ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold">Đã tạm dừng</p>
            <p className="mb-4 text-muted">Nội dung câu hỏi được ẩn trong lúc dừng.</p>
            <button className="btn btn-primary" onClick={() => setPaused(false)}>
              <Play size={16} /> Tiếp tục làm bài
            </button>
          </div>
        ) : (
          <article className="card card-raised space-y-5 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-primary-soft px-2.5 py-1 text-sm font-bold text-primary">
                Câu {session.current + 1}/{total}
              </span>
              <span className="mt-1 text-xs text-muted">
                {PART_LABEL[q.part]} · {sourceLabel(q)}
                {q.prio && <span className="ml-2 rounded-md bg-surface2 px-1.5 py-0.5">{PRIO_LABEL[q.prio]}</span>}
              </span>
              <button
                className={'ml-auto btn !px-2.5 ' + (session.flagged.includes(id) ? '!border-warn !bg-warn-soft text-warn' : '')}
                onClick={() => toggleFlag(id)}
                aria-pressed={session.flagged.includes(id)}
                title="Đánh dấu xem lại (F)"
              >
                <Flag size={15} />
                <span className="hidden sm:inline">Đánh dấu</span>
              </button>
            </div>
            <h2 className="pre text-xl font-bold leading-snug sm:text-[1.35rem]">{q.prompt}</h2>

            <QuestionView
              key={id}
              q={q}
              answer={answer}
              order={session.orders[id]}
              onChange={onChange}
              checked={checked}
              locked={locked}
            />

            {!revealed && (q.type === 'open' || (instant && !autoCheck)) && (
              <button className="btn btn-primary" onClick={() => reveal(id)}>
                {q.type === 'open' ? 'Xem đáp án mẫu' : 'Kiểm tra đáp án'}
              </button>
            )}

            {revealed && q.type !== 'open' && (
              <div
                role="status"
                className={
                  'rise flex items-center gap-2 rounded-2xl px-4 py-3 font-bold ' +
                  (verdict === 'correct' ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad')
                }
              >
                {verdict === 'correct' ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}
                {verdict === 'correct' ? 'Chính xác!' : 'Chưa đúng — xem đáp án đúng ở trên'}
              </div>
            )}

            {revealed && q.explanation && (
              <div className="rise rounded-2xl border border-line bg-surface2 p-4 text-sm">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <Lightbulb size={14} aria-hidden="true" /> Vì sao đúng
                </p>
                <p className="pre leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </article>
        )}

        <div className="flex justify-between">
          <button className="btn" disabled={session.current === 0} onClick={() => goTo(session.current - 1)}>
            <ChevronLeft size={16} /> Câu trước
          </button>
          <button className="btn" disabled={session.current === total - 1} onClick={() => goTo(session.current + 1)}>
            Câu sau <ChevronRight size={16} />
          </button>
        </div>
        <p className="hidden text-xs text-muted sm:block">Phím tắt: ← → chuyển câu · 1–4 chọn đáp án · F đánh dấu.</p>
      </div>

      <aside className="card h-fit p-4 lg:sticky lg:top-20" aria-label="Danh sách câu hỏi">
        <p className="mb-2 text-sm font-semibold">Danh sách câu</p>
        <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
          {session.questionIds.map((x, i) => {
            const done = isAnswered(BY_ID[x], session.answers[x])
            const flagged = session.flagged.includes(x)
            return (
              <button
                key={x}
                onClick={() => goTo(i)}
                aria-label={`Câu ${i + 1}${done ? ' đã trả lời' : ''}${flagged ? ' đã đánh dấu' : ''}`}
                aria-current={i === session.current}
                className={
                  'relative grid aspect-square min-h-8 place-items-center rounded-xl border text-xs font-bold transition-colors ' +
                  (i === session.current
                    ? 'border-primary bg-primary text-primary-fg'
                    : done
                      ? 'border-ok/50 bg-ok-soft text-ok'
                      : 'border-line text-muted hover:bg-surface2')
                }
              >
                {i + 1}
                {flagged && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-warn" />}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted">Xanh: đã trả lời · chấm vàng: đã đánh dấu.</p>
      </aside>
    </div>
  )
}
