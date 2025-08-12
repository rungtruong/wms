'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { serialsService } from '@/services/serials';
import { WarrantyCheckResponse } from '@/types';

const warrantyCheckSchema = z.object({
  serialNumber: z.string().min(1, 'Vui lòng nhập số serial'),
});

type WarrantyCheckForm = z.infer<typeof warrantyCheckSchema>;

function WarrantyResult({ result }: { result: WarrantyCheckResponse }) {
  const getStatusIcon = () => {
    if (result.isValid) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else {
      return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (result.isValid) {
      return 'Còn bảo hành';
    } else {
      return 'Hết bảo hành';
    }
  };

  const getStatusColor = () => {
    if (result.isValid) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else {
      return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Kết quả tra cứu bảo hành</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          {getStatusIcon()}
          <div className="ml-4">
            <h4 className="text-xl font-semibold text-gray-900">{getStatusText()}</h4>
            <p className="text-sm text-gray-600">Serial: {result.serial?.serialNumber || 'N/A'}</p>
          </div>
        </div>

        {result.serial && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
                <p className="mt-1 text-sm text-gray-900">{result.serial.product?.name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <p className="mt-1 text-sm text-gray-900">{result.serial.product?.model || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Hợp đồng</label>
                <p className="mt-1 text-sm text-gray-900">{result.serial.contract?.contractNumber || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu bảo hành</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(result.serial.warrantyStartDate)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày kết thúc bảo hành</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(result.serial.warrantyEndDate)}</p>
              </div>
              
              {result.isValid && result.daysRemaining !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thời gian còn lại</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {result.daysRemaining > 0 ? `${result.daysRemaining} ngày` : 'Đã hết hạn'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`mt-6 p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-3">
              <h5 className="font-medium">{getStatusText()}</h5>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          </div>
        </div>

        {result.serial?.notes && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{result.serial.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WarrantyCheckPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WarrantyCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WarrantyCheckForm>({
    resolver: zodResolver(warrantyCheckSchema),
  });

  const onSubmit = async (data: WarrantyCheckForm) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await serialsService.checkWarranty(data.serialNumber);
      setResult(response);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không tìm thấy thông tin bảo hành');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tra cứu bảo hành
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Nhập số serial để kiểm tra tình trạng bảo hành sản phẩm của bạn
          </p>
        </div>

        <div className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Thông tin tra cứu</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                  Số Serial
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('serialNumber')}
                    type="text"
                    placeholder="Nhập số serial sản phẩm"
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {errors.serialNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tra cứu...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Tra cứu bảo hành
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Lỗi tra cứu</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {result && <WarrantyResult result={result} />}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Hướng dẫn sử dụng</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Số serial thường được in trên nhãn sản phẩm hoặc hộp đựng</li>
            <li>• Số serial bao gồm cả chữ và số, vui lòng nhập chính xác</li>
            <li>• Nếu không tìm thấy thông tin, vui lòng liên hệ bộ phận hỗ trợ</li>
            <li>• Thông tin bảo hành được cập nhật theo thời gian thực</li>
          </ul>
        </div>
      </div>
    </div>
  );
}