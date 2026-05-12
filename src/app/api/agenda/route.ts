import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const page = parseInt(searchParams.get('page') || '1')

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { pic: { contains: search } },
      ]
    }
    if (category) where.category = category
    if (published !== null && published !== undefined && published !== '') {
      where.published = published === 'true'
    }
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const calculatedOffset = offset || (page - 1) * limit

    const [agenda, total] = await Promise.all([
      db.agenda.findMany({
        where,
        orderBy: { date: 'asc' },
        take: limit,
        skip: calculatedOffset,
      }),
      db.agenda.count({ where }),
    ])

    return NextResponse.json({ agenda, total, page, limit })
  } catch (error) {
    console.error('Get agenda error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, time, location, pic, category, published } = body

    if (!title || !date) {
      return NextResponse.json({ error: 'Title dan tanggal harus diisi' }, { status: 400 })
    }

    const agenda = await db.agenda.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        time: time || null,
        location: location || null,
        pic: pic || null,
        category: category || 'umum',
        published: published !== undefined ? published : true,
      },
    })

    return NextResponse.json({ agenda }, { status: 201 })
  } catch (error) {
    console.error('Create agenda error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
