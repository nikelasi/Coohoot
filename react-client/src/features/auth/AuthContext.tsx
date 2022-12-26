import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../api'

const TOKEN_KEY = 'token'
const USER_KEY = 'loggedUser'

interface AuthContextObject {
  user: any
  token: string | null
  loading: boolean
  login: (userIdentification: string, password: string) => Promise<any>
  logout: () => Promise<boolean>
  deleteUser: (password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextObject>({
  user: null,
  token: null,
  loading: true,
  login: async (userIdentification: string, password: string) => false,
  logout: async () => false,
  deleteUser: async (password: string) => false
})

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    updateToken(token)
  }, [])

  const updateToken = async (token: string | null) => {
    setLoading(true)
    api.setToken(token)
    if (token) {
      const result = await api.users.getMe()
      if (result.success) {
        setToken(token)
        setUser(result.user)
        localStorage.setItem(USER_KEY, JSON.stringify(result.user))
        localStorage.setItem(TOKEN_KEY, token)
        return
      }
    }
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setToken(null)
    setLoading(false)
  }

  const login = async (userIdentification: string, password: string): Promise<any> => {
    const result = await api.auth.login(userIdentification, password)
    if (result.success) {
      await updateToken(result.token)
    }
    return result
  }

  const logout = async (): Promise<boolean> => {
    const success = await api.auth.logout()
    if (success) {
      await updateToken(null)
    }
    return success
  }

  const deleteUser = async (password: string): Promise<boolean> => {
    const success = await api.users.deleteUser(password)
    if (success) {
      await updateToken(null)
    }
    return success
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, deleteUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthContext