import { Monitor, Moon, Sun } from 'lucide-react'
import { useApp } from '../store/AppContext'
import type { Settings } from '../types'

const OPTS: { v: Settings['theme']; icon: typeof Sun; label: string }[] = [
  { v: 'light', icon: Sun, label: 'Sáng' },
  { v: 'dark', icon: Moon, label: 'Tối' },
  { v: 'system', icon: Monitor, label: 'Theo hệ thống' },
]

const PALETTES: { v: Settings['palette']; label: string; from: string; to: string }[] = [
  { v: 'ocean', label: 'Xanh biển', from: '#8fd0f8', to: '#2272ba' },
  { v: 'ghibli', label: 'Xanh lá Ghibli', from: '#c3e6ab', to: '#36855f' },
]

export default function ThemeToggle() {
  const { settings, setSettings } = useApp()
  return (
    <div className="flex items-center gap-2">
      <div role="radiogroup" aria-label="Bảng màu" className="flex gap-1.5 rounded-xl border border-line bg-surface p-1">
        {PALETTES.map(({ v, label, from, to }) => (
          <button
            key={v}
            role="radio"
            aria-checked={settings.palette === v}
            aria-label={label}
            title={label}
            onClick={() => setSettings({ palette: v })}
            className={
              'grid h-8 w-8 place-items-center rounded-lg transition-shadow ' +
              (settings.palette === v ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'opacity-80 hover:opacity-100')
            }
          >
            <span className="h-5 w-5 rounded-full" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label="Chế độ giao diện" className="flex rounded-xl border border-line bg-surface p-1">
        {OPTS.map(({ v, icon: Icon, label }) => (
          <button
            key={v}
            role="radio"
            aria-checked={settings.theme === v}
            aria-label={label}
            title={label}
            onClick={() => setSettings({ theme: v })}
            className={
              'grid h-8 w-8 place-items-center rounded-lg transition-colors ' +
              (settings.theme === v ? 'bg-primary text-primary-fg' : 'text-muted hover:bg-surface2')
            }
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}
