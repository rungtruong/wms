export interface Serial {
  id: string
  serialNumber: string
  name: string
  productName: string
  model: string
  description?: string
  category: string
  warrantyMonths: number
  isActive: boolean
  manufactureDate: string
  purchaseDate?: string
  contractId?: string
  warrantyStatus: 'active' | 'expired' | 'claimed' | 'suspended'
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
  isActive: boolean
  manufactureDate: string
  purchaseDate?: string
  contractId?: string
  warrantyStatus: 'active' | 'expired' | 'claimed' | 'suspended'
  notes?: string
}

export interface UpdateSerialDto extends Partial<CreateSerialDto> {}

export interface SerialFilters {
  search?: string
  category?: string
  warrantyStatus?: 'active' | 'expired' | 'claimed' | 'suspended'
  isActive?: boolean
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