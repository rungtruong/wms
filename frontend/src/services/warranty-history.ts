import { api } from '@/lib/api';
import { WarrantyHistory, CreateWarrantyHistoryRequest, UpdateWarrantyHistoryRequest, ActionType } from '@/types';

export const warrantyHistoryService = {
  getAll: async (actionType?: ActionType): Promise<WarrantyHistory[]> => {
    const params = actionType ? { actionType } : {};
    const response = await api.get('/warranty-history', { params });
    return response.data;
  },

  getById: async (id: string): Promise<WarrantyHistory> => {
    const response = await api.get(`/warranty-history/${id}`);
    return response.data;
  },

  getBySerialId: async (serialId: string): Promise<WarrantyHistory[]> => {
    const response = await api.get(`/warranty-history/serial/${serialId}`);
    return response.data;
  },

  create: async (historyData: CreateWarrantyHistoryRequest): Promise<WarrantyHistory> => {
    const response = await api.post('/warranty-history', historyData);
    return response.data;
  },

  update: async (id: string, historyData: UpdateWarrantyHistoryRequest): Promise<WarrantyHistory> => {
    const response = await api.patch(`/warranty-history/${id}`, historyData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/warranty-history/${id}`);
  },
};