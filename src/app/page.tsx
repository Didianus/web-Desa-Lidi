'use client'

import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Navbar } from '@/components/user/Navbar'
import { Footer } from '@/components/user/Footer'
import { HeroSection } from '@/components/user/HeroSection'
import { SambutanSection } from '@/components/user/SambutanSection'
import { StatistikSection } from '@/components/user/StatistikSection'
import { BeritaSection } from '@/components/user/BeritaSection'
import { PengumumanSection } from '@/components/user/PengumumanSection'
import { ProfilDesa } from '@/components/user/ProfilDesa'
import { BeritaPage, BeritaDetail } from '@/components/user/BeritaPage'
import { PengumumanPage } from '@/components/user/PengumumanPage'
import { GaleriPage } from '@/components/user/GaleriPage'
import { LayananSuratPage } from '@/components/user/LayananSuratPage'
import { KontakPage } from '@/components/user/KontakPage'
import { LoginPage } from '@/components/user/LoginPage'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { BeritaManager } from '@/components/admin/BeritaManager'
import { PengumumanManager } from '@/components/admin/PengumumanManager'
import { GaleriManager } from '@/components/admin/GaleriManager'
import { SuratManager } from '@/components/admin/SuratManager'
import { ProfilManager } from '@/components/admin/ProfilManager'
import { UserManager } from '@/components/admin/UserManager'

function UserLayout() {
  const { currentPage } = useAppStore()

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <SambutanSection />
            <StatistikSection />
            <BeritaSection />
            <PengumumanSection />
          </>
        )
      case 'profil':
        return <ProfilDesa />
      case 'berita':
        return <BeritaPage />
      case 'berita-detail':
        return <BeritaDetail />
      case 'pengumuman':
        return <PengumumanPage />
      case 'galeri':
        return <GaleriPage />
      case 'layanan-surat':
        return <LayananSuratPage />
      case 'kontak':
        return <KontakPage />
      case 'login':
        return <LoginPage />
      default:
        return <HeroSection />
    }
  }

  // Login page has its own full-screen layout
  if (currentPage === 'login') {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

function AdminLayout() {
  const { currentAdminPage } = useAppStore()
  const { isAuthenticated } = useAuthStore()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentAdminPage) {
      case 'dashboard':
        return <AdminDashboard />
      case 'berita':
        return <BeritaManager />
      case 'pengumuman':
        return <PengumumanManager />
      case 'galeri':
        return <GaleriManager />
      case 'surat':
        return <SuratManager />
      case 'profil':
        return <ProfilManager />
      case 'users':
        return <UserManager />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  )
}

export default function Home() {
  const { viewMode } = useAppStore()

  return viewMode === 'admin' ? <AdminLayout /> : <UserLayout />
}
