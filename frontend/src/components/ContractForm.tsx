import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from '@/lib/toast'

interface ContractFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contractData: any) => void
  editingContract?: any
}

export default function ContractForm({ isOpen, onClose, onSubmit, editingContract }: ContractFormProps) {
  const [formData, setFormData] = useState({
    contractNumber: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    startDate: '',
    endDate: '',
    warrantyTerms: ''
  })

  useEffect(() => {
    if (editingContract) {
      setFormData({
        contractNumber: editingContract.contractNumber,
        customerName: editingContract.customer.name,
        customerAddress: editingContract.customer.address,
        customerPhone: editingContract.customer.phone,
        customerEmail: editingContract.customer.email,
        startDate: editingContract.startDate,
        endDate: editingContract.endDate,
        warrantyTerms: editingContract.terms || ''
      })
    } else {
      setFormData({
        contractNumber: '',
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerEmail: '',
        startDate: '',
        endDate: '',
        warrantyTerms: ''
      })
    }
  }, [editingContract, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.contractNumber.trim()) {
      showToast.error('Vui lòng nhập số hợp đồng')
      return
    }
    
    if (!formData.customerName.trim()) {
      showToast.error('Vui lòng nhập tên khách hàng')
      return
    }
    
    if (!formData.customerPhone.trim()) {
      showToast.error('Vui lòng nhập số điện thoại')
      return
    }
    
    if (!formData.startDate) {
      showToast.error('Vui lòng chọn ngày bắt đầu')
      return
    }
    
    if (!formData.endDate) {
      showToast.error('Vui lòng chọn ngày kết thúc')
      return
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showToast.error('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }
    
    onSubmit(formData)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingContract ? 'Sửa Hợp đồng Bảo hành' : 'Thêm Hợp đồng Bảo hành'}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số hợp đồng *
            </label>
            <input
              type="text"
              name="contractNumber"
              value={formData.contractNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập số hợp đồng..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khách hàng *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập tên khách hàng..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ *
            </label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Nhập địa chỉ khách hàng..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập số điện thoại..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className="form-input"
              placeholder="Nhập email khách hàng..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điều khoản bảo hành
            </label>
            <textarea
              name="warrantyTerms"
              value={formData.warrantyTerms}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Nhập điều khoản bảo hành..."
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
          >
            {editingContract ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
