'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, Bell, Loader2 } from 'lucide-react'

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

  const fetchData = () => {
    fetch('/api/pengumuman?limit=50')
      .then(r => r.json())
      .then(d => setList(d.pengumuman || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

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
      fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const openEdit = (item: Pengumuman) => {
    setEditing(item); setForm({ title: item.title, content: item.content, priority: item.priority, published: item.published }); setDialogOpen(true)
  }

  const priorityBadge: Record<string, string> = {
    penting: 'bg-red-100 text-red-700',
    normal: 'bg-emerald-100 text-emerald-700',
    biasa: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengumuman</h1>
          <p className="text-gray-500 text-sm">Kelola pengumuman desa</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm({ title: '', content: '', priority: 'normal', published: true }); setDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Tambah'} Pengumuman</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><label className="text-sm font-medium">Judul *</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">Konten *</label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="mt-1 min-h-[150px]" /></div>
              <div>
                <label className="text-sm font-medium">Prioritas</label>
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
                <label className="text-sm font-medium">Publish</label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editing ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Judul</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Prioritas</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Memuat...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Belum ada pengumuman</td></tr>
                ) : list.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center shrink-0"><Bell className="w-4 h-4 text-emerald-600" /></div>
                        <span className="font-medium text-gray-900 text-sm truncate max-w-[250px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge className={priorityBadge[item.priority] || 'bg-gray-100 text-gray-700'}>{item.priority}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}>{item.published ? 'Publish' : 'Draft'}</Badge>
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
    </div>
  )
}
