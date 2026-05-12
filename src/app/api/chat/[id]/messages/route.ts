import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Verify chat room exists
    const chatRoom = await db.chatRoom.findUnique({ where: { id } })
    if (!chatRoom) {
      return NextResponse.json({ error: 'Chat room tidak ditemukan' }, { status: 404 })
    }

    const [messages, total] = await Promise.all([
      db.chatMessage.findMany({
        where: { roomId: id },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
        include: {
          sender: { select: { id: true, name: true, username: true, avatar: true } },
        },
      }),
      db.chatMessage.count({ where: { roomId: id } }),
    ])

    return NextResponse.json({ messages, total })
  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { senderId, message } = body

    if (!senderId || !message) {
      return NextResponse.json({ error: 'SenderId dan message harus diisi' }, { status: 400 })
    }

    // Verify chat room exists and is active
    const chatRoom = await db.chatRoom.findUnique({ where: { id } })
    if (!chatRoom) {
      return NextResponse.json({ error: 'Chat room tidak ditemukan' }, { status: 404 })
    }
    if (chatRoom.status === 'closed') {
      return NextResponse.json({ error: 'Chat room sudah ditutup' }, { status: 400 })
    }

    // Verify sender exists
    const sender = await db.user.findUnique({ where: { id: senderId } })
    if (!sender) {
      return NextResponse.json({ error: 'Sender tidak ditemukan' }, { status: 404 })
    }

    const chatMessage = await db.chatMessage.create({
      data: {
        roomId: id,
        senderId,
        message,
      },
      include: {
        sender: { select: { id: true, name: true, username: true, avatar: true } },
      },
    })

    // Update chat room's updatedAt timestamp
    await db.chatRoom.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({ message: chatMessage }, { status: 201 })
  } catch (error) {
    console.error('Send chat message error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
