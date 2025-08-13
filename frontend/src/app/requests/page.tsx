'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import Table from '@/components/Table'
import { mockData } from '@/lib/data'

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockData.warrantyRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.issue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      received: 'status-badge status-received',
      validated: 'status-badge status-processing',
      processing: 'status-badge status-processing',
      completed: 'status-badge status-completed',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge'
  }

  const getStatusText = (status: string) => {
    const statusTexts = {
      received: 'Tiếp nhận',
      validated: 'Đã kiểm tra',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
    }
    return statusTexts[status as keyof typeof statusTexts] || status
  }

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      high: 'status-badge priority-high',
      medium: 'status-badge priority-medium',
      low: 'status-badge priority-low',
    }
    return priorityClasses[priority as keyof typeof priorityClasses] || 'status-badge'
  }

  const getPriorityText = (priority: string) => {
    const priorityTexts = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
    }
    return priorityTexts[priority as keyof typeof priorityTexts] || priority
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleEditRequest = (id: string) => {
    const request = requests.find(r => r.id === id)
    if (request) {
      alert(`Chỉnh sửa yêu cầu: ${request.ticketNumber}\nKhách hàng: ${request.customerName}`)
    }
  }

  const handleDeleteRequest = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      setRequests(requests.filter(r => r.id !== id))
      alert('Xóa yêu cầu thành công!')
    }
  }

  const handleViewRequest = (id: string) => {
    const request = requests.find(r => r.id === id)
    if (request) {
      alert(`Yêu cầu: ${request.ticketNumber}\nKhách hàng: ${request.customerName}\nVấn đề: ${request.issue}\nMức độ: ${getPriorityText(request.priority)}\nTrạng thái: ${getStatusText(request.status)}`)
    }
  }

  return (
    <Layout title="Quản lý Yêu cầu Bảo hành" notificationCount={2}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý Yêu cầu Bảo hành</h2>
            </div>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4" />
              Tạo yêu cầu
            </button>
          </div>

          <div className="card">
            <div className="pb-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm yêu cầu..."
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
                  <option value="received">Tiếp nhận</option>
                  <option value="validated">Đã kiểm tra</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>
            </div>

            <Table
              columns={[
                {
                  key: 'ticketNumber',
                  header: 'Mã yêu cầu',
                  className: 'font-medium text-primary-600'
                },
                {
                  key: 'customerName',
                  header: 'Khách hàng'
                },
                {
                  key: 'serialNumber',
                  header: 'Serial',
                  className: 'font-mono text-sm'
                },
                {
                  key: 'issue',
                  header: 'Vấn đề',
                  render: (_, request) => (
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900">{request.issue}</div>
                      <div className="text-sm text-gray-500 truncate">{request.description}</div>
                    </div>
                  )
                },
                {
                  key: 'priority',
                  header: 'Mức độ',
                  render: (priority) => (
                    <span className={getPriorityBadge(priority)}>
                      {getPriorityText(priority)}
                    </span>
                  )
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
                  render: (_, request) => (
                    <div className="flex space-x-2">
                      <button 
                        className="btn--icon btn--view"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewRequest(request.id)
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditRequest(request.id)
                        }}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="btn--icon btn--delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRequest(request.id)
                        }}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredRequests}
              emptyMessage="Không tìm thấy yêu cầu nào phù hợp với tiêu chí tìm kiếm."
            />
          </div>
    </Layout>
  )
}
