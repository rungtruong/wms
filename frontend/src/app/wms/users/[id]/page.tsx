"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Shield,
  Users,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Layout from "@/components/Layout";
import UserForm from "@/components/UserForm";
import { mockData } from "@/lib/data";
import { showToast } from "@/lib/toast";
import { User } from "@/types";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [users, setUsers] = useState(mockData.users);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <Layout title="Người dùng không tồn tại">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Người dùng không tồn tại
          </h2>
          <button
            onClick={() => router.push("/wms/users")}
            className="btn btn-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </button>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "technician":
        return "Kỹ thuật viên";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "manager":
        return <Users className="h-5 w-5" />;
      case "technician":
        return <UserCheck className="h-5 w-5" />;
      default:
        return <UserCheck className="h-5 w-5" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technician":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditUser = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== user.id));
    setIsDeleteModalOpen(false);
    showToast.success("Xóa người dùng thành công!");
    router.push("/users");
  };

  const handleFormSubmit = (formData: any) => {
    setUsers(
      users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              email: formData.email,
              fullName: formData.fullName,
              role: formData.role,
              isActive: formData.isActive,
              updatedAt: new Date().toISOString(),
            }
          : u
      )
    );
    setIsEditModalOpen(false);
    showToast.success("Cập nhật người dùng thành công!");
  };

  return (
    <Layout title={`Chi tiết người dùng - ${user.fullName}`}>
      <div className="mb-6">
        <button
          onClick={() => router.push("/users")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách người dùng
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.fullName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button onClick={handleEditUser} className="btn btn-secondary">
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </button>
            <button onClick={handleDeleteUser} className="btn btn-danger">
              <Trash2 className="h-4 w-4" />
              Xóa người dùng
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Information */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {user.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      <span>{getRoleText(user.role)}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        user.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Trạng thái
                      </p>
                      <p
                        className={`font-medium ${
                          user.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Không hoạt động"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Ngày tạo
                      </p>
                      <p className="text-gray-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Cập nhật lần cuối
                      </p>
                      <p className="text-gray-900">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <div className="card">
            <div className="card-header mb-6">
              <h3 className="card-title font-semibold text-gray-900">
                Quyền hạn
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {user.role === "admin" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Quản lý người dùng
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Quản lý hệ thống
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Xem tất cả báo cáo
                      </span>
                    </div>
                  </>
                )}
                {user.role === "manager" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Quản lý yêu cầu
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Phân công kỹ thuật viên
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Xem báo cáo</span>
                    </div>
                  </>
                )}
                {user.role === "technician" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Xử lý yêu cầu
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Cập nhật tiến độ
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        Ghi chú sửa chữa
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <UserForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingUser={user}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận xóa
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Bạn có chắc chắn muốn xóa người dùng này?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  <strong>Họ và tên:</strong> {user.fullName}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>Vai trò:</strong> {getRoleText(user.role)}
                </p>
              </div>
              <p className="text-red-600 text-sm mt-2">
                <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteUser}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Xóa người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
