import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where = published !== null ? { published: published === 'true' } : {}

    const [berita, total] = await Promise.all([
      db.berita.findMany({
        where,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.berita.count({ where }),
    ])

    return NextResponse.json({ berita, total })
  } catch (error) {
    console.error('Get berita error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, image, authorId, published } = body

    if (!title || !content || !authorId) {
      return NextResponse.json({ error: 'Judul, konten, dan author harus diisi' }, { status: 400 })
    }

    const berita = await db.berita.create({
      data: { title, content, image, authorId, published: published ?? true },
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json({ berita }, { status: 201 })
  } catch (error) {
    console.error('Create berita error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
