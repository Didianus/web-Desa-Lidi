'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/useAuthStore'
import { Plus, Pencil, Trash2, Newspaper, Loader2, ChevronLeft, ChevronRight, Download, FileJson, FileSpreadsheet, Search, X } from 'lucide-react'

interface Berita {
  id: string
  title: string
  content: string
  image?: string
  images?: string
  published: boolean
  createdAt: string
  author: { name: string }
}

export function BeritaManager() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [list, setList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Berita | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', image: '', published: true })
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // Search, Filter, Pagination
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const totalPages = Math.ceil(total / limit)

  const fetchBerita = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus === 'published') params.set('published', 'true')
    if (filterStatus === 'draft') params.set('published', 'false')
    params.set('page', String(page))
    params.set('limit', String(limit))

    fetch(`/api/berita?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.berita || []); setTotal(d.total || 0); setLoading(false) })
      .catch(() => { setLoading(false) })
  }

  useEffect(() => { fetchBerita() }, [page, filterStatus])

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
      const url = editing ? `/api/berita/${editing.id}` : '/api/berita'
      const method = editing ? 'PUT' : 'POST'
      const allImages = [form.image, ...imageUrls].filter(Boolean)
      const body = {
        ...form,
        authorId: user?.id,
        images: allImages.length > 0 ? JSON.stringify(allImages) : undefined,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()

      toast({ title: editing ? 'Berhasil Diupdate' : 'Berhasil Dibuat', description: `Berita berhasil ${editing ? 'diupdate' : 'dibuat'}` })
      setDialogOpen(false)
      setEditing(null)
      setForm({ title: '', content: '', image: '', published: true })
      setImageUrls([])
      setLoading(true)
      fetchBerita()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan berita', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return
    try {
      await fetch(`/api/berita/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Berita berhasil dihapus' })
      setLoading(true)
      fetchBerita()
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus berita', variant: 'destructive' })
    }
  }

  const handleExport = async (format: string) => {
    try {
      const res = await fetch(`/api/export?type=berita&format=${format}`)
      if (format === 'csv') {
        const text = await res.text()
        const blob = new Blob([text], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `berita_${new Date().toISOString().split('T')[0]}.csv`; a.click()
        URL.revokeObjectURL(url)
      } else {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = `berita_${new Date().toISOString().split('T')[0]}.json`; a.click()
        URL.revokeObjectURL(url)
      }
      toast({ title: 'Berhasil', description: `Data berhasil diexport sebagai ${format.toUpperCase()}` })
    } catch {
      toast({ title: 'Error', description: 'Gagal mengexport data', variant: 'destructive' })
    }
  }

  const openEdit = (item: Berita) => {
    setEditing(item)
    setForm({ title: item.title, content: item.content, image: item.image || '', published: item.published })
    try {
      const parsed = item.images ? JSON.parse(item.images) : []
      setImageUrls(Array.isArray(parsed) && parsed.length > 1 ? parsed.slice(1) : [])
    } catch {
      setImageUrls([])
    }
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', content: '', image: '', published: true })
    setImageUrls([])
    setDialogOpen(true)
  }

  const addImageUrl = () => {
    setImageUrls(prev => [...prev, ''])
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const updateImageUrl = (index: number, value: string) => {
    setImageUrls(prev => prev.map((url, i) => i === index ? value : url))
  }

  const handlePageChange = (newPage: number) => {
    setLoading(true)
    setPage(newPage)
  }

  const handleFilterChange = (v: 'all' | 'published' | 'draft') => {
    setLoading(true)
    setFilterStatus(v)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Berita</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola berita desa</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
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
              <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" /> Tambah Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="dark:text-white">{editing ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Judul *</label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Judul berita" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Konten *</label>
                  <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Isi berita..." className="mt-1 min-h-[200px]" />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">URL Gambar Utama</label>
                  <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="mt-1" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium dark:text-gray-300">Gambar Tambahan</label>
                    <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="h-7 text-xs gap-1">
                      <Plus className="w-3 h-3" /> Tambah Gambar
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={url}
                          onChange={e => updateImageUrl(index, e.target.value)}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeImageUrl(index)}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                  <label htmlFor="published" className="text-sm font-medium dark:text-gray-300">Publish</label>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editing ? 'Update Berita' : 'Simpan Berita'}
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
            placeholder="Cari berita berdasarkan judul..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Select value={filterStatus} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Publish</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Judul</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Belum ada berita</td></tr>
                ) : (
                  list.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center shrink-0">
                            <Newspaper className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-[200px]">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={item.published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}>
                          {item.published ? 'Publish' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8">
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
