import { apiClient } from '../api'

export interface WarrantyDetails {
  serial: {
    serialNumber: string
    productName: string
    model: string
    manufacturingDate: string
    purchaseDate: string
    warrantyRemaining: string
    status: string
    repairHistory: any[]
  }
  contract: {
    contractNumber: string
    startDate: string
    endDate: string
    terms: string
  } | null
  warranty: {
    isValid: boolean
    status: string
    startDate: string
    endDate: string
    daysRemaining: number
  }
}

export interface WarrantyRequestData {
  serialNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  issue: string
  description: string
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string
}

export interface WarrantyRequestResponse {
  message: string
  ticket: {
    id: string
    ticketNumber: string
    status: string
    priority: string
    createdAt: string
  }
}

class CustomerPortalService {

  async checkWarranty(serialNumber: string): Promise<WarrantyDetails> {
    const encodedSerial = encodeURIComponent(serialNumber);
    return apiClient.get<WarrantyDetails>(`/products/serials/warranty/${encodedSerial}`)
  }

  async createWarrantyRequest(data: WarrantyRequestData): Promise<WarrantyRequestResponse> {
    return apiClient.post<WarrantyRequestResponse>('/products/serials/warranty-request', data)
  }
}

export const customerPortalService = new CustomerPortalService()