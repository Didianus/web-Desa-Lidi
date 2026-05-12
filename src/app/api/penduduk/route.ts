import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const jenisKelamin = searchParams.get('jenisKelamin') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { nik: { contains: search } },
        { alamat: { contains: search } },
      ]
    }
    if (status) where.status = status
    if (jenisKelamin) where.jenisKelamin = jenisKelamin

    const [penduduk, total] = await Promise.all([
      db.penduduk.findMany({ where, orderBy: { nama: 'asc' }, take: limit, skip: offset }),
      db.penduduk.count({ where }),
    ])

    return NextResponse.json({ penduduk, total })
  } catch (error) {
    console.error('Get penduduk error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nik, nama, jenisKelamin, tempatLahir, tanggalLahir, alamat, rt, rw, pekerjaan, status, agama, statusKawin, pendidikan } = body

    if (!nik || !nama || !jenisKelamin || !alamat) {
      return NextResponse.json({ error: 'NIK, nama, jenis kelamin, dan alamat harus diisi' }, { status: 400 })
    }

    // Check NIK uniqueness
    const existing = await db.penduduk.findUnique({ where: { nik } })
    if (existing) {
      return NextResponse.json({ error: 'NIK sudah terdaftar' }, { status: 400 })
    }

    const penduduk = await db.penduduk.create({
      data: {
        nik, nama, jenisKelamin,
        tempatLahir: tempatLahir || null,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        alamat,
        rt: rt || '001', rw: rw || '001',
        pekerjaan: pekerjaan || 'Belum Bekerja',
        status: status || 'aktif',
        agama: agama || 'Islam',
        statusKawin: statusKawin || 'Belum Kawin',
        pendidikan: pendidikan || 'SD',
      },
    })

    return NextResponse.json({ penduduk }, { status: 201 })
  } catch (error) {
    console.error('Create penduduk error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
