import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.galeri.delete({ where: { id } })
    return NextResponse.json({ message: 'Galeri berhasil dihapus' })
  } catch (error) {
    console.error('Delete galeri error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
