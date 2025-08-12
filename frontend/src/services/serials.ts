import { api } from '@/lib/api';
import { Serial, CreateSerialRequest, UpdateSerialRequest, WarrantyCheckResponse, WarrantyStatus } from '@/types';

export const serialsService = {
  getAll: async (): Promise<Serial[]> => {
    const response = await api.get('/serials');
    return response.data;
  },

  getById: async (id: string): Promise<Serial> => {
    const response = await api.get(`/serials/${id}`);
    return response.data;
  },

  getBySerialNumber: async (serialNumber: string): Promise<Serial> => {
    const response = await api.get(`/serials/number/${serialNumber}`);
    return response.data;
  },

  checkWarranty: async (serialNumber: string): Promise<WarrantyCheckResponse> => {
    const response = await api.get(`/serials/warranty/${serialNumber}`);
    return response.data;
  },

  create: async (serialData: CreateSerialRequest): Promise<Serial> => {
    const response = await api.post('/serials', serialData);
    return response.data;
  },

  update: async (id: string, serialData: UpdateSerialRequest): Promise<Serial> => {
    const response = await api.patch(`/serials/${id}`, serialData);
    return response.data;
  },

  updateWarrantyStatus: async (id: string, status: WarrantyStatus, notes?: string): Promise<Serial> => {
    const response = await api.patch(`/serials/${id}/warranty`, { status, notes });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/serials/${id}`);
  },
};