import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title)

export default function Charts({ distribution, scores }) {
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Sentiment distribution',
        data: distribution,
        backgroundColor: ['#22c55e', '#fb7185', '#94a3b8'],
        borderWidth: 0,
      },
    ],
  }

  const barData = {
    labels: scores.map((score) => score.label),
    datasets: [
      {
        label: 'Confidence',
        data: scores.map((score) => Math.round(score.value * 100)),
        backgroundColor: 'rgba(56, 189, 248, 0.85)',
        borderRadius: 12,
      },
    ],
  }

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#cbd5e1', boxWidth: 14, padding: 16 } },
      title: { display: false },
    },
  }

  const barOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      tooltip: { callbacks: { label: (context) => `${context.parsed.y} %` } },
    },
    scales: {
      x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
      },
    },
  }

  const pieOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed} %` } },
    },
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Sentiment distribution</h2>
            <p className="mt-1 text-sm text-slate-400">Overview of sentiment classes across your dataset.</p>
          </div>
        </div>
        <div className="h-[320px]">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Confidence scores</h2>
            <p className="mt-1 text-sm text-slate-400">Compare AI confidence across each sentiment label.</p>
          </div>
        </div>
        <div className="h-[320px]">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </section>
  )
}
