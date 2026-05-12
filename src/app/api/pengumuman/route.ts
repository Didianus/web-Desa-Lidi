import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [pengumuman, total] = await Promise.all([
      db.pengumuman.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.pengumuman.count({ where: { published: true } }),
    ])

    return NextResponse.json({ pengumuman, total })
  } catch (error) {
    console.error('Get pengumuman error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, priority, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Judul dan konten harus diisi' }, { status: 400 })
    }

    const pengumuman = await db.pengumuman.create({
      data: { title, content, priority: priority || 'normal', published: published ?? true },
    })

    return NextResponse.json({ pengumuman }, { status: 201 })
  } catch (error) {
    console.error('Create pengumuman error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
