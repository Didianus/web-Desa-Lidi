'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/useAuthStore'
import { Plus, Pencil, Trash2, Newspaper, Loader2 } from 'lucide-react'

interface Berita {
  id: string
  title: string
  content: string
  image?: string
  published: boolean
  createdAt: string
  author: { name: string }
}

export function BeritaManager() {
  const { toast } = useToast()
  const { user, token } = useAuthStore()
  const [list, setList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Berita | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', image: '', published: true })

  const fetchBerita = () => {
    fetch('/api/berita?limit=50')
      .then(r => r.json())
      .then(d => setList(d.berita || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBerita() }, [])

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({ title: 'Error', description: 'Judul dan konten harus diisi', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const url = editing ? `/api/berita/${editing.id}` : '/api/berita'
      const method = editing ? 'PUT' : 'POST'
      const body = { ...form, authorId: user?.id }

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
      fetchBerita()
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus berita', variant: 'destructive' })
    }
  }

  const openEdit = (item: Berita) => {
    setEditing(item)
    setForm({ title: item.title, content: item.content, image: item.image || '', published: item.published })
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', content: '', image: '', published: true })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
          <p className="text-gray-500 text-sm">Kelola berita desa</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Judul *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Judul berita" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Konten *</label>
                <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Isi berita..." className="mt-1 min-h-[200px]" />
              </div>
              <div>
                <label className="text-sm font-medium">URL Gambar</label>
                <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                <label htmlFor="published" className="text-sm font-medium">Publish</label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editing ? 'Update Berita' : 'Simpan Berita'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Judul</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Belum ada berita</td></tr>
                ) : (
                  list.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center shrink-0">
                            <Newspaper className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}>
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
    </div>
  )
}
