import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { NotificationProvider } from '@/contexts/NotificationContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'WMS',
  description: 'Warranty Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="bg-cream-50 antialiased">
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  )
}
