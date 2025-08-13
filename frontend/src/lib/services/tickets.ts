import { apiClient } from '../api';
import type { WarrantyRequest } from '@/types';

interface CreateTicketRequest {
  serialNumber: string;
  customerName: string;
  issue: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UpdateTicketRequest {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  issue?: string;
  description?: string;
}

interface CreateTicketCommentRequest {
  content: string;
  authorId: string;
}

interface TicketComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

class TicketsService {
  async getAll(status?: string, priority?: string): Promise<WarrantyRequest[]> {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    
    return apiClient.get<WarrantyRequest[]>('/tickets', Object.keys(params).length > 0 ? params : undefined);
  }

  async getById(id: string): Promise<WarrantyRequest> {
    return apiClient.get<WarrantyRequest>(`/tickets/${id}`);
  }

  async create(data: CreateTicketRequest): Promise<WarrantyRequest> {
    return apiClient.post<WarrantyRequest>('/tickets', data);
  }

  async update(id: string, data: UpdateTicketRequest): Promise<WarrantyRequest> {
    return apiClient.patch<WarrantyRequest>(`/tickets/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/tickets/${id}`);
  }

  async addComment(id: string, data: CreateTicketCommentRequest): Promise<TicketComment> {
    return apiClient.post<TicketComment>(`/tickets/${id}/comments`, data);
  }

  async getComments(id: string): Promise<TicketComment[]> {
    return apiClient.get<TicketComment[]>(`/tickets/${id}/comments`);
  }

  async getByStatus(status: 'open' | 'in_progress' | 'resolved' | 'closed'): Promise<WarrantyRequest[]> {
    return this.getAll(status);
  }

  async getByPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): Promise<WarrantyRequest[]> {
    return this.getAll(undefined, priority);
  }
}

export const ticketsService = new TicketsService();
export type {
  CreateTicketRequest,
  UpdateTicketRequest,
  CreateTicketCommentRequest,
  TicketComment
};