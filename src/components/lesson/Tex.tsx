import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

/** Công thức LaTeX (nội dung tĩnh trong bài học), render bằng KaTeX ngay trong app, không cần mạng. */
export default function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'html' }),
    [tex, display],
  )
  return display ? (
    <div className="tex-block" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )
}
