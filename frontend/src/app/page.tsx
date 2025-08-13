'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle, Clock, Wrench } from 'lucide-react'
import Layout from '@/components/Layout'
import { WarrantyRequestsChart, ProductFailuresChart } from '@/components/Charts'
import Table from '@/components/Table'
import { mockData } from '@/lib/data'

export default function Dashboard() {
  const [data, setData] = useState(mockData)

  const stats = [
    {
      name: 'Tổng hợp đồng',
      value: data.statistics.totalContracts,
      icon: FileText,
      color: 'text-teal-500', // --color-primary
      bgColor: 'bg-bg-1',
    },
    {
      name: 'Đang hiệu lực',
      value: data.statistics.activeContracts,
      icon: CheckCircle,
      color: 'text-teal-500', // --color-success
      bgColor: 'bg-bg-3',
    },
    {
      name: 'Sắp hết hạn',
      value: data.statistics.expiringThisMonth,
      icon: Clock,
      color: 'text-orange-500', // --color-warning
      bgColor: 'bg-bg-2',
    },
    {
      name: 'Yêu cầu chờ xử lý',
      value: data.statistics.pendingRequests,
      icon: Wrench,
      color: 'text-red-500', // --color-error
      bgColor: 'bg-bg-4',
    },
  ]

  const recentRequests = data.warrantyRequests.slice(0, 5)

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      received: 'status-badge status-received',
      validated: 'status-badge status-processing',
      processing: 'status-badge status-processing',
      completed: 'status-badge status-completed',
    }
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <Layout title="Tổng quan hệ thống">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-surface border border-card rounded-xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-xs text-slate-500 m-0">{stat.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê yêu cầu bảo hành</h3>
              <div className="h-64">
                <WarrantyRequestsChart />
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm lỗi nhiều nhất</h3>
              <div className="h-64">
                <ProductFailuresChart data={data.statistics.topFailingProducts} />
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="card">
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Yêu cầu bảo hành gần đây</h3>
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
                  key: 'issue',
                  header: 'Sản phẩm'
                },
                {
                  key: 'status',
                  header: 'Trạng thái',
                  render: (status) => (
                    <span className={getStatusBadge(status)}>
                      {status === 'received' && 'Tiếp nhận'}
                      {status === 'validated' && 'Đã kiểm tra'}
                      {status === 'processing' && 'Đang xử lý'}
                      {status === 'completed' && 'Hoàn thành'}
                    </span>
                  )
                },
                {
                  key: 'createdAt',
                  header: 'Ngày tạo',
                  render: (value) => formatDate(value)
                }
              ]}
              data={recentRequests}
              emptyMessage="Không có yêu cầu bảo hành nào."
            />
          </div>
    </Layout>
  )
}
