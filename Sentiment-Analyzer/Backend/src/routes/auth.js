const express = require('express')
const bcrypt = require('bcryptjs')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const { signToken, requireAuth } = require('../middleware/auth')

const router = express.Router()

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false })

const EMAIL_RE = /^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/

router.post('/signup', authLimiter, async (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid email is required.' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email: email.toLowerCase(), passwordHash, name: name || '' })

  const token = signToken(user)
  res.status(201).json({ token, user: user.toSafeJSON() })
})

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' })

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: 'Invalid email or password.' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid email or password.' })

  const token = signToken(user)
  res.json({ token, user: user.toSafeJSON() })
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found.' })
  res.json({ user: user.toSafeJSON() })
})

module.exports = router
