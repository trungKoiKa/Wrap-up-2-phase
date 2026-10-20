import { Download, Trash2, Upload } from 'lucide-react'
import { useRef } from 'react'
import { exportAll, importAll } from '../lib/storage'
import { useApp } from '../store/AppContext'

export default function Settings() {
  const { settings, setSettings, resetAll, reloadFromStorage } = useApp()
  const file = useRef<HTMLInputElement>(null)

  function doExport() {
    const blob = new Blob([exportAll()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ai-in-action-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function doImport(f: File) {
    try {
      importAll(await f.text())
      reloadFromStorage()
      alert('Đã nhập dữ liệu.')
    } catch {
      alert('File không hợp lệ.')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">Cài đặt</h1>

      <section className="card space-y-4 p-5">
        <label className="flex items-center justify-between gap-4">
          <span>
            Thời gian mỗi câu (chế độ Thi thử)
            <span className="block text-sm text-muted">Tổng giờ = số câu × giá trị này</span>
          </span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              min={10}
              max={600}
              value={settings.secondsPerQuestion}
              onChange={(e) => setSettings({ secondsPerQuestion: Math.max(10, Number(e.target.value) || 60) })}
              className="w-20 rounded-lg border border-line bg-surface px-2 py-1"
            />
            giây
          </span>
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>
            Hiện đáp án + giải thích ngay khi chọn
            <span className="block text-sm text-muted">Áp dụng cả chế độ Thi thử cho câu trắc nghiệm và đúng/sai</span>
          </span>
          <input
            type="checkbox"
            checked={settings.instantFeedback}
            onChange={(e) => setSettings({ instantFeedback: e.target.checked })}
            className="h-5 w-5"
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>Xáo trộn thứ tự câu hỏi</span>
          <input
            type="checkbox"
            checked={settings.shuffleQuestions}
            onChange={(e) => setSettings({ shuffleQuestions: e.target.checked })}
            className="h-5 w-5"
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>Xáo trộn thứ tự đáp án</span>
          <input
            type="checkbox"
            checked={settings.shuffleOptions}
            onChange={(e) => setSettings({ shuffleOptions: e.target.checked })}
            className="h-5 w-5"
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>Số lần làm đúng liên tiếp để xóa khỏi Sổ câu sai</span>
          <input
            type="number"
            min={1}
            max={5}
            value={settings.wrongStreakToClear}
            onChange={(e) => setSettings({ wrongStreakToClear: Math.max(1, Number(e.target.value) || 2) })}
            className="w-20 rounded-lg border border-line bg-surface px-2 py-1"
          />
        </label>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">Dữ liệu</h2>
        <p className="text-sm text-muted">
          Tiến độ chỉ lưu trong trình duyệt này (localStorage). Hãy xuất file để sao lưu hoặc chuyển máy.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn" onClick={doExport}>
            <Download size={16} /> Xuất JSON
          </button>
          <button className="btn" onClick={() => file.current?.click()}>
            <Upload size={16} /> Nhập JSON
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void doImport(f)
              e.target.value = ''
            }}
          />
          <button className="btn btn-danger" onClick={() => confirm('Xóa toàn bộ lịch sử và Sổ câu sai?') && resetAll()}>
            <Trash2 size={16} /> Xóa tiến độ
          </button>
        </div>
      </section>
    </div>
  )
}
