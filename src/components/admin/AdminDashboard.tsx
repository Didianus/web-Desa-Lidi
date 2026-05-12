'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import { Newspaper, Bell, Image, FileText, Users, Home, Clock, CheckCircle } from 'lucide-react'

export function AdminDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Berita', value: stats?.totalBerita || 0, icon: Newspaper, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Pengumuman', value: stats?.totalPengumuman || 0, icon: Bell, color: 'bg-teal-500', bg: 'bg-teal-50' },
    { label: 'Total Galeri', value: stats?.totalGaleri || 0, icon: Image, color: 'bg-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Total Surat', value: stats?.totalSurat || 0, icon: FileText, color: 'bg-amber-500', bg: 'bg-amber-50' },
  ]

  const suratCards = [
    { label: 'Menunggu', value: stats?.suratPending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Diproses', value: stats?.suratDiproses || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Selesai', value: stats?.suratSelesai || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Penduduk', value: stats?.jumlahPenduduk?.toLocaleString() || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, {user?.name || 'Admin'}! 👋</h1>
        <p className="text-emerald-200 mt-1">Panel administrasi Desa Sukamaju</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Surat Status */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Status Surat & Penduduk</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {suratCards.map((card, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
