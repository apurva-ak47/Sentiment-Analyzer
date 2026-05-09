import { ArrowLeftOnRectangleIcon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { auth } from '../lib/api'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate()
  const user = auth.getUser()
  const displayName = user?.name?.trim() || user?.email || 'Account'

  const handleLogout = () => {
    auth.clear()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 text-slate-950 shadow-md">
          <span className="text-xl font-semibold">AI</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Smart Review Analyzer</p>
          <h1 className="text-2xl font-semibold text-white">Review Intelligence</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-slate-200">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/90 bg-slate-950/80 px-4 py-2 text-sm transition hover:border-sky-400 hover:bg-slate-900"
        >
          {darkMode ? <SunIcon className="h-5 w-5 text-amber-300" /> : <MoonIcon className="h-5 w-5 text-slate-200" />}
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-200">
          <UserCircleIcon className="h-5 w-5" />
          <span className="max-w-[10rem] truncate" title={displayName}>{displayName}</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </header>
  )
}
