'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { productsService } from '@/lib/services/products'
import { Search, HelpCircle, CheckCircle, Clock, AlertCircle, Phone, Mail } from 'lucide-react'
import { showToast } from '@/lib/toast'

export default function CustomerPortalPage() {
  const [serialInput, setSerialInput] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!serialInput.trim()) return

    setIsLoading(true)
    
    try {
      const warrantyInfo = await productsService.checkWarranty(serialInput.trim())
      
      if (warrantyInfo) {
        setSearchResult(warrantyInfo)
      } else {
        setSearchResult(null)
        showToast.error('Không tìm thấy thông tin bảo hành cho serial này')
      }
    } catch (error) {
      console.error('Error checking warranty:', error)
      setSearchResult(null)
      showToast.error('Lỗi khi tra cứu thông tin bảo hành')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <Layout title="Tra cứu Thông tin Bảo hành">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tra cứu Thông tin Bảo hành</h2>
              <p className="text-lg text-gray-600">Nhập số serial sản phẩm để kiểm tra thông tin bảo hành của bạn</p>
            </div>

            {/* Search Form */}
            <div className="card p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nhập serial number..."
                    className="form-input pl-10 text-lg py-3"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button 
                  className="btn btn-primary px-8 py-3 text-lg"
                  onClick={handleSearch}
                  disabled={isLoading || !serialInput.trim()}
                >
                  {isLoading ? 'Đang tìm...' : 'Tra cứu'}
                </button>
              </div>

              {/* Guidance */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium text-gray-900">Hướng dẫn tra cứu</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Serial number thường được in trên nhãn phía sau hoặc dưới đáy sản phẩm</p>
                  <p>• Nhập đầy đủ và chính xác số serial, bao gồm cả dấu gạch ngang (-) nếu có</p>
                  <p>• Ví dụ: DL15-2024-001234, IP15-2024-005678</p>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {searchResult && (
              <div className="space-y-6">
                {/* Product Information */}
                <div className="card">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin Sản phẩm</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Tên sản phẩm</label>
                        <p className="text-lg font-medium text-gray-900">{searchResult.serial.productName}</p>
                      </div>
                      <div>
                        <label className="form-label">Model</label>
                        <p className="text-lg font-medium text-gray-900">{searchResult.serial.model}</p>
                      </div>
                      <div>
                        <label className="form-label">Serial Number</label>
                        <p className="text-lg font-mono font-medium text-primary-600">{searchResult.serial.serialNumber}</p>
                      </div>
                      <div>
                        <label className="form-label">Ngày sản xuất</label>
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.serial.manufactureDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warranty Information */}
                <div className="card">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin Bảo hành</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Ngày bắt đầu bảo hành</label>
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.contract.startDate)}</p>
                      </div>
                      <div>
                        <label className="form-label">Ngày kết thúc bảo hành</label>
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.contract.endDate)}</p>
                      </div>
                      <div>
                        <label className="form-label">Thời gian bảo hành còn lại</label>
                        <p className="text-lg font-medium text-primary-600">{searchResult.serial.warrantyRemaining}</p>
                      </div>
                      <div>
                        <label className="form-label">Trạng thái</label>
                        <span className={`status-badge ${searchResult.serial.status === 'active' ? 'status-active' : 'status-expired'}`}>
                          {searchResult.serial.status === 'active' ? 'Đang bảo hành' : 'Hết bảo hành'}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">Điều khoản bảo hành</label>
                        <p className="text-gray-900">{searchResult.contract.terms}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="card">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Thông tin Khách hàng</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Tên khách hàng</label>
                        <p className="text-lg font-medium text-gray-900">{searchResult.contract.customer.name}</p>
                      </div>
                      <div>
                        <label className="form-label">Số điện thoại</label>
                        <p className="text-lg font-medium text-gray-900">{searchResult.contract.customer.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">Địa chỉ</label>
                        <p className="text-gray-900">{searchResult.contract.customer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repair History */}
                {searchResult.serial.repairHistory.length > 0 && (
                  <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900">Lịch sử Sửa chữa</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {searchResult.serial.repairHistory.map((repair: any, index: number) => (
                          <div key={index} className="border-l-4 border-primary-500 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{repair.issue}</h4>
                              <span className="text-sm text-gray-500">{formatDate(repair.date)}</span>
                            </div>
                            <p className="text-gray-600 mb-1">{repair.solution}</p>
                            <p className="text-sm text-gray-500">Kỹ thuật viên: {repair.technician}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchResult === null && serialInput && !isLoading && (
              <div className="card p-8 text-center">
                <div className="text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thông tin</h3>
                  <p className="mb-4">Serial number "{serialInput}" không tồn tại trong hệ thống hoặc chưa được đăng ký bảo hành.</p>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Vui lòng kiểm tra lại số serial hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
                  </div>
                </div>
              </div>
            )}


          </div>
    </Layout>
  )
}
