import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Browse from './pages/Browse'
import History from './pages/History'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Settings from './pages/Settings'

// Trang Ôn tập kéo theo KaTeX và nội dung hai sổ (24 buổi) nên tách chunk, chỉ tải khi mở
const Learn = lazy(() => import('./pages/Learn'))
const learn = (
  <Suspense fallback={<p className="text-muted">Đang tải bài học…</p>}>
    <Learn />
  </Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="result" element={<Result />} />
        <Route path="learn" element={learn} />
        <Route path="learn/:day" element={learn} />
        <Route path="browse" element={<Browse />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
