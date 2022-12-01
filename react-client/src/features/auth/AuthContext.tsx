import { createContext, useContext, useEffect, useState } from 'react'

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
    if (token) {
      // TODO: Fetch user data, and ensure token is valid
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

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