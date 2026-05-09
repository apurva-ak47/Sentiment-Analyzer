const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'sra_token'
const USER_KEY = 'sra_user'

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user || {}))
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
}

async function request(path, { method = 'GET', body, headers = {}, formData } = {}) {
  const token = auth.getToken()
  const opts = {
    method,
    headers: {
      ...(formData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }
  if (formData) opts.body = formData
  else if (body !== undefined) opts.body = JSON.stringify(body)

  const response = await fetch(`${API_BASE}${path}`, opts)
  const isJSON = (response.headers.get('content-type') || '').includes('application/json')
  const data = isJSON ? await response.json().catch(() => ({})) : null

  if (!response.ok) {
    const error = new Error((data && data.error) || `Request failed (${response.status})`)
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  analyze: (review) => request('/analyze', { method: 'POST', body: { review } }),
  history: () => request('/analyze/history'),
  uploadCsv: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request('/upload-csv', { method: 'POST', formData })
  },
}
