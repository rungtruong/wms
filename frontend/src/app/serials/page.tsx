'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import SerialForm from '@/components/SerialForm'
import Table from '@/components/Table'
import { mockData } from '@/lib/data'

export default function SerialsPage() {
  const [serials, setSerials] = useState(mockData.serials)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSerial, setEditingSerial] = useState(null)

  const filteredSerials = serials.filter(serial => {
    const matchesSearch = serial.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serial.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || serial.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'status-badge status-active',
      expired: 'status-badge status-expired',
      suspended: 'status-badge status-processing',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge'
  }

  const getStatusText = (status: string) => {
    const statusTexts = {
      active: 'Đang bảo hành',
      expired: 'Hết bảo hành',
      suspended: 'Tạm dừng',
    }
    return statusTexts[status as keyof typeof statusTexts] || status
  }

  const handleAddSerial = () => {
    setEditingSerial(null)
    setIsFormOpen(true)
  }

  const handleEditSerial = (id: string) => {
    const serial = serials.find(s => s.id === id)
    if (serial) {
      setEditingSerial(serial)
      setIsFormOpen(true)
    }
  }

  const handleDeleteSerial = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa serial này?')) {
      setSerials(serials.filter(s => s.id !== id))
      alert('Xóa serial thành công!')
    }
  }

  const handleViewSerial = (id: string) => {
    const serial = serials.find(s => s.id === id)
    if (serial) {
      alert(`Serial: ${serial.serialNumber}\nSản phẩm: ${serial.productName}\nModel: ${serial.model}\nTrạng thái: ${getStatusText(serial.status)}\nBảo hành còn lại: ${serial.warrantyRemaining}`)
    }
  }

  const handleFormSubmit = (formData: any) => {
    if (editingSerial) {
      // Update existing serial
      setSerials(serials.map(serial => 
        serial.id === editingSerial.id 
          ? {
              ...serial,
              serialNumber: formData.serialNumber,
              productName: formData.productName,
              model: formData.model,
              manufactureDate: formData.manufactureDate,
              contractId: formData.contractId
            }
          : serial
      ))
      alert('Cập nhật serial thành công!')
    } else {
      // Add new serial
      const newSerial = {
        id: `S${String(Date.now()).slice(-3)}`,
        serialNumber: formData.serialNumber,
        productName: formData.productName,
        model: formData.model,
        manufactureDate: formData.manufactureDate,
        contractId: formData.contractId,
        warrantyRemaining: '24 tháng',
        status: 'active' as const,
        repairHistory: []
      }
      setSerials([...serials, newSerial])
      alert('Thêm serial thành công!')
    }
  }

  return (
    <Layout title="Quản lý Serial Sản phẩm" notificationCount={2}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Serial Sản phẩm</h2>
            </div>
            <button className="btn btn-primary" onClick={handleAddSerial}>
              <Plus className="h-4 w-4" />
              Thêm serial
            </button>
          </div>

          <div className="card">
            <div className="pb-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm serial..."
                    className="form-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-input sm:w-48"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang bảo hành</option>
                  <option value="expired">Hết bảo hành</option>
                  <option value="suspended">Tạm dừng</option>
                </select>
              </div>
            </div>

            <Table
              columns={[
                {
                  key: 'serialNumber',
                  header: 'Serial Number',
                  className: 'font-medium text-primary-600'
                },
                {
                  key: 'productName',
                  header: 'Sản phẩm'
                },
                {
                  key: 'model',
                  header: 'Model'
                },
                {
                  key: 'warrantyRemaining',
                  header: 'Bảo hành còn lại'
                },
                {
                  key: 'status',
                  header: 'Trạng thái',
                  render: (status) => (
                    <span className={getStatusBadge(status)}>
                      {getStatusText(status)}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  header: 'Thao tác',
                  render: (_, serial) => (
                    <div className="flex space-x-2">
                      <button 
                        className="btn--icon btn--view"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewSerial(serial.id)
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditSerial(serial.id)
                        }}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSerial(serial.id)
                        }}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredSerials}
              emptyMessage="Không tìm thấy serial nào phù hợp với tiêu chí tìm kiếm."
            />
          </div>

          <SerialForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            editingSerial={editingSerial}
            contracts={mockData.contracts}
          />
    </Layout>
  )
}
