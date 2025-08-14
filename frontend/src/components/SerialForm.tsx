import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from '@/lib/toast'
import { Serial, CreateSerialDto } from '@/types/serial'

interface SerialFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (serialData: CreateSerialDto) => void
  editingSerial?: Serial
  contracts: any[]
  isLoading?: boolean
}

export default function SerialForm({ isOpen, onClose, onSubmit, editingSerial, contracts, isLoading = false }: SerialFormProps) {
  const [formData, setFormData] = useState({
    serialNumber: '',
    name: '',
    model: '',
    description: '',
    category: '',
    warrantyMonths: 12,
    isActive: true,
    manufactureDate: '',
    purchaseDate: '',
    contractId: '',
    warrantyStatus: 'active' as 'active' | 'expired' | 'claimed' | 'suspended',
    notes: ''
  })

  useEffect(() => {
    if (editingSerial) {
      setFormData({
        serialNumber: editingSerial.serialNumber,
        name: editingSerial.productName || editingSerial.name,
        model: editingSerial.model,
        description: editingSerial.description || '',
        category: editingSerial.category,
        warrantyMonths: editingSerial.warrantyMonths,
        isActive: editingSerial.isActive,
        manufactureDate: editingSerial.manufactureDate,
        purchaseDate: editingSerial.purchaseDate || '',
        contractId: editingSerial.contractId || '',
        warrantyStatus: editingSerial.warrantyStatus || 'active',
        notes: editingSerial.notes || ''
      })
    } else {
      setFormData({
        serialNumber: '',
        name: '',
        model: '',
        description: '',
        category: '',
        warrantyMonths: 12,
        isActive: true,
        manufactureDate: '',
        purchaseDate: '',
        contractId: '',
        warrantyStatus: 'active' as 'active' | 'expired' | 'claimed' | 'suspended',
        notes: ''
      })
    }
  }, [editingSerial, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.serialNumber.trim()) {
      showToast.error('Vui lòng nhập số serial')
      return
    }
    
    if (!formData.name.trim()) {
      showToast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    
    if (!formData.category.trim()) {
      showToast.error('Vui lòng nhập danh mục sản phẩm')
      return
    }
    
    if (!formData.model.trim()) {
      showToast.error('Vui lòng nhập model sản phẩm')
      return
    }
    

    
    onSubmit(formData)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingSerial ? 'Sửa Serial Sản phẩm' : 'Thêm Serial Sản phẩm'}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number *
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập serial number..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập tên sản phẩm..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập model sản phẩm..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập mô tả sản phẩm..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập danh mục sản phẩm..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian bảo hành (tháng) *
            </label>
            <input
              type="number"
              name="warrantyMonths"
              value={formData.warrantyMonths}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập số tháng bảo hành..."
              min="1"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">
              Kích hoạt
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sản xuất
            </label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày mua
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái bảo hành
            </label>
            <select
              name="warrantyStatus"
              value={formData.warrantyStatus}
              onChange={handleChange}
              className="form-input"
            >
              <option value="active">Đang bảo hành</option>
              <option value="expired">Hết bảo hành</option>
              <option value="claimed">Đã bảo hành</option>
              <option value="suspended">Tạm ngưng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hợp đồng bảo hành
            </label>
            <select
              name="contractId"
              value={formData.contractId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Chọn hợp đồng</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.contractNumber} - {contract.customerName || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập ghi chú..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingSerial ? 'Đang cập nhật...' : 'Đang thêm...'}
              </>
            ) : (
              editingSerial ? 'Cập nhật' : 'Thêm mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
