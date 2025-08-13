"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, AlertCircle, Clock, CheckCircle, FileText, Phone, Mail, MapPin, Edit, Package } from 'lucide-react'
import Layout from '@/components/Layout'
import ContractForm from '@/components/ContractForm'
import { mockData } from '@/lib/data'
import { Contract } from '@/types'
import { showToast } from '@/lib/toast'

interface ContractDetailPageProps {
  params: {
    id: string;
  };
}

export default function ContractDetailPage({
  params,
}: ContractDetailPageProps) {
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const foundContract = mockData.contracts.find((c) => c.id === params.id);
    setContract(foundContract || null);
    setLoading(false);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: "status-badge status-active",
      expired: "status-badge status-expired",
      suspended: "status-badge status-processing",
    };
    return (
      statusClasses[status as keyof typeof statusClasses] || "status-badge"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      active: "Đang hiệu lực",
      expired: "Hết hạn",
      suspended: "Tạm dừng",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Layout title="Chi tiết hợp đồng bảo hành">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!contract) {
    return (
      <Layout title="Chi tiết hợp đồng bảo hành">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy hợp đồng
          </h2>
          <p className="text-gray-600 mb-6">
            Hợp đồng bảo hành không tồn tại hoặc đã bị xóa.
          </p>
          <button onClick={() => router.back()} className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </Layout>
    );
  }

  const daysRemaining = calculateDaysRemaining(contract.endDate);

  const handleEditContract = () => {
    setIsFormOpen(true);
  };

  const handlePrintContract = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hợp đồng bảo hành - ${contract!.contractNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #000; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #21808D; padding-bottom: 20px; }
            .contract-title { font-size: 24px; font-weight: bold; color: #21808D; margin-bottom: 10px; }
            .contract-number { font-size: 16px; color: #666; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #21808D; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-grid { display: table; width: 100%; margin-bottom: 15px; }
            .info-row { display: table-row; }
            .info-cell { display: table-cell; width: 50%; padding: 5px 10px 5px 0; vertical-align: top; }
            .info-item { margin-bottom: 12px; }
            .info-label { font-weight: bold; color: #333; display: inline-block; min-width: 120px; }
            .info-value { color: #666; }
            .product-item { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; page-break-inside: avoid; }
            .product-info { display: table; width: 100%; }
            .product-row { display: table-row; }
            .product-cell { display: table-cell; width: 33.33%; padding: 3px 10px 3px 0; }
            .terms { background: #f0f9ff; padding: 15px; border-radius: 5px; border-left: 4px solid #21808D; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="contract-title">HỢP ĐỒNG BẢO HÀNH</div>
            <div class="contract-number">Mã hợp đồng: ${contract!.contractNumber}</div>
          </div>

          <div class="section">
            <div class="section-title">Thông tin hợp đồng</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Mã hợp đồng:</span> <span class="info-value">${contract!.contractNumber}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Trạng thái:</span> <span class="info-value">${getStatusText(contract!.status)}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Ngày bắt đầu:</span> <span class="info-value">${formatDateOnly(contract!.startDate)}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Ngày kết thúc:</span> <span class="info-value">${formatDateOnly(contract!.endDate)}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Ngày tạo:</span> <span class="info-value">${formatDate(contract!.createdAt)}</span>
                </div>
                <div class="info-cell"></div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Thông tin khách hàng</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Tên khách hàng:</span> <span class="info-value">${contract!.customer.name}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Số điện thoại:</span> <span class="info-value">${contract!.customer.phone}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Email:</span> <span class="info-value">${contract!.customer.email}</span>
                </div>
                <div class="info-cell"></div>
              </div>
              <div class="info-row">
                <div class="info-cell" style="width: 100%;" colspan="2">
                  <span class="info-label">Địa chỉ:</span> <span class="info-value">${contract!.customer.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Sản phẩm được bảo hành</div>
            ${contract!.products.map(product => `
              <div class="product-item">
                <div class="product-info">
                  <div class="product-row">
                    <div class="product-cell">
                      <span class="info-label">Tên sản phẩm:</span> <span class="info-value">${product.name}</span>
                    </div>
                    <div class="product-cell">
                      <span class="info-label">Model:</span> <span class="info-value">${product.model}</span>
                    </div>
                    <div class="product-cell">
                      <span class="info-label">Serial:</span> <span class="info-value">${product.serial}</span>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Điều khoản bảo hành</div>
            <div class="terms">
              ${contract!.terms}
            </div>
          </div>

          <div class="footer">
            <p>Hợp đồng được in vào ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
            <p> ${new Date().getFullYear()} - Hệ thống quản lý bảo hành</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
    
    showToast.success('Đang chuẩn bị in hợp đồng...')
  };

  const handleFormSubmit = (formData: any) => {
    // Update contract data (in real app, this would call an API)
    const updatedContract = {
      ...contract!,
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
    };
    setContract(updatedContract);
    setIsFormOpen(false);
    showToast.success('Cập nhật hợp đồng thành công!');
  };

  return (
    <Layout title={`Chi tiết hợp đồng ${contract.contractNumber}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết hợp đồng bảo hành
              </h1>
              <p className="text-gray-600 mt-1">
                Mã hợp đồng: {contract.contractNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={getStatusBadge(contract.status)}>
              {getStatusText(contract.status)}
            </span>
            {daysRemaining > 0 && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Còn {daysRemaining} ngày
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thông tin hợp đồng
                </h2>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã hợp đồng
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {contract.contractNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span className={getStatusBadge(contract.status)}>
                      {getStatusText(contract.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDateOnly(contract.startDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDateOnly(contract.endDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điều khoản bảo hành
                  </label>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {contract.terms}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo hợp đồng
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(contract.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Sản phẩm được bảo hành
                </h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {contract.products.map((product, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Package className="h-5 w-5 text-teal-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Model:</span>{" "}
                              {product.model}
                            </div>
                            <div>
                              <span className="font-medium">Serial:</span>{" "}
                              <span className="font-mono">
                                {product.serial}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thông tin khách hàng
                </h2>
              </div>
              <div className="card-content space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {contract.customer.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {contract.customer.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {contract.customer.email}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {contract.customer.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thao tác
                </h2>
              </div>
              <div className="card-content space-y-3">
                <button 
                  onClick={handleEditContract}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{backgroundColor: '#21808D', color: '#FCFCF9'}}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa hợp đồng
                </button>
                <button 
                  onClick={handlePrintContract}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors border"
                  style={{backgroundColor: 'transparent', color: '#133437', borderColor: '#A7A9A9'}}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  In hợp đồng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContractForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingContract={contract}
      />
    </Layout>
  )
}
