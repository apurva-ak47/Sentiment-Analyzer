const express = require('express')
const Analysis = require('../models/Analysis')
const { requireAuth } = require('../middleware/auth')
const { analyzeReview, distributionFromAnalyses } = require('../utils/sentiment')

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
  const { review } = req.body || {}
  if (!review || typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ error: 'A non-empty review string is required.' })
  }

  const analysis = analyzeReview(review)

  await Analysis.create({
    user: req.userId,
    source: 'single',
    review,
    sentiment: analysis.sentiment,
    scores: analysis.scores,
    keywords: analysis.keywords,
    rawScore: analysis.rawScore,
  })

  const recent = await Analysis.find({ user: req.userId }).sort({ createdAt: -1 }).limit(200).lean()
  const distribution = distributionFromAnalyses(recent)

  res.json({
    sentiment: analysis.sentiment,
    scores: analysis.scores,
    keywords: analysis.keywords,
    distribution,
  })
})

router.get('/history', requireAuth, async (req, res) => {
  const items = await Analysis.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
  res.json({ items })
})

module.exports = router
