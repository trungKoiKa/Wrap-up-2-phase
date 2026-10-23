import { ArrowLeft, ArrowRight, PenLine } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FlashCards from '../components/lesson/FlashCards'
import '../components/lesson/lesson.css'
import { annotateLesson, annotateOverview, annotators, hasDeep, simList } from '../components/lesson/annotate'
import Rich from '../components/lesson/Rich'
import SimHost from '../components/lesson/SimHost'
import Tex from '../components/lesson/Tex'
import { BOOK_BY_ID, BOOK_OF_LESSON, BOOKS, LESSON_BY_ID, type Book, type BookId, type Lesson } from '../data/lessons'
import type { Concept } from '../data/lessons/types'
import { FIGS, SIMS as SIMS_CV } from '../lessons/sims.js'
import { SIMS as SIMS_P1 } from '../lessons/sims-p1.js'
import { QUESTIONS } from '../data'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'

type Known = Record<string, boolean>

/** id bài học là duy nhất giữa hai sổ nên gộp chung một bảng mô phỏng */
const SIMS = { ...SIMS_CV, ...SIMS_P1 }

function isBookId(x: unknown): x is BookId {
  return typeof x === 'string' && x in BOOK_BY_ID
}

export default function Learn() {
  const { day } = useParams()
  const lesson = day ? LESSON_BY_ID[day] : undefined
  const [lastBook] = useState<BookId>(() => {
    const b = load<string>('learnBook', 'p1')
    return isBookId(b) ? b : 'p1'
  })
  const book = lesson ? BOOK_OF_LESSON[lesson.id] : isBookId(day) ? BOOK_BY_ID[day] : BOOK_BY_ID[lastBook]
  const [known, setKnown] = useState<Known>(() => load<Known>('lessonKnown', {}))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [day])

  useEffect(() => {
    save('learnBook', book.id)
  }, [book.id])

  function toggleKnown(key: string) {
    setKnown((k) => {
      const next = { ...k }
      if (next[key]) delete next[key]
      else next[key] = true
      save('lessonKnown', next)
      return next
    })
  }

  return (
    <div className="learn">
      <LessonNav book={book} current={lesson?.id} known={known} />
      <div className="lmain">
        {lesson ? <Day key={lesson.id} d={lesson} book={book} known={known} onToggleKnown={toggleKnown} /> : <OverviewPage key={book.id} book={book} />}
      </div>
    </div>
  )
}

function knownCount(d: Lesson, known: Known) {
  return d.cards.filter((_, i) => known[`${d.id}:${i}`]).length
}

