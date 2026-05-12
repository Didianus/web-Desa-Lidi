'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Users, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserItem {
  id: string
  username: string
  name: string
  role: string
  createdAt: string
}

export function UserManager() {
  const { toast } = useToast()
  const [list, setList] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'admin' })

  const fetchData = () => {
    fetch('/api/users').then(r => r.json()).then(d => setList(d.users || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async () => {
    if (!form.username || !form.password || !form.name) {
      toast({ title: 'Error', description: 'Semua field harus diisi', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast({ title: 'Berhasil', description: 'User berhasil ditambahkan' })
      setDialogOpen(false); setForm({ username: '', password: '', name: '', role: 'admin' }); fetchData()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Gagal menambahkan user', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Kelola User</h1><p className="text-gray-500 text-sm">Kelola akun pengguna</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setForm({ username: '', password: '', name: '', role: 'admin' }); setDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah User Baru</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nama</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1" /></div>
              <div><Label>Username</Label><Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="mt-1" /></div>
              <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="mt-1" /></div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
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

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nama</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Memuat...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Belum ada user</td></tr>
                ) : list.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.username}</td>
                    <td className="py-3 px-4">
                      <Badge className={item.role === 'admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                        {item.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
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
