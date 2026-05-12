import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || ''
    const isRead = searchParams.get('isRead')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (userId) where.userId = userId
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      where.isRead = isRead === 'true'
    }

    const [notifikasi, total] = await Promise.all([
      db.notifikasi.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: { user: { select: { name: true, username: true } } },
      }),
      db.notifikasi.count({ where }),
    ])

    return NextResponse.json({ notifikasi, total })
  } catch (error) {
    console.error('Get notifikasi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, userId, link } = body

    if (!title || !message) {
      return NextResponse.json({ error: 'Title dan message harus diisi' }, { status: 400 })
    }

    const notifikasi = await db.notifikasi.create({
      data: {
        title,
        message,
        type: type || 'info',
        userId: userId || null,
        link: link || null,
      },
      include: { user: { select: { name: true, username: true } } },
    })

    return NextResponse.json({ notifikasi }, { status: 201 })
  } catch (error) {
    console.error('Create notifikasi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
