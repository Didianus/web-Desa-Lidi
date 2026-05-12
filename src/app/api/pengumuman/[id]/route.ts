import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, priority, published } = body

    const pengumuman = await db.pengumuman.update({
      where: { id },
      data: { title, content, priority, published },
    })

    return NextResponse.json({ pengumuman })
  } catch (error) {
    console.error('Update pengumuman error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.pengumuman.delete({ where: { id } })
    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' })
  } catch (error) {
    console.error('Delete pengumuman error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
