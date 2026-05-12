import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = status ? { status } : {}

    const surat = await db.suratPengajuan.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ surat })
  } catch (error) {
    console.error('Get surat error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama, nik, alamat, jenisSurat, keterangan, userId } = body

    if (!nama || !nik || !alamat || !jenisSurat) {
      return NextResponse.json({ error: 'Semua field wajib harus diisi' }, { status: 400 })
    }

    const surat = await db.suratPengajuan.create({
      data: { nama, nik, alamat, jenisSurat, keterangan, userId, status: 'pending' },
    })

    return NextResponse.json({ surat }, { status: 201 })
  } catch (error) {
    console.error('Create surat error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
