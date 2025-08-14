"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Package,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import Layout from "@/components/Layout";
import SerialForm from "@/components/SerialForm";
import { Serial } from "@/types/serial";
import { showToast } from "@/lib/toast";
import { useSerial, useUpdateSerial } from "@/hooks/useSerials";

interface SerialDetailPageProps {
  params: {
    id: string;
  };
}

export default function SerialDetailPage({ params }: SerialDetailPageProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: serial, isLoading: loading, error } = useSerial(params.id);
  const updateSerialMutation = useUpdateSerial();

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      valid: "status-badge status-active",
      expired: "status-badge status-expired",
      voided: "status-badge status-suspended",
    };
    return (
      statusClasses[status as keyof typeof statusClasses] || "status-badge"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      valid: "Còn bảo hành",
      expired: "Hết bảo hành",
      voided: "Hủy bảo hành",
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
    // Contract data would come from a separate API call
    return null;
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
                    serial!.warrantyStatus
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
                    serial!.warrantyMonths
                      ? `${serial!.warrantyMonths} tháng`
                      : "-"
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
                  <span class="info-label">Mã hợp đồng:</span> <span class="info-value">${
                    contract.contractNumber
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Khách hàng:</span> <span class="info-value">${
                    contract.customerName || "N/A"
                  }</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Điện thoại:</span> <span class="info-value">${
                    contract.customerPhone || "N/A"
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Email:</span> <span class="info-value">${
                    contract.customerEmail || "N/A"
                  }</span>
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
              false
                ? []
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
    if (serial) {
      updateSerialMutation.mutate(
        { id: serial.id, data: formData },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            showToast.success("Cập nhật thông tin serial thành công!");
          },
          onError: () => {
            showToast.error("Có lỗi xảy ra khi cập nhật serial");
          },
        }
      );
    }
  };

  const contract = getContract();

  // Loading state
  if (loading) {
    return (
      <Layout title="Chi tiết Serial">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout title="Lỗi">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">
              Không thể tải thông tin serial. Vui lòng thử lại.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary mr-2"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push("/wms/serials")}
              className="btn btn-secondary"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Not found state
  if (!serial) {
    return (
      <Layout title="Không tìm thấy">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy serial
            </h2>
            <p className="text-gray-600 mb-4">
              Serial với ID này không tồn tại trong hệ thống.
            </p>
            <button
              onClick={() => router.push("/wms/serials")}
              className="btn btn-primary"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
                    <span className={getStatusBadge(serial.warrantyStatus)}>
                      {getStatusText(serial.warrantyStatus)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sản xuất
                    </label>
                    <p className="text-sm text-gray-900">
                      {serial.manufactureDate
                        ? formatDateOnly(serial.manufactureDate)
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bảo hành còn lại
                    </label>
                    <p className="text-sm text-gray-900">
                      {serial.warrantyMonths
                        ? `${serial.warrantyMonths} tháng`
                        : "-"}
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
                        {contract.customerName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Điện thoại
                      </label>
                      <p className="text-sm text-gray-900">
                        {contract.customerPhone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {contract.customerEmail || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Ghi chú
                </h2>
              </div>
              <div className="card-content">
                {serial.notes ? (
                  <p className="text-sm text-gray-600">{serial.notes}</p>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có ghi chú</p>
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
        contracts={[]}
      />
    </Layout>
  );
}
