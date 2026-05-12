import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: { id: true, username: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, name, role } = body

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Username, password, dan nama harus diisi' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: { username, password: hashedPassword, name, role: role || 'admin' },
      select: { id: true, username: true, name: true, role: true, createdAt: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
