import { createContext, useContext, useEffect, useState } from 'react'
import { api, getTokens, saveTokens } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => getTokens())
  const [authError, setAuthError] = useState(null)
  const [authFailed, setAuthFailed] = useState(false)

  useEffect(() => {
    if (getTokens()) return

    const tryLogin = (attempt = 0) => {
      const initData = window.Telegram?.WebApp?.initData
      if (!initData) {
        if (attempt < 5) {
          setTimeout(() => tryLogin(attempt + 1), 300)
        } else {
          setAuthFailed(true)
        }
        return
      }

      api.post('/api/v1/auth/login/', { raw_data: initData })
        .then((data) => {
          saveTokens(data)
          setTokens(data)
        })
        .catch((err) => {
          setAuthError({
            message: err.message,
            status: err.status ?? null,
            initDataPresent: !!initData,
            initDataLength: initData.length,
            apiUrl: import.meta.env.VITE_API_URL || '(not set)',
            timestamp: new Date().toISOString(),
          })
          setAuthFailed(true)
        })
    }

    tryLogin()
  }, [])

  return (
    <AuthContext.Provider value={{ tokens, authError, authFailed }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
