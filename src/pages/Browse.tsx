import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import AnswerKey from '../components/AnswerKey'
import { QUESTIONS } from '../data'
import { useApp } from '../store/AppContext'
import { PART_LABEL, type Part } from '../types'

const TYPE_LABEL: Record<string, string> = {
  single: 'Trắc nghiệm',
  multi: 'Chọn nhiều',
  truefalse: 'Đúng/Sai',
  fill: 'Điền khuyết',
  matching: 'Nối cột',
  ordering: 'Sắp xếp',
  open: 'Tự luận',
}

export default function Browse() {
  const { wrong } = useApp()
  const [qs, setQs] = useState('')
  const [part, setPart] = useState<Part | 0>(0)
  const [onlyWrong, setOnlyWrong] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const list = useMemo(() => {
    const k = qs.trim().toLowerCase()
    return QUESTIONS.filter(
      (q) =>
        (part === 0 || q.part === part) &&
        (!onlyWrong || wrong[q.id]) &&
        (!k || JSON.stringify(q).toLowerCase().includes(k)),
    )
  }, [qs, part, onlyWrong, wrong])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Tra cứu câu hỏi & đáp án</h1>
      <div className="card flex flex-wrap items-center gap-3 p-3">
        <label className="relative min-w-48 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={qs}
            onChange={(e) => setQs(e.target.value)}
            placeholder="Tìm theo từ khóa…"
            aria-label="Tìm kiếm"
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3"
          />
        </label>
        <select
          value={part}
          onChange={(e) => setPart(Number(e.target.value) as Part | 0)}
          aria-label="Lọc theo phần"
          className="rounded-lg border border-line bg-surface px-3 py-2"
        >
          <option value={0}>Tất cả phần</option>
          {([1, 2, 3, 4] as Part[]).map((p) => (
            <option key={p} value={p}>
              {PART_LABEL[p]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} />
          Chỉ câu sai
        </label>
        <span className="text-sm text-muted">{list.length} câu</span>
      </div>

      {list.map((q) => {
        const open = openId === q.id
        return (
          <div key={q.id} className="card">
            <button
              className="flex w-full items-start gap-3 p-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : q.id)}
            >
              <span className="mt-0.5 rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">{q.id}</span>
              <span className="flex-1 text-sm font-medium">{q.prompt}</span>
              <span className="shrink-0 rounded-md bg-surface2 px-2 py-0.5 text-xs text-muted">{TYPE_LABEL[q.type]}</span>
              {wrong[q.id] && <span className="shrink-0 rounded-md bg-bad-soft px-2 py-0.5 text-xs text-bad">sai</span>}
            </button>
            {open && (
              <div className="space-y-2 border-t border-line p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Đáp án</p>
                <AnswerKey q={q} />
                {q.explanation && <p className="pre rounded-lg bg-surface2 p-3 text-sm">{q.explanation}</p>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
