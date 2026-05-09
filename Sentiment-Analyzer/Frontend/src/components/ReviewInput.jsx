import { useState } from 'react'

const SENTIMENT_STYLES = {
  Positive: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40',
  Negative: 'bg-rose-500/20 text-rose-200 border border-rose-400/40',
  Neutral: 'bg-slate-500/20 text-slate-200 border border-slate-400/40',
}

const BAR_COLORS = {
  Positive: 'from-emerald-500 to-emerald-300',
  Negative: 'from-rose-500 to-rose-300',
  Neutral: 'from-slate-400 to-slate-300',
}

export default function ReviewInput({ onAnalyze, loading, result }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const submitReview = () => {
    if (!text.trim()) {
      setError('Please enter a review before analysis.')
      return
    }
    setError('')
    onAnalyze(text)
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Real-time review analyzer</h2>
          <p className="mt-2 text-sm text-slate-400">Paste a review and receive instant sentiment predictions.</p>
        </div>
        <button
          type="button"
          onClick={submitReview}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze Review'}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows="6"
        placeholder="Enter customer review text here…"
        className="mt-6 w-full resize-none rounded-3xl border border-slate-700 bg-slate-950/95 px-4 py-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
      />
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-800" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-800" />
          </div>
        ) : result ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">Sentiment</span>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${SENTIMENT_STYLES[result.sentiment] || SENTIMENT_STYLES.Neutral}`}>
                {result.sentiment}
              </span>
            </div>
            <div className="space-y-4">
              {result.scores.map((score) => {
                const pct = Math.round(score.value * 100)
                return (
                  <div key={score.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{score.label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[score.label] || BAR_COLORS.Neutral} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-500">
            <p className="text-sm">Analyze a sample review to populate sentiment and confidence scores.</p>
          </div>
        )}
      </div>
    </section>
  )
}
