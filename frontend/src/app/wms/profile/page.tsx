'use client'

import { useState, useEffect } from 'react'
import { Camera, Edit, Save, X, Shield, Users, UserCheck, Mail, Phone, MapPin, Calendar, Clock, Key } from 'lucide-react'
import Layout from '@/components/Layout'
import { showToast } from '@/lib/toast'
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { user: authUser } = useAuth()
  
  // API hooks
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  })

  // Initialize form when profile data is loaded
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      })
    }
  }, [userProfile])

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên'
      case 'manager': return 'Quản lý'
      case 'technician': return 'Kỹ thuật viên'
      default: return role
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5" />
      case 'manager': return <Users className="h-5 w-5" />
      case 'technician': return <UserCheck className="h-5 w-5" />
      default: return <UserCheck className="h-5 w-5" />
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'technician': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (userProfile) {
      setEditForm({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast.error('Mật khẩu xác nhận không khớp!')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      showToast.error('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }
    
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setIsChangingPassword(false)
    } catch (error) {
      console.error('Password change failed:', error)
    }
  }

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload
    showToast.info('Tính năng upload ảnh đang được phát triển!')
  }

  // Show loading state
  if (profileLoading) {
    return (
      <Layout title="Thông tin cá nhân">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    )
  }

  // Show error state
  if (profileError) {
    return (
      <Layout title="Thông tin cá nhân">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Không thể tải thông tin profile</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Show message if no profile data
  if (!userProfile) {
    return (
      <Layout title="Thông tin cá nhân">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Không tìm thấy thông tin profile</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Thông tin cá nhân">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản và cài đặt bảo mật của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header flex justify-between items-center mb-6">
                <h3 className="card-title font-semibold text-gray-900">Thông tin cơ bản</h3>
                {!isEditing ? (
                  <button
                    onClick={handleEditProfile}
                    className="btn btn-secondary"
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-secondary"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <div className="card-content">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {userProfile.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleAvatarChange}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{userProfile.fullName}</h2>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeClass(userProfile.role)}`}>
                        {getRoleIcon(userProfile.role)}
                        <span>{getRoleText(userProfile.role)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userProfile.fullName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userProfile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userProfile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        className="form-input"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userProfile.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="card mt-8">
              <div className="card-header flex justify-between items-center">
                <h3 className="card-title font-semibold text-gray-900">Bảo mật</h3>
                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="btn btn-secondary"
                  >
                    <Key className="h-4 w-4" />
                    Đổi mật khẩu
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changePasswordMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {changePasswordMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordForm({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                      }}
                      className="btn btn-secondary"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <div className="card-content">
                {isChangingPassword ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="form-input"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="form-input"
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="form-input"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p>Mật khẩu được mã hóa an toàn. Click "Đổi mật khẩu" để cập nhật.</p>
                    <p className="text-sm mt-2">Lần đổi mật khẩu cuối: {formatDate(userProfile.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header mb-6">
                <h3 className="card-title font-semibold text-gray-900">Thông tin tài khoản</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${userProfile.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                      <p className={`text-sm font-medium ${userProfile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {userProfile.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ngày tạo tài khoản</p>
                      <p className="text-sm text-gray-900">{formatDate(userProfile.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Đăng nhập lần cuối</p>
                      <p className="text-sm text-gray-900">{formatDate(userProfile.lastLogin)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Edit className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cập nhật lần cuối</p>
                      <p className="text-sm text-gray-900">{formatDate(userProfile.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title font-semibold text-gray-900">ID tài khoản</h3>
              </div>
              <div className="card-content">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-mono text-gray-700">{userProfile.id}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ID này được sử dụng để định danh tài khoản trong hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
