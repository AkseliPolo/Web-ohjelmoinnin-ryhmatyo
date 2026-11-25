import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    apiFetch('/api/users/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    setUser(null)
    await apiFetch('/api/users/logout', { method: 'POST' }).catch(() => null)
  }

  if (!ready) return null

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
