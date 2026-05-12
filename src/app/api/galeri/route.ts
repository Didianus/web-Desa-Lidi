import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = category ? { category } : {}

    const galeri = await db.galeri.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ galeri })
  } catch (error) {
    console.error('Get galeri error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, image, category } = body

    if (!title || !image) {
      return NextResponse.json({ error: 'Judul dan gambar harus diisi' }, { status: 400 })
    }

    const galeri = await db.galeri.create({
      data: { title, image, category: category || 'umum' },
    })

    return NextResponse.json({ galeri }, { status: 201 })
  } catch (error) {
    console.error('Create galeri error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
