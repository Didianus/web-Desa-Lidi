'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, AlertTriangle, Info, ArrowRight } from 'lucide-react'

interface Pengumuman {
  id: string
  title: string
  content: string
  priority: string
  createdAt: string
}

const priorityConfig: Record<string, { icon: any; color: string; bg: string; badge: string }> = {
  penting: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  normal: { icon: Bell, color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  biasa: { icon: Info, color: 'text-gray-600', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700' },
}

export function PengumumanSection() {
  const { setCurrentPage } = useAppStore()
  const [list, setList] = useState<Pengumuman[]>([])

  useEffect(() => {
    fetch('/api/pengumuman?limit=3')
      .then(r => r.json())
      .then(d => setList(d.pengumuman || []))
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Pengumuman</h2>
            <p className="text-gray-500 mt-2">Pengumuman terbaru dari Pemerintah Desa</p>
            <div className="w-20 h-1 bg-emerald-500 mt-3 rounded-full" />
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage('pengumuman')}
            className="hidden md:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {list.map((item) => {
            const config = priorityConfig[item.priority] || priorityConfig.normal
            return (
              <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                      <config.icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <Badge className={`${config.badge} text-xs`}>
                          {item.priority === 'penting' ? 'Penting' : item.priority === 'normal' ? 'Normal' : 'Biasa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
