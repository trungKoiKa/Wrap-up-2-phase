import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, X } from 'lucide-react'
import type { Answer, Question } from '../types'

interface Props {
  q: Question
  answer?: Answer
  /** option / item order chosen when the session started */
  order?: string[]
  onChange: (a: Answer) => void
  /** show correct/incorrect feedback */
  checked: boolean
  /** disable editing */
  locked: boolean
}

const base = 'opt w-full text-left rounded-2xl border-2 px-4 py-3.5 flex items-start gap-3 leading-snug '
const idle = 'border-line bg-surface'
const selected = 'border-primary bg-primary-soft'
const good = 'border-ok bg-ok-soft'
const bad = 'border-bad bg-bad-soft'

function Mark({ state }: { state: 'ok' | 'bad' | null }) {
  if (!state) return null
  return state === 'ok' ? <Check className="pop text-ok shrink-0" size={22} strokeWidth={3} aria-label="Đúng" /> : <X className="pop text-bad shrink-0" size={22} strokeWidth={3} aria-label="Sai" />
}

function Choice({
  checked,
  multi,
  selectedNow,
  correct,
  text,
  onClick,
  disabled,
  label,
}: {
  checked: boolean
  multi: boolean
  selectedNow: boolean
  correct: boolean
  text: string
  onClick: () => void
  disabled: boolean
  label: string
}) {
  let cls = selectedNow ? selected : idle
  let mark: 'ok' | 'bad' | null = null
  if (checked) {
    if (correct) {
      cls = good
      mark = 'ok'
    } else if (selectedNow) {
      cls = bad
      mark = 'bad'
    }
  }
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selectedNow}
      disabled={disabled}
      onClick={onClick}
      className={base + cls}
    >
      <span
        className={
          'mt-px grid h-7 w-7 shrink-0 place-items-center border-2 text-xs font-bold ' +
          (multi ? 'rounded-lg ' : 'rounded-full ') +
          (selectedNow ? 'border-primary bg-primary text-primary-fg' : 'border-line text-muted')
        }
      >
        {label}
      </span>
      <span className="flex-1">{text}</span>
      <Mark state={mark} />
    </button>
  )
}

function SortableRow({ id, state, disabled, n }: { id: string; state: 'ok' | 'bad' | null; disabled: boolean; n: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className={base + (state === 'ok' ? good : state === 'bad' ? bad : idle)}
    >
      <button
        type="button"
        aria-label="Kéo để sắp xếp"
        className="mt-0.5 touch-none text-muted"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface2 text-xs font-bold text-muted">{n}</span>
      <span className="flex-1">{id}</span>
      <Mark state={state} />
    </div>
  )
}

