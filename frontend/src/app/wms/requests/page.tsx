"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react";
import { showToast } from "@/lib/toast";
import Layout from "@/components/Layout";
import Table from "@/components/Table";
import { ticketsService } from "@/lib/services/tickets";
import type { WarrantyRequest } from "@/types";

export default function RequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<WarrantyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WarrantyRequest | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    serialNumber: "",
    issue: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ticketsService.getAll();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Không thể tải danh sách yêu cầu. Vui lòng thử lại.");
        showToast.error("Không thể tải danh sách yêu cầu");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issueDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      new: "status-badge status-primary",
      received: "status-badge status-received",
      in_progress: "status-badge status-processing",
      resolved: "status-badge status-completed",
      closed: "status-badge status-completed",
    };
    return (
      statusClasses[status as keyof typeof statusClasses] || "status-badge"
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      new: "Mới",
      received: "Tiếp nhận",
      in_progress: "Đang xử lý",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleEditRequest = (id: string) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setFormData({
        customerName: request.customerName,
        customerEmail: request.customerEmail || "",
        serialNumber: request.productSerial?.serialNumber || "",
        issue: request.issueTitle || "",
        description: request.issueDescription,
        priority: request.priority,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    const request = requests.find((r) => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteRequest = async () => {
    if (selectedRequest && !submitting) {
      try {
        setSubmitting(true);
        await ticketsService.delete(selectedRequest.id);
        setRequests(requests.filter((r) => r.id !== selectedRequest.id));
        setIsDeleteModalOpen(false);
        setSelectedRequest(null);
        showToast.success("Xóa yêu cầu thành công!");
      } catch (err) {
        console.error("Error deleting request:", err);
        showToast.error("Không thể xóa yêu cầu. Vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleUpdateRequest = async () => {
    if (!formData.customerName || !formData.serialNumber || !formData.issue) {
      showToast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (selectedRequest && !submitting) {
      try {
        setSubmitting(true);
        const updateData = {
          issueTitle: formData.issue,
          issueDescription: formData.description,
          priority: formData.priority,
        };

        const updatedRequest = await ticketsService.update(
          selectedRequest.id,
          updateData
        );

        const updatedRequests = requests.map((request) =>
          request.id === selectedRequest.id ? updatedRequest : request
        );
        setRequests(updatedRequests);
        setIsEditModalOpen(false);
        setSelectedRequest(null);
        setFormData({
          customerName: "",
          customerEmail: "",
          serialNumber: "",
          issue: "",
          description: "",
          priority: "medium",
        });
        showToast.success("Cập nhật yêu cầu thành công!");
      } catch (err) {
        console.error("Error updating request:", err);
        showToast.error("Không thể cập nhật yêu cầu. Vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleViewRequest = (id: string) => {
    router.push(`/wms/requests/${id}`);
  };

  const handleCreateRequest = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.serialNumber || !formData.issue) {
      showToast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (!submitting) {
      try {
        setSubmitting(true);
        const createData = {
          serialNumber: formData.serialNumber,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          issueTitle: formData.issue,
          issueDescription: formData.description,
          priority: formData.priority,
        };

        const newRequest = await ticketsService.create(createData);
        setRequests([newRequest, ...requests]);
        setIsCreateModalOpen(false);
        setFormData({
          customerName: "",
          customerEmail: "",
          serialNumber: "",
          issue: "",
          description: "",
          priority: "medium",
        });
        showToast.success("Tạo yêu cầu bảo hành thành công!");
      } catch (err) {
        console.error("Error creating request:", err);
        showToast.error("Không thể tạo yêu cầu. Vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Layout title="Quản lý Yêu cầu Bảo hành">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý Yêu cầu Bảo hành
          </h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Tạo yêu cầu
        </button>
      </div>

      <div className="card">
        <div className="pb-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-input sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="received">Tiếp nhận</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="text-red-800">
                <p className="text-sm font-medium">Có lỗi xảy ra</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <Table
            columns={[
              {
                key: "ticketNumber",
                header: "Mã yêu cầu",
                className: "font-medium text-primary-600",
              },
              {
                key: "customerName",
                header: "Khách hàng",
              },
              {
                key: "serialNumber",
                header: "Serial",
                className: "font-mono text-sm",
                render: (_, request) => (
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900">
                      {request.productSerial?.serialNumber}
                    </div>
                  </div>
                ),
              },
              {
                key: "issue",
                header: "Vấn đề",
                render: (_, request) => (
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900">
                      {request.issueTitle}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {request.issueDescription}
                    </div>
                  </div>
                ),
              },
              {
                key: "priority",
                header: "Mức độ",
                render: (priority) => (
                  <span className={getPriorityBadge(priority)}>
                    {getPriorityText(priority)}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Trạng thái",
                render: (status) => (
                  <span className={getStatusBadge(status)}>
                    {getStatusText(status)}
                  </span>
                ),
              },
              {
                key: "createdAt",
                header: "Ngày tạo",
                render: (_, request) => formatDate(request.createdAt),
              },
              {
                key: "updatedAt",
                header: "Ngày cập nhật",
                render: (_, request) => formatDate(request.updatedAt),
              },
              {
                key: "actions",
                header: "Thao tác",
                render: (_, request) => (
                  <div className="flex space-x-2">
                    <button
                      className="btn--icon btn--view"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRequest(request.id);
                      }}
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="btn--icon btn--edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRequest(request.id);
                      }}
                      title="Sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn--icon btn--delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(request.id);
                      }}
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredRequests}
            emptyMessage="Không tìm thấy yêu cầu nào phù hợp với tiêu chí tìm kiếm."
          />
        )}
      </div>

      {/* Create Request Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Tạo yêu cầu bảo hành mới
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    className="form-input"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleInputChange("customerEmail", e.target.value)
                    }
                    className="form-input"
                    placeholder="Nhập email khách hàng"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    handleInputChange("serialNumber", e.target.value)
                  }
                  className="form-input"
                  placeholder="Nhập serial number sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vấn đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.issue}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                  className="form-input"
                  placeholder="Mô tả ngắn gọn vấn đề"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="form-input"
                  rows={4}
                  placeholder="Mô tả chi tiết vấn đề và các triệu chứng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ ưu tiên
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="form-input"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({
              customerName: "",
              customerEmail: "",
              serialNumber: "",
              issue: "",
              description: "",
              priority: "medium",
            });
                }}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={submitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang tạo..." : "Tạo yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Chỉnh sửa yêu cầu bảo hành
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    className="form-input"
                    placeholder="Nhập tên khách hàng"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                    className="form-input"
                    placeholder="Nhập serial number sản phẩm"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vấn đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.issue}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                  className="form-input"
                  placeholder="Mô tả ngắn gọn vấn đề"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="form-input"
                  rows={4}
                  placeholder="Mô tả chi tiết vấn đề và các triệu chứng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ ưu tiên
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="form-input"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedRequest(null);
                  setFormData({
                customerName: "",
                customerEmail: "",
                serialNumber: "",
                issue: "",
                description: "",
                priority: "medium",
              });
                }}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateRequest}
                disabled={submitting}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Bạn có chắc chắn muốn xóa yêu cầu bảo hành này?
              </p>
              {selectedRequest && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">
                    <strong>Mã yêu cầu:</strong> {selectedRequest.ticketNumber}
                  </p>
                  <p className="text-sm">
                    <strong>Khách hàng:</strong> {selectedRequest.customerName}
                  </p>
                  <p className="text-sm">
                    <strong>Vấn đề:</strong> {selectedRequest.issueDescription}
                  </p>
                </div>
              )}
              <p className="text-red-600 text-sm mt-2">
                <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedRequest(null);
                }}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteRequest}
                disabled={submitting}
                className="btn btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang xóa..." : "Xóa yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
