import { BookOpen, History, Home, Settings, Sparkles } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Trang chủ', icon: Home },
  { to: '/browse', label: 'Tra cứu', icon: BookOpen },
  { to: '/history', label: 'Tiến độ', icon: History },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
]

export default function Layout() {
  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Bỏ qua đến nội dung chính
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
          <NavLink to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-primary-fg shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--primary-2), var(--primary))' }}
              aria-hidden="true"
            >
              <Sparkles size={18} />
            </span>
            <span className="hidden leading-tight md:block">
              AI In Action
              <span className="block text-[11px] font-medium text-muted">Ôn thi giữa kỳ</span>
            </span>
          </NavLink>
          <nav className="ml-2 flex flex-1 gap-1" aria-label="Điều hướng chính">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                aria-label={label}
                className={({ isActive }) =>
                  'flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-colors ' +
                  (isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface2')
                }
              >
                <Icon size={17} aria-hidden="true" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:pt-8">
        <Outlet />
      </main>
    </div>
  )
}
