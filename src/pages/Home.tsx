import { ArrowRight, BookX, CheckCheck, GraduationCap, ListChecks, Play, RotateCcw, Shuffle, Sparkles, Timer } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BY_ID, QUESTIONS } from '../data'
import { inScope, pickRandom, pickRemaining, remainingIds, type Scope } from '../lib/sets'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'
import { BANK_LABEL, BANK_PARTS, PART_LABEL, PRIO_LABEL, type Bank, type Mode, type Part, type Prio } from '../types'

const BANKS: Bank[] = ['midterm', 'cv']
const PRIOS: Prio[] = [1, 2, 3]

/** bật/tắt một phần tử nhưng luôn giữ ít nhất một lựa chọn */
function toggle<T>(cur: T[], x: T): T[] {
  return cur.includes(x) ? (cur.length > 1 ? cur.filter((y) => y !== x) : cur) : [...cur, x]
}

export default function Home() {
  const nav = useNavigate()
  const { session, wrong, seen, startSession, settings, discardSession, history, resetSeen } = useApp()
  const [mode, setMode] = useState<Mode>('exam')
  const [count, setCount] = useState(50)
  const [bank, setBankState] = useState<Bank>(() => {
    const b = load<Bank>('bank', 'midterm')
    return BANKS.includes(b) ? b : 'midterm'
  })
  const [parts, setParts] = useState<Part[]>(BANK_PARTS[bank])
  const [prios, setPrios] = useState<Prio[]>(PRIOS)

  const bankScope: Scope = { parts: BANK_PARTS[bank] }
  const scope: Scope = { parts, prios: bank === 'cv' ? prios : undefined }
  const bankPool = QUESTIONS.filter((q) => inScope(q, bankScope))
  const wrongIds = Object.keys(wrong).filter((id) => BY_ID[id] && inScope(BY_ID[id], bankScope))
  const poolSize = QUESTIONS.filter((q) => inScope(q, scope)).length
  const n = Math.min(count, poolSize)
  const seenSet = new Set(seen)
  const remaining = remainingIds(seenSet, scope).length
  const nRemaining = Math.min(count, remaining)
  const seenTotal = bankPool.filter((q) => seenSet.has(q.id)).length

  function start(title: string, ids: string[]) {
    if (ids.length === 0) return
    startSession(title, ids, mode)
    nav('/quiz')
  }

  function setBank(b: Bank) {
    setBankState(b)
    setParts(BANK_PARTS[b])
    setPrios(PRIOS)
    save('bank', b)
  }

  const last = history[0]

  return (
    <div className="space-y-6">
      <section
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl sm:p-9"
        style={{ background: 'linear-gradient(135deg, var(--hero-1) 0%, var(--hero-2) 55%, var(--hero-3) 100%)' }}
      >
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-14 h-56 w-56 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }}
        />
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          <Sparkles size={13} aria-hidden="true" /> {BANK_LABEL[bank]}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">AI In Action</h1>
        <p className="mt-2 max-w-xl text-white">
          {bankPool.length} câu hỏi · {BANK_PARTS[bank].length} phần · trắc nghiệm, đúng/sai, điền khuyết, nối cột, sắp xếp
          {bank === 'midterm' ? ', tự luận' : ''}. Chọn đáp án là biết đúng sai và hiểu vì sao.
        </p>
      </section>

      {session && (
        <section className="card flex flex-wrap items-center gap-3 border-primary p-4">
          <div className="flex-1">
            <p className="font-semibold">Bạn đang làm dở: {session.title}</p>
            <p className="text-sm text-muted">
              Đã trả lời {Object.keys(session.answers).length}/{session.questionIds.length} câu
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => nav('/quiz')}>
            <Play size={16} /> Tiếp tục
          </button>
          <button className="btn btn-danger" onClick={() => confirm('Bỏ lượt đang làm?') && discardSession()}>
            Bỏ lượt này
          </button>
        </section>
      )}

      <section className="card card-raised space-y-6 p-5 sm:p-7">
        <div>
          <h2 className="mb-2.5 text-base font-bold">1. Chọn chế độ làm bài</h2>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            {(
              [
                ['exam', 'Thi thử', 'Đồng hồ đếm ngược (' + settings.secondsPerQuestion + ' giây/câu), chọn đáp án là biết đúng/sai ngay (tắt được trong Cài đặt).'],
                ['practice', 'Luyện tập', 'Xem đáp án + giải thích ngay sau mỗi câu, đồng hồ đếm lên.'],
              ] as const
            ).map(([m, title, desc]) => (
              <button
                key={m}
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={
                  'opt rounded-2xl border-2 p-4 text-left ' + (mode === m ? 'border-primary bg-primary-soft' : 'border-line bg-surface')
                }
              >
                <span className="flex items-center gap-2 font-semibold">
                  {m === 'exam' ? <Timer size={17} aria-hidden="true" /> : <GraduationCap size={17} aria-hidden="true" />} {title}
                </span>
                <span className="mt-1 block text-sm text-muted">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2.5 text-base font-bold">2. Phạm vi</h2>
          <div className="mb-3 inline-flex rounded-xl border border-line bg-surface2 p-1" role="radiogroup" aria-label="Nhóm đề">
            {BANKS.map((b) => (
              <button
                key={b}
                role="radio"
                aria-checked={bank === b}
                onClick={() => setBank(b)}
                className={
                  'rounded-lg px-3 py-1.5 text-sm font-semibold ' +
                  (bank === b ? 'bg-surface text-primary shadow-sm' : 'text-muted hover:text-fg')
                }
              >
                {BANK_LABEL[b]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {BANK_PARTS[bank].map((p) => (
              <button
                key={p}
                aria-pressed={parts.includes(p)}
                onClick={() => setParts((cur) => toggle(cur, p))}
                className="chip"
              >
                {PART_LABEL[p]}
              </button>
            ))}
          </div>
          {bank === 'cv' && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Mức ưu tiên:</span>
              {PRIOS.map((p) => (
                <button
                  key={p}
                  aria-pressed={prios.includes(p)}
                  onClick={() => setPrios((cur) => toggle(cur, p))}
                  className="chip"
                >
                  {PRIO_LABEL[p]}
                </button>
              ))}
            </div>
          )}
          <label className="mt-3 flex items-center gap-3 text-sm">
            Số câu:
            <input
              type="number"
              min={5}
              max={poolSize}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-lg border border-line bg-surface px-2 py-1"
            />
            <span className="text-muted">(tối đa {poolSize})</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="btn btn-primary"
            onClick={() => start(`Đề ngẫu nhiên ${n} câu`, pickRandom(n, Date.now() % 2147483647, wrong, seenSet, scope))}
          >
            <Shuffle size={16} aria-hidden="true" /> Bắt đầu đề ngẫu nhiên {n} câu
          </button>
          <button
            className="btn"
            disabled={remaining === 0}
            onClick={() =>
              start(`Các câu còn lại (${nRemaining} câu)`, pickRemaining(nRemaining, Date.now() % 2147483647, seenSet, scope))
            }
            title={remaining === 0 ? 'Bạn đã làm hết các câu trong phạm vi này' : 'Chỉ gồm các câu chưa xuất hiện trong lượt nào đã nộp'}
          >
            <ListChecks size={16} aria-hidden="true" /> Làm các câu còn lại ({nRemaining} câu)
          </button>
          <button
            className="btn"
            onClick={() =>
              start(
                'Tất cả câu trong phạm vi',
                QUESTIONS.filter((q) => inScope(q, scope)).map((q) => q.id),
              )
            }
          >
            Làm toàn bộ ({poolSize} câu)
          </button>
          <button
            className="btn"
            disabled={wrongIds.length === 0}
            onClick={() => start('Ôn câu sai', wrongIds)}
            title={wrongIds.length === 0 ? 'Chưa có câu sai nào' : ''}
          >
            <BookX size={16} /> Ôn câu sai ({wrongIds.length})
          </button>
          <button className="btn" onClick={() => nav(bank === 'cv' ? '/learn/cv' : '/learn/p1')}>
            <GraduationCap size={16} aria-hidden="true" /> Ôn lý thuyết trước
          </button>
        </div>
        {remaining === 0 && seenTotal > 0 && (
          <div role="status" className="flex flex-wrap items-center gap-3 rounded-2xl bg-ok-soft px-4 py-3 text-sm">
            <CheckCheck size={18} className="text-ok" aria-hidden="true" />
            <span className="flex-1 font-medium">Bạn đã làm hết các câu trong phạm vi này.</span>
            <button
              className="btn"
              onClick={() =>
                confirm('Bắt đầu vòng mới? Đánh dấu “đã làm” sẽ được xóa; lịch sử và Sổ câu sai vẫn giữ nguyên.') && resetSeen()
              }
            >
              <RotateCcw size={16} aria-hidden="true" /> Bắt đầu vòng mới
            </button>
          </div>
        )}
        <p className="text-sm text-muted">
          “Các câu còn lại” chỉ gồm những câu chưa xuất hiện trong lượt nào bạn đã nộp. Đề ngẫu nhiên ưu tiên câu bạn chưa làm hoặc từng làm sai. Câu sai rời “Sổ câu sai” sau khi làm đúng {settings.wrongStreakToClear} lần liên tiếp.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Đã làm"
          value={`${seenTotal}/${bankPool.length}`}
          hint={`còn ${bankPool.length - seenTotal} câu chưa gặp`}
          progress={bankPool.length ? seenTotal / bankPool.length : 0}
        />
        <Stat label="Sổ câu sai" value={String(wrongIds.length)} hint="câu cần ôn lại" />
        <Stat
          label="Lượt gần nhất"
          value={last ? `${Math.round((last.points / last.total) * 100)}%` : '—'}
          hint={last ? last.title : 'chưa có lượt nào'}
        />
      </section>

      <button className="btn" onClick={() => nav('/browse')}>
        Tra cứu toàn bộ đáp án <ArrowRight size={16} />
      </button>
    </div>
  )
}

function Stat({ label, value, hint, progress }: { label: string; value: string; hint: string; progress?: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      <p className="truncate text-sm text-muted">{hint}</p>
      {progress !== undefined && (
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  )
}
