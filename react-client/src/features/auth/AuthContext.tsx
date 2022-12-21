import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../api'

const TOKEN_KEY = 'token'
const USER_KEY = 'loggedUser'

interface AuthContextObject {
  user: any
  token: string | null
  setToken: (token: string | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextObject>({
  user: null,
  token: null,
  setToken: () => {},
  loading: true
})

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    updateToken(token)
  }, [token])

  const updateToken = async (token: string | null) => {
    api.setToken(token)
    if (token) {
      const result = await api.auth.me()
      if (result.success) {
        setUser(result.user)
        localStorage.setItem(USER_KEY, JSON.stringify(result.user))
        localStorage.setItem(TOKEN_KEY, token)
      } else {
        setToken(null)
      }
    } else {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthContext