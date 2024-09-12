import { createContext, useState, useContext, useEffect } from 'react'
import nookies from 'nookies'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  isAuthenticated: boolean
  login: (accessToken: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const cookies = nookies.get()
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = cookies.refreshToken
    setIsAuthenticated(!!accessToken && !!refreshToken)
  }, [])

  const login = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)
    const cookies = nookies.get()
    setIsAuthenticated(!!accessToken && !!cookies.refreshToken)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    nookies.destroy(null, 'refreshToken')
    setIsAuthenticated(false)
    navigate('/login') // Redirect to login page
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
