import { api } from '@/lib/api';
import { Contract, CreateContractRequest, UpdateContractRequest } from '@/types';

export const contractsService = {
  getAll: async (): Promise<Contract[]> => {
    const response = await api.get('/contracts');
    return response.data;
  },

  getById: async (id: string): Promise<Contract> => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  getByNumber: async (contractNumber: string): Promise<Contract> => {
    const response = await api.get(`/contracts/number/${contractNumber}`);
    return response.data;
  },

  create: async (contractData: CreateContractRequest): Promise<Contract> => {
    const response = await api.post('/contracts', contractData);
    return response.data;
  },

  update: async (id: string, contractData: UpdateContractRequest): Promise<Contract> => {
    const response = await api.patch(`/contracts/${id}`, contractData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contracts/${id}`);
  },
};