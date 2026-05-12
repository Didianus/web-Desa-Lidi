'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, Users, Search, Loader2, Filter } from 'lucide-react'

interface Penduduk {
  id: string
  nik: string
  nama: string
  jenisKelamin: string
  tempatLahir: string | null
  tanggalLahir: Date | null
  alamat: string
  rt: string
  rw: string
  pekerjaan: string
  status: string
  agama: string
  statusKawin: string
  pendidikan: string
}

const statusColors: Record<string, string> = {
  aktif: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pindah: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  meninggal: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const emptyForm = {
  nik: '', nama: '', jenisKelamin: 'Laki-laki', tempatLahir: '', tanggalLahir: '',
  alamat: '', rt: '001', rw: '001', pekerjaan: 'Belum Bekerja', status: 'aktif',
  agama: 'Islam', statusKawin: 'Belum Kawin', pendidikan: 'SMA',
}

export function PendudukManager() {
  const { toast } = useToast()
  const [list, setList] = useState<Penduduk[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Penduduk | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const fetchData = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    params.set('limit', '50')

    fetch(`/api/penduduk?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.penduduk || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search, filterStatus])

  const handleSave = async () => {
    if (!form.nik || !form.nama || !form.jenisKelamin || !form.alamat) {
      toast({ title: 'Error', description: 'NIK, Nama, Jenis Kelamin, dan Alamat wajib diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/penduduk/${editing.id}` : '/api/penduduk'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')

      toast({ title: 'Berhasil', description: `Data penduduk berhasil ${editing ? 'diupdate' : 'ditambahkan'}` })
      setDialogOpen(false); setEditing(null); setForm(emptyForm); fetchData()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Gagal menyimpan data', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data penduduk ini?')) return
    try {
      await fetch(`/api/penduduk/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Data penduduk berhasil dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const openEdit = (item: Penduduk) => {
    setEditing(item)
    setForm({
      nik: item.nik, nama: item.nama, jenisKelamin: item.jenisKelamin,
      tempatLahir: item.tempatLahir || '', tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir).toISOString().split('T')[0] : '',
      alamat: item.alamat, rt: item.rt, rw: item.rw, pekerjaan: item.pekerjaan,
      status: item.status, agama: item.agama, statusKawin: item.statusKawin, pendidikan: item.pendidikan,
    })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Penduduk</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total: {total} penduduk terdaftar</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Penduduk
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari NIK, nama, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-900"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-white dark:bg-gray-900">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="pindah">Pindah</SelectItem>
            <SelectItem value="meninggal">Meninggal</SelectItem>
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">NIK</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">L/P</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Pekerjaan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">RT/RW</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">Memuat data...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">Tidak ada data penduduk</td></tr>
                ) : list.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600 dark:text-gray-400">{item.nik}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{item.nama}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{item.jenisKelamin === 'Laki-laki' ? '👨' : '👩'} {item.jenisKelamin}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{item.pekerjaan}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.rt}/{item.rw}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${statusColors[item.status] || 'bg-gray-100 text-gray-700'} text-xs capitalize`}>{item.status}</Badge>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{editing ? 'Edit Data Penduduk' : 'Tambah Data Penduduk'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="dark:text-gray-300">NIK *</Label><Input value={form.nik} onChange={e => setForm(f => ({ ...f, nik: e.target.value }))} maxLength={16} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Nama Lengkap *</Label><Input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label className="dark:text-gray-300">Jenis Kelamin *</Label>
                <Select value={form.jenisKelamin} onValueChange={v => setForm(f => ({ ...f, jenisKelamin: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label className="dark:text-gray-300">Tempat Lahir</Label><Input value={form.tempatLahir} onChange={e => setForm(f => ({ ...f, tempatLahir: e.target.value }))} className="mt-1" /></div>
              <div><Label className="dark:text-gray-300">Tanggal Lahir</Label><Input type="date" value={form.tanggalLahir} onChange={e => setForm(f => ({ ...f, tanggalLahir: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label className="dark:text-gray-300">Agama</Label>
                <Select value={form.agama} onValueChange={v => setForm(f => ({ ...f, agama: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="dark:text-gray-300">Alamat *</Label><Input value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="dark:text-gray-300">RT</Label><Input value={form.rt} onChange={e => setForm(f => ({ ...f, rt: e.target.value }))} maxLength={3} className="mt-1" /></div>
                <div><Label className="dark:text-gray-300">RW</Label><Input value={form.rw} onChange={e => setForm(f => ({ ...f, rw: e.target.value }))} maxLength={3} className="mt-1" /></div>
              </div>
              <div>
                <Label className="dark:text-gray-300">Pekerjaan</Label>
                <Select value={form.pekerjaan} onValueChange={v => setForm(f => ({ ...f, pekerjaan: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Belum Bekerja', 'PNS', 'TNI', 'Polisi', 'Wiraswasta', 'Pedagang', 'Petani', 'Karyawan Swasta', 'Guru', 'Dokter', 'Perawat', 'Ibu Rumah Tangga', 'Pelajar', 'Mahasiswa', 'Pensiunan', 'Sopir', 'Buruh'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="dark:text-gray-300">Pendidikan</Label>
                <Select value={form.pendidikan} onValueChange={v => setForm(f => ({ ...f, pendidikan: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="dark:text-gray-300">Status Perkawinan</Label>
                <Select value={form.statusKawin} onValueChange={v => setForm(f => ({ ...f, statusKawin: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="dark:text-gray-300">Status Penduduk</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="pindah">Pindah</SelectItem>
                    <SelectItem value="meninggal">Meninggal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? 'Update Data' : 'Simpan Data'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
