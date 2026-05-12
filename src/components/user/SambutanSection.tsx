'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

export function SambutanSection() {
  const [profil, setProfil] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profil').then(r => r.json()).then(d => setProfil(d.profil)).catch(() => {})
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Sambutan Kepala Desa</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Photo Side */}
              <div className="bg-emerald-600 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
                  <span className="text-4xl font-bold text-white">
                    {profil?.kepalaDesa?.charAt(2) || 'A'}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg">{profil?.kepalaDesa || 'H. Ahmad Suryadi, S.Sos'}</h3>
                <p className="text-emerald-200 text-sm mt-1">Kepala Desa</p>
              </div>

              {/* Content Side */}
              <div className="md:col-span-2 p-8">
                <Quote className="w-8 h-8 text-emerald-300 mb-4" />
                <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {profil?.sambutanKepalaDesa || 'Sambutan kepala desa akan ditampilkan di sini.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
