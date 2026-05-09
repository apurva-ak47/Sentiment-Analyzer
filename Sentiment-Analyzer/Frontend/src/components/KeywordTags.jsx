const PALETTE = [
  'from-sky-500/30 to-sky-500/10 text-sky-100 border-sky-400/30',
  'from-emerald-500/30 to-emerald-500/10 text-emerald-100 border-emerald-400/30',
  'from-amber-500/30 to-amber-500/10 text-amber-100 border-amber-400/30',
  'from-rose-500/30 to-rose-500/10 text-rose-100 border-rose-400/30',
  'from-violet-500/30 to-violet-500/10 text-violet-100 border-violet-400/30',
  'from-cyan-500/30 to-cyan-500/10 text-cyan-100 border-cyan-400/30',
]

export default function KeywordTags({ keywords }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Keyword extraction</h2>
          <p className="mt-1 text-sm text-slate-400">Highlighted keywords from your latest analysis.</p>
        </div>
      </div>
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <span
              key={`${keyword}-${index}`}
              className={`rounded-full border bg-gradient-to-br ${PALETTE[index % PALETTE.length]} px-4 py-2 text-sm font-medium`}
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-500">
          <p>No keywords yet. Analyze a review to see keyword chips here.</p>
        </div>
      )}
    </section>
  )
}
