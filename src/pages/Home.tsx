import { ArrowRight, BookX, GraduationCap, Play, Shuffle, Sparkles, Timer } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS } from '../data'
import { pickRandom } from '../lib/sets'
import { useApp } from '../store/AppContext'
import { PART_LABEL, type Mode, type Part } from '../types'

const PARTS: Part[] = [1, 2, 3, 4]

export default function Home() {
  const nav = useNavigate()
  const { session, wrong, seen, startSession, settings, discardSession, history } = useApp()
  const [mode, setMode] = useState<Mode>('exam')
  const [count, setCount] = useState(50)
  const [parts, setParts] = useState<Part[]>(PARTS)

  const wrongIds = Object.keys(wrong)
  const poolSize = QUESTIONS.filter((q) => parts.includes(q.part)).length
  const n = Math.min(count, poolSize)

  function start(title: string, ids: string[]) {
    if (ids.length === 0) return
    startSession(title, ids, mode)
    nav('/quiz')
  }

  function togglePart(p: Part) {
    setParts((cur) => (cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : [...cur, p]))
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
          <Sparkles size={13} aria-hidden="true" /> Ôn thi giữa kỳ
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">AI In Action</h1>
        <p className="mt-2 max-w-xl text-white">
          {QUESTIONS.length} câu hỏi · 4 phần · trắc nghiệm, đúng/sai, điền khuyết, nối cột, sắp xếp, tự luận. Chọn đáp án là biết đúng sai và hiểu vì sao.
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
          <div className="flex flex-wrap gap-2">
            {PARTS.map((p) => (
              <button
                key={p}
                aria-pressed={parts.includes(p)}
                onClick={() => togglePart(p)}
                className="chip"
              >
                {PART_LABEL[p]}
              </button>
            ))}
          </div>
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
            onClick={() => start(`Đề ngẫu nhiên ${n} câu`, pickRandom(n, Date.now() % 2147483647, wrong, new Set(seen), parts))}
          >
            <Shuffle size={16} /> Bắt đầu đề ngẫu nhiên {n} câu
          </button>
          <button
            className="btn"
            onClick={() =>
              start(
                'Tất cả câu trong phạm vi',
                QUESTIONS.filter((q) => parts.includes(q.part)).map((q) => q.id),
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
        </div>
        <p className="text-sm text-muted">
          Đề ngẫu nhiên ưu tiên câu bạn chưa làm hoặc từng làm sai. Câu sai rời “Sổ câu sai” sau khi làm đúng {settings.wrongStreakToClear} lần liên tiếp.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Đã làm" value={`${new Set(seen).size}/${QUESTIONS.length}`} hint="câu khác nhau" />
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

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      <p className="truncate text-sm text-muted">{hint}</p>
    </div>
  )
}
