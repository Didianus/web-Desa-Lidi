import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.notifikasi.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Notifikasi tidak ditemukan' }, { status: 404 })
    }

    // If only toggling isRead
    if (body.isRead !== undefined && Object.keys(body).length === 1) {
      const notifikasi = await db.notifikasi.update({
        where: { id },
        data: { isRead: body.isRead },
        include: { user: { select: { name: true, username: true } } },
      })
      return NextResponse.json({ notifikasi })
    }

    // Full update
    const { title, message, type, isRead, userId, link } = body
    const notifikasi = await db.notifikasi.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(type !== undefined && { type }),
        ...(isRead !== undefined && { isRead }),
        ...(userId !== undefined && { userId }),
        ...(link !== undefined && { link }),
      },
      include: { user: { select: { name: true, username: true } } },
    })

    return NextResponse.json({ notifikasi })
  } catch (error) {
    console.error('Update notifikasi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const existing = await db.notifikasi.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Notifikasi tidak ditemukan' }, { status: 404 })
    }

    await db.notifikasi.delete({ where: { id } })
    return NextResponse.json({ message: 'Notifikasi berhasil dihapus' })
  } catch (error) {
    console.error('Delete notifikasi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
