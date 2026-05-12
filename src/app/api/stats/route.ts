import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [totalBerita, totalPengumuman, totalGaleri, totalSurat, suratPending, suratDiproses, suratSelesai, profil] = await Promise.all([
      db.berita.count(),
      db.pengumuman.count(),
      db.galeri.count(),
      db.suratPengajuan.count(),
      db.suratPengajuan.count({ where: { status: 'pending' } }),
      db.suratPengajuan.count({ where: { status: 'diproses' } }),
      db.suratPengajuan.count({ where: { status: 'selesai' } }),
      db.profilDesa.findFirst(),
    ])

    return NextResponse.json({
      totalBerita,
      totalPengumuman,
      totalGaleri,
      totalSurat,
      suratPending,
      suratDiproses,
      suratSelesai,
      jumlahPenduduk: profil?.jumlahPenduduk || 0,
      jumlahKK: profil?.jumlahKK || 0,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
