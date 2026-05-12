import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function toCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return headers.join(',') + '\n'

  const headerRow = headers.join(',')
  const rows = data.map((item) =>
    headers
      .map((h) => {
        const value = item[h]
        if (value === null || value === undefined) return ''
        const str = String(value)
        // Escape quotes and wrap in quotes if contains comma or newline
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      })
      .join(',')
  )
  return headerRow + '\n' + rows.join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'penduduk'
    const format = searchParams.get('format') || 'json'

    let data: any[] = []
    let filename = ''

    switch (type) {
      case 'penduduk': {
        data = await db.penduduk.findMany({ orderBy: { nama: 'asc' } })
        filename = 'data-penduduk'
        if (format === 'csv') {
          const headers = [
            'nik', 'nama', 'jenisKelamin', 'tempatLahir', 'tanggalLahir',
            'alamat', 'rt', 'rw', 'pekerjaan', 'status', 'agama',
            'statusKawin', 'pendidikan', 'createdAt',
          ]
          const csv = toCSV(data, headers)
          return new NextResponse(csv, {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
          })
        }
        break
      }

      case 'surat': {
        data = await db.suratPengajuan.findMany({
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        })
        // Flatten for CSV
        const flatData = data.map((s) => ({
          ...s,
          userName: s.user?.name || '',
        }))
        filename = 'data-surat'
        if (format === 'csv') {
          const headers = [
            'noSurat', 'nama', 'nik', 'alamat', 'jenisSurat',
            'keterangan', 'status', 'userName', 'createdAt',
          ]
          const csv = toCSV(flatData, headers)
          return new NextResponse(csv, {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
          })
        }
        break
      }

      case 'kegiatan': {
        data = await db.kegiatan.findMany({ orderBy: { date: 'asc' } })
        filename = 'data-kegiatan'
        if (format === 'csv') {
          const headers = [
            'title', 'description', 'date', 'endDate', 'time',
            'location', 'category', 'status', 'createdAt',
          ]
          const csv = toCSV(data, headers)
          return new NextResponse(csv, {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="${filename}.csv"`,
            },
          })
        }
        break
      }

      default:
        return NextResponse.json({ error: 'Tipe export tidak valid. Gunakan: penduduk, surat, kegiatan' }, { status: 400 })
    }

    // Return JSON format
    return NextResponse.json({ data, type, total: data.length })
  } catch (error) {
    console.error('Export data error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
