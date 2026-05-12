import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.agenda.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Agenda tidak ditemukan' }, { status: 404 })
    }

    const { title, description, date, time, location, pic, category, published } = body
    const data: any = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (date !== undefined) data.date = new Date(date)
    if (time !== undefined) data.time = time
    if (location !== undefined) data.location = location
    if (pic !== undefined) data.pic = pic
    if (category !== undefined) data.category = category
    if (published !== undefined) data.published = published

    const agenda = await db.agenda.update({ where: { id }, data })
    return NextResponse.json({ agenda })
  } catch (error) {
    console.error('Update agenda error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const existing = await db.agenda.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Agenda tidak ditemukan' }, { status: 404 })
    }

    await db.agenda.delete({ where: { id } })
    return NextResponse.json({ message: 'Agenda berhasil dihapus' })
  } catch (error) {
    console.error('Delete agenda error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
