import { apiClient } from '../api';
import type { Serial } from '@/types';

interface CreateProductSerialRequest {
  serialNumber: string;
  productName: string;
  model: string;
  manufactureDate: string;
  contractId?: string;
}

interface UpdateProductSerialRequest extends Partial<CreateProductSerialRequest> {}

interface CreateWarrantyRequestRequest {
  serialNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  issueTitle: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface WarrantyDetails {
  serial: {
    serialNumber: string
    productName: string
    model: string
    manufacturingDate: string
    purchaseDate: string
    warrantyRemaining: string
    status: 'valid' | 'expired' | 'cancelled'
    repairHistory?: any[]
  }
  contract: {
    contractNumber: string
    startDate: string
    endDate: string
    terms: string
    customerName?: string
    customerPhone?: string
    customerAddress?: string
    customerEmail?: string
  } | null
  warranty: {
    isValid: boolean
    status: 'valid' | 'expired' | 'cancelled'
    startDate: string
    endDate: string
    daysRemaining: number
  }
}

class ProductsService {
  async getAll(model?: string): Promise<any[]> {
    const params = model ? { model } : undefined;
    return apiClient.get<any[]>('/products', params);
  }

  async getById(id: string): Promise<any> {
    return apiClient.get<any>(`/products/${id}`);
  }

  async create(data: CreateProductSerialRequest): Promise<any> {
    return apiClient.post<any>('/products', data);
  }

  async update(id: string, data: UpdateProductSerialRequest): Promise<any> {
    return apiClient.patch<any>(`/products/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
  }

  async getAllSerials(): Promise<Serial[]> {
    return apiClient.get<Serial[]>('/products/serials');
  }

  async getSerialById(id: string): Promise<Serial> {
    return apiClient.get<Serial>(`/products/serials/${id}`);
  }

  async getSerialByNumber(serialNumber: string): Promise<Serial> {
    return apiClient.get<Serial>(`/products/serials/number/${serialNumber}`);
  }

  async getSerialsByCustomer(customerEmail: string): Promise<Serial[]> {
    return apiClient.get<Serial[]>(`/products/serials/customer/${customerEmail}`);
  }

  async createSerial(data: CreateProductSerialRequest): Promise<Serial> {
    return apiClient.post<Serial>('/products/serials', data);
  }

  async updateSerial(id: string, data: UpdateProductSerialRequest): Promise<Serial> {
    return apiClient.patch<Serial>(`/products/serials/${id}`, data);
  }

  async updateSerialWarrantyStatus(id: string, status: string, notes?: string): Promise<Serial> {
    return apiClient.patch<Serial>(`/products/serials/${id}/warranty-status`, {
      status,
      notes
    });
  }

  async deleteSerial(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/serials/${id}`);
  }

  async checkWarranty(serialNumber: string): Promise<WarrantyDetails> {
    return apiClient.get<WarrantyDetails>(`/products/serials/warranty/${serialNumber}`);
  }

  async createWarrantyRequest(data: CreateWarrantyRequestRequest): Promise<any> {
    return apiClient.post<any>('/products/serials/warranty-request', data);
  }
}

export const productsService = new ProductsService();
export type {
  CreateProductSerialRequest,
  UpdateProductSerialRequest,
  CreateWarrantyRequestRequest,
  WarrantyDetails
};