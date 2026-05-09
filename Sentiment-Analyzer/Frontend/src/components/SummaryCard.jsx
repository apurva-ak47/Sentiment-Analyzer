export default function SummaryCard({ title, value, icon, accent = 'from-sky-500/30 to-cyan-400/10' }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-sky-400/60">
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-60 transition-opacity group-hover:opacity-90`} />
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-3xl bg-white/10 p-3 text-slate-100 shadow-inner backdrop-blur-sm">{icon}</div>
        <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">Live</span>
      </div>
      <div className="mt-8">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}
