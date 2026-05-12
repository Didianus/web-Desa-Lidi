import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const page = parseInt(searchParams.get('page') || '1')

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    }
    if (category) where.category = category
    if (status) where.status = status
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const calculatedOffset = offset || (page - 1) * limit

    const [kegiatan, total] = await Promise.all([
      db.kegiatan.findMany({
        where,
        orderBy: { date: 'asc' },
        take: limit,
        skip: calculatedOffset,
      }),
      db.kegiatan.count({ where }),
    ])

    return NextResponse.json({ kegiatan, total, page, limit })
  } catch (error) {
    console.error('Get kegiatan error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, endDate, time, location, category, status } = body

    if (!title || !date) {
      return NextResponse.json({ error: 'Title dan tanggal harus diisi' }, { status: 400 })
    }

    const kegiatan = await db.kegiatan.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        time: time || null,
        location: location || null,
        category: category || 'umum',
        status: status || 'akan_datang',
      },
    })

    return NextResponse.json({ kegiatan }, { status: 201 })
  } catch (error) {
    console.error('Create kegiatan error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
