'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Users, Home, Eye, Target, BookOpen } from 'lucide-react'

export function ProfilDesa() {
  const [profil, setProfil] = useState<any>(null)
  const [struktur, setStruktur] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/profil')
      .then(r => r.json())
      .then(d => { setProfil(d.profil); setStruktur(d.struktur || []) })
      .catch(() => {})
  }, [])

  if (!profil) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Profil Desa</h1>
          <p className="text-emerald-200 mt-2">Mengenal lebih dekat {profil.namaDesa}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs defaultValue="sejarah" className="space-y-6">
          <TabsList className="bg-white shadow-sm p-1 h-auto flex-wrap">
            <TabsTrigger value="sejarah" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Sejarah</TabsTrigger>
            <TabsTrigger value="visi-misi" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Visi & Misi</TabsTrigger>
            <TabsTrigger value="struktur" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Struktur Organisasi</TabsTrigger>
            <TabsTrigger value="data-penduduk" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Data Penduduk</TabsTrigger>
          </TabsList>

          {/* Sejarah */}
          <TabsContent value="sejarah">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Sejarah Desa</h2>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profil.sejarah}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visi Misi */}
          <TabsContent value="visi-misi">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg italic border-l-4 border-emerald-500 pl-4">{profil.visi}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
                  </div>
                  <div className="space-y-3">
                    {profil.misi.split('\n').filter((m: string) => m.trim()).map((m: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <Badge className="bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">{i + 1}</Badge>
                        <p className="text-gray-700">{m.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Struktur Organisasi */}
          <TabsContent value="struktur">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h2>
                </div>

                {/* Kepala Desa */}
                {struktur.filter(s => s.jabatan === 'Kepala Desa').map(s => (
                  <div key={s.id} className="flex justify-center mb-8">
                    <div className="bg-emerald-600 text-white rounded-xl p-6 text-center min-w-[200px] shadow-lg">
                      <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold">
                        {s.nama.charAt(0)}
                      </div>
                      <h3 className="font-bold text-lg">{s.nama}</h3>
                      <p className="text-emerald-200 text-sm">{s.jabatan}</p>
                    </div>
                  </div>
                ))}

                {/* Sekretaris & Kaur/Kasi */}
                <div className="grid md:grid-cols-3 gap-4">
                  {struktur.filter(s => s.jabatan !== 'Kepala Desa').map(s => (
                    <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-emerald-700">
                        {s.nama.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-gray-900">{s.nama}</h3>
                      <p className="text-sm text-emerald-600 mt-1">{s.jabatan}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Penduduk */}
          <TabsContent value="data-penduduk">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Data Kependudukan</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Jumlah Penduduk', value: profil.jumlahPenduduk?.toLocaleString() },
                      { label: 'Kepala Keluarga', value: profil.jumlahKK?.toLocaleString() },
                      { label: 'Laki-laki', value: profil.jumlahLaki?.toLocaleString() },
                      { label: 'Perempuan', value: profil.jumlahPerempuan?.toLocaleString() },
                      { label: 'Luas Wilayah', value: `${profil.luasWilayah} Km²` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Wilayah</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Home, label: 'Nama Desa', value: profil.namaDesa },
                      { icon: MapPin, label: 'Kecamatan', value: profil.kecamatan },
                      { icon: MapPin, label: 'Kabupaten/Kota', value: profil.kabupaten },
                      { icon: MapPin, label: 'Provinsi', value: profil.provinsi },
                      { icon: Phone, label: 'Telepon', value: profil.telepon },
                      { icon: Mail, label: 'Email', value: profil.email },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="font-medium text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