function LessonNav({ book, current, known }: { book: Book; current?: string; known: Known }) {
  return (
    <nav className="lnav" aria-label="Mục lục ôn tập">
      <div className="lbooks" role="group" aria-label="Chọn sổ ôn">
        {BOOKS.map((b) => (
          <Link key={b.id} to={`/learn/${b.id}`} aria-current={b.id === book.id ? 'true' : undefined} className="lbook">
            <span className="dn">{b.tab}</span>
            <span className="dt">{b.name}</span>
          </Link>
        ))}
      </div>
      <Link to={`/learn/${book.id}`} aria-current={!current ? 'page' : undefined}>
        <span className="dn">Bắt đầu</span>
        <span className="dt">Tổng quan & thuật ngữ</span>
      </Link>
      <div className="sep" />
      {book.lessons.map((d) => {
        const k = knownCount(d, known)
        return (
          <Link key={d.id} to={`/learn/${d.id}`} aria-current={current === d.id ? 'page' : undefined}>
            <span className="dn">Day {d.n}</span>
            <span className="dt">{d.title}</span>
            <span className="dp" title={`${k}/${d.cards.length} thẻ đã nhớ`}>
              <i style={{ width: `${(k / d.cards.length) * 100}%` }} />
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function OverviewPage({ book }: { book: Book }) {
  const a = useMemo(() => annotateOverview(book.overview, annotators[book.id]), [book])
  const first = book.lessons[0]
  return (
    <>
      <div className="lhead">
        <span className="kick">
          {book.tab} · {book.name} · Bắt đầu từ đây
        </span>
        <h2>{book.heading}</h2>
        <p className="lead">
          <Rich segs={a.intro} />
        </p>
      </div>
      <section className="lsec">
        <h3>
          Đọc theo thứ tự này <small>bấm vào một buổi để mở</small>
        </h3>
        <ol className="lflow">
          {book.overview.flow.map((f, i) => {
            const d = LESSON_BY_ID[f.day]
            return (
              <li key={f.day}>
                <Link to={`/learn/${f.day}`}>
                  <span className="fd">Day {d.n}</span>
                  <span className="fl">
                    {f.label} · {d.title}
                  </span>
                  <span className="ft">
                    <Rich segs={a.flow[i]} />
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
      <section className="lsec">
        <h3>Cách dùng sổ này</h3>
        <ol className="lsteps">
          {a.howto.map((h, i) => (
            <li key={i}>
              <span>
                <Rich segs={h} />
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="lsec">
        <h3>Thuật ngữ gặp ở mọi buổi</h3>
        <div className="ltable">
          <table>
            <thead>
              <tr>
                {book.enFirst ? (
                  <>
                    <th>Tiếng Anh</th>
                    <th>Tiếng Việt</th>
                  </>
                ) : (
                  <>
                    <th>Tiếng Việt</th>
                    <th>Tiếng Anh</th>
                  </>
                )}
                <th>Hiểu nhanh</th>
              </tr>
            </thead>
            <tbody>
              {book.overview.glossary.map((g) => (
                <tr key={g[0]}>
                  <td>{book.enFirst ? g[1] : g[0]}</td>
                  <td>{book.enFirst ? g[0] : g[1]}</td>
                  <td>{g[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="lpager">
        <span />
        <Link className="btn" to={`/learn/${first.id}`}>
          Bắt đầu với Day {first.n} · {first.title} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </>
  )
}

/** Tên khái niệm: sổ Phase 1 để tiếng Anh trước (tiếng Việt bên dưới), sổ Phase 2 giữ như cũ. */
function ConceptTerm({ c, enFirst }: { c: Concept; enFirst: boolean }) {
  if (!enFirst)
    return (
      <div className="term">
        {c.t}
        <span className="en">{c.en}</span>
      </div>
    )
  const head = c.en.charAt(0).toUpperCase() + c.en.slice(1)
  return (
    <div className="term">
      {head}
      {c.t.toLowerCase() !== c.en.toLowerCase() && <span className="vi">{c.t}</span>}
    </div>
  )
}

type Annotated = ReturnType<typeof annotateLesson>

/** Danh sách khái niệm của phần Cốt lõi (deep = false) hoặc Đào sâu; có nhãn khâu khi buổi có bản đồ. */
function ConceptList({ d, a, enFirst, deep }: { d: Lesson; a: Annotated; enFirst: boolean; deep: boolean }) {
  const stages = d.map?.stages ?? []
  return (
    <div className="concepts">
      {d.concepts.map((c, i) => {
        if (!!c.deep !== deep) return null
        const si = stages.findIndex((s) => s.k === c.stage)
        return (
          <div className="concept" key={c.t}>
            <div>
              {si >= 0 && (
                <span className="lstage">
                  Khâu {si + 1} · {stages[si].en}
                </span>
              )}
              <ConceptTerm c={c} enFirst={enFirst} />
            </div>
            <div className="body">
              <p>
                <Rich segs={a.concepts[i].d} />
              </p>
              <p className="lex">
                <b>Ví dụ</b>
                <Rich segs={a.concepts[i].ex} />
              </p>
              {c.fig && FIGS[c.fig] && (
                <figure className="cfig">
                  {/* SVG do sổ ôn tự vẽ (nội dung tĩnh, không có dữ liệu người dùng) */}
                  <div dangerouslySetInnerHTML={{ __html: FIGS[c.fig]() }} />
                  {c.figCap && <figcaption>{c.figCap}</figcaption>}
                </figure>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FormulaGrid({ d, a, deep }: { d: Lesson; a: Annotated; deep: boolean }) {
  return (
    <div className="formulas">
      {d.formulas.map((f, i) =>
        !!f.deep !== deep ? null : (
          <div className="formula" key={i}>
            <Tex tex={f.tex} display />
            <p className="read">
              <b>Đọc là</b>
              <Rich segs={a.formulas[i].read} />
            </p>
            <p className="lex">
              <b>Ví dụ</b>
              <Rich segs={a.formulas[i].ex} />
            </p>
          </div>
        ),
      )}
    </div>
  )
}

function LessonTable({ d, a }: { d: Lesson; a: Annotated }) {
  return (
    <div className="ltable">
      <table>
        <thead>
          <tr>
            {d.table.cols.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {a.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>
                  <Rich segs={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TrapList({ items }: { items: Annotated['traps'] }) {
  return (
    <ul className="ltraps">
      {items.map((t, i) => (
        <li key={i}>
          <Rich segs={t} />
        </li>
      ))}
    </ul>
  )
}

/** Cuối buổi: mở ngay một lượt luyện tập chỉ gồm câu hỏi của buổi này (chỉ sổ có đề theo buổi). */
function PracticeDay({ d }: { d: Lesson }) {
  const nav = useNavigate()
  const { session, startSession } = useApp()
  const all = d.part ? QUESTIONS.filter((q) => q.part === d.part) : []
  if (!all.length) return null
  // Bộ cốt lõi (prio 1) phủ các ý chính của buổi; cả bộ thêm câu quan trọng và chi tiết
  const core = all.filter((q) => q.prio === 1).map((q) => q.id)
  const ids = all.map((q) => q.id)

  function start(pick: string[], label: string) {
    if (session && !confirm(`Bạn đang làm dở "${session.title}". Bỏ lượt đó để làm đề Day ${d.n}?`)) return
    startSession(`Ôn Day ${d.n} · ${label}`, pick, 'practice')
    nav('/quiz')
  }

  return (
    <section className="lpractice">
      <div>
        <h3>Luyện đề buổi này</h3>
        <p>
          Bắt đầu với {core.length} câu cốt lõi phủ các ý chính của Day {d.n}. Nắm chắc rồi mới làm cả bộ {ids.length} câu (thêm câu quan trọng và chi tiết, số liệu). Chế độ luyện tập: chọn đáp án là biết đúng sai kèm giải thích.
        </p>
      </div>
      <div className="lpractice-btns">
        {core.length > 0 && (
          <button className="btn btn-primary" onClick={() => start(core, `cốt lõi (${core.length} câu)`)}>
            <PenLine size={16} aria-hidden="true" /> Làm {core.length} câu cốt lõi
          </button>
        )}
        <button className="btn" onClick={() => start(ids, `cả bộ (${ids.length} câu)`)}>
          Cả bộ {ids.length} câu
        </button>
      </div>
    </section>
  )
}

function Day({ d, book, known, onToggleKnown }: { d: Lesson; book: Book; known: Known; onToggleKnown: (key: string) => void }) {
  const sims = useMemo(() => simList(SIMS[d.id]), [d.id])
  const a = useMemo(() => annotateLesson(d, sims, annotators[book.id]), [d, sims, book])
  const idx = book.lessons.indexOf(d)
  const prev = book.lessons[idx - 1]
  const next = book.lessons[idx + 1]
  const deep = hasDeep(d)

  return (
    <>
      <div className="lhead">
        <span className="kick">
          {book.tab} · Day {d.n}
        </span>
        <h2>{d.title}</h2>
        <p className="lquestion">
          <b>Câu hỏi của buổi</b>
          <Rich segs={a.question} />
        </p>
      </div>

      {d.prereq && (
        <section className="lsec">
          <h3>
            Cần biết trước <small>ôn nhanh từ các buổi trước, bấm để mở lại</small>
          </h3>
          <div className="lprereq">
            {d.prereq.map((p, i) => (
              <Link key={p.t} to={`/learn/${p.day}`}>
                <span className="pd">Day {LESSON_BY_ID[p.day]?.n}</span>
                <span className="pt">{p.t}</span>
                <span className="px">
                  <Rich segs={a.prereq[i]} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="lintro">
        <div className="see">
          <span className="lbl">Hình dung đơn giản</span>
          <p>
            <Rich segs={a.analogy} />
          </p>
        </div>
        <div className="why">
          <span className="lbl">Vì sao cần biết</span>
          <p>
            <Rich segs={a.why} />
          </p>
        </div>
      </div>

      {d.thread && (
        <div className="lthread">
          <span className="lbl">Ví dụ xuyên suốt · {d.thread.name}</span>
          <p>
            <Rich segs={a.thread} />
          </p>
        </div>
      )}

      {d.map ? (
        <section className="lsec">
          <h3>
            Bản đồ của buổi <small>{d.map.note}</small>
          </h3>
          <p className="lmap-title">{d.map.title}</p>
          <ol className="lmap">
            {d.map.stages.map((s, i) => {
              const nd = s.next ? LESSON_BY_ID[s.next] : undefined
              return (
                <li key={s.k}>
                  <div className="mh">
                    <span className="me">{s.en}</span>
                    <span className="mv">{s.vi}</span>
                  </div>
                  <p className="md">
                    <Rich segs={a.map[i].does} />
                  </p>
                  <p className="mx">
                    <b>{d.thread?.name ?? 'Ví dụ'}</b>
                    <Rich segs={a.map[i].eg} />
                  </p>
                  {nd && (
                    <Link className="btn" to={`/learn/${nd.id}`}>
                      Day {nd.n} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      ) : (
        <section className="lsec">
          <h3>
            Lộ trình hiểu <small>đi lần lượt từng bước</small>
          </h3>
          <ol className="lsteps">
            {a.steps.map((s, i) => (
              <li key={i}>
                <span>
                  <Rich segs={s} />
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="lsec">
        <h3>
          {deep ? (
            <>
              <span className="ltier">Cốt lõi</span> Các khái niệm phải nắm
            </>
          ) : (
            'Các khái niệm, giải thích bằng lời thường'
          )}
        </h3>
        <ConceptList d={d} a={a} enFirst={book.enFirst} deep={false} />
      </section>

      {sims.length > 0 && (
        <section className="lsec">
          <h3>
            Thử tay <small>mô phỏng tương tác: kéo, bấm và quan sát</small>
          </h3>
          {sims.map((sim, i) => (
            <SimHost key={i} id={`${d.id}-${i}`} sim={sim} text={a.sims[i]} />
          ))}
        </section>
      )}

      {d.formulas.some((f) => !f.deep) && (
        <section className="lsec">
          <h3>
            Công thức & con số <small>đọc dòng "Đọc là" trước, rồi mới nhìn ký hiệu</small>
          </h3>
          <FormulaGrid d={d} a={a} deep={false} />
        </section>
      )}

      {!d.table.deep && (
        <section className="lsec">
          <h3>{d.table.title}</h3>
          <LessonTable d={d} a={a} />
        </section>
      )}

      <div className="ltwo">
        <section className="lsec">
          <h3>Bẫy hay gặp</h3>
          <TrapList items={a.traps} />
        </section>
        <section className="lsec">
          <h3>3 điều phải nhớ</h3>
          <ul className="lkeep">
            {a.remember.map((t, i) => (
              <li key={i}>
                <Rich segs={t} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {deep && (
        <details className="ldeep">
          <summary>
            <b>Đào sâu</b>
            <small>chi tiết công cụ, tham số và con số. Đọc sau khi đã nắm phần Cốt lõi.</small>
          </summary>
          <div className="ldeep-body">
            {d.concepts.some((c) => c.deep) && (
              <div>
                <h4>Khái niệm mở rộng</h4>
                <ConceptList d={d} a={a} enFirst={book.enFirst} deep />
              </div>
            )}
            {d.formulas.some((f) => f.deep) && (
              <div>
                <h4>Công thức & con số</h4>
                <FormulaGrid d={d} a={a} deep />
              </div>
            )}
            {d.table.deep && (
              <div>
                <h4>{d.table.title}</h4>
                <LessonTable d={d} a={a} />
              </div>
            )}
            {a.deepTraps.length > 0 && (
              <div>
                <h4>Bẫy khi dùng công cụ</h4>
                <TrapList items={a.deepTraps} />
              </div>
            )}
          </div>
        </details>
      )}

      <FlashCards id={d.id} cards={a.cards} known={known} onToggleKnown={onToggleKnown} />

      <PracticeDay d={d} />

      <div className="lpager">
        {prev ? (
          <Link className="btn" to={`/learn/${prev.id}`}>
            <ArrowLeft size={16} aria-hidden="true" /> Day {prev.n} · {prev.title}
          </Link>
        ) : (
          <Link className="btn" to={`/learn/${book.id}`}>
            <ArrowLeft size={16} aria-hidden="true" /> Tổng quan
          </Link>
        )}
        {next && (
          <Link className="btn" to={`/learn/${next.id}`}>
            Day {next.n} · {next.title} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </>
  )
}
