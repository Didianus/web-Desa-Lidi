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
import { RegisterPage } from '@/components/user/RegisterPage'
import { WargaDashboard } from '@/components/user/WargaDashboard'
import { ChatWargaPage } from '@/components/user/ChatWargaPage'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { BeritaManager } from '@/components/admin/BeritaManager'
import { PengumumanManager } from '@/components/admin/PengumumanManager'
import { GaleriManager } from '@/components/admin/GaleriManager'
import { PendudukManager } from '@/components/admin/PendudukManager'
import { SuratManager } from '@/components/admin/SuratManager'
import { LaporanPage } from '@/components/admin/LaporanPage'
import { PengaturanPage } from '@/components/admin/PengaturanPage'
import { KegiatanPage } from '@/components/user/KegiatanPage'
import { KegiatanManager } from '@/components/admin/KegiatanManager'
import { AgendaManager } from '@/components/admin/AgendaManager'
import { ChatWargaManager } from '@/components/admin/ChatWargaManager'
import { NotifikasiManager } from '@/components/admin/NotifikasiManager'

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
      case 'kegiatan':
        return <KegiatanPage />
      case 'galeri':
        return <GaleriPage />
      case 'layanan-surat':
        return <LayananSuratPage />
      case 'kontak':
        return <KontakPage />
      case 'dashboard-warga':
        return <WargaDashboard />
      case 'chat-warga':
        return <ChatWargaPage />
      default:
        return <HeroSection />
    }
  }

  if (currentPage === 'login') {
    return <LoginPage />
  }

  if (currentPage === 'register') {
    return <RegisterPage />
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
  const { currentAdminPage, adminDarkMode } = useAppStore()
  const { isAuthenticated } = useAuthStore()

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
      case 'penduduk':
        return <PendudukManager />
      case 'surat':
        return <SuratManager />
      case 'kegiatan':
        return <KegiatanManager />
      case 'agenda':
        return <AgendaManager />
      case 'chat':
        return <ChatWargaManager />
      case 'notifikasi':
        return <NotifikasiManager />
      case 'laporan':
        return <LaporanPage />
      case 'pengaturan':
        return <PengaturanPage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className={`flex h-screen ${adminDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  const { viewMode } = useAppStore()

  return viewMode === 'admin' ? <AdminLayout /> : <UserLayout />
}
