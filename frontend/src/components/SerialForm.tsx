import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from '@/lib/toast'

interface SerialFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (serialData: any) => void
  editingSerial?: any
  contracts: any[]
}

export default function SerialForm({ isOpen, onClose, onSubmit, editingSerial, contracts }: SerialFormProps) {
  const [formData, setFormData] = useState({
    serialNumber: '',
    productName: '',
    model: '',
    manufactureDate: '',
    contractId: ''
  })

  useEffect(() => {
    if (editingSerial) {
      setFormData({
        serialNumber: editingSerial.serialNumber,
        productName: editingSerial.productName,
        model: editingSerial.model,
        manufactureDate: editingSerial.manufactureDate || '',
        contractId: editingSerial.contractId || ''
      })
    } else {
      setFormData({
        serialNumber: '',
        productName: '',
        model: '',
        manufactureDate: '',
        contractId: ''
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
    
    if (!formData.productName.trim()) {
      showToast.error('Vui lòng nhập tên sản phẩm')
      return
    }
    
    if (!formData.model.trim()) {
      showToast.error('Vui lòng nhập model sản phẩm')
      return
    }
    
    if (!formData.contractId) {
      showToast.error('Vui lòng chọn hợp đồng')
      return
    }
    
    onSubmit(formData)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
              name="productName"
              value={formData.productName}
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
                  {contract.contractNumber} - {contract.customer.name}
                </option>
              ))}
            </select>
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
          >
            {editingSerial ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
