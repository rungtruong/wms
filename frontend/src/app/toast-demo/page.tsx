'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { showToast } from '@/lib/toast'

export default function ToastDemoPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSuccessToast = () => {
    showToast.success('Thao tác thành công!')
  }

  const handleErrorToast = () => {
    showToast.error('Có lỗi xảy ra, vui lòng thử lại!')
  }

  const handleInfoToast = () => {
    showToast.info('Thông tin quan trọng cần lưu ý')
  }

  const handleWarningToast = () => {
    showToast.warning('Cảnh báo: Hãy kiểm tra lại thông tin')
  }

  const handleLoadingToast = () => {
    const toastId = showToast.loading('Đang xử lý...')
    setTimeout(() => {
      showToast.success('Hoàn thành!')
    }, 2000)
  }

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Thành công!')
        } else {
          reject('Thất bại!')
        }
      }, 2000)
    })

    showToast.promise(promise, {
      loading: 'Đang xử lý yêu cầu...',
      success: 'Yêu cầu đã được xử lý thành công!',
      error: 'Có lỗi xảy ra khi xử lý yêu cầu!'
    })
  }

  const handleAsyncAction = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      showToast.success('Tải dữ liệu thành công!')
    } catch (error) {
      showToast.error('Không thể tải dữ liệu!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Demo Toast Notifications" notificationCount={2}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Toast Notifications</h2>
        <p className="text-gray-600">Các loại thông báo đã được tích hợp vào hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Toast Cơ Bản</h3>
          <div className="space-y-3">
            <button 
              onClick={handleSuccessToast}
              className="btn btn-success w-full"
            >
              Success Toast
            </button>
            <button 
              onClick={handleErrorToast}
              className="btn btn-error w-full"
            >
              Error Toast
            </button>
            <button 
              onClick={handleInfoToast}
              className="btn btn-secondary w-full"
            >
              Info Toast
            </button>
            <button 
              onClick={handleWarningToast}
              className="btn btn-warning w-full"
            >
              Warning Toast
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Toast Nâng Cao</h3>
          <div className="space-y-3">
            <button 
              onClick={handleLoadingToast}
              className="btn btn-primary w-full"
            >
              Loading Toast
            </button>
            <button 
              onClick={handlePromiseToast}
              className="btn btn-primary w-full"
            >
              Promise Toast
            </button>
            <button 
              onClick={handleAsyncAction}
              disabled={isLoading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Đang tải...' : 'Async Action'}
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ứng Dụng Thực Tế</h3>
          <div className="space-y-3">
            <button 
              onClick={() => showToast.success('Lưu hợp đồng thành công!')}
              className="btn btn-success w-full"
            >
              Lưu Hợp Đồng
            </button>
            <button 
              onClick={() => showToast.warning('Hợp đồng sắp hết hạn!')}
              className="btn btn-warning w-full"
            >
              Cảnh Báo Hết Hạn
            </button>
            <button 
              onClick={() => showToast.error('Không thể xóa hợp đồng đang sử dụng!')}
              className="btn btn-error w-full"
            >
              Lỗi Xóa
            </button>
            <button 
              onClick={() => showToast.info('Đã gửi email thông báo cho khách hàng')}
              className="btn btn-secondary w-full"
            >
              Gửi Email
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hướng Dẫn Sử Dụng</h3>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Toast notifications đã được tích hợp vào toàn bộ hệ thống để cung cấp phản hồi tức thì cho người dùng:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li><strong>Success:</strong> Hiển thị khi thao tác thành công (thêm, sửa, xóa hợp đồng)</li>
            <li><strong>Error:</strong> Hiển thị khi có lỗi xảy ra hoặc validation thất bại</li>
            <li><strong>Warning:</strong> Cảnh báo người dùng về các tình huống cần chú ý</li>
            <li><strong>Info:</strong> Hiển thị thông tin bổ sung hoặc hướng dẫn</li>
            <li><strong>Loading:</strong> Hiển thị trạng thái đang xử lý cho các thao tác mất thời gian</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
