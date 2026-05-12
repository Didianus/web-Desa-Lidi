'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/useAuthStore'
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, Trash2, Plus, Loader2, Filter, CheckCheck } from 'lucide-react'

interface Notifikasi {
  id: string
  title: string
  message: string
  type: string
  userId: string | null
  isRead: boolean
  link: string | null
  createdAt: string
}

const typeConfig: Record<string, { icon: any; color: string; borderColor: string; bgColor: string; iconColor: string }> = {
  info: { icon: Info, color: 'text-blue-700 dark:text-blue-400', borderColor: 'border-l-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/10', iconColor: 'text-blue-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-700 dark:text-amber-400', borderColor: 'border-l-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/10', iconColor: 'text-amber-500' },
  success: { icon: CheckCircle, color: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-l-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/10', iconColor: 'text-emerald-500' },
  danger: { icon: AlertCircle, color: 'text-red-700 dark:text-red-400', borderColor: 'border-l-red-500', bgColor: 'bg-red-50 dark:bg-red-900/10', iconColor: 'text-red-500' },
}

export function NotifikasiManager() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [list, setList] = useState<Notifikasi[]>([])
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('')
  const [filterRead, setFilterRead] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'info', link: '' })
  const [saving, setSaving] = useState(false)
  const socketRef = useRef<any>(null)
  const [pulseId, setPulseId] = useState<string | null>(null)

  const fetchData = () => {
    const params = new URLSearchParams()
    params.set('limit', '50')
    if (filterType) params.set('type', filterType)
    if (filterRead === 'unread') params.set('isRead', 'false')
    if (filterRead === 'read') params.set('isRead', 'true')

    fetch(`/api/notifikasi?${params}`)
      .then(r => r.json())
      .then(d => { setList(d.notifikasi || []); setTotal(d.total || 0); setUnreadCount((d.notifikasi || []).filter((n: Notifikasi) => !n.isRead).length) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filterType, filterRead])

  // WebSocket for real-time notifications
  useEffect(() => {
    if (!user) return
    let socket: any = null

    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client')
        socket = io('/?XTransformPort=3003', { transports: ['websocket', 'polling'] })

        socket.on('connect', () => {
          socket.emit('authenticate', { userId: user.id, username: user.username, role: user.role })
        })

        socket.on('new-notification', (data: any) => {
          setList(prev => [data, ...prev])
          setUnreadCount(prev => prev + 1)
          setPulseId(data.id)
          setTimeout(() => setPulseId(null), 3000)
          toast({ title: data.title, description: data.message })
        })

        socketRef.current = socket
      } catch (err) {
        console.error('Socket connection error:', err)
      }
    }

    connectSocket()
    return () => { if (socket) socket.disconnect() }
  }, [user?.id])

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifikasi/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) })
      fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal mengupdate notifikasi', variant: 'destructive' }) }
  }

  const handleMarkAllRead = async () => {
    try {
      const unreadIds = list.filter(n => !n.isRead).map(n => n.id)
      for (const id of unreadIds) {
        await fetch(`/api/notifikasi/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) })
      }
      toast({ title: 'Berhasil', description: 'Semua notifikasi ditandai sudah dibaca' })
      fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal update notifikasi', variant: 'destructive' }) }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifikasi/${id}`, { method: 'DELETE' })
      toast({ title: 'Berhasil', description: 'Notifikasi dihapus' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' }) }
  }

  const handleCreate = async () => {
    if (!form.title || !form.message) {
      toast({ title: 'Error', description: 'Judul dan pesan wajib diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/notifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Berhasil', description: 'Notifikasi berhasil dibuat' })
      setDialogOpen(false); setForm({ title: '', message: '', type: 'info', link: '' }); fetchData()
    } catch { toast({ title: 'Error', description: 'Gagal membuat notifikasi', variant: 'destructive' }) }
    finally { setSaving(false) }
  }

  // Count by type
  const typeCounts = list.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'Baru saja'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            Notifikasi
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} belum dibaca</Badge>}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pusat notifikasi dan pemberitahuan desa</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
            </Button>
          )}
          <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" /> Buat Notifikasi
          </Button>
        </div>
      </div>

      {/* Type Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(typeConfig).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? '' : type)}
            className={`p-4 rounded-lg border transition-all text-left ${
              filterType === type ? 'border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            } ${config.bgColor}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <config.icon className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm font-medium capitalize ${config.color}`}>{type}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{typeCounts[type] || 0}</p>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterRead} onValueChange={setFilterRead}>
          <SelectTrigger className="w-44 bg-white dark:bg-gray-900"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status Baca" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="unread">Belum Dibaca</SelectItem>
            <SelectItem value="read">Sudah Dibaca</SelectItem>
          </SelectContent>
        </Select>
        {filterType && (
          <Button variant="outline" size="sm" onClick={() => setFilterType('')} className="gap-1">
            <span className="capitalize">{filterType}</span> <span className="text-xs">×</span>
          </Button>
        )}
      </div>

      {/* Notification List */}
      <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            {loading ? (
              <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>
            ) : list.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-800">
                {list.map(item => {
                  const config = typeConfig[item.type] || typeConfig.info
                  const IconComp = config.icon
                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex items-start gap-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 ${
                        item.isRead ? 'border-l-transparent' : config.borderColor
                      } ${!item.isRead ? config.bgColor : ''} ${pulseId === item.id ? 'animate-pulse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}>
                        <IconComp className={`w-5 h-5 ${config.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-medium text-sm ${item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.message}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(item.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {!item.isRead && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => handleMarkRead(item.id)}>
                              <CheckCircle className="w-3 h-3" /> Tandai dibaca
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600 gap-1" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-3 h-3" /> Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-gray-900">
          <DialogHeader><DialogTitle className="dark:text-white">Buat Notifikasi Baru</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label className="dark:text-gray-300">Judul *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Judul notifikasi" className="mt-1" /></div>
            <div><Label className="dark:text-gray-300">Pesan *</Label><Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Isi pesan notifikasi" className="mt-1 min-h-[80px]" /></div>
            <div>
              <Label className="dark:text-gray-300">Tipe</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2 capitalize">
                        <config.icon className={`w-4 h-4 ${config.iconColor}`} />
                        {key}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="dark:text-gray-300">Link (opsional)</Label><Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." className="mt-1" /></div>
            <Button onClick={handleCreate} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Kirim Notifikasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
