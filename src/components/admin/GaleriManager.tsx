'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'

interface GaleriItem {
  id: string
  title: string
  image: string
  category: string
  createdAt: string
}

export function GaleriManager() {
  const { toast } = useToast()
  const [list, setList] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', image: '', category: 'umum' })

  const fetchData = () => {
    fetch('/api/galeri?limit=50')
      .then(r => r.json())
      .then(d => setList(d.galeri || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async () => {
    if (!form.title || !form.image) {
      toast({ title: 'Error', description: 'Judul dan gambar harus diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/galeri', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast({ title: 'Berhasil', description: 'Foto berhasil ditambahkan' })
      setDialogOpen(false); setForm({ title: '', image: '', category: 'umum' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menambahkan foto', variant: 'destructive' }) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return
    try {
      await fetch(`/api/galeri/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Foto berhasil dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const categoryBadge: Record<string, string> = {
    umum: 'bg-gray-100 text-gray-700', kegiatan: 'bg-emerald-100 text-emerald-700',
    pembangunan: 'bg-amber-100 text-amber-700', budaya: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1><p className="text-gray-500 text-sm">Kelola foto galeri desa</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm({ title: '', image: '', category: 'umum' }); setDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Tambah Foto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah Foto</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><label className="text-sm font-medium">Judul *</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" /></div>
              <div><label className="text-sm font-medium">URL Gambar *</label><Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="mt-1" /></div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="pembangunan">Pembangunan</SelectItem>
                    <SelectItem value="budaya">Budaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />)
        ) : list.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">Belum ada foto</div>
        ) : list.map(item => (
          <Card key={item.id} className="border-0 shadow-md overflow-hidden group">
            <div className="aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-white/40" /></div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <Badge className={`${categoryBadge[item.category] || 'bg-gray-100'} text-xs mt-1`}>{item.category}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
