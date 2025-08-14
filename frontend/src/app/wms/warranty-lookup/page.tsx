'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { productsService } from '@/lib/services/products'
import { Search, HelpCircle, CheckCircle, Clock, AlertCircle, Phone, Mail, Loader2 } from 'lucide-react'
import { showToast } from '@/lib/toast'
import type { WarrantyDetails } from '@/lib/services/products'

export default function CustomerPortalPage() {
  const [serialInput, setSerialInput] = useState('')
  const [searchResult, setSearchResult] = useState<WarrantyDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateSerialNumber = (serial: string): boolean => {
    if (!serial || serial.trim().length === 0) {
      setError('Vui lòng nhập số serial')
      return false
    }
    if (serial.trim().length < 3) {
      setError('Số serial phải có ít nhất 3 ký tự')
      return false
    }
    if (serial.trim().length > 50) {
      setError('Số serial không được vượt quá 50 ký tự')
      return false
    }
    return true
  }

  const handleSearch = async () => {
    const trimmedSerial = serialInput.trim()
    setError(null)
    
    if (!validateSerialNumber(trimmedSerial)) {
      return
    }

    setIsLoading(true)
    setSearchResult(null)
    
    try {
      const warrantyInfo = await productsService.checkWarranty(trimmedSerial)
      
      if (warrantyInfo) {
        setSearchResult(warrantyInfo)
        showToast.success('Tìm thấy thông tin bảo hành')
      } else {
        setSearchResult(null)
        setError('Không tìm thấy thông tin bảo hành cho serial này')
      }
    } catch (error: any) {
      console.error('Error checking warranty:', error)
      setSearchResult(null)
      
      if (error?.response?.status === 404) {
        setError('Không tìm thấy thông tin bảo hành cho serial này')
      } else if (error?.response?.status === 400) {
        setError('Số serial không hợp lệ')
      } else if (error?.response?.status >= 500) {
        setError('Lỗi hệ thống, vui lòng thử lại sau')
      } else {
        setError('Lỗi khi tra cứu thông tin bảo hành')
      }
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
                  className="btn btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSearch}
                  disabled={isLoading || !serialInput.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang tìm...
                    </>
                  ) : (
                    'Tra cứu'
                  )}
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
              
              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Loading Skeleton */}
              {isLoading && (
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               )}
               
               {/* Empty State */}
               {!isLoading && !error && !searchResult && serialInput.trim() === '' && (
                 <div className="mt-8 text-center py-12">
                   <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-600 mb-2">Tra cứu thông tin bảo hành</h3>
                   <p className="text-gray-500">Nhập số serial để kiểm tra thông tin bảo hành sản phẩm</p>
                 </div>
               )}
               
               {/* No Results State */}
               {!isLoading && !error && !searchResult && serialInput.trim() !== '' && (
                 <div className="mt-8 text-center py-12">
                   <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy kết quả</h3>
                   <p className="text-gray-500">Vui lòng kiểm tra lại số serial và thử lại</p>
                 </div>
               )}
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
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.serial.manufacturingDate)}</p>
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
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.warranty.startDate)}</p>
                      </div>
                      <div>
                        <label className="form-label">Ngày kết thúc bảo hành</label>
                        <p className="text-lg font-medium text-gray-900">{formatDate(searchResult.warranty.endDate)}</p>
                      </div>
                      <div>
                        <label className="form-label">Thời gian bảo hành còn lại</label>
                        <p className="text-lg font-medium text-primary-600">{searchResult.serial.warrantyRemaining}</p>
                      </div>
                      <div>
                        <label className="form-label">Trạng thái</label>
                        <span className={`status-badge ${searchResult.warranty.status === 'valid' ? 'status-active' : 'status-expired'}`}>
                      {searchResult.warranty.status === 'valid' ? 'Đang bảo hành' : 'Hết bảo hành'}
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">Điều khoản bảo hành</label>
                        <p className="text-gray-900">{searchResult.contract?.terms}</p>
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
                        <p className="text-lg font-medium text-gray-900">{searchResult.contract?.customerName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="form-label">Số điện thoại</label>
                        <p className="text-lg font-medium text-gray-900">{searchResult.contract?.customerPhone || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">Địa chỉ</label>
                        <p className="text-gray-900">{searchResult.contract?.customerAddress || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repair History */}
                {searchResult.serial.repairHistory && searchResult.serial.repairHistory.length > 0 && (
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
