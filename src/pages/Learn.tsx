import { ArrowLeft, ArrowRight, PenLine } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FlashCards from '../components/lesson/FlashCards'
import '../components/lesson/lesson.css'
import { annotateLesson, annotateOverview } from '../components/lesson/annotate'
import Rich from '../components/lesson/Rich'
import SimHost from '../components/lesson/SimHost'
import Tex from '../components/lesson/Tex'
import { LESSON_BY_ID, LESSONS, OVERVIEW, type Lesson } from '../data/lessons'
import { SIMS } from '../lessons/sims.js'
import { QUESTIONS } from '../data'
import { load, save } from '../lib/storage'
import { useApp } from '../store/AppContext'

type Known = Record<string, boolean>

export default function Learn() {
  const { day } = useParams()
  const lesson = day ? LESSON_BY_ID[day] : undefined
  const [known, setKnown] = useState<Known>(() => load<Known>('lessonKnown', {}))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [day])

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
      <LessonNav current={lesson?.id} known={known} />
      <div className="lmain">{lesson ? <Day key={lesson.id} d={lesson} known={known} onToggleKnown={toggleKnown} /> : <OverviewPage />}</div>
    </div>
  )
}

function knownCount(d: Lesson, known: Known) {
  return d.cards.filter((_, i) => known[`${d.id}:${i}`]).length
}

function LessonNav({ current, known }: { current?: string; known: Known }) {
  return (
    <nav className="lnav" aria-label="Mục lục ôn tập">
      <Link to="/learn" aria-current={!current ? 'page' : undefined}>
        <span className="dn">Bắt đầu</span>
        <span className="dt">Tổng quan & thuật ngữ</span>
      </Link>
      <div className="sep" />
      {LESSONS.map((d) => {
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

function OverviewPage() {
  const a = useMemo(() => annotateOverview(OVERVIEW), [])
  return (
    <>
      <div className="lhead">
        <span className="kick">Bắt đầu từ đây</span>
        <h2>Mười buổi, một chiếc xe biết nhìn</h2>
        <p className="lead">
          <Rich segs={a.intro} />
        </p>
      </div>
      <section className="lsec">
        <h3>
          Đọc theo thứ tự này <small>bấm vào một buổi để mở</small>
        </h3>
        <ol className="lflow">
          {OVERVIEW.flow.map((f, i) => {
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
                <th>Tiếng Việt</th>
                <th>Tiếng Anh</th>
                <th>Hiểu nhanh</th>
              </tr>
            </thead>
            <tbody>
              {OVERVIEW.glossary.map((g) => (
                <tr key={g[0]}>
                  <td>{g[0]}</td>
                  <td>{g[1]}</td>
                  <td>{g[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="lpager">
        <span />
        <Link className="btn" to={`/learn/${LESSONS[0].id}`}>
          Bắt đầu với Day {LESSONS[0].n} · {LESSONS[0].title} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </>
  )
}

/** Cuối buổi: mở ngay một lượt luyện tập chỉ gồm câu hỏi của buổi này. */
function PracticeDay({ d }: { d: Lesson }) {
  const nav = useNavigate()
  const { session, startSession } = useApp()
  const ids = QUESTIONS.filter((q) => q.part === d.part).map((q) => q.id)
  if (!ids.length) return null

  function start() {
    if (session && !confirm(`Bạn đang làm dở "${session.title}". Bỏ lượt đó để làm đề Day ${d.n}?`)) return
    startSession(`Ôn Day ${d.n} · ${d.title}`, ids, 'practice')
    nav('/quiz')
  }

  return (
    <section className="lpractice">
      <div>
        <h3>Luyện đề buổi này</h3>
        <p>
          {ids.length} câu trắc nghiệm, đúng/sai, điền khuyết, nối cột, sắp xếp về Day {d.n}. Chế độ luyện tập: chọn đáp án là biết đúng sai kèm giải thích.
        </p>
      </div>
      <button className="btn btn-primary" onClick={start}>
        <PenLine size={16} aria-hidden="true" /> Làm đề Day {d.n} ({ids.length} câu)
      </button>
    </section>
  )
}

function Day({ d, known, onToggleKnown }: { d: Lesson; known: Known; onToggleKnown: (key: string) => void }) {
  const sim = SIMS[d.id]
  const a = useMemo(() => annotateLesson(d, sim), [d, sim])
  const idx = LESSONS.indexOf(d)
  const prev = LESSONS[idx - 1]
  const next = LESSONS[idx + 1]

  return (
    <>
      <div className="lhead">
        <span className="kick">Day {d.n}</span>
        <h2>{d.title}</h2>
        <p className="lquestion">
          <b>Câu hỏi của buổi</b>
          <Rich segs={a.question} />
        </p>
      </div>

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

      <section className="lsec">
        <h3>Các khái niệm, giải thích bằng lời thường</h3>
        <div className="concepts">
          {d.concepts.map((c, i) => (
            <div className="concept" key={c.t}>
              <div className="term">
                {c.t}
                <span className="en">{c.en}</span>
              </div>
              <div className="body">
                <p>
                  <Rich segs={a.concepts[i].d} />
                </p>
                <p className="lex">
                  <b>Ví dụ</b>
                  <Rich segs={a.concepts[i].ex} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {sim && a.sim && (
        <section className="lsec">
          <h3>
            Thử tay <small>mô phỏng tương tác: kéo, bấm và quan sát</small>
          </h3>
          <SimHost id={d.id} sim={sim} text={a.sim} />
        </section>
      )}

      <section className="lsec">
        <h3>
          Công thức <small>đọc dòng "Đọc là" trước, rồi mới nhìn ký hiệu</small>
        </h3>
        <div className="formulas">
          {d.formulas.map((f, i) => (
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
          ))}
        </div>
      </section>

      <section className="lsec">
        <h3>{d.table.title}</h3>
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
      </section>

      <div className="ltwo">
        <section className="lsec">
          <h3>Bẫy hay gặp</h3>
          <ul className="ltraps">
            {a.traps.map((t, i) => (
              <li key={i}>
                <Rich segs={t} />
              </li>
            ))}
          </ul>
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

      <FlashCards id={d.id} cards={a.cards} known={known} onToggleKnown={onToggleKnown} />

      <PracticeDay d={d} />

      <div className="lpager">
        {prev ? (
          <Link className="btn" to={`/learn/${prev.id}`}>
            <ArrowLeft size={16} aria-hidden="true" /> Day {prev.n} · {prev.title}
          </Link>
        ) : (
          <Link className="btn" to="/learn">
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
