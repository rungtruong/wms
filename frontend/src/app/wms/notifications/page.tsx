'use client'

import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useNotifications } from '@/contexts/NotificationContext'
import { Bell, AlertTriangle, Info, CheckCircle, X, Check, ExternalLink } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const router = useRouter()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      case 'success':
        return CheckCircle
      case 'error':
        return X
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500 bg-yellow-50'
      case 'info':
        return 'text-blue-500 bg-blue-50'
      case 'success':
        return 'text-green-500 bg-green-50'
      case 'error':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }



  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
  }

  const handleDetailClick = (notification: any) => {
    if (notification.title.includes('Hợp đồng')) {
      router.push('/wms/contracts')
    } else if (notification.title.includes('Yêu cầu bảo hành')) {
      router.push('/wms/requests')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout title="Thông báo hệ thống">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">Thông báo</h2>
              </div>
              <button 
                onClick={() => {
                  markAllAsRead()
                }}
                className="btn btn-outline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            </div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="card p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                  <p className="text-gray-500">Bạn đã xem tất cả thông báo.</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const colorClasses = getNotificationColor(notification.type)
                  
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`card p-6 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? 'ring-2 ring-primary-100' : ''}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${colorClasses}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`text-lg font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              <p className={`mt-1 ${!notification.read ? 'text-gray-600' : 'text-gray-500'}`}>
                                {notification.message}
                              </p>
                              <p className="mt-2 text-sm text-gray-400">
                                {formatDate(notification.date)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDetailClick(notification)
                                }}
                                className="btn btn-primary text-sm flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Chi tiết
                              </button>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="btn btn-outline p-2 text-green-600 hover:text-green-700"
                                  title="Đánh dấu đã đọc"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="btn btn-outline p-2 text-red-600 hover:text-red-700"
                                title="Xóa thông báo"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
    </Layout>
  )
}
