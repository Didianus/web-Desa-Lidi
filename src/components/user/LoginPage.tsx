'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAppStore } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { LogIn, Loader2, Trees, ArrowLeft } from 'lucide-react'

export function LoginPage() {
  const { toast } = useToast()
  const { login } = useAuthStore()
  const { setCurrentPage, setViewMode } = useAppStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast({ title: 'Error', description: 'Username dan password harus diisi', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login gagal')

      login(data.user, data.token)
      if (data.user.role === 'admin' || data.user.role === 'kepala_desa') {
        setViewMode('admin')
      } else {
        // Warga user - redirect to warga dashboard
        setCurrentPage('dashboard-warga')
      }
      toast({ title: 'Login Berhasil', description: `Selamat datang, ${data.user.name}` })
    } catch (err: any) {
      toast({ title: 'Login Gagal', description: err.message || 'Username atau password salah', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trees className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Login Desa</h1>
            <p className="text-gray-500 mt-1">Masuk untuk mengakses layanan desa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Daftar sebagai Warga
              </button>
            </p>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-700 font-medium mb-1">Demo Login:</p>
            <p className="text-xs text-emerald-600">Admin: <code className="bg-emerald-100 px-1 rounded">admin</code> / <code className="bg-emerald-100 px-1 rounded">admin123</code></p>
            <p className="text-xs text-emerald-600">Warga: <code className="bg-emerald-100 px-1 rounded">warga_budi</code> / <code className="bg-emerald-100 px-1 rounded">admin123</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
