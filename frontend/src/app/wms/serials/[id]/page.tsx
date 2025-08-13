"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Edit,
  Package,
  Wrench,
  History,
} from "lucide-react";
import Layout from "@/components/Layout";
import SerialForm from "@/components/SerialForm";
import { mockData } from "@/lib/data";
import { Serial } from "@/types";
import { showToast } from "@/lib/toast";

interface SerialDetailPageProps {
  params: {
    id: string;
  };
}

export default function SerialDetailPage({ params }: SerialDetailPageProps) {
  const router = useRouter();
  const [serial, setSerial] = useState<Serial | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const foundSerial = mockData.serials.find((s) => s.id === params.id);
    setSerial(foundSerial || null);
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
      active: "Đang bảo hành",
      expired: "Hết bảo hành",
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

  const getContract = () => {
    return mockData.contracts.find((c) => c.id === serial?.contractId);
  };

  const handleEditSerial = () => {
    setIsFormOpen(true);
  };

  const handlePrintSerial = () => {
    const contract = getContract();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thông tin Serial - ${serial!.serialNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #000; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #21808D; padding-bottom: 20px; }
            .serial-title { font-size: 24px; font-weight: bold; color: #21808D; margin-bottom: 10px; }
            .serial-number { font-size: 16px; color: #666; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #21808D; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-grid { display: table; width: 100%; margin-bottom: 15px; }
            .info-row { display: table-row; }
            .info-cell { display: table-cell; width: 50%; padding: 5px 10px 5px 0; vertical-align: top; }
            .info-item { margin-bottom: 12px; }
            .info-label { font-weight: bold; color: #333; display: inline-block; min-width: 120px; }
            .info-value { color: #666; }
            .repair-item { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; page-break-inside: avoid; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="serial-title">THÔNG TIN SERIAL SẢN PHẨM</div>
            <div class="serial-number">Serial: ${serial!.serialNumber}</div>
          </div>

          <div class="section">
            <div class="section-title">Thông tin sản phẩm</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Serial Number:</span> <span class="info-value">${
                    serial!.serialNumber
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Tên sản phẩm:</span> <span class="info-value">${
                    serial!.productName
                  }</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Model:</span> <span class="info-value">${
                    serial!.model
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Trạng thái:</span> <span class="info-value">${getStatusText(
                    serial!.status
                  )}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Ngày sản xuất:</span> <span class="info-value">${formatDateOnly(
                    serial!.manufactureDate
                  )}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Bảo hành còn lại:</span> <span class="info-value">${
                    serial!.warrantyRemaining
                  }</span>
                </div>
              </div>
            </div>
          </div>

          ${
            contract
              ? `
          <div class="section">
            <div class="section-title">Thông tin hợp đồng</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Mã hợp đồng:</span> <span class="info-value">${contract.contractNumber}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Khách hàng:</span> <span class="info-value">${contract.customer.name}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Điện thoại:</span> <span class="info-value">${contract.customer.phone}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Email:</span> <span class="info-value">${contract.customer.email}</span>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <div class="section">
            <div class="section-title">Lịch sử sửa chữa</div>
            ${
              serial!.repairHistory.length > 0
                ? serial!.repairHistory
                    .map(
                      (repair) => `
              <div class="repair-item">
                <div class="info-item">
                  <span class="info-label">Ngày sửa chữa:</span> <span class="info-value">${formatDateOnly(
                    repair.date
                  )}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Vấn đề:</span> <span class="info-value">${
                    repair.issue
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Giải pháp:</span> <span class="info-value">${
                    repair.solution
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Kỹ thuật viên:</span> <span class="info-value">${
                    repair.technician
                  }</span>
                </div>
              </div>
            `
                    )
                    .join("")
                : "<p>Chưa có lịch sử sửa chữa</p>"
            }
          </div>

          <div class="footer">
            <p>Thông tin được in vào ngày: ${new Date().toLocaleDateString(
              "vi-VN"
            )}</p>
            <p>© ${new Date().getFullYear()} - Hệ thống quản lý bảo hành</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    showToast.success("Đang chuẩn bị in thông tin serial...");
  };

  const handleFormSubmit = (formData: any) => {
    const updatedSerial = {
      ...serial!,
      serialNumber: formData.serialNumber,
      productName: formData.productName,
      model: formData.model,
      manufactureDate: formData.manufactureDate,
      warrantyRemaining: formData.warrantyRemaining,
    };
    setSerial(updatedSerial);
    setIsFormOpen(false);
    showToast.success("Cập nhật thông tin serial thành công!");
  };

  if (loading) {
    return (
      <Layout title="Chi tiết Serial sản phẩm">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!serial) {
    return (
      <Layout title="Chi tiết Serial sản phẩm">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy Serial
          </h2>
          <p className="text-gray-600 mb-6">
            Serial sản phẩm không tồn tại hoặc đã bị xóa.
          </p>
          <button onClick={() => router.back()} className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </Layout>
    );
  }

  const contract = getContract();

  return (
    <Layout title={`Chi tiết Serial ${serial.serialNumber}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết Serial sản phẩm
              </h1>
              <p className="text-gray-600 mt-1">
                Serial: {serial.serialNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={getStatusBadge(serial.status)}>
              {getStatusText(serial.status)}
            </span>
            {serial.warrantyRemaining && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Còn {serial.warrantyRemaining}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thông tin sản phẩm
                </h2>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {serial.serialNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm
                    </label>
                    <p className="text-sm text-gray-900">
                      {serial.productName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <p className="text-sm text-gray-900">{serial.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <span className={getStatusBadge(serial.status)}>
                      {getStatusText(serial.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sản xuất
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDateOnly(serial.manufactureDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bảo hành còn lại
                    </label>
                    <p className="text-sm text-gray-900">
                      {serial.warrantyRemaining}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {contract && (
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
                        Khách hàng
                      </label>
                      <p className="text-sm text-gray-900">
                        {contract.customer.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Điện thoại
                      </label>
                      <p className="text-sm text-gray-900">
                        {contract.customer.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {contract.customer.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Lịch sử sửa chữa
                </h2>
              </div>
              <div className="card-content">
                {serial.repairHistory.length > 0 ? (
                  <div className="space-y-4">
                    {serial.repairHistory.map((repair, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Wrench className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">
                                {repair.issue}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {formatDateOnly(repair.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {repair.solution}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Kỹ thuật viên:</strong>{" "}
                              {repair.technician}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có lịch sử sửa chữa</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thao tác
                </h2>
              </div>
              <div className="card-content space-y-3">
                <button
                  onClick={handleEditSerial}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#21808D", color: "#FCFCF9" }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa thông tin
                </button>
                <button
                  onClick={handlePrintSerial}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors border"
                  style={{
                    backgroundColor: "transparent",
                    color: "#133437",
                    borderColor: "#A7A9A9",
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  In thông tin Serial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SerialForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingSerial={serial}
        contracts={mockData.contracts}
      />
    </Layout>
  );
}
