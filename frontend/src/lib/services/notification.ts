import { apiClient } from '@/lib/api'

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  userId?: string
  ticketId?: string
  read: boolean
  createdAt: string
  user?: {
    id: string
    fullName: string
    email: string
  }
  ticket?: {
    id: string
    ticketNumber: string
  }
}

export interface CreateNotificationDto {
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  userId?: string
  ticketId?: string
}

export interface UpdateNotificationDto {
  read?: boolean
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications')
    return response
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count')
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

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/mark-all-read')
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