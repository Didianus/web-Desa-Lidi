'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/stores/useAppStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'
import { Users, FileText, TrendingUp, Download, FileJson, FileSpreadsheet, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

const COLORS = ['#059669', '#0d9488', '#0891b2', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#ea580c', '#2563eb', '#65a30d']

export function LaporanPage() {
  const { adminDarkMode } = useAppStore()
  const { toast } = useToast()
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d)).catch(() => {})
  }, [])

  const textColor = adminDarkMode ? '#9ca3af' : '#6b7280'
  const gridColor = adminDarkMode ? '#374151' : '#f3f4f6'

  const jenisSuratLabels: Record<string, string> = {
    domisili: 'Surat Domisili', usaha: 'Surat Usaha', kelahiran: 'Surat Kelahiran', kematian: 'Surat Kematian',
  }

  const suratJenisData = (stats?.suratByJenis || []).map((s: any) => ({
    ...s, name: jenisSuratLabels[s.name] || s.name,
  }))

  // Summary cards data
  const summary = [
    { label: 'Total Penduduk Aktif', value: stats?.pendudukAktif || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Laki-laki', value: stats?.pendudukLaki || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Perempuan', value: stats?.pendudukPerempuan || 0, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/30' },
    { label: 'Total Surat', value: stats?.totalSurat || 0, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  ]

  const handleExport = async (format: string) => {
    try {
      const types = ['penduduk', 'surat', 'kegiatan']
      for (const type of types) {
        const res = await fetch(`/api/export?type=${type}&format=${format}`)
        if (!res.ok) continue
        if (format === 'csv') {
          const text = await res.text()
          const blob = new Blob([text], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`; a.click()
          URL.revokeObjectURL(url)
        } else {
          const data = await res.json()
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = `${type}_${new Date().toISOString().split('T')[0]}.json`; a.click()
          URL.revokeObjectURL(url)
        }
      }
      toast({ title: 'Berhasil', description: `Data berhasil diexport sebagai ${format.toUpperCase()}` })
    } catch { toast({ title: 'Error', description: 'Gagal mengexport data', variant: 'destructive' }) }
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Ringkasan data dan statistik desa</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 dark:border-gray-700">
              <Download className="w-4 h-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              <FileJson className="w-4 h-4 mr-2" /> Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrintPDF}>
              <Printer className="w-4 h-4 mr-2" /> Print PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((card, i) => (
          <Card key={i} className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Surat per Jenis */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader><CardTitle className="text-base dark:text-white">Surat per Jenis</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={suratJenisData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} />
                <YAxis tick={{ fontSize: 12, fill: textColor }} />
                <Tooltip contentStyle={{ backgroundColor: adminDarkMode ? '#1f2937' : '#fff', border: `1px solid ${adminDarkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', color: adminDarkMode ? '#fff' : '#000' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {suratJenisData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pendidikan */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader><CardTitle className="text-base dark:text-white">Tingkat Pendidikan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats?.pendudukByPendidikan || []} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {(stats?.pendudukByPendidikan || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pekerjaan */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader><CardTitle className="text-base dark:text-white">Distribusi Pekerjaan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.pendudukByPekerjaan || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" tick={{ fontSize: 12, fill: textColor }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: textColor }} />
                <Tooltip contentStyle={{ backgroundColor: adminDarkMode ? '#1f2937' : '#fff', border: `1px solid ${adminDarkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', color: adminDarkMode ? '#fff' : '#000' }} />
                <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agama */}
        <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader><CardTitle className="text-base dark:text-white">Komposisi Agama</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats?.pendudukByAgama || []} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {(stats?.pendudukByAgama || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Surat */}
        <Card className="lg:col-span-2 border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
          <CardHeader><CardTitle className="text-base dark:text-white">Status Pengajuan Surat</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Menunggu', value: stats?.suratPending || 0, fill: '#f59e0b' },
                { name: 'Diproses', value: stats?.suratDiproses || 0, fill: '#3b82f6' },
                { name: 'Selesai', value: stats?.suratSelesai || 0, fill: '#059669' },
                { name: 'Ditolak', value: stats?.suratDitolak || 0, fill: '#dc2626' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: textColor }} />
                <YAxis tick={{ fontSize: 12, fill: textColor }} />
                <Tooltip contentStyle={{ backgroundColor: adminDarkMode ? '#1f2937' : '#fff', border: `1px solid ${adminDarkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', color: adminDarkMode ? '#fff' : '#000' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {[0,1,2,3].map(i => (
                    <Cell key={i} fill={['#f59e0b','#3b82f6','#059669','#dc2626'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardHeader><CardTitle className="text-base dark:text-white">Ringkasan Data Desa</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Penduduk Aktif', value: stats?.pendudukAktif || 0 },
              { label: 'Penduduk Pindah', value: stats?.pendudukPindah || 0 },
              { label: 'Penduduk Meninggal', value: stats?.pendudukMeninggal || 0 },
              { label: 'Total Berita', value: stats?.totalBerita || 0 },
              { label: 'Pengumuman Aktif', value: stats?.totalPengumuman || 0 },
              { label: 'Foto Galeri', value: stats?.totalGaleri || 0 },
              { label: 'Surat Selesai', value: stats?.suratSelesai || 0 },
              { label: 'Surat Pending', value: stats?.suratPending || 0 },
              { label: 'Total Kegiatan', value: stats?.totalKegiatan || 0 },
              { label: 'Total Agenda', value: stats?.totalAgenda || 0 },
              { label: 'Chat Aktif', value: stats?.chatRoomsActive || 0 },
              { label: 'Notifikasi Baru', value: stats?.notifikasiUnread || 0 },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