export default function QuestionView({ q, answer, order, onChange, checked, locked }: Props) {
  if (q.type === 'single') {
    const opts = order ?? [q.answer, ...q.distractors]
    const sel = answer?.t === 'single' ? answer.v : ''
    return (
      <div className="space-y-2" role="radiogroup">
        {opts.map((o, i) => (
          <Choice
            key={o}
            label={'ABCD'[i]}
            multi={false}
            checked={checked}
            selectedNow={sel === o}
            correct={o === q.answer}
            text={o}
            disabled={locked}
            onClick={() => onChange({ t: 'single', v: o })}
          />
        ))}
      </div>
    )
  }

  if (q.type === 'multi') {
    const opts = order ?? [...q.answers, ...q.distractors]
    const sel = answer?.t === 'multi' ? answer.v : []
    return (
      <div className="space-y-2" role="group">
        <p className="text-sm text-muted">Chọn {q.answers.length} đáp án đúng.</p>
        {opts.map((o, i) => (
          <Choice
            key={o}
            label={'ABCDEF'[i]}
            multi
            checked={checked}
            selectedNow={sel.includes(o)}
            correct={q.answers.includes(o)}
            text={o}
            disabled={locked}
            onClick={() => onChange({ t: 'multi', v: sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o] })}
          />
        ))}
      </div>
    )
  }

  if (q.type === 'truefalse') {
    const sel = answer?.t === 'truefalse' ? answer.v : undefined
    return (
      <div className="grid grid-cols-2 gap-3" role="radiogroup">
        {[true, false].map((v) => (
          <Choice
            key={String(v)}
            label={v ? 'Đ' : 'S'}
            multi={false}
            checked={checked}
            selectedNow={sel === v}
            correct={v === q.answer}
            text={v ? 'Đúng' : 'Sai'}
            disabled={locked}
            onClick={() => onChange({ t: 'truefalse', v })}
          />
        ))}
      </div>
    )
  }

  if (q.type === 'fill') {
    const val = answer?.t === 'fill' ? answer.v : ''
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={val}
          disabled={locked}
          onChange={(e) => onChange({ t: 'fill', v: e.target.value })}
          placeholder="Nhập đáp án…"
          className={
            'w-full rounded-2xl border-2 bg-surface px-4 py-3 text-base ' +
            (checked ? (q.answers.length && isFillOk(q, val) ? 'border-ok' : 'border-bad') : 'border-line')
          }
          aria-label="Đáp án"
        />
        {checked && (
          <p className="text-sm">
            Đáp án đúng: <b className="text-ok">{q.answers[0]}</b>
          </p>
        )}
      </div>
    )
  }

  if (q.type === 'matching') {
    const val = answer?.t === 'matching' ? answer.v : q.left.map(() => null)
    const rightOrder = order ? order.map(Number) : q.right.map((_, i) => i)
    return (
      <div className="space-y-3">
        <ol className="space-y-2 text-sm">
          {rightOrder.map((ri, k) => (
            <li key={ri} className="flex gap-2 rounded-lg bg-surface2 px-3 py-2">
              <b className="text-primary">{k + 1}.</b>
              <span>{q.right[ri]}</span>
            </li>
          ))}
        </ol>
        <div className="space-y-2">
          {q.left.map((l, i) => {
            const ok = checked ? val[i] === q.pairs[i] : null
            return (
              <div
                key={l}
                className={
                  'flex flex-col gap-2 rounded-2xl border p-3 sm:flex-row sm:items-center ' +
                  (ok === null ? 'border-line bg-surface' : ok ? 'border-ok bg-ok-soft' : 'border-bad bg-bad-soft')
                }
              >
                <span className="flex-1 font-medium">{l}</span>
                <select
                  disabled={locked}
                  aria-label={'Ghép ' + l}
                  value={val[i] === null ? '' : rightOrder.indexOf(val[i] as number)}
                  onChange={(e) => {
                    const next = [...val]
                    next[i] = e.target.value === '' ? null : rightOrder[Number(e.target.value)]
                    onChange({ t: 'matching', v: next })
                  }}
                  className="rounded-lg border border-line bg-surface px-3 py-2"
                >
                  <option value="">— chọn —</option>
                  {rightOrder.map((_, k) => (
                    <option key={k} value={k}>
                      {k + 1}
                    </option>
                  ))}
                </select>
                {ok === false && (
                  <span className="text-sm text-ok">
                    Đúng: {rightOrder.indexOf(q.pairs[i]) + 1}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (q.type === 'ordering') {
    return <Ordering q={q} answer={answer} order={order} onChange={onChange} checked={checked} locked={locked} />
  }

  // open
  const val = answer?.t === 'open' ? answer.v : ''
  const self = answer?.t === 'open' ? answer.self : null
  return (
    <div className="space-y-3">
      <textarea
        value={val}
        disabled={locked && checked}
        onChange={(e) => onChange({ t: 'open', v: e.target.value, self })}
        rows={5}
        placeholder="Viết nháp câu trả lời của bạn (không bắt buộc)…"
        className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base"
        aria-label="Câu trả lời nháp"
      />
      {checked && (
        <>
          <div className="rounded-2xl border border-primary bg-primary-soft p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Đáp án mẫu</p>
            <p className="pre text-sm leading-relaxed">{q.modelAnswer}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Tự chấm">
            <span className="text-sm text-muted">Bạn tự chấm:</span>
            {(
              [
                ['right', 'Đúng ý', 'text-ok'],
                ['partial', 'Gần đúng', 'text-warn'],
                ['wrong', 'Chưa đúng', 'text-bad'],
              ] as const
            ).map(([k, label, c]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={self === k}
                onClick={() => onChange({ t: 'open', v: val, self: k })}
                className={'btn ' + c + (self === k ? ' !border-primary !bg-primary-soft' : '')}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function isFillOk(q: Extract<Question, { type: 'fill' }>, val: string) {
  // lightweight mirror of lib/grading for display colour; imported lazily to avoid cycles
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  const num = (s: string) => {
    const t = s.toLowerCase().replace(/triệu|tr|%|\s/g, '').replace(',', '.')
    return /^-?\d+(\.\d+)?$/.test(t) ? parseFloat(t) : null
  }
  const n = num(val)
  return q.answers.some((a) => {
    const m = num(a)
    if (n !== null && m !== null) return Math.abs(n - m) < 0.001
    return norm(a) === norm(val)
  })
}

function Ordering({ q, answer, order, onChange, checked, locked }: Props & { q: Extract<Question, { type: 'ordering' }> }) {
  const items = answer?.t === 'ordering' ? answer.v : (order ?? q.items)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = items.indexOf(String(active.id))
    const to = items.indexOf(String(over.id))
    onChange({ t: 'ordering', v: arrayMove(items, from, to) })
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">Kéo thả (hoặc dùng phím Space + mũi tên) để sắp xếp đúng thứ tự.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((it, i) => (
              <SortableRow
                key={it}
                id={it}
                n={i + 1}
                disabled={locked}
                state={checked ? (q.items[i] === it ? 'ok' : 'bad') : null}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {checked && (
        <div className="rounded-2xl border border-ok bg-ok-soft p-3 text-sm">
          <b>Thứ tự đúng:</b>
          <ol className="ml-5 mt-1 list-decimal">
            {q.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
