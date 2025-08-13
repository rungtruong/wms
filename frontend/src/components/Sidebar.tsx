'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  Hash, 
  Wrench, 
  Users,
  Menu,
  X,
  Search
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
}

const navigation = [
  { name: 'Tổng quan', href: '/', icon: Home },
  { name: 'Hợp đồng', href: '/contracts', icon: FileText },
  { name: 'Serial sản phẩm', href: '/serials', icon: Hash },
  { name: 'Yêu cầu bảo hành', href: '/requests', icon: Wrench },
  { name: 'Quản lý người dùng', href: '/users', icon: Users },
  { name: 'Tra cứu bảo hành', href: '/customer-portal', icon: Search },
]

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface border-r border-brown-600/20 transition-transform duration-300 ease-in-out z-40 ${
      collapsed ? '-translate-x-64' : 'translate-x-0'
    }`}>
        <div className="h-full overflow-y-auto p-4">
          {/* Navigation */}
          <div className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium ${
                    isActive
                      ? 'bg-teal-500 text-cream-50'
                      : 'text-slate-500 hover:bg-gray-200 hover:text-slate-900'
                  }`}
                  onClick={() => {}}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-cream-50' : 'text-slate-400 group-hover:text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
  )
}
