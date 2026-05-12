import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const berita = await db.berita.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    })

    if (!berita) {
      return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ berita })
  } catch (error) {
    console.error('Get berita detail error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, image, published } = body

    const berita = await db.berita.update({
      where: { id },
      data: { title, content, image, published },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json({ berita })
  } catch (error) {
    console.error('Update berita error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.berita.delete({ where: { id } })
    return NextResponse.json({ message: 'Berita berhasil dihapus' })
  } catch (error) {
    console.error('Delete berita error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
