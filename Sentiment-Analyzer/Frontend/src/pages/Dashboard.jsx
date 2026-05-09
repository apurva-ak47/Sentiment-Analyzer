import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownTrayIcon,
  BoltIcon,
  ChartBarSquareIcon,
  FaceFrownIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline'
import Navbar from '../components/Navbar'
import SummaryCard from '../components/SummaryCard'
import ReviewInput from '../components/ReviewInput'
import FileUpload from '../components/FileUpload'
import Charts from '../components/Charts'
import KeywordTags from '../components/KeywordTags'
import { toast } from 'react-toastify'
import { api, auth } from '../lib/api'

const initialSummary = [0, 0, 0]
const initialScores = [
  { label: 'Positive', value: 0 },
  { label: 'Negative', value: 0 },
  { label: 'Neutral', value: 0 },
]

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const [summary, setSummary] = useState(initialSummary)
  const [result, setResult] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [distribution, setDistribution] = useState(initialSummary)
  const [scores, setScores] = useState(initialScores)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [datasetRows, setDatasetRows] = useState([])
  const [loadingReview, setLoadingReview] = useState(false)
  const [loadingDataset, setLoadingDataset] = useState(false)
  const [totalAnalyzed, setTotalAnalyzed] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    api
      .history()
      .then(({ items }) => {
        if (cancelled || !items?.length) return
        setTotalAnalyzed(items.length)
        const counts = items.reduce(
          (acc, item) => {
            acc[item.sentiment] = (acc[item.sentiment] || 0) + 1
            return acc
          },
          { Positive: 0, Negative: 0, Neutral: 0 }
        )
        const total = items.length
        const dist = [
          Math.round((counts.Positive * 100) / total),
          Math.round((counts.Negative * 100) / total),
          Math.round((counts.Neutral * 100) / total),
        ]
        setSummary(dist)
        setDistribution(dist)
      })
      .catch((err) => {
        if (err.status === 401) {
          auth.clear()
          navigate('/login', { replace: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  const sentimentCards = useMemo(
    () => [
      {
        title: 'Positive %',
        value: `${summary[0]}%`,
        icon: <FaceSmileIcon className="h-6 w-6 text-emerald-400" />,
        accent: 'from-emerald-500/30 to-emerald-400/5',
      },
      {
        title: 'Negative %',
        value: `${summary[1]}%`,
        icon: <FaceFrownIcon className="h-6 w-6 text-rose-400" />,
        accent: 'from-rose-500/30 to-rose-400/5',
      },
      {
        title: 'Neutral %',
        value: `${summary[2]}%`,
        icon: <ChartBarSquareIcon className="h-6 w-6 text-slate-300" />,
        accent: 'from-slate-500/30 to-slate-400/5',
      },
    ],
    [summary]
  )

  const handleAuthError = (err) => {
    if (err.status === 401) {
      auth.clear()
      toast.error('Session expired — please log in again.')
      navigate('/login', { replace: true })
      return true
    }
    return false
  }

  const analyzeReview = async (text) => {
    setLoadingReview(true)
    try {
      const data = await api.analyze(text)
      setResult(data)
      setKeywords(data.keywords || [])
      setDistribution(data.distribution || initialSummary)
      setScores(data.scores || initialScores)
      setSummary(data.distribution || initialSummary)
      setTotalAnalyzed((count) => count + 1)
      toast.success('Review analyzed successfully')
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err.message || 'Analysis failed.')
    } finally {
      setLoadingReview(false)
    }
  }

  const analyzeDataset = async () => {
    if (!uploadedFile) return
    setLoadingDataset(true)
    try {
      const data = await api.uploadCsv(uploadedFile)
      setDatasetRows(data.rows || [])
      if (data.distribution) {
        setDistribution(data.distribution)
        setSummary(data.distribution)
      }
      if (data.total) setTotalAnalyzed((count) => count + data.total)
      toast.success(`Analyzed ${data.total ?? data.rows?.length ?? 0} reviews`)
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err.message || 'CSV analysis failed.')
    } finally {
      setLoadingDataset(false)
    }
  }

  const handleDownload = () => {
    if (!datasetRows.length) {
      toast.info('Run a CSV analysis first to download results.')
      return
    }
    const csvContent = [
      'Review,Sentiment,Score',
      ...datasetRows.map(
        (item) => `"${item.review.replace(/"/g, '""')}",${item.sentiment},${item.scoreLabel}`
      ),
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'review-results.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Download started')
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Smart Review Analyzer</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Dashboard overview</h2>
                <p className="mt-2 max-w-xl text-slate-400">
                  Monitor live sentiment trends, manage datasets, and extract keywords powered by your Node + MongoDB backend.
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/90 px-5 py-3 text-sm text-slate-300 shadow-inner">
                  <BoltIcon className="h-5 w-5 text-amber-400" />
                  Real-time inference ready
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {totalAnalyzed} analyzed in your workspace
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 sm:grid-cols-3">
            {sentimentCards.map((card) => (
              <SummaryCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                accent={card.accent}
              />
            ))}
          </div>

          <div className="space-y-6">
            <ReviewInput onAnalyze={analyzeReview} loading={loadingReview} result={result} />
            <FileUpload
              uploadedFile={uploadedFile}
              onFileChange={setUploadedFile}
              onAnalyze={analyzeDataset}
              rows={datasetRows}
              loading={loadingDataset}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Export</p>
                <h3 className="text-xl font-semibold text-white">Results download</h3>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download CSV
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Export your most recent dataset analysis for reporting or stakeholder review.
            </p>
          </section>

          <KeywordTags keywords={keywords} />
        </aside>
      </div>

      <div className="mt-8">
        <Charts distribution={distribution} scores={scores} />
      </div>
    </main>
  )
}
