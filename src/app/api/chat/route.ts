import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wargaId = searchParams.get('wargaId') || ''
    const adminId = searchParams.get('adminId') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}
    if (wargaId) where.wargaId = wargaId
    if (adminId) where.adminId = adminId
    if (status) where.status = status

    const chatRooms = await db.chatRoom.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        warga: { select: { id: true, name: true, username: true, avatar: true } },
        admin: { select: { id: true, name: true, username: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { name: true } } },
        },
      },
    })

    // Format to include lastMessage at top level
    const formatted = chatRooms.map((room) => ({
      ...room,
      lastMessage: room.messages.length > 0 ? room.messages[0] : null,
    }))

    return NextResponse.json({ chatRooms: formatted, total: formatted.length })
  } catch (error) {
    console.error('Get chat rooms error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wargaId, subject } = body

    if (!wargaId) {
      return NextResponse.json({ error: 'Warga ID harus diisi' }, { status: 400 })
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: wargaId } })
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    const chatRoom = await db.chatRoom.create({
      data: {
        wargaId,
        subject: subject || 'Pertanyaan Umum',
      },
      include: {
        warga: { select: { id: true, name: true, username: true, avatar: true } },
        admin: { select: { id: true, name: true, username: true, avatar: true } },
      },
    })

    return NextResponse.json({ chatRoom }, { status: 201 })
  } catch (error) {
    console.error('Create chat room error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
