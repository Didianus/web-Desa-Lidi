'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAppStore } from '@/stores/useAppStore'
import { Newspaper, Bell, Image, FileText, Users, Home, Clock, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts'

const COLORS = ['#059669', '#0d9488', '#0891b2', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#ea580c']

export function AdminDashboard() {
  const { user } = useAuthStore()
  const { adminDarkMode } = useAppStore()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Penduduk', value: stats?.totalPenduduk || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', trend: '+12' },
    { label: 'Berita Desa', value: stats?.totalBerita || 0, icon: Newspaper, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/30', trend: '+3' },
    { label: 'Surat Masuk', value: stats?.suratPending || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30', trend: '+5' },
    { label: 'Pengumuman Aktif', value: stats?.totalPengumuman || 0, icon: Bell, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/30', trend: '+1' },
  ]

  const suratCards = [
    { label: 'Menunggu', value: stats?.suratPending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Diproses', value: stats?.suratDiproses || 0, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Selesai', value: stats?.suratSelesai || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Ditolak', value: stats?.suratDitolak || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30' },
  ]

  // Gender data for pie chart
  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLaki || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ]

  const textColor = adminDarkMode ? '#9ca3af' : '#6b7280'

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-32 translate-x-32 opacity-30" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-emerald-400 rounded-full translate-y-24 opacity-20" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Selamat Datang, {user?.name || 'Admin'}! 👋</h1>
          <p className="text-emerald-200 mt-1">Panel administrasi Desa Sukamaju — {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3 h-3 mr-1" />{card.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Surat by Jenis - Bar Chart */}
        <Card className="lg:col-span-2 border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Statistik Surat per Jenis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.suratByJenis || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={adminDarkMode ? '#374151' : '#f3f4f6'} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: textColor }} />
                <YAxis tick={{ fontSize: 12, fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: adminDarkMode ? '#1f2937' : '#fff',
                    border: `1px solid ${adminDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: adminDarkMode ? '#fff' : '#000',
                  }}
                />
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Pie Chart */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Jenis Kelamin</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#0891b2'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Surat Status Cards */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Status Surat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suratCards.map((card, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{card.label}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pekerjaan Distribution */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Pekerjaan Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats?.pendudukByPekerjaan || []} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {(stats?.pendudukByPekerjaan || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Surat */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Surat Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(stats?.recentSurat || []).map((s: any, i: number) => {
              const statusColors: Record<string, string> = {
                pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                diproses: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                selesai: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                ditolak: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              }
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{s.jenisSurat}</p>
                  </div>
                  <Badge className={`${statusColors[s.status] || ''} text-[10px]`}>{s.status}</Badge>
                </div>
              )
            })}
            {(!stats?.recentSurat || stats.recentSurat.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada surat</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
