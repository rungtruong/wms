import { apiClient } from '@/lib/api'
import { Serial, CreateSerialDto, UpdateSerialDto, SerialFilters, ApiResponse } from '@/types/serial'

class SerialService {

  async getSerials(filters?: SerialFilters): Promise<Serial[]> {
    const params: Record<string, string> = {}
    
    if (filters?.search) params.search = filters.search
    if (filters?.category) params.category = filters.category
    if (filters?.warrantyStatus) params.warrantyStatus = filters.warrantyStatus
    if (filters?.isActive !== undefined) params.isActive = filters.isActive.toString()
    
    return apiClient.get<Serial[]>('/products/serials', Object.keys(params).length > 0 ? params : undefined)
  }

  async getSerialById(id: string): Promise<Serial> {
    return apiClient.get<Serial>(`/products/serials/${id}`)
  }

  async getSerialByNumber(serialNumber: string): Promise<Serial> {
    return apiClient.get<Serial>(`/products/serials/number/${serialNumber}`)
  }

  async createSerial(data: CreateSerialDto): Promise<Serial> {
    return apiClient.post<Serial>('/products/serials', data)
  }

  async updateSerial(id: string, data: UpdateSerialDto): Promise<Serial> {
    return apiClient.patch<Serial>(`/products/serials/${id}`, data)
  }

  async deleteSerial(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/serials/${id}`)
  }

  async getSerialsByCustomerEmail(customerEmail: string): Promise<Serial[]> {
    return apiClient.get<Serial[]>(`/products/serials/customer/${customerEmail}`)
  }

  async updateWarrantyStatus(id: string, warrantyStatus: 'active' | 'expired' | 'claimed'): Promise<Serial> {
    return apiClient.patch<Serial>(`/products/serials/${id}/warranty-status`, { warrantyStatus })
  }
}

export const serialsService = new SerialService()