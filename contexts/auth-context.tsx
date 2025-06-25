// context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { postApi } from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  login: (email: string, role: string) => void
  logout: () => void
  loading: boolean
}

interface User {
  id: number;
  documenId: string;
  name: string;
  email: string;
  role: Role;
}
interface Role {
  id: number;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = Cookies.get('isAuthenticated') === 'true'
    const role = Cookies.get('userRole') || null
    setIsAuthenticated(auth)
    setUserRole(role)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await postApi<User>('login', { identifier: email, password: password }, false)
    if (res.success && res.data) {
      Cookies.set('isAuthenticated', 'true', { expires: 7 })
      Cookies.set('role', JSON.stringify(res.data.role), { expires: 7 })
      Cookies.set("user", JSON.stringify(res.data), { expires: 7 })
      setIsAuthenticated(true)
      setUserRole(res.data.role.name)
    }
  }

  const logout = () => {
    Cookies.remove('isAuthenticated')
    Cookies.remove('userRole')
    setIsAuthenticated(false)
    setUserRole(null)
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, loading }}>
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
