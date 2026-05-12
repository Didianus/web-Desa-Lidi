import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, name: true, role: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
