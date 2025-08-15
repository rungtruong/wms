'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { notificationService, Notification } from '@/lib/services/notification'
import { useAuth } from './AuthContext'
import { showToast } from '@/lib/utils/toast'

interface NotificationContextType {
  notifications: Notification[]
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  unreadCount: number
  loading: boolean
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshNotifications = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    console.log('🔍 [NotificationContext] refreshNotifications called')
    console.log('🔍 [NotificationContext] user:', user)
    console.log('🔍 [NotificationContext] token:', token)
    
    if (!user || !token) {
      console.log('🔍 [NotificationContext] No user or token, returning early')
      return
    }
    
    try {
      setLoading(true)
      console.log('🔍 [NotificationContext] Calling notificationService.getNotifications()')
      const data = await notificationService.getNotifications()
      console.log('🔍 [NotificationContext] API response:', data)
      setNotifications(data)
    } catch (error) {
      console.error('❌ [NotificationContext] Error fetching notifications:', error)
      showToast.error('Không thể tải thông báo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      refreshNotifications()
    }
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      console.log('🔍 [NotificationContext] markAsRead called with id:', id)
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
      console.log('✅ [NotificationContext] markAsRead successful')
    } catch (error) {
      console.error('❌ [NotificationContext] Error marking notification as read:', error)
      showToast.error('Không thể đánh dấu thông báo đã đọc')
    }
  }

  const markAllAsRead = async () => {
    if (!user) return
    
    try {
      console.log('🔍 [NotificationContext] markAllAsRead called')
      await notificationService.markAllAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
      showToast.success('Đã đánh dấu tất cả thông báo đã đọc')
      console.log('✅ [NotificationContext] markAllAsRead successful')
    } catch (error) {
      console.error('❌ [NotificationContext] Error marking all notifications as read:', error)
      showToast.error('Không thể đánh dấu tất cả thông báo đã đọc')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      showToast.success('Đã xóa thông báo')
    } catch (error) {
      console.error('Error deleting notification:', error)
      showToast.error('Không thể xóa thông báo')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      unreadCount,
      loading,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
