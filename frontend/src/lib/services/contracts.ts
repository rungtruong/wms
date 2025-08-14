import { apiClient } from '../api';
import type { Contract } from '@/types';

interface CreateContractRequest {
  contractNumber: string;
  customerId?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  contractProducts: Array<{
    name: string;
    model: string;
    serial: string;
  }>;
  startDate: string;
  endDate: string;
  termsConditions: string;
   status?: 'active' | 'expired' | 'suspended';
   createdBy?: string;
}

interface UpdateContractRequest extends Partial<CreateContractRequest> {}

class ContractsService {
  async getAll(): Promise<Contract[]> {
    return apiClient.get<Contract[]>('/contracts');
  }

  async getById(id: string): Promise<Contract> {
    return apiClient.get<Contract>(`/contracts/${id}`);
  }

  async getByContractNumber(contractNumber: string): Promise<Contract> {
    return apiClient.get<Contract>(`/contracts/number/${contractNumber}`);
  }

  async getByCustomerEmail(customerEmail: string): Promise<Contract[]> {
    return apiClient.get<Contract[]>(`/contracts/customer/${customerEmail}`);
  }

  async create(data: CreateContractRequest): Promise<Contract> {
    return apiClient.post<Contract>('/contracts', data);
  }

  async update(id: string, data: UpdateContractRequest): Promise<Contract> {
    return apiClient.patch<Contract>(`/contracts/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/contracts/${id}`);
  }
}

export const contractsService = new ContractsService();
export type { CreateContractRequest, UpdateContractRequest };