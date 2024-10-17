import { createContext, useMemo, useState, ReactNode, useCallback } from 'react'

interface AuthContextProps {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    username: string,
    display: string,
    timezone: string
  ) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data = await response.json()
    document.cookie = `accessToken=${data.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/`
    document.cookie = `refreshToken=${data.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`
    setIsAuthenticated(true)
  }

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    await handleResponse(response)
  }, [])

  const register = useCallback(
    async (
      email: string,
      password: string,
      username: string,
      display: string,
      timezone: string
    ) => {
      const response = await fetch(`/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, display, timezone }),
      })
      await handleResponse(response)
    },
    []
  )

  const logout = useCallback(() => {
    document.cookie =
      'accessToken=; Max-Age=0; HttpOnly; Secure; SameSite=Strict; Path=/'
    document.cookie =
      'refreshToken=; Max-Age=0; HttpOnly; Secure; SameSite=Strict; Path=/'
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [isAuthenticated, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
