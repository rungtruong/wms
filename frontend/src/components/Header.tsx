"use client";

import { useState } from "react";
import { Menu, User, Settings, LogOut, ChevronDown, Shield, UserCircle } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { WMSLogo } from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  title: string;
  notificationCount: number;
  onMenuToggle: () => void;
}

export default function Header({
  title,
  notificationCount,
  onMenuToggle,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Use auth user data
  const currentUser = {
    fullName: user?.name || "User",
    email: user?.email || "",
    role: user?.role || "user",
    avatar: null
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên'
      case 'manager': return 'Quản lý'
      case 'technician': return 'Kỹ thuật viên'
      default: return role
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'manager': return <User className="h-4 w-4" />
      case 'technician': return <UserCircle className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    window.location.href = '/profile';
    setIsProfileOpen(false);
  };

  const handleSettings = () => {
    // TODO: Navigate to settings page
    console.log('Settings clicked');
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-brown-600/20 z-50">
      <div className="h-full px-4 flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md border border-brown-600/20 hover:bg-cream-50 flex items-center justify-center"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <WMSLogo variant="full" tagline className="flex-1" />

        <div className="flex items-center gap-4">
          <NotificationDropdown notificationCount={notificationCount} />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-cream-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-800">{currentUser.fullName}</p>
                <p className="text-xs text-slate-500">{getRoleText(currentUser.role)}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {currentUser.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentUser.fullName}</p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleIcon(currentUser.role)}
                        <span className="text-xs text-gray-600">{getRoleText(currentUser.role)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="h-4 w-4" />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Cài đặt
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
}
