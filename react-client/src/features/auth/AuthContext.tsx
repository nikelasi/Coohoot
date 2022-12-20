import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../api'

interface AuthContextObject {
  user: any
  token: string | null
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextObject>({
  user: null,
  token: null,
  setToken: () => {},
})

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    api.setToken(token)
    if (token) {
      login(token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (token: string) => {
    const result = await api.auth.me()
    if (result.success) {
      setUser(result.user)
      localStorage.setItem('token', token)
    } else {
      setToken(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthContext