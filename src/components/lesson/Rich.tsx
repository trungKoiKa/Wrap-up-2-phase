import { Fragment } from 'react'
import type { Seg } from '../../lib/gloss'
import Tex from './Tex'

/** Hiển thị văn bản đã chú giải: chữ, thuật ngữ kèm "(giải thích)", công thức inline. */
export default function Rich({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) => (
        <Fragment key={i}>
          {s.k === 'text' && s.v}
          {s.k === 'math' && <Tex tex={s.tex} />}
          {s.k === 'term' && (
            <>
              {s.v} <span className="gl">({s.def})</span>
            </>
          )}
        </Fragment>
      ))}
    </>
  )
}
