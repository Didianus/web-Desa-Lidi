import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const penduduk = await db.penduduk.findUnique({ where: { id } })
    if (!penduduk) return NextResponse.json({ error: 'Penduduk tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ penduduk })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nik, nama, jenisKelamin, tempatLahir, tanggalLahir, alamat, rt, rw, pekerjaan, status, agama, statusKawin, pendidikan } = body

    const data: any = { nik, nama, jenisKelamin, tempatLahir, alamat, rt, rw, pekerjaan, status, agama, statusKawin, pendidikan }
    if (tanggalLahir) data.tanggalLahir = new Date(tanggalLahir)

    const penduduk = await db.penduduk.update({ where: { id }, data })
    return NextResponse.json({ penduduk })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.penduduk.delete({ where: { id } })
    return NextResponse.json({ message: 'Penduduk berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
