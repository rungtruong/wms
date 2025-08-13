'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import ContractForm from '@/components/ContractForm'
import Table from '@/components/Table'
import { contractsService } from '@/lib/services/contracts'
import { showToast } from '@/lib/toast'

export default function ContractsPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      setIsLoading(true)
      const data = await contractsService.getAll()
      setContracts(data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
      showToast.error('Lỗi khi tải danh sách hợp đồng')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || contract.status === statusFilter
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
      active: 'Đang hiệu lực',
      expired: 'Hết hạn',
      suspended: 'Tạm dừng',
    }
    return statusTexts[status as keyof typeof statusTexts] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleAddContract = () => {
    setEditingContract(null)
    setIsFormOpen(true)
  }

  const handleEditContract = (id: string) => {
    const contract = contracts.find(c => c.id === id)
    if (contract) {
      setEditingContract(contract)
      setIsFormOpen(true)
    }
  }

  const handleDeleteContract = (id: string) => {
    const contract = contracts.find(c => c.id === id)
    if (contract) {
      setSelectedContract(contract)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDeleteContract = async () => {
    if (selectedContract) {
      try {
        await contractsService.delete(selectedContract.id)
        setContracts(contracts.filter(c => c.id !== selectedContract.id))
        setIsDeleteModalOpen(false)
        setSelectedContract(null)
        showToast.success('Xóa hợp đồng thành công!')
      } catch (error) {
        console.error('Error deleting contract:', error)
        showToast.error('Lỗi khi xóa hợp đồng')
      }
    }
  }

  const handleViewContract = (id: string) => {
    router.push(`/wms/contracts/${id}`)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingContract) {
        // Update existing contract
        const updatedContract = await contractsService.update(editingContract.id, {
          contractNumber: formData.contractNumber,
          customer: {
            name: formData.customerName,
            address: formData.customerAddress,
            phone: formData.customerPhone,
            email: formData.customerEmail
          },
          startDate: formData.startDate,
          endDate: formData.endDate,
          terms: formData.warrantyTerms
        })
        setContracts(contracts.map(contract => 
          contract.id === editingContract.id ? updatedContract : contract
        ))
        showToast.success('Cập nhật hợp đồng thành công!')
      } else {
        // Add new contract
        const newContract = await contractsService.create({
          contractNumber: formData.contractNumber,
          customer: {
            name: formData.customerName,
            address: formData.customerAddress,
            phone: formData.customerPhone,
            email: formData.customerEmail
          },
          products: [],
          startDate: formData.startDate,
          endDate: formData.endDate,
          terms: formData.warrantyTerms
        })
        setContracts([...contracts, newContract])
        showToast.success('Thêm hợp đồng thành công!')
      }
      setIsFormOpen(false)
      setEditingContract(null)
    } catch (error) {
      console.error('Error saving contract:', error)
      showToast.error('Lỗi khi lưu hợp đồng')
    }
  }

  if (isLoading) {
    return (
      <Layout title="Quản lý Hợp đồng Bảo hành" notificationCount={2}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Quản lý Hợp đồng Bảo hành" notificationCount={2}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Hợp đồng Bảo hành</h2>
            </div>
            <button className="btn btn-primary" onClick={handleAddContract}>
              <Plus className="h-4 w-4" />
              Thêm hợp đồng
            </button>
          </div>

          <div className="card">
            {/* Filters */}
            <div className="pb-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hợp đồng..."
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
                  <option value="active">Đang hiệu lực</option>
                  <option value="expired">Hết hạn</option>
                  <option value="suspended">Tạm dừng</option>
                </select>
              </div>
            </div>

            <Table
              columns={[
                {
                  key: 'contractNumber',
                  header: 'Số hợp đồng',
                  className: 'font-medium text-primary-600'
                },
                {
                  key: 'customer',
                  header: 'Khách hàng',
                  render: (_, contract) => (
                    <div>
                      <div className="font-medium text-gray-900">{contract.customerName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{contract.customerEmail || 'N/A'}</div>
                    </div>
                  )
                },
                {
                  key: 'startDate',
                  header: 'Ngày bắt đầu',
                  render: (value) => formatDate(value)
                },
                {
                  key: 'endDate',
                  header: 'Ngày kết thúc',
                  render: (value) => formatDate(value)
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
                  key: 'createdAt',
                  header: 'Ngày tạo',
                  render: (_, contract) => formatDate(contract.createdAt)
                },
                {
                  key: 'updatedAt',
                  header: 'Ngày cập nhật',
                  render: (_, contract) => formatDate(contract.updatedAt)
                },
                {
                  key: 'actions',
                  header: 'Thao tác',
                  render: (_, contract) => (
                    <div className="flex space-x-2">
                      <button 
                        className="btn--icon btn--view"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewContract(contract.id)
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditContract(contract.id)
                        }}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteContract(contract.id)
                        }}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredContracts}
              emptyMessage="Không tìm thấy hợp đồng nào phù hợp với tiêu chí tìm kiếm."
            />
          </div>

          <ContractForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            editingContract={editingContract}
          />

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Bạn có chắc chắn muốn xóa hợp đồng này?</p>
                  {selectedContract && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><strong>Số hợp đồng:</strong> {selectedContract.contractNumber}</p>
                      <p className="text-sm"><strong>Khách hàng:</strong> {selectedContract.customerName || 'N/A'}</p>
                      <p className="text-sm"><strong>Thời hạn:</strong> {formatDate(selectedContract.startDate)} - {formatDate(selectedContract.endDate)}</p>
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
                      setSelectedContract(null)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmDeleteContract}
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Xóa hợp đồng
                  </button>
                </div>
              </div>
            </div>
          )}
    </Layout>
  )
}
