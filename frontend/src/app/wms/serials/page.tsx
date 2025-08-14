'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import SerialForm from '@/components/SerialForm'
import Table from '@/components/Table'
import { mockData } from '@/lib/data'
import { showToast } from '@/lib/toast'
import { useSerials, useCreateSerial, useUpdateSerial, useDeleteSerial } from '@/hooks/useSerials'
import { Serial, SerialFilters } from '@/types/serial'

export default function SerialsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingSerial, setEditingSerial] = useState<Serial | null>(null)
  const [selectedSerial, setSelectedSerial] = useState<Serial | null>(null)

  const filters: SerialFilters = {
    search: searchTerm || undefined,
    warrantyStatus: statusFilter ? statusFilter as 'valid' | 'expired' | 'voided' : undefined,
  }

  const { data: serials = [], isLoading, error, refetch } = useSerials(filters)
  const createSerialMutation = useCreateSerial()
  const updateSerialMutation = useUpdateSerial()
  const deleteSerialMutation = useDeleteSerial()

  if (error) {
    return (
      <Layout title="Quản lý Serial Sản phẩm" notificationCount={2}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
            <button 
              onClick={() => refetch()}
              className="btn btn-primary"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const filteredSerials = serials

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      valid: 'status-badge status-active',
      expired: 'status-badge status-expired',
      voided: 'status-badge status-suspended',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge'
  }

  const getStatusText = (status: string) => {
    const statusTexts = {
      valid: 'Còn bảo hành',
      expired: 'Hết bảo hành',
      voided: 'Hủy bảo hành',
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
    const serial = serials.find(s => s.id === id)
    if (serial) {
      setSelectedSerial(serial)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDeleteSerial = () => {
    if (selectedSerial) {
      deleteSerialMutation.mutate(selectedSerial.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setSelectedSerial(null)
        }
      })
    }
  }

  const handleViewSerial = (id: string) => {
    router.push(`/wms/serials/${id}`)
  }

  const handleFormSubmit = (formData: any) => {
    if (editingSerial) {
      updateSerialMutation.mutate({
        id: editingSerial.id,
        data: {
          serialNumber: formData.serialNumber,
          name: formData.productName,
          model: formData.model,
          description: formData.description,
          category: formData.category,
          warrantyMonths: formData.warrantyMonths,

          manufactureDate: formData.manufactureDate,
          purchaseDate: formData.purchaseDate,
          contractId: formData.contractId,
          warrantyStatus: formData.warrantyStatus,
          notes: formData.notes
        }
      }, {
        onSuccess: () => {
          setIsFormOpen(false)
          setEditingSerial(null)
        }
      })
    } else {
      createSerialMutation.mutate({
        serialNumber: formData.serialNumber,
        name: formData.productName,
        model: formData.model,
        description: formData.description,
        category: formData.category,
        warrantyMonths: formData.warrantyMonths || 24,
        
        manufactureDate: formData.manufactureDate,
        purchaseDate: formData.purchaseDate,
        contractId: formData.contractId,
        warrantyStatus: formData.warrantyStatus || 'valid',
        notes: formData.notes
      }, {
        onSuccess: () => {
          setIsFormOpen(false)
        }
      })
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
                  <option value="valid">Còn bảo hành</option>
                  <option value="expired">Hết bảo hành</option>
                  <option value="voided">Hủy bảo hành</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
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
                    key: 'category',
                    header: 'Danh mục'
                  },
                  {
                    key: 'warrantyMonths',
                    header: 'Bảo hành (tháng)'
                  },
                  {
                    key: 'warrantyStatus',
                    header: 'Trạng thái',
                    render: (status) => (
                      <span className={getStatusBadge(status)}>
                        {getStatusText(status)}
                      </span>
                    )
                  },
                  {
                    key: 'createdAt',
                    header: 'Ngày tạo',
                    render: (_, serial) => serial.createdAt ? formatDate(serial.createdAt) : '-'
                  },
                  {
                    key: 'updatedAt',
                    header: 'Ngày cập nhật',
                    render: (_, serial) => serial.updatedAt ? formatDate(serial.updatedAt) : '-'
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
            )}
          </div>

          <SerialForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false)
              setEditingSerial(null)
            }}
            onSubmit={handleFormSubmit}
            editingSerial={editingSerial}
            contracts={[]}
            isLoading={createSerialMutation.isPending || updateSerialMutation.isPending}
          />

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Bạn có chắc chắn muốn xóa serial này?</p>
                  {selectedSerial && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><strong>Serial Number:</strong> {selectedSerial.serialNumber}</p>
                      <p className="text-sm"><strong>Sản phẩm:</strong> {selectedSerial.productName}</p>
                      <p className="text-sm"><strong>Model:</strong> {selectedSerial.model}</p>
                    </div>
                  )}
                  <p className="text-red-600 text-sm mt-2">
                    <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false)
                      setSelectedSerial(null)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDeleteSerial}
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Xóa serial
                  </button>
                </div>
              </div>
            </div>
          )}
    </Layout>
  )
}
