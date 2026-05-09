import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ChartBarSquareIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { api, auth } from '../lib/api'

const initialState = { email: '', password: '' }

export default function Login() {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const validation = {}
    if (!form.email) validation.email = 'Email is required.'
    else if (!/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) validation.email = 'Enter a valid email.'
    if (!form.password) validation.password = 'Password is required.'
    else if (form.password.length < 6) validation.password = 'Password must be at least 6 characters.'
    setErrors(validation)
    return Object.keys(validation).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const { token, user } = await api.login({ email: form.email, password: form.password })
      auth.setSession(token, user)
      toast.success(`Welcome back${user?.name ? `, ${user.name}` : ''}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-stretch gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-6 text-slate-100 lg:w-1/2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.32em] text-sky-300">Smart Review Analyzer</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Welcome back</h1>
            <p className="mt-4 text-slate-300">Sign in to access your sentiment dashboard, manage datasets, and turn raw reviews into insights.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard icon={<SparklesIcon className="h-5 w-5 text-sky-300" />} title="Live insights" body="Instant sentiment + confidence scoring for every review." />
            <FeatureCard icon={<ChartBarSquareIcon className="h-5 w-5 text-cyan-300" />} title="Analytics-ready" body="Track trends and surface keyword themes in one view." />
            <FeatureCard icon={<ShieldCheckIcon className="h-5 w-5 text-emerald-300" />} title="Secure auth" body="JWT-protected access to your private analysis history." />
            <FeatureCard icon={<SparklesIcon className="h-5 w-5 text-amber-300" />} title="CSV ready" body="Bulk-analyze datasets and export the results in seconds." />
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-soft backdrop-blur-xl sm:max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-slate-400">Enter your credentials to continue.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              error={errors.password}
              placeholder="********"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Continue'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-sky-300 hover:text-sky-200">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, error, placeholder, autoComplete }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 ${
          error ? 'border-rose-500/70' : 'border-slate-700'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
    </div>
  )
}

function FeatureCard({ icon, title, body }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-sky-400/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950/80">{icon}</div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{title}</p>
      </div>
      <p className="mt-4 text-sm text-slate-200">{body}</p>
    </div>
  )
}
