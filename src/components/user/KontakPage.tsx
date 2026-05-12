'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export function KontakPage() {
  const { toast } = useToast()
  const [profil, setProfil] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profil').then(r => r.json()).then(d => setProfil(d.profil)).catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: 'Pesan Terkirim', description: 'Terima kasih telah menghubungi kami.' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Hubungi Kami</h1>
          <p className="text-emerald-200 mt-2">Jangan ragu untuk menghubungi kami</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: MapPin, title: 'Alamat', value: profil?.alamat || 'Jl. Raya Sukamaju No. 1', color: 'bg-emerald-100 text-emerald-600' },
            { icon: Phone, title: 'Telepon', value: profil?.telepon || '(022) 6654321', color: 'bg-teal-100 text-teal-600' },
            { icon: Mail, title: 'Email', value: profil?.email || 'desa@sukamaju.go.id', color: 'bg-cyan-100 text-cyan-600' },
          ].map((item, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" placeholder="Nama Anda" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@contoh.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject">Subjek</Label>
                  <Input id="subject" placeholder="Subjek pesan" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea id="message" placeholder="Tulis pesan Anda..." className="mt-1 min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Send className="w-4 h-4 mr-2" /> Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map Placeholder & Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-emerald-200 to-emerald-400 flex items-center justify-center">
                <div className="text-center text-emerald-800">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">Peta Lokasi</p>
                  <p className="text-sm">{profil?.alamat || 'Jl. Raya Sukamaju No. 1'}</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-gray-900">Jam Pelayanan</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Senin - Kamis</span>
                    <span className="font-medium">08.00 - 15.00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumat</span>
                    <span className="font-medium">08.00 - 11.30 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sabtu - Minggu</span>
                    <span className="font-medium text-red-500">Tutup</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
