const Sentiment = require('sentiment')

const analyzer = new Sentiment()

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','so','of','to','in','on','for','at','by','with',
  'is','are','was','were','be','been','being','am','i','you','he','she','it','we','they','them',
  'this','that','these','those','my','your','his','her','its','our','their','as','from','into',
  'about','than','too','very','just','also','have','has','had','do','does','did','not','no','yes',
  'will','would','can','could','should','may','might','one','some','any','every','all','because'
])

function classify(score, comparative) {
  if (comparative > 0.05 || score >= 2) return 'Positive'
  if (comparative < -0.05 || score <= -2) return 'Negative'
  return 'Neutral'
}

function softmaxScores(score, comparative) {
  const positive = Math.max(0, comparative) * 4 + (score > 0 ? score : 0)
  const negative = Math.max(0, -comparative) * 4 + (score < 0 ? -score : 0)
  const neutral = 1 / (1 + Math.abs(comparative) * 6)
  const raw = [positive + 0.05, negative + 0.05, neutral + 0.5]
  const total = raw.reduce((a, b) => a + b, 0)
  const [p, n, u] = raw.map((value) => Number((value / total).toFixed(3)))
  return [
    { label: 'Positive', value: p },
    { label: 'Negative', value: n },
    { label: 'Neutral', value: u },
  ]
}

function extractKeywords(review, result, limit = 6) {
  const polar = new Set([...result.positive, ...result.negative].map((word) => word.toLowerCase()))
  const tokens = review
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && word.length > 2 && !STOPWORDS.has(word))

  const counts = new Map()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1 + (polar.has(token) ? 2 : 0))
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word)
}

function analyzeReview(text) {
  const review = (text || '').toString()
  const result = analyzer.analyze(review)
  const sentiment = classify(result.score, result.comparative)
  const scores = softmaxScores(result.score, result.comparative)
  const keywords = extractKeywords(review, result)
  return {
    sentiment,
    scores,
    keywords,
    rawScore: result.score,
  }
}

function distributionFromAnalyses(items) {
  const total = items.length || 1
  const counts = { Positive: 0, Negative: 0, Neutral: 0 }
  for (const item of items) counts[item.sentiment] = (counts[item.sentiment] || 0) + 1
  return [
    Math.round((counts.Positive * 100) / total),
    Math.round((counts.Negative * 100) / total),
    Math.round((counts.Neutral * 100) / total),
  ]
}

module.exports = { analyzeReview, distributionFromAnalyses }
