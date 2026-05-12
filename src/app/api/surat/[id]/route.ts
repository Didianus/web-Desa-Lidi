import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const surat = await db.suratPengajuan.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    })

    if (!surat) {
      return NextResponse.json({ error: 'Surat tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ surat })
  } catch (error) {
    console.error('Get surat detail error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, nama, nik, alamat, jenisSurat, keterangan } = body

    const surat = await db.suratPengajuan.update({
      where: { id },
      data: { status, nama, nik, alamat, jenisSurat, keterangan },
    })

    return NextResponse.json({ surat })
  } catch (error) {
    console.error('Update surat error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.suratPengajuan.delete({ where: { id } })
    return NextResponse.json({ message: 'Surat berhasil dihapus' })
  } catch (error) {
    console.error('Delete surat error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
