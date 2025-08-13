'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import ContractForm from '@/components/ContractForm'
import ConfirmationModal from '@/components/ConfirmationModal'
import Table from '@/components/Table'
import { mockData } from '@/lib/data'
import { showToast } from '@/lib/toast'

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockData.contracts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<string | null>(null)

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setContractToDelete(id)
    setIsConfirmModalOpen(true)
  }

  const confirmDeleteContract = () => {
    if (contractToDelete) {
      setContracts(contracts.filter(c => c.id !== contractToDelete))
      showToast.success('Xóa hợp đồng thành công!')
      setContractToDelete(null)
    }
  }

  const handleViewContract = (id: string) => {
    const contract = contracts.find(c => c.id === id)
    if (contract) {
      showToast.info(`Hợp đồng: ${contract.contractNumber} - Khách hàng: ${contract.customer.name} - Trạng thái: ${getStatusText(contract.status)}`)
    }
  }

  const handleFormSubmit = (formData: any) => {
    if (editingContract) {
      // Update existing contract
      setContracts(contracts.map(contract => 
        contract.id === editingContract.id 
          ? {
              ...contract,
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
            }
          : contract
      ))
      showToast.success('Cập nhật hợp đồng thành công!')
    } else {
      // Add new contract
      const newContract = {
        id: `WC${String(Date.now()).slice(-3)}`,
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
        terms: formData.warrantyTerms,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      }
      setContracts([...contracts, newContract])
      showToast.success('Thêm hợp đồng thành công!')
    }
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
                      <div className="font-medium text-gray-900">{contract.customer.name}</div>
                      <div className="text-sm text-gray-500">{contract.customer.email}</div>
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

          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={confirmDeleteContract}
            title="Bạn có chắc chắn muốn xóa hợp đồng này?"
            message="Hành động này không thể hoàn tác."
            confirmText="Xóa"
            cancelText="Hủy"
            type="danger"
          />
    </Layout>
  )
}
