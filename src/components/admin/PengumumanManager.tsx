'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, Bell, Loader2, ChevronLeft, ChevronRight, Download, FileJson, FileSpreadsheet, Search } from 'lucide-react'

interface Pengumuman {
  id: string
  title: string
  content: string
  priority: string
  published: boolean
  createdAt: string
}

export function PengumumanManager() {
  const { toast } = useToast()
  const [list, setList] = useState<Pengumuman[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Pengumuman | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', published: true })

  // Search, Filter, Pagination
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('semua')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const totalPages = Math.ceil(total / limit)

  const fetchData = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterPriority !== 'semua') params.set('priority', filterPriority)
    if (filterStatus === 'published') params.set('published', 'true')
    if (filterStatus === 'draft') params.set('published', 'false')
    params.set('page', String(page))
    params.set('limit', String(limit))

    fetch(`/api/pengumuman?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.pengumuman || []); setTotal(d.total || 0); setLoading(false) })
      .catch(() => { setLoading(false) })
  }

  useEffect(() => { fetchData() }, [page, filterPriority, filterStatus])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({ title: 'Error', description: 'Judul dan konten harus diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/pengumuman/${editing.id}` : '/api/pengumuman'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast({ title: 'Berhasil', description: `Pengumuman berhasil ${editing ? 'diupdate' : 'dibuat'}` })
      setDialogOpen(false); setEditing(null); setForm({ title: '', content: '', priority: 'normal', published: true })
      setLoading(true)
      fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan pengumuman', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return
    try {
      await fetch(`/api/pengumuman/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Pengumuman berhasil dihapus' })
      setLoading(true)
      fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const handleExport = async (format: string) => {
    try {
      const res = await fetch(`/api/export?type=pengumuman&format=${format}`)
      if (format === 'csv') {
        const text = await res.text()
        const blob = new Blob([text], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `pengumuman_${new Date().toISOString().split('T')[0]}.csv`; a.click()
        URL.revokeObjectURL(url)
      } else {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `pengumuman_${new Date().toISOString().split('T')[0]}.json`; a.click()
        URL.revokeObjectURL(url)
      }
      toast({ title: 'Berhasil', description: `Data berhasil diexport sebagai ${format.toUpperCase()}` })
    } catch {
      toast({ title: 'Error', description: 'Gagal mengexport data', variant: 'destructive' })
    }
  }

  const openEdit = (item: Pengumuman) => {
    setEditing(item); setForm({ title: item.title, content: item.content, priority: item.priority, published: item.published }); setDialogOpen(true)
  }

  const priorityBadge: Record<string, string> = {
    penting: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    normal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    biasa: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  }

  const handlePageChange = (newPage: number) => {
    setLoading(true)
    setPage(newPage)
  }

  const handleFilterPriorityChange = (v: string) => {
    setLoading(true)
    setFilterPriority(v)
    setPage(1)
  }

  const handleFilterStatusChange = (v: 'all' | 'published' | 'draft') => {
    setLoading(true)
    setFilterStatus(v)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Pengumuman</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola pengumuman desa</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 dark:bg-gray-800 dark:border-gray-700">
                <Download className="w-4 h-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileJson className="w-4 h-4 mr-2" /> Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditing(null); setForm({ title: '', content: '', priority: 'normal', published: true }); setDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" /> Tambah Pengumuman
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl dark:bg-gray-900">
              <DialogHeader><DialogTitle className="dark:text-white">{editing ? 'Edit' : 'Tambah'} Pengumuman</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div><label className="text-sm font-medium dark:text-gray-300">Judul *</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" /></div>
                <div><label className="text-sm font-medium dark:text-gray-300">Konten *</label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="mt-1 min-h-[150px]" /></div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Prioritas</label>
                  <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="penting">🔴 Penting</SelectItem>
                      <SelectItem value="normal">🟢 Normal</SelectItem>
                      <SelectItem value="biasa">⚪ Biasa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                  <label className="text-sm font-medium dark:text-gray-300">Publish</label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editing ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari pengumuman berdasarkan judul..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Select value={filterPriority} onValueChange={handleFilterPriorityChange}>
          <SelectTrigger className="w-full sm:w-[160px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Prioritas</SelectItem>
            <SelectItem value="penting">🔴 Penting</SelectItem>
            <SelectItem value="normal">🟢 Normal</SelectItem>
            <SelectItem value="biasa">⚪ Biasa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
          <SelectTrigger className="w-full sm:w-[160px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Publish</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Judul</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Prioritas</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Memuat...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Belum ada pengumuman</td></tr>
                ) : list.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center shrink-0"><Bell className="w-4 h-4 text-emerald-600" /></div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[250px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge className={priorityBadge[item.priority] || 'bg-gray-100 text-gray-700'}>{item.priority}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={item.published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}>{item.published ? 'Publish' : 'Draft'}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8"><Pencil className="w-4 h-4 text-gray-500" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8"><Trash2 className="w-4 h-4 text-red-500" /></Button>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} dari {total} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="gap-1 dark:bg-gray-800 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hal {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="gap-1 dark:bg-gray-800 dark:border-gray-700"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
