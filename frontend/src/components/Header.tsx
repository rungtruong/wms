"use client";

import { Menu, User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { WMSLogo } from "./Logo";

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

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cream-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-slate-600" />
            </div>
            <span className="text-sm font-medium text-slate-800">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
