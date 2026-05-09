const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema(
  {
    label: String,
    value: Number,
  },
  { _id: false }
)

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    source: { type: String, enum: ['single', 'csv'], default: 'single', index: true },
    review: { type: String, required: true },
    sentiment: { type: String, enum: ['Positive', 'Negative', 'Neutral'], required: true },
    scores: [scoreSchema],
    keywords: [String],
    rawScore: Number,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Analysis', analysisSchema)
