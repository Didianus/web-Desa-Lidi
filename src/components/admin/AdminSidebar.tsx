'use client'

import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  Image,
  FileText,
  Settings,
  Users,
  LogOut,
  Trees,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'berita', label: 'Kelola Berita', icon: Newspaper },
  { key: 'pengumuman', label: 'Kelola Pengumuman', icon: Bell },
  { key: 'galeri', label: 'Kelola Galeri', icon: Image },
  { key: 'surat', label: 'Kelola Surat', icon: FileText },
  { key: 'profil', label: 'Profil Desa', icon: Settings },
  { key: 'users', label: 'Kelola User', icon: Users },
] as const

export function AdminSidebar() {
  const { currentAdminPage, setCurrentAdminPage, setViewMode, adminSidebarOpen, setAdminSidebarOpen } = useAppStore()
  const { logout } = useAuthStore()

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-300 ${
        adminSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {adminSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Trees className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Admin Panel</h2>
              <p className="text-[10px] text-gray-500">Desa Sukamaju</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
          className="h-8 w-8 text-gray-500 hover:text-gray-700"
        >
          {adminSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <Separator />

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentAdminPage(item.key as any)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentAdminPage === item.key
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {adminSidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => setViewMode('user')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {adminSidebarOpen && <span>Kembali ke Website</span>}
        </button>
        <button
          onClick={() => { logout(); setViewMode('user') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {adminSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
