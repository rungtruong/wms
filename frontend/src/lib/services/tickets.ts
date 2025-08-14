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
  status?: 'received' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  issue?: string;
  description?: string;
}

interface TicketHistory {
  id: string;
  actionType: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  performedBy?: {
    id: string;
    fullName: string;
  };
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

  async getHistory(id: string): Promise<TicketHistory[]> {
    return apiClient.get<TicketHistory[]>(`/tickets/${id}/history`);
  }

  async getByStatus(status: 'received' | 'in_progress' | 'resolved' | 'closed'): Promise<WarrantyRequest[]> {
    return this.getAll(status);
  }

  async getByPriority(priority: 'low' | 'medium' | 'high' | 'urgent'): Promise<WarrantyRequest[]> {
    return this.getAll(undefined, priority);
  }

  async updateStatus(id: string, status: 'received' | 'in_progress' | 'resolved' | 'closed', note?: string): Promise<WarrantyRequest> {
    const updateData: any = { status };
    if (note) {
      updateData.note = note;
    }
    return apiClient.patch<WarrantyRequest>(`/tickets/${id}/status`, updateData);
  }

  async assignTechnician(id: string, technicianId: string, note?: string): Promise<WarrantyRequest> {
    const assignData: any = { technicianId };
    if (note) {
      assignData.note = note;
    }
    return apiClient.patch<WarrantyRequest>(`/tickets/${id}/assign`, assignData);
  }

  async sendEmail(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(`/tickets/${id}/send-email`, {});
  }
}

export const ticketsService = new TicketsService();
export type {
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketHistory
};