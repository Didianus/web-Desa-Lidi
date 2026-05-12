import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserPage = 
  | 'home'
  | 'profil'
  | 'berita'
  | 'berita-detail'
  | 'pengumuman'
  | 'galeri'
  | 'layanan-surat'
  | 'kontak'
  | 'login'

export type AdminPage =
  | 'dashboard'
  | 'berita'
  | 'pengumuman'
  | 'galeri'
  | 'surat'
  | 'profil'
  | 'users'

interface AppState {
  viewMode: 'user' | 'admin'
  setViewMode: (mode: 'user' | 'admin') => void
  currentPage: UserPage
  setCurrentPage: (page: UserPage) => void
  currentAdminPage: AdminPage
  setCurrentAdminPage: (page: AdminPage) => void
  selectedBeritaId: string | null
  setSelectedBeritaId: (id: string | null) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  adminSidebarOpen: boolean
  setAdminSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      viewMode: 'user',
      setViewMode: (mode) => set({ viewMode: mode, currentPage: mode === 'user' ? 'home' : 'home', currentAdminPage: 'dashboard' }),
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      currentAdminPage: 'dashboard',
      setCurrentAdminPage: (page) => set({ currentAdminPage: page }),
      selectedBeritaId: null,
      setSelectedBeritaId: (id) => set({ selectedBeritaId: id }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      adminSidebarOpen: true,
      setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
    }),
    {
      name: 'desa-app-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
)
