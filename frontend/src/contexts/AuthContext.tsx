'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService, type LoginResponse } from '@/lib/services/auth'
import { showToast } from '@/lib/toast'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not on public route
    if (!isLoading && !user && !isPublicRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, isPublicRoute, pathname, router])

  const checkAuth = () => {
    try {
      const token = authService.getToken()
      const userData = authService.getCurrentUser()
      
      console.log('🔍 [AuthContext] checkAuth called')
      console.log('🔍 [AuthContext] token:', token)
      console.log('🔍 [AuthContext] userData:', userData)
      
      if (token && userData) {
        setUser(userData)
        console.log('✅ [AuthContext] User set successfully')
      } else {
        console.log('❌ [AuthContext] No token or userData found')
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error checking auth:', error)
      authService.setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await authService.login(email, password);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.status === 400) {
        showToast.error('Email hoặc mật khẩu không chính xác');
      } else {
        showToast.error('Có lỗi xảy ra khi đăng nhập');
      }
      return false;
    }
  };

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content if not authenticated and not on public route
  if (!user && !isPublicRoute) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}