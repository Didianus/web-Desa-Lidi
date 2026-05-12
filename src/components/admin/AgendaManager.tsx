'use client'

import { useEffect, useState } from 'react'
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
import { Plus, Pencil, Trash2, CalendarCheck, MapPin, Clock, User, Loader2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

interface Agenda {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  pic: string | null
  category: string
  published: boolean
  createdAt: string
}

const categoryColors: Record<string, string> = {
  umum: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rapat: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  kegiatan: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  pelayanan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
}

const categoryLabels: Record<string, string> = {
  umum: 'Umum', rapat: 'Rapat', kegiatan: 'Kegiatan', pelayanan: 'Pelayanan',
}

const emptyForm = { title: '', description: '', date: '', time: '', location: '', pic: '', category: 'umum', published: true }

export function AgendaManager() {
  const { toast } = useToast()
  const { adminDarkMode } = useAppStore()
  const [list, setList] = useState<Agenda[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPublished, setFilterPublished] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Agenda | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const limit = 10

  const fetchData = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCategory) params.set('category', filterCategory)
    if (filterPublished) params.set('published', filterPublished)
    params.set('page', String(page))
    params.set('limit', String(limit))

    fetch(`/api/agenda?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.agenda || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search, filterCategory, filterPublished, page])

  const totalPages = Math.ceil(total / limit)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAgenda = list.filter(a => a.date.split('T')[0] === todayStr)

  const handleSave = async () => {
    if (!form.title || !form.date) {
      toast({ title: 'Error', description: 'Judul dan tanggal wajib diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/agenda/${editing.id}` : '/api/agenda'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast({ title: 'Berhasil', description: `Agenda berhasil ${editing ? 'diupdate' : 'ditambahkan'}` })
      setDialogOpen(false); setEditing(null); setForm(emptyForm); fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan agenda', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus agenda ini?')) return
    try {
      await fetch(`/api/agenda/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Agenda berhasil dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const openEdit = (item: Agenda) => {
    setEditing(item)
    setForm({
      title: item.title, description: item.description || '', date: item.date.split('T')[0],
      time: item.time || '', location: item.location || '', pic: item.pic || '',
      category: item.category, published: item.published,
    })
    setDialogOpen(true)
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda Desa</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola agenda dan jadwal kegiatan desa</p>
        </div>
        <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Agenda
        </Button>
      </div>

      {/* Today's Agenda Highlight */}
      {todayAgenda.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Agenda Hari Ini
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayAgenda.map(item => (
              <Card key={item.id} className="border-l-4 border-l-emerald-500 border-0 shadow-md dark:bg-gray-900">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h4>
                  <div className="mt-2 space-y-1">
                    {item.time && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</p>}
                    {item.location && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</p>}
                    {item.pic && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><User className="w-3 h-3" />{item.pic}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari agenda..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white dark:bg-gray-900" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 bg-white dark:bg-gray-900"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPublished} onValueChange={setFilterPublished}>
          <SelectTrigger className="w-40 bg-white dark:bg-gray-900"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="true">Publish</SelectItem>
            <SelectItem value="false">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Agenda</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Lokasi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">PIC</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">Tidak ada agenda</td></tr>
                ) : list.map(item => {
                  const isToday = item.date.split('T')[0] === todayStr
                  return (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors ${isToday ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center shrink-0">
                            <CalendarCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                              {item.title}
                              {isToday && <Badge className="bg-emerald-600 text-white text-[9px] px-1 py-0">HARI INI</Badge>}
                            </p>
                            {item.time && <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.location || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.pic || '-'}</td>
                      <td className="py-3 px-4"><Badge className={`${categoryColors[item.category]} text-xs`}>{categoryLabels[item.category]}</Badge></td>
                      <td className="py-3 px-4">
                        <Badge className={item.published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}>
                          {item.published ? 'Publish' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="w-4 h-4 text-gray-500" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{editing ? 'Edit Agenda' : 'Tambah Agenda Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label className="dark:text-gray-300">Judul Agenda *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nama agenda" className="mt-1" /></div>
            <div><Label className="dark:text-gray-300">Deskripsi</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi agenda..." className="mt-1 min-h-[80px]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="dark:text-gray-300">Tanggal *</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Waktu</Label><Input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="08:00 - 12:00" className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Lokasi</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Lokasi agenda" className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Penanggung Jawab</Label><Input value={form.pic} onChange={e => setForm(f => ({ ...f, pic: e.target.value }))} placeholder="Nama PIC" className="mt-1" /></div>
              <div>
                <Label className="dark:text-gray-300">Kategori</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm font-medium dark:text-gray-300">Publish</span>
                </label>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? 'Update Agenda' : 'Simpan Agenda'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
