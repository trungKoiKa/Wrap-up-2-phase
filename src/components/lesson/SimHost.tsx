import { useEffect, useRef } from 'react'
import type { SimSpec, SimUI } from '../../data/lessons/types'
import type { Seg } from '../../lib/gloss'
import Rich from './Rich'

/**
 * Khung cho một mô phỏng: phần chữ do React vẽ, còn thanh kéo/hình vẽ do mã mô phỏng (thuần DOM)
 * dựng trong các vùng ref. Đổi buổi hoặc rời trang thì dọn sạch các vùng đó.
 */
export default function SimHost({ id, sim, text }: { id: string; sim: SimSpec; text: { intro: Seg[]; tries: Seg[][] } }) {
  const ctrlRef = useRef<HTMLDivElement>(null)
  const figRef = useRef<HTMLDivElement>(null)
  const outRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctrl = ctrlRef.current!
    const fig = figRef.current!
    const out = outRef.current!
    let seq = 0
    let btns: HTMLDivElement | null = null
    const ui: SimUI = {
      controls: ctrl,
      fig,
      out,
      slider(o, cb) {
        const lab = document.createElement('label')
        const sid = `sim-${id}-${seq++}`
        lab.htmlFor = sid
        const name = document.createElement('span')
        name.textContent = o.label
        const val = document.createElement('output')
        name.appendChild(val)
        const inp = document.createElement('input')
        Object.assign(inp, { type: 'range', id: sid, min: String(o.min), max: String(o.max), step: String(o.step), value: String(o.value) })
        val.textContent = o.fmt(+inp.value)
        inp.addEventListener('input', () => {
          val.textContent = o.fmt(+inp.value)
          cb(+inp.value)
        })
        lab.append(name, inp)
        ctrl.appendChild(lab)
        return inp
      },
      select(label, options, value, cb) {
        const lab = document.createElement('label')
        const sid = `sim-${id}-${seq++}`
        lab.htmlFor = sid
        const name = document.createElement('span')
        name.textContent = label
        const sel = document.createElement('select')
        sel.id = sid
        for (const op of options) sel.add(new Option(op, op, op === value, op === value))
        sel.addEventListener('change', () => cb(sel.value))
        lab.append(name, sel)
        ctrl.appendChild(lab)
        return sel
      },
      button(label, cb) {
        if (!btns) {
          btns = document.createElement('div')
          btns.className = 'btns'
          ctrl.appendChild(btns)
        }
        const b = document.createElement('button')
        b.type = 'button'
        b.className = 'btn'
        b.textContent = label
        b.addEventListener('click', cb)
        btns.appendChild(b)
      },
      svg(w, h) {
        fig.replaceChildren()
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        s.setAttribute('viewBox', `0 0 ${w} ${h}`)
        s.setAttribute('role', 'img')
        s.setAttribute('aria-label', sim.title)
        fig.appendChild(s)
        return s
      },
    }
    try {
      sim.build(ui)
    } catch (e) {
      out.textContent = 'Không chạy được mô phỏng này: ' + (e as Error).message
    }
    return () => {
      ctrl.replaceChildren()
      fig.replaceChildren()
      out.replaceChildren()
    }
  }, [id, sim])

  return (
    <div className="sim">
      <div className="sim-head">
        <h3>{sim.title}</h3>
        <p>
          <Rich segs={text.intro} />
        </p>
      </div>
      <div className="sim-body">
        <div className="sim-ctrl" ref={ctrlRef} />
        <div className="sim-fig" ref={figRef} />
      </div>
      <div className="sim-out" ref={outRef} aria-live="polite" />
      <div className="sim-try">
        <span className="lbl">Thử xem</span>
        <ul>
          {text.tries.map((t, i) => (
            <li key={i}>
              <Rich segs={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
