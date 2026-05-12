import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const profil = await db.profilDesa.findFirst()
    const struktur = await db.strukturOrganisasi.findMany({ orderBy: { urutan: 'asc' } })

    return NextResponse.json({ profil, struktur })
  } catch (error) {
    console.error('Get profil error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    const profil = await db.profilDesa.findFirst()
    if (!profil) {
      return NextResponse.json({ error: 'Profil desa tidak ditemukan' }, { status: 404 })
    }

    const updated = await db.profilDesa.update({
      where: { id: profil.id },
      data: body,
    })

    return NextResponse.json({ profil: updated })
  } catch (error) {
    console.error('Update profil error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
