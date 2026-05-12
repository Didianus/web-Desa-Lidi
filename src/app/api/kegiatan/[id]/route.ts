import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.kegiatan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kegiatan tidak ditemukan' }, { status: 404 })
    }

    const { title, description, date, endDate, time, location, category, status } = body
    const data: any = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (date !== undefined) data.date = new Date(date)
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null
    if (time !== undefined) data.time = time
    if (location !== undefined) data.location = location
    if (category !== undefined) data.category = category
    if (status !== undefined) data.status = status

    const kegiatan = await db.kegiatan.update({ where: { id }, data })
    return NextResponse.json({ kegiatan })
  } catch (error) {
    console.error('Update kegiatan error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const existing = await db.kegiatan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kegiatan tidak ditemukan' }, { status: 404 })
    }

    await db.kegiatan.delete({ where: { id } })
    return NextResponse.json({ message: 'Kegiatan berhasil dihapus' })
  } catch (error) {
    console.error('Delete kegiatan error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
