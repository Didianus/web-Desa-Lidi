'use client'

import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function AdminHeader() {
  const { adminDarkMode, setAdminDarkMode, currentAdminPage } = useAppStore()
  const { user } = useAuthStore()

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    berita: 'Kelola Berita',
    pengumuman: 'Kelola Pengumuman',
    galeri: 'Kelola Galeri',
    penduduk: 'Kelola Penduduk',
    surat: 'Kelola Surat',
    laporan: 'Laporan',
    pengaturan: 'Pengaturan',
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {pageTitles[currentAdminPage] || 'Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari..."
            className="pl-10 w-64 bg-gray-50 dark:bg-gray-800 border-0"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-400">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAdminDarkMode(!adminDarkMode)}
          className="text-gray-500 dark:text-gray-400"
        >
          {adminDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ') || 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
