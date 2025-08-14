export interface Serial {
  id: string
  serialNumber: string
  name: string
  productName: string
  model: string
  description?: string
  category: string
  warrantyMonths: number
  manufactureDate: string
  purchaseDate?: string
  contractId?: string
  warrantyStatus: 'valid' | 'expired' | 'voided'
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSerialDto {
  serialNumber: string
  name: string
  model: string
  description?: string
  category: string
  warrantyMonths: number
  manufactureDate: string
  purchaseDate?: string
  contractId?: string
  warrantyStatus: 'valid' | 'expired' | 'voided'
  notes?: string
}

export interface UpdateSerialDto extends Partial<CreateSerialDto> {}

export interface SerialFilters {
  search?: string
  category?: string
  warrantyStatus?: 'valid' | 'expired' | 'voided'
}

export interface SerialResponse {
  data: Serial[]
  total: number
  page: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}