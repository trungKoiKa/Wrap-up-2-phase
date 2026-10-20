import type { Question } from '../types'

/** Static, read-only rendering of the correct answer for any question type. */
export default function AnswerKey({ q }: { q: Question }) {
  switch (q.type) {
    case 'single':
      return <p className="font-medium text-ok">{q.answer}</p>
    case 'multi':
      return (
        <ul className="list-disc space-y-1 pl-5 text-ok">
          {q.answers.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )
    case 'truefalse':
      return <p className="font-medium text-ok">{q.answer ? 'Đúng' : 'Sai'}</p>
    case 'fill':
      return <p className="font-medium text-ok">{q.answers[0]}</p>
    case 'matching':
      return (
        <ul className="space-y-1 text-ok">
          {q.left.map((l, i) => (
            <li key={l}>
              <b>{l}</b> → {q.right[q.pairs[i]]}
            </li>
          ))}
        </ul>
      )
    case 'ordering':
      return (
        <ol className="list-decimal space-y-1 pl-5 text-ok">
          {q.items.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      )
    case 'open':
      return <p className="pre text-sm">{q.modelAnswer}</p>
  }
}
