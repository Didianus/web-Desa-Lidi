'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/useAppStore'
import { Plus, Pencil, Trash2, CalendarDays, List, ChevronLeft, ChevronRight, MapPin, Clock, Loader2, Search, Filter } from 'lucide-react'

interface Kegiatan {
  id: string
  title: string
  description: string | null
  date: string
  endDate: string | null
  time: string | null
  location: string | null
  category: string
  status: string
  createdAt: string
}

const categoryColors: Record<string, string> = {
  umum: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pemerintahan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sosial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  budaya: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  pendidikan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
}

const categoryDots: Record<string, string> = {
  umum: 'bg-emerald-500',
  pemerintahan: 'bg-blue-500',
  sosial: 'bg-amber-500',
  budaya: 'bg-purple-500',
  pendidikan: 'bg-cyan-500',
}

const statusColors: Record<string, string> = {
  akan_datang: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  berlangsung: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  selesai: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  dibatalkan: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const categoryLabels: Record<string, string> = {
  umum: 'Umum', pemerintahan: 'Pemerintahan', sosial: 'Sosial', budaya: 'Budaya', pendidikan: 'Pendidikan',
}

const statusLabels: Record<string, string> = {
  akan_datang: 'Akan Datang', berlangsung: 'Berlangsung', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
}

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const emptyForm = { title: '', description: '', date: '', endDate: '', time: '', location: '', category: 'umum', status: 'akan_datang' }

export function KegiatanManager() {
  const { toast } = useToast()
  const { adminDarkMode } = useAppStore()
  const [list, setList] = useState<Kegiatan[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Kegiatan | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  // Calendar state
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const limit = 10

  const fetchData = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCategory) params.set('category', filterCategory)
    if (filterStatus) params.set('status', filterStatus)
    params.set('page', String(page))
    params.set('limit', String(limit))

    fetch(`/api/kegiatan?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.kegiatan || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search, filterCategory, filterStatus, page])

  const totalPages = Math.ceil(total / limit)

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [calMonth, calYear])

  const eventsByDate = useMemo(() => {
    const map: Record<string, Kegiatan[]> = {}
    list.forEach(k => {
      const d = new Date(k.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!map[key]) map[key] = []
      map[key].push(k)
    })
    return map
  }, [list])

  const handleSave = async () => {
    if (!form.title || !form.date) {
      toast({ title: 'Error', description: 'Judul dan tanggal wajib diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/kegiatan/${editing.id}` : '/api/kegiatan'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast({ title: 'Berhasil', description: `Kegiatan berhasil ${editing ? 'diupdate' : 'ditambahkan'}` })
      setDialogOpen(false); setEditing(null); setForm(emptyForm); fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan kegiatan', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return
    try {
      await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Kegiatan berhasil dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const openEdit = (item: Kegiatan) => {
    setEditing(item)
    setForm({
      title: item.title, description: item.description || '', date: item.date.split('T')[0],
      endDate: item.endDate ? item.endDate.split('T')[0] : '', time: item.time || '',
      location: item.location || '', category: item.category, status: item.status,
    })
    setDialogOpen(true)
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  const getDateKey = (day: number) => `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const today = new Date()
  const isToday = (day: number) => calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()

  const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] || []) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kalender Kegiatan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola kegiatan dan acara desa</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>
              <CalendarDays className="w-4 h-4 inline mr-1" />Kalender
            </button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>
              <List className="w-4 h-4 inline mr-1" />List
            </button>
          </div>
          <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" /> Tambah Kegiatan
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari kegiatan..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white dark:bg-gray-900" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 bg-white dark:bg-gray-900"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-white dark:bg-gray-900"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                  {MONTHS[calMonth]} {calYear}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} className="h-20" />
                  const dateKey = getDateKey(day)
                  const events = eventsByDate[dateKey] || []
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`h-20 p-1.5 rounded-lg text-left border transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        isToday(day) ? 'border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800' : 'border-gray-100 dark:border-gray-800'
                      } ${selectedDate === dateKey ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400' : ''}`}
                    >
                      <span className={`text-xs font-medium ${isToday(day) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 2).map((e, j) => (
                          <div key={j} className={`h-1.5 rounded-full ${categoryDots[e.category] || 'bg-gray-400'}`} />
                        ))}
                        {events.length > 2 && <span className="text-[9px] text-gray-400">+{events.length - 2}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t dark:border-gray-800">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${categoryDots[key]}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Day Detail Panel */}
          <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base dark:text-white">
                {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih Tanggal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map(item => (
                      <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">{item.title}</h4>
                          <Badge className={`${categoryColors[item.category]} text-[10px]`}>{categoryLabels[item.category]}</Badge>
                        </div>
                        {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {item.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>}
                          {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t dark:border-gray-700">
                          <Badge className={`${statusColors[item.status]} text-[10px]`}>{statusLabels[item.status]}</Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(item.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">Tidak ada kegiatan pada tanggal ini</p>
                )
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">Klik tanggal pada kalender untuk melihat detail kegiatan</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <>
          <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Kegiatan</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Tanggal</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Lokasi</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
                    ) : list.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-gray-400">Tidak ada kegiatan</td></tr>
                    ) : list.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center shrink-0">
                              <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</p>
                              {item.time && <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.location || '-'}</td>
                        <td className="py-3 px-4"><Badge className={`${categoryColors[item.category]} text-xs`}>{categoryLabels[item.category]}</Badge></td>
                        <td className="py-3 px-4"><Badge className={`${statusColors[item.status]} text-xs`}>{statusLabels[item.status]}</Badge></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="w-4 h-4 text-gray-500" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Halaman {page} dari {totalPages} ({total} data)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{editing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label className="dark:text-gray-300">Judul Kegiatan *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nama kegiatan" className="mt-1" /></div>
            <div><Label className="dark:text-gray-300">Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi kegiatan..." className="mt-1 min-h-[80px]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="dark:text-gray-300">Tanggal Mulai *</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Tanggal Selesai</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Waktu</Label><Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Lokasi</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Lokasi kegiatan" className="mt-1" /></div>
              <div>
                <Label className="dark:text-gray-300">Kategori</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="dark:text-gray-300">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? 'Update Kegiatan' : 'Simpan Kegiatan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
