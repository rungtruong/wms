'use client'

import { useState } from 'react'
import { Search, FileText, Phone, Mail, MapPin, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { showToast } from '@/lib/toast'
import { WMSLogo } from '@/components/Logo'
import { customerPortalService, type WarrantyDetails } from '@/lib/services/customer-portal'

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState('lookup')
  const [lookupSerial, setLookupSerial] = useState('')
  const [lookupResult, setLookupResult] = useState<WarrantyDetails | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [isLooking, setIsLooking] = useState(false)
  
  const [ticketForm, setTicketForm] = useState({
    serialNumber: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    issue: '',
    description: ''
  })
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLookup = async () => {
    if (!lookupSerial.trim()) {
      setLookupError('Vui lòng nhập số serial')
      setLookupResult(null)
      return
    }

    setIsLooking(true)
    setLookupError(null)
    
    try {
      const warrantyDetails = await customerPortalService.checkWarranty(lookupSerial.trim())
      setLookupResult(warrantyDetails)
      setLookupError(null)
    } catch (error: any) {
      setLookupResult(null)
      if (error.status === 404) {
        setLookupError(`Không tìm thấy thông tin bảo hành cho serial "${lookupSerial.trim()}"`)
      } else {
        setLookupError(error.message || 'Có lỗi xảy ra khi tra cứu thông tin bảo hành')
      }
    } finally {
      setIsLooking(false)
    }
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ticketForm.serialNumber || !ticketForm.customerName || !ticketForm.customerPhone || !ticketForm.issue) {
      setTicketError('Vui lòng điền đầy đủ thông tin bắt buộc')
      setTicketSuccess(null)
      return
    }

    setIsSubmitting(true)
    setTicketError(null)
    setTicketSuccess(null)
    
    try {
      const response = await customerPortalService.createWarrantyRequest({
        serialNumber: ticketForm.serialNumber,
        customerName: ticketForm.customerName,
        customerPhone: ticketForm.customerPhone,
        customerEmail: ticketForm.customerEmail || undefined,
        issue: ticketForm.issue,
        description: ticketForm.description,
        priority: 'medium'
      })
      
      setTicketSuccess(`Yêu cầu bảo hành đã được gửi thành công! Mã yêu cầu: ${response.ticket.ticketNumber}`)
      
      setTicketForm({
        serialNumber: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        issue: '',
        description: ''
      })
    } catch (error: any) {
      if (error.status === 404) {
        setTicketError('Không tìm thấy serial number này trong hệ thống')
      } else if (error.status === 401) {
        setTicketError('Bạn cần đăng nhập để gửi yêu cầu bảo hành')
      } else {
        setTicketError(error.message || 'Có lỗi xảy ra khi gửi yêu cầu bảo hành')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (isValid) => {
    if (isValid) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusText = (warranty: WarrantyDetails['warranty']) => {
    if (warranty.isValid) {
      if (warranty.daysRemaining > 30) return 'Còn hiệu lực'
      return `Sắp hết hạn (${warranty.daysRemaining} ngày)`
    }
    return 'Hết hạn'
  }

  const getStatusColor = (warranty: WarrantyDetails['warranty']) => {
    if (warranty.isValid) {
      if (warranty.daysRemaining > 30) return 'text-green-600 bg-green-50'
      return 'text-orange-600 bg-orange-50'
    }
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <WMSLogo variant="mark" className="h-10 w-10 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tra cứu Bảo hành</h1>
                <p className="text-sm text-gray-600">Kiểm tra thông tin và gửi yêu cầu bảo hành</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Hỗ trợ khách hàng</p>
              <p className="text-lg font-semibold text-teal-600">1900-xxxx</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('lookup')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'lookup'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="h-4 w-4 inline mr-2" />
                Tra cứu Bảo hành
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'ticket'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Gửi Yêu cầu Bảo hành
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'lookup' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Tra cứu thông tin bảo hành</h2>
                  <p className="text-gray-600 mb-6">Nhập số serial của sản phẩm để kiểm tra thông tin bảo hành</p>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nhập số serial (VD: DL15-2024-001234)"
                        value={lookupSerial}
                        onChange={(e) => {
                          setLookupSerial(e.target.value)
                          if (lookupError) setLookupError(null)
                        }}
                        className="form-input w-full"
                        onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                      />
                    </div>
                    <button
                      onClick={handleLookup}
                      disabled={isLooking}
                      className="btn btn-primary px-6"
                    >
                      {isLooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang tìm...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Tra cứu
                        </>
                      )}
                    </button>
                  </div>
                  
                  {lookupError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{lookupError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {lookupResult && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin Bảo hành</h3>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lookupResult.warranty)}`}>
                      {getStatusIcon(lookupResult.warranty.isValid)}
                      <span className="ml-2">{getStatusText(lookupResult.warranty)}</span>
                    </div>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                          <p className="text-gray-900">{lookupResult.serial.productName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                          <p className="text-gray-900">{lookupResult.serial.model}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Số Serial</label>
                          <p className="text-gray-900 font-mono">{lookupResult.serial.serialNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bảo hành còn lại</label>
                          <p className="text-gray-900">{lookupResult.serial.warrantyRemaining}</p>
                        </div>
                      </div>

                      {lookupResult.contract && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
                            <p className="text-gray-900">{lookupResult.contract.customer.name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                            <p className="text-gray-900">{new Date(lookupResult.contract.startDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                            <p className="text-gray-900">{new Date(lookupResult.contract.endDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số hợp đồng</label>
                            <p className="text-gray-900">{lookupResult.contract.contractNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ticket' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gửi yêu cầu bảo hành</h2>
                  <p className="text-gray-600 mb-6">Điền thông tin chi tiết để gửi yêu cầu bảo hành cho sản phẩm của bạn</p>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số Serial <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.serialNumber}
                        onChange={(e) => {
                          setTicketForm({...ticketForm, serialNumber: e.target.value})
                          if (ticketError) setTicketError(null)
                        }}
                        className="form-input w-full"
                        placeholder="VD: DL15-2024-001234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.customerName}
                        onChange={(e) => {
                          setTicketForm({...ticketForm, customerName: e.target.value})
                          if (ticketError) setTicketError(null)
                        }}
                        className="form-input w-full"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={ticketForm.customerPhone}
                        onChange={(e) => {
                          setTicketForm({...ticketForm, customerPhone: e.target.value})
                          if (ticketError) setTicketError(null)
                        }}
                        className="form-input w-full"
                        placeholder="0901234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={ticketForm.customerEmail}
                        onChange={(e) => setTicketForm({...ticketForm, customerEmail: e.target.value})}
                        className="form-input w-full"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vấn đề gặp phải <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={ticketForm.issue}
                      onChange={(e) => {
                        setTicketForm({...ticketForm, issue: e.target.value})
                        if (ticketError) setTicketError(null)
                      }}
                      className="form-input w-full"
                    >
                      <option value="">Chọn loại vấn đề</option>
                      <option value="hardware">Lỗi phần cứng</option>
                      <option value="software">Lỗi phần mềm</option>
                      <option value="performance">Hiệu suất kém</option>
                      <option value="display">Lỗi màn hình</option>
                      <option value="battery">Lỗi pin</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      rows={4}
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      className="form-input w-full"
                      placeholder="Mô tả chi tiết về vấn đề bạn gặp phải..."
                    />
                  </div>

                  {ticketError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{ticketError}</p>
                      </div>
                    </div>
                  )}
                  
                  {ticketSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700">{ticketSuccess}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Gửi yêu cầu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
