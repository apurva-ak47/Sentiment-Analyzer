const express = require('express')
const multer = require('multer')
const { parse } = require('csv-parse/sync')
const Analysis = require('../models/Analysis')
const { requireAuth } = require('../middleware/auth')
const { analyzeReview, distributionFromAnalyses } = require('../utils/sentiment')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /csv|text\/plain|application\/vnd\.ms-excel/.test(file.mimetype) || /\.csv$/i.test(file.originalname)
    cb(ok ? null : new Error('Only CSV files are allowed.'), ok)
  },
})

function pickReviewColumn(record) {
  if (!record || typeof record !== 'object') return null
  const keys = Object.keys(record)
  const preferred = keys.find((k) => /review|comment|text|feedback|message/i.test(k))
  if (preferred) return record[preferred]
  return record[keys[0]]
}

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file is required (field name "file").' })

  let records
  try {
    records = parse(req.file.buffer.toString('utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    })
  } catch (err) {
    return res.status(400).json({ error: 'Could not parse CSV: ' + err.message })
  }

  if (!records.length) {
    try {
      records = parse(req.file.buffer.toString('utf8'), { columns: false, skip_empty_lines: true, trim: true })
        .map((row) => ({ review: Array.isArray(row) ? row[0] : row }))
    } catch (_) {
      records = []
    }
  }

  const rows = []
  const docs = []
  for (const record of records) {
    const review = (pickReviewColumn(record) || '').toString().trim()
    if (!review) continue
    const analysis = analyzeReview(review)
    const topScore = analysis.scores.find((s) => s.label === analysis.sentiment) || analysis.scores[0]
    rows.push({
      review,
      sentiment: analysis.sentiment,
      scoreLabel: `${Math.round(topScore.value * 100)}%`,
      keywords: analysis.keywords,
    })
    docs.push({
      user: req.userId,
      source: 'csv',
      review,
      sentiment: analysis.sentiment,
      scores: analysis.scores,
      keywords: analysis.keywords,
      rawScore: analysis.rawScore,
    })
  }

  if (!rows.length) {
    return res.status(400).json({ error: 'No reviews found in the CSV. Ensure there is a "review" column or text in the first column.' })
  }

  if (docs.length) await Analysis.insertMany(docs)

  const distribution = distributionFromAnalyses(rows)
  res.json({ rows, distribution, total: rows.length })
})

router.use((err, _req, res, _next) => {
  if (err && err.message) return res.status(400).json({ error: err.message })
  res.status(500).json({ error: 'Upload failed.' })
})

module.exports = router
