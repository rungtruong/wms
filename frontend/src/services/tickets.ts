import { api } from '@/lib/api';
import { Ticket, TicketComment, CreateTicketRequest, UpdateTicketRequest, CreateTicketCommentRequest, TicketStatus, TicketPriority } from '@/types';

export const ticketsService = {
  getAll: async (status?: TicketStatus, priority?: TicketPriority): Promise<Ticket[]> => {
    const params: any = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (ticketData: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  update: async (id: string, ticketData: UpdateTicketRequest): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}`, ticketData);
    return response.data;
  },

  addComment: async (ticketId: string, commentData: CreateTicketCommentRequest): Promise<TicketComment> => {
    const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  getComments: async (ticketId: string): Promise<TicketComment[]> => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};