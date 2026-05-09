require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./src/config/db')

const authRoutes = require('./src/routes/auth')
const analyzeRoutes = require('./src/routes/analyze')
const uploadRoutes = require('./src/routes/upload')

const app = express()

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
)

// Middleware
app.use(express.json({ limit: '1mb' }))

// Health Route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/upload-csv', uploadRoutes)

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err)

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Server Port
const PORT = Number(process.env.PORT) || 5000

// Start Server
connectDB()
  .then(() => {
    console.log('[db] connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('[startup] failed to connect to MongoDB:', err.message)
    process.exit(1)
  })