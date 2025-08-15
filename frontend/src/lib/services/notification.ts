import { apiClient } from './api'

export interface Notification {
  id: string
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  message: string
  createdAt: string
  read: boolean
  userId: string
}

export interface CreateNotificationDto {
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  message: string
  userId: string
}

export interface UpdateNotificationDto {
  read?: boolean
}

class NotificationService {
  async getNotifications(userId?: string): Promise<Notification[]> {
    const params = userId ? `?userId=${userId}` : ''
    const response = await apiClient.get<Notification[]>(`/notifications${params}`)
    return response
  }

  async getUnreadCount(userId?: string): Promise<{ count: number }> {
    const params = userId ? `?userId=${userId}` : ''
    const response = await apiClient.get<{ count: number }>(`/notifications/unread-count${params}`)
    return response
  }

  async getNotificationById(id: string): Promise<Notification> {
    const response = await apiClient.get<Notification>(`/notifications/${id}`)
    return response
  }

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    const response = await apiClient.post<Notification>('/notifications', data)
    return response
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.post<Notification>(`/notifications/mark-read/${id}`)
    return response
  }

  async markAllAsRead(userId?: string): Promise<void> {
    const params = userId ? `?userId=${userId}` : ''
    await apiClient.post(`/notifications/mark-all-read${params}`)
  }

  async updateNotification(id: string, data: UpdateNotificationDto): Promise<Notification> {
    const response = await apiClient.patch<Notification>(`/notifications/${id}`, data)
    return response
  }

  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`)
  }
}

export const notificationService = new NotificationService()