import { useCallback, useRef, useState } from 'react'
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const SENTIMENT_PILL = {
  Positive: 'bg-emerald-500/20 text-emerald-200',
  Negative: 'bg-rose-500/20 text-rose-200',
  Neutral: 'bg-slate-500/20 text-slate-200',
}

export default function FileUpload({ uploadedFile, onFileChange, onAnalyze, rows, loading }) {
  const [dragActive, setDragActive] = useState(false)
  const dropRef = useRef(null)
  const inputRef = useRef(null)

  const handleDrag = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') setDragActive(true)
    else if (event.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      setDragActive(false)
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onFileChange(event.dataTransfer.files[0])
      }
    },
    [onFileChange]
  )

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">CSV dataset upload</h2>
          <p className="mt-2 text-sm text-slate-400">Drop a CSV with a <code className="rounded bg-slate-800/80 px-1.5 py-0.5 text-xs text-sky-200">review</code> column to bulk-analyze.</p>
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!uploadedFile || loading}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          {loading ? 'Analyzing…' : 'Analyze Dataset'}
        </button>
      </div>

      <div
        ref={dropRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 cursor-pointer rounded-[1.8rem] border-2 p-8 text-center transition ${
          dragActive ? 'border-sky-400 bg-slate-950/90' : 'border-dashed border-slate-700 bg-slate-950/70 hover:border-sky-400/60'
        }`}
      >
        <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-slate-500" />
        <p className="mt-3 text-sm text-slate-300">Drag &amp; drop your CSV here, or click to choose a file.</p>
        <p className="mt-1 text-xs text-slate-500">Max 5 MB · CSV with a "review" column (or first column)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(event) => event.target.files?.[0] && onFileChange(event.target.files[0])}
        />
      </div>

      {uploadedFile && (
        <div className="mt-6 flex items-center gap-3 rounded-[1.8rem] border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
            <DocumentTextIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{uploadedFile.name}</p>
            <p className="text-xs text-slate-400">{(uploadedFile.size / 1024).toFixed(1)} KB · ready to analyze</p>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/80">
        <div className="grid grid-cols-4 gap-2 bg-slate-900/90 px-4 py-3 text-xs uppercase tracking-[0.25em] text-slate-500">
          <span className="col-span-2">Review</span>
          <span>Sentiment</span>
          <span>Score</span>
        </div>
        <div className="max-h-80 divide-y divide-slate-800 overflow-y-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 px-4 py-4">
                <div className="col-span-2 h-4 animate-pulse rounded-full bg-slate-800" />
                <div className="h-4 animate-pulse rounded-full bg-slate-800" />
                <div className="h-4 animate-pulse rounded-full bg-slate-800" />
              </div>
            ))
          ) : rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 px-4 py-4 text-sm">
                <p className="col-span-2 line-clamp-2 text-slate-100">{row.review}</p>
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SENTIMENT_PILL[row.sentiment] || SENTIMENT_PILL.Neutral}`}>
                    {row.sentiment}
                  </span>
                </div>
                <p className="text-slate-300">{row.scoreLabel}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">Analyze a CSV to preview dataset predictions.</div>
          )}
        </div>
      </div>
    </section>
  )
}
