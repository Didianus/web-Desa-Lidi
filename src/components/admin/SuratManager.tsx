'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Surat {
  id: string
  nama: string
  nik: string
  alamat: string
  jenisSurat: string
  keterangan: string | null
  status: string
  createdAt: string
  user?: { name: string }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', icon: Clock },
  diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: FileText },
  selesai: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
}

const jenisSuratLabel: Record<string, string> = {
  domisili: 'Surat Domisili',
  usaha: 'Surat Usaha',
  kelahiran: 'Surat Kelahiran',
  kematian: 'Surat Kematian',
}

export function SuratManager() {
  const { toast } = useToast()
  const [list, setList] = useState<Surat[]>([])
  const [loading, setLoading] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<Surat | null>(null)
  const [filter, setFilter] = useState('all')

  const fetchData = () => {
    const url = filter === 'all' ? '/api/surat?limit=50' : `/api/surat?status=${filter}&limit=50`
    fetch(url).then(r => r.json()).then(d => setList(d.surat || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/surat/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      toast({ title: 'Berhasil', description: `Status surat diubah ke ${statusConfig[status]?.label || status}` })
      fetchData(); setDetailOpen(false)
    } catch { toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' }) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return
    try {
      await fetch(`/api/surat/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Surat berhasil dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Kelola Surat</h1><p className="text-gray-500 text-sm">Kelola pengajuan surat warga</p></div>
        <div className="flex gap-2">
          {['all', 'pending', 'diproses', 'selesai', 'ditolak'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border'}`}>
              {s === 'all' ? 'Semua' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pemohon</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Jenis Surat</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Tanggal</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">Memuat...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">Belum ada surat</td></tr>
                ) : list.map(item => {
                  const sc = statusConfig[item.status] || statusConfig.pending
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div><p className="font-medium text-gray-900 text-sm">{item.nama}</p><p className="text-xs text-gray-500">NIK: {item.nik}</p></div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{jenisSuratLabel[item.jenisSurat] || item.jenisSurat}</td>
                      <td className="py-3 px-4"><Badge className={sc.color}>{sc.label}</Badge></td>
                      <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(item); setDetailOpen(true) }}>
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detail Pengajuan Surat</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Nama</p><p className="font-medium">{selected.nama}</p></div>
                <div><p className="text-xs text-gray-500">NIK</p><p className="font-medium">{selected.nik}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500">Alamat</p><p className="font-medium">{selected.alamat}</p></div>
                <div><p className="text-xs text-gray-500">Jenis Surat</p><p className="font-medium">{jenisSuratLabel[selected.jenisSurat]}</p></div>
                <div><p className="text-xs text-gray-500">Status</p><Badge className={statusConfig[selected.status]?.color}>{statusConfig[selected.status]?.label}</Badge></div>
                {selected.keterangan && <div className="col-span-2"><p className="text-xs text-gray-500">Keterangan</p><p className="font-medium">{selected.keterangan}</p></div>}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => updateStatus(selected.id, 'diproses')} className="flex-1 bg-blue-600 hover:bg-blue-700">Proses</Button>
                <Button onClick={() => updateStatus(selected.id, 'selesai')} className="flex-1 bg-emerald-600 hover:bg-emerald-700">Selesai</Button>
                <Button onClick={() => updateStatus(selected.id, 'ditolak')} variant="destructive" className="flex-1">Tolak</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
