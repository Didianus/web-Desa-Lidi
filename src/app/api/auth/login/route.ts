import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { username } })
    if (!user) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
