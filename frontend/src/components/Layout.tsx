'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useNotifications } from '@/contexts/NotificationContext'

interface LayoutProps {
  title: string
  notificationCount?: number
  children: React.ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { unreadCount } = useNotifications()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <Header 
        title="Hệ thống Quản lý Bảo hành" 
        notificationCount={unreadCount} 
        onMenuToggle={toggleSidebar}
      />
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main className={`mt-16 p-6 min-h-[calc(100vh-64px)] transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-64'
      }`}>
        {children}
      </main>
    </div>
  )
}
