"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  UserCheck,
} from "lucide-react";
import Layout from "@/components/Layout";
import UserForm from "@/components/UserForm";
import Table from "@/components/Table";
import { usersService } from "@/lib/services/users";
import { showToast } from "@/lib/toast";
import { User } from "@/types";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <Users className="h-4 w-4" />;
      case "technician":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleViewUser = (id: string) => {
    window.location.href = `/wms/users/${id}`;
  };

  const handleEditUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setIsFormOpen(true);
    }
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        await usersService.delete(selectedUser.id);
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        showToast.success("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast.error("Lỗi khi xóa người dùng");
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingUser) {
        const updatedUser = await usersService.update(editingUser.id, {
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
        });
        setUsers(
          users.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        showToast.success("Cập nhật người dùng thành công!");
      } else {
        const newUser = await usersService.create({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        });
        setUsers([...users, newUser]);
        showToast.success("Thêm người dùng thành công!");
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      showToast.error("Lỗi khi lưu thông tin người dùng");
    }
  };

  if (isLoading) {
    return (
      <Layout title="Quản lý Người dùng">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </Layout>
    );
  }

  const columns = [
    {
      key: "fullName",
      header: "Họ và tên",
      render: (value: any, user: User) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Vai trò",
      render: (value: any, user: User) => (
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              user.role === "admin"
                ? "bg-red-100 text-red-800"
                : user.role === "manager"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {getRoleIcon(user.role)}
            <span>{getRoleText(user.role)}</span>
          </span>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Trạng thái",
      render: (value: any, user: User) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (value: any, user: User) => formatDate(user.createdAt),
    },
    {
      key: "updatedAt",
      header: "Ngày cập nhật",
      render: (value: any, user: User) => formatDate(user.updatedAt),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (value: any, user: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewUser(user.id)}
            className="btn--icon btn--view"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditUser(user.id)}
            className="btn--icon btn--edit"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="btn--icon btn--delete"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Quản lý Người dùng" notificationCount={2}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý Người dùng
          </h2>
          <p className="text-gray-600">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <Plus className="h-4 w-4" />
          Thêm người dùng
        </button>
      </div>

      <div className="card">
        <div className="pb-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="technician">Kỹ thuật viên</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table
            data={filteredUsers}
            columns={columns}
            emptyMessage="Không có người dùng nào"
          />
        </div>
      </div>

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
      />

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
              {selectedUser && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">
                    <strong>Họ và tên:</strong> {selectedUser.fullName}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="text-sm">
                    <strong>Vai trò:</strong> {getRoleText(selectedUser.role)}
                  </p>
                </div>
              )}
              <p className="text-red-600 text-sm mt-2">
                <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
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
