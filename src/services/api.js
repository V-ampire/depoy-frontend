import { API_URL } from '../config'

const BASE_URL = API_URL.replace(/\/$/, '')

const STORAGE_KEY = 'auth_tokens'
const REFRESH_PATH = '/api/v1/auth/refresh-token/'

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export function saveTokens(tokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEY)
}

async function doFetch(path, options = {}) {
  const tokens = getTokens()
  const headers = {
    'Content-Type': 'application/json',
    ...(tokens ? { Authorization: `Bearer ${tokens.access_token}` } : {}),
    ...options.headers,
  }
  return fetch(`${BASE_URL}${path}`, { ...options, headers })
}

const REFRESH_RETRIES = 3
const REFRESH_RETRY_DELAY_MS = 1000

async function tryRefresh() {
  const tokens = getTokens()
  if (!tokens?.refresh_token) throw new Error('No refresh token')

  let lastError
  for (let attempt = 1; attempt <= REFRESH_RETRIES; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${REFRESH_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      })

      if (!res.ok) {
        clearTokens()
        throw Object.assign(new Error('Session expired'), { status: res.status })
      }

      const newTokens = await res.json()
      saveTokens(newTokens)
      return newTokens
    } catch (err) {
      // Не ретраим если сервер явно отклонил токен (4xx)
      if (err.status >= 400 && err.status < 500) throw err
      lastError = err
      if (attempt < REFRESH_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, REFRESH_RETRY_DELAY_MS * attempt))
      }
    }
  }

  throw lastError
}

async function request(path, options = {}) {
  let res = await doFetch(path, options)

  if (res.status === 401 && path !== REFRESH_PATH) {
    await tryRefresh()
    res = await doFetch(path, options)
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw Object.assign(new Error(error.detail || res.statusText), { status: res.status })
  }

  return res.json()
}

export const api = {
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path) => request(path, { method: 'GET' }),
}
