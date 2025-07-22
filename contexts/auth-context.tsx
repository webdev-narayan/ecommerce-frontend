// context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LoginResponse, User } from '@/lib/types/auth'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null;
  userRole: string | null
  login: (email: string, role: string) => Promise<LoginResponse | null>
  logout: () => void
  loading: boolean
}

import { getUser, login as SLogin, logout as SLogout } from "@/lib/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const meApi = async () => {
    setLoading(true)
    const res = await getUser()
    if (res) {
      setIsAuthenticated(true)
      setUserRole("authenticated")
    } else {
      setIsAuthenticated(false)
    }
    setLoading(false)
  }
  useEffect(() => {
    meApi()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    // const res = await postApi<LoginResponse>('/auth/local', { identifier: email, password: password }, false)
    const res = await SLogin({ email, password })
    if (res.success && res.user?.user) {

      setIsAuthenticated(true)
      setUserRole("authenticated")
      setUser(res.user.user)
      return res.user
    }
    return null
  }

  const logout = async () => {
    const res = await SLogout()
    if (res.successs) {
      setIsAuthenticated(false)
      setUserRole(null)
      // router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
