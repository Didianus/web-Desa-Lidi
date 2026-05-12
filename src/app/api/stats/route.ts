import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalBerita, totalPengumuman, totalGaleri, totalSurat,
      suratPending, suratDiproses, suratSelesai, suratDitolak,
      totalPenduduk, pendudukAktif, pendudukLaki, pendudukPerempuan,
      pendudukPindah, pendudukMeninggal,
      profil,
      recentSurat, recentBerita,
      // New kegiatan stats
      totalKegiatan, kegiatanAkanDatang, kegiatanBerlangsung, kegiatanSelesai,
      // New agenda stats
      totalAgenda, agendaToday,
      // New chat stats
      totalChatRooms, chatRoomsActive,
      // New notifikasi stats
      totalNotifikasi, notifikasiUnread,
      // Recent kegiatan & upcoming agenda
      recentKegiatan, upcomingAgenda,
    ] = await Promise.all([
      db.berita.count(),
      db.pengumuman.count({ where: { published: true } }),
      db.galeri.count(),
      db.suratPengajuan.count(),
      db.suratPengajuan.count({ where: { status: 'pending' } }),
      db.suratPengajuan.count({ where: { status: 'diproses' } }),
      db.suratPengajuan.count({ where: { status: 'selesai' } }),
      db.suratPengajuan.count({ where: { status: 'ditolak' } }),
      db.penduduk.count(),
      db.penduduk.count({ where: { status: 'aktif' } }),
      db.penduduk.count({ where: { jenisKelamin: 'Laki-laki' } }),
      db.penduduk.count({ where: { jenisKelamin: 'Perempuan' } }),
      db.penduduk.count({ where: { status: 'pindah' } }),
      db.penduduk.count({ where: { status: 'meninggal' } }),
      db.profilDesa.findFirst(),
      db.suratPengajuan.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      db.berita.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { author: { select: { name: true } } } }),
      // Kegiatan stats
      db.kegiatan.count(),
      db.kegiatan.count({ where: { status: 'akan_datang' } }),
      db.kegiatan.count({ where: { status: 'berlangsung' } }),
      db.kegiatan.count({ where: { status: 'selesai' } }),
      // Agenda stats
      db.agenda.count(),
      db.agenda.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      // Chat stats
      db.chatRoom.count(),
      db.chatRoom.count({ where: { status: 'active' } }),
      // Notifikasi stats
      db.notifikasi.count(),
      db.notifikasi.count({ where: { isRead: false } }),
      // Recent kegiatan (last 5)
      db.kegiatan.findMany({ orderBy: { date: 'desc' }, take: 5 }),
      // Upcoming agenda (next 5)
      db.agenda.findMany({
        where: {
          date: { gte: new Date() },
          published: true,
        },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ])

    // Get pekerjaan distribution
    const pendudukByPekerjaan = await db.penduduk.groupBy({
      by: ['pekerjaan'],
      _count: { pekerjaan: true },
      where: { status: 'aktif' },
    })

    // Get pendidikan distribution
    const pendudukByPendidikan = await db.penduduk.groupBy({
      by: ['pendidikan'],
      _count: { pendidikan: true },
      where: { status: 'aktif' },
    })

    // Get agama distribution
    const pendudukByAgama = await db.penduduk.groupBy({
      by: ['agama'],
      _count: { agama: true },
      where: { status: 'aktif' },
    })

    // Get surat by jenis
    const suratByJenis = await db.suratPengajuan.groupBy({
      by: ['jenisSurat'],
      _count: { jenisSurat: true },
    })

    return NextResponse.json({
      totalBerita,
      totalPengumuman,
      totalGaleri,
      totalSurat,
      suratPending,
      suratDiproses,
      suratSelesai,
      suratDitolak,
      totalPenduduk,
      pendudukAktif,
      pendudukLaki,
      pendudukPerempuan,
      pendudukPindah,
      pendudukMeninggal,
      jumlahPenduduk: profil?.jumlahPenduduk || 0,
      jumlahKK: profil?.jumlahKK || 0,
      recentSurat,
      recentBerita,
      pendudukByPekerjaan: pendudukByPekerjaan.map(p => ({ name: p.pekerjaan, value: p._count.pekerjaan })),
      pendudukByPendidikan: pendudukByPendidikan.map(p => ({ name: p.pendidikan, value: p._count.pendidikan })),
      pendudukByAgama: pendudukByAgama.map(p => ({ name: p.agama, value: p._count.agama })),
      suratByJenis: suratByJenis.map(s => ({ name: s.jenisSurat, value: s._count.jenisSurat })),
      // New stats
      totalKegiatan,
      kegiatanAkanDatang,
      kegiatanBerlangsung,
      kegiatanSelesai,
      totalAgenda,
      agendaToday,
      totalChatRooms,
      chatRoomsActive,
      totalNotifikasi,
      notifikasiUnread,
      recentKegiatan,
      upcomingAgenda,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
