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
  UserPlus,
} from "lucide-react";
import Layout from "@/components/Layout";
import { WarrantyRequest, User as UserType } from "@/types";
import { showToast } from "@/lib/toast";
import { ticketsService } from "@/lib/services/tickets";
import { usersService } from "@/lib/services/users";

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const router = useRouter();
  const [request, setRequest] = useState<WarrantyRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [assignNote, setAssignNote] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const requestData = await ticketsService.getById(params.id);
        console.log("Request data:", requestData);
        console.log("Product Serial:", requestData.productSerial);
        console.log("Serial Number:", requestData.productSerial?.serialNumber);
        setRequest(requestData);
      } catch (error) {
        console.error("Error fetching request:", error);
        setError("Không thể tải thông tin yêu cầu");
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [params.id]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const techniciansList = await usersService.getTechniciansAndManagers();
        setTechnicians(techniciansList);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: "status-badge status-received",
      in_progress: "status-badge status-processing",
      resolved: "status-badge status-completed",
      closed: "status-badge status-closed",
    };
    return (
      statusClasses[status as keyof typeof statusClasses] ||
      "status-badge status-received"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      open: "Tiếp nhận",
      in_progress: "Đang xử lý",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const getStatusDisplayValue = (value: string) => {
    const statusMapping = {
      open: "Tiếp nhận",
      in_progress: "Đang xử lý",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
      urgent: "Khẩn cấp",
    };
    return statusMapping[value as keyof typeof statusMapping] || value;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      urgent: "status-badge priority-urgent",
      high: "status-badge priority-high",
      medium: "status-badge priority-medium",
      low: "status-badge priority-low",
    };
    return (
      priorityClasses[priority as keyof typeof priorityClasses] ||
      "status-badge"
    );
  };

  const getPriorityText = (priority: string) => {
    const priorityTexts = {
      urgent: "Khẩn cấp",
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
    };
    return priorityTexts[priority as keyof typeof priorityTexts] || priority;
  };

  const calculateDaysRemaining = (dateString: string) => {
    const today = new Date();
    const created = new Date(dateString);
    const diffTime = today.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(request?.createdAt || "");

  const handleUpdateStatus = () => {
    setIsStatusModalOpen(true);
  };

  const handleAssignTechnician = () => {
    setIsAssignModalOpen(true);
  };

  const handleSendEmail = async () => {
    try {
      const result = await ticketsService.sendEmail(params.id);
      showToast.success(result.message);
      
      // Reload request data to get updated history
      const updatedRequest = await ticketsService.getById(params.id);
      setRequest(updatedRequest);
    } catch (error: any) {
      showToast.error(error.message || "Có lỗi xảy ra khi gửi email");
    }
  };

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Báo cáo yêu cầu bảo hành - ${request!.ticketNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #000; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #21808D; padding-bottom: 20px; }
            .report-title { font-size: 24px; font-weight: bold; color: #21808D; margin-bottom: 10px; }
            .ticket-number { font-size: 16px; color: #666; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #21808D; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-grid { display: table; width: 100%; margin-bottom: 15px; }
            .info-row { display: table-row; }
            .info-cell { display: table-cell; width: 50%; padding: 5px 10px 5px 0; vertical-align: top; }
            .info-label { font-weight: bold; color: #333; display: inline-block; min-width: 120px; }
            .info-value { color: #666; }
            .timeline-item { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 10px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="report-title">BÁO CÁO YÊU CẦU BẢO HÀNH</div>
            <div class="ticket-number">Mã yêu cầu: ${
              request!.ticketNumber
            }</div>
          </div>

          <div class="section">
            <div class="section-title">Thông tin yêu cầu</div>
            <div class="info-grid">
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Mã yêu cầu:</span> <span class="info-value">${
                    request!.ticketNumber
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Serial Number:</span> <span class="info-value">${
                    request!.productSerial?.serialNumber
                  }</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Khách hàng:</span> <span class="info-value">${
                    request!.customerName
                  }</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Kỹ thuật viên:</span> <span class="info-value">${
                    request!.assignee?.fullName
                  }</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-cell">
                  <span class="info-label">Trạng thái:</span> <span class="info-value">${getStatusText(
                    request!.status
                  )}</span>
                </div>
                <div class="info-cell">
                  <span class="info-label">Ưu tiên:</span> <span class="info-value">${getPriorityText(
                    request!.priority
                  )}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Mô tả vấn đề</div>
            <p><strong>Mô tả vấn đề:</strong> ${request!.issueDescription}</p>
          </div>

          <div class="section">
            <div class="section-title">Lịch sử xử lý</div>
            ${request!.history
              .map(
                (item) => `
              <div class="timeline-item">
                <div><strong>${item.description}</strong> - ${formatDate(
                  item.createdAt
                )}</div>
                <div>Thực hiện bởi: ${
                  item.performer?.fullName || "Hệ thống"
                }</div>
                ${
                  item.oldValue && item.newValue
                    ? `<div>Từ: ${getStatusDisplayValue(
                        item.oldValue
                      )} → ${getStatusDisplayValue(item.newValue)}</div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <div class="footer">
            <p>Báo cáo được tạo vào ngày: ${new Date().toLocaleDateString(
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

    showToast.success("Đang chuẩn bị in báo cáo...");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <FileText className="h-4 w-4" />;
      case "validated":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Layout title="Chi tiết yêu cầu bảo hành">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !request) {
    return (
      <Layout title="Chi tiết yêu cầu bảo hành">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy yêu cầu
          </h2>
          <p className="text-gray-600 mb-6">
            Yêu cầu bảo hành không tồn tại hoặc đã bị xóa.
          </p>
          <button onClick={() => router.back()} className="btn btn--primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Chi tiết yêu cầu ${request.ticketNumber}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="btn btn-secondary">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết yêu cầu bảo hành
              </h1>
              <p className="text-gray-600 mt-1">
                Mã yêu cầu: {request.ticketNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={getStatusBadge(request.status)}>
              {getStatusText(request.status)}
            </span>
            <span className={getPriorityBadge(request.priority)}>
              {getPriorityText(request.priority)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Thông tin yêu cầu
                </h2>
              </div>
              <div className="card-content space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã yêu cầu
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {request.ticketNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial sản phẩm
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {request.productSerial?.serialNumber ||
                        "Chưa có thông tin"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khách hàng
                    </label>
                    <p className="text-sm text-gray-900">
                      {request.customerName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Người phụ trách
                    </label>
                    <p className="text-sm text-gray-900">
                      {request.assignee?.fullName || "Chưa phân công"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vấn đề
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {request.issueTitle || "Chưa có tiêu đề"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {request.issueDescription}
                  </p>
                </div>

                {request.productSerial && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thông tin sản phẩm
                    </label>
                    <p className="text-sm text-gray-900">
                      {request.productSerial.name} -{" "}
                      {request.productSerial.model}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cập nhật lần cuối
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(request.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title pb-6 text-lg font-bold text-gray-900">
                  Lịch sử xử lý
                </h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {request.history && request.history.length > 0 ? (
                    request.history.map((historyItem, index) => (
                      <div key={historyItem.id} className="relative">
                        {index !== request.history.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="flex items-start space-x-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusBadge(
                              historyItem.newValue
                            )}`}
                          >
                            {getStatusIcon(historyItem.newValue)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {historyItem.performer?.fullName || "Hệ thống"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(historyItem.createdAt)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              {historyItem.description}
                            </p>
                            {historyItem.oldValue && historyItem.newValue && (
                              <p className="text-xs text-gray-500">
                                Từ:{" "}
                                <span className="font-medium">
                                  {getStatusDisplayValue(historyItem.oldValue)}
                                </span>{" "}
                                →
                                <span className="font-medium">
                                  {getStatusDisplayValue(historyItem.newValue)}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Chưa có lịch sử xử lý nào
                    </p>
                  )}
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
                    {request.customerName}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {request.customerPhone || "Chưa có thông tin"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {request.customerEmail || "Chưa có thông tin"}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {request.productSerial?.contract?.customerAddress ||
                      "Chưa có thông tin"}
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
                  onClick={handleUpdateStatus}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#21808D", color: "#FCFCF9" }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </button>
                <button
                  onClick={handleAssignTechnician}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#3B82F6", color: "#FCFCF9" }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Phân công kỹ thuật viên
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={
                    request?.status !== "resolved" &&
                    request?.status !== "closed"
                  }
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      request?.status === "resolved" ||
                      request?.status === "closed"
                        ? "#10B981"
                        : "#9CA3AF",
                    color: "#FCFCF9",
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email cho khách hàng
                </button>
                <button
                  onClick={handlePrintReport}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors border"
                  style={{
                    backgroundColor: "transparent",
                    color: "#133437",
                    borderColor: "#A7A9A9",
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  In báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cập nhật trạng thái
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="open">Tiếp nhận</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="form-input"
                  rows={3}
                  placeholder="Nhập ghi chú về việc cập nhật trạng thái..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (selectedStatus && request) {
                    try {
                      setIsUpdatingStatus(true);
                      await ticketsService.updateStatus(
                        request.id,
                        selectedStatus as
                          | "open"
                          | "in_progress"
                          | "resolved"
                          | "closed",
                        statusNote || undefined
                      );

                      // Reload request data to get updated info and history
                      const updatedRequest = await ticketsService.getById(
                        params.id
                      );
                      setRequest(updatedRequest);

                      setIsStatusModalOpen(false);
                      setSelectedStatus("");
                      setStatusNote("");
                      showToast.success("Cập nhật trạng thái thành công!");
                    } catch (error) {
                      console.error("Error updating status:", error);
                      showToast.error(
                        "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại."
                      );
                    } finally {
                      setIsUpdatingStatus(false);
                    }
                  }
                }}
                disabled={!selectedStatus || isUpdatingStatus}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingStatus ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân công kỹ thuật viên
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn kỹ thuật viên
                </label>
                <select 
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- Chọn kỹ thuật viên --</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.fullName} ({tech.role === 'manager' ? 'Quản lý' : 'Kỹ thuật viên'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  className="form-input"
                  rows={3}
                  placeholder="Ghi chú về việc phân công..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (selectedTechnician && request) {
                    try {
                      await ticketsService.assignTechnician(
                        request.id,
                        selectedTechnician,
                        assignNote || undefined
                      );

                      // Reload request data to get updated info and history
                      const updatedRequest = await ticketsService.getById(
                        params.id
                      );
                      setRequest(updatedRequest);

                      setIsAssignModalOpen(false);
                      setSelectedTechnician('');
                      setAssignNote('');
                      showToast.success("Phân công kỹ thuật viên thành công!");
                    } catch (error) {
                      console.error("Error assigning technician:", error);
                      showToast.error(
                        "Có lỗi xảy ra khi phân công kỹ thuật viên. Vui lòng thử lại."
                      );
                    }
                  } else {
                    showToast.error("Vui lòng chọn kỹ thuật viên!");
                  }
                }}
                disabled={!selectedTechnician}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Phân công
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
