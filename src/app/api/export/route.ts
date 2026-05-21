import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function toCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return headers.join(",") + "\n";

  const headerRow = headers.join(",");

  const rows = data.map((item) =>
    headers
      .map((h) => {
        const value = item[h];

        if (value === null || value === undefined) return "";

        const str = String(value);

        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }

        return str;
      })
      .join(","),
  );

  return headerRow + "\n" + rows.join("\n");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "penduduk";

    const format = searchParams.get("format") || "json";

    let data: any[] = [];

    let filename = "";

    switch (type) {
      // =========================
      // PENDUDUK
      // =========================
      case "penduduk": {
        data = await db.penduduk.findMany({
          orderBy: { nama: "asc" },
        });

        filename = "data-penduduk";

        if (format === "csv") {
          const headers = [
            "nik",
            "nama",
            "jenisKelamin",
            "tempatLahir",
            "tanggalLahir",
            "alamat",
            "rt",
            "rw",
            "pekerjaan",
            "status",
            "agama",
            "statusKawin",
            "pendidikan",
            "createdAt",
          ];

          const csv = toCSV(data, headers);

          return new NextResponse(csv, {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="${filename}.csv"`,
            },
          });
        }

        if (format === "pdf") {
          const doc = new jsPDF();

          doc.setFontSize(18);

          doc.text("Data Penduduk Desa", 14, 20);

          autoTable(doc, {
            startY: 30,
            head: [["No", "Nama", "NIK", "Alamat"]],
            body: data.map((item, index) => [
              index + 1,
              item.nama,
              item.nik,
              item.alamat,
            ]),
          });

          const pdfBuffer = doc.output("arraybuffer");

          return new Response(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            },
          });
        }

        break;
      }

      // =========================
      // SURAT
      // =========================
      case "surat": {
        data = await db.suratPengajuan.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });

        const flatData = data.map((s) => ({
          ...s,
          userName: s.user?.name || "",
        }));

        filename = "data-surat";

        if (format === "csv") {
          const headers = [
            "noSurat",
            "nama",
            "nik",
            "alamat",
            "jenisSurat",
            "keterangan",
            "status",
            "userName",
            "createdAt",
          ];

          const csv = toCSV(flatData, headers);

          return new NextResponse(csv, {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="${filename}.csv"`,
            },
          });
        }

        if (format === "pdf") {
          const doc = new jsPDF();

          doc.setFontSize(18);

          doc.text("Data Surat Desa", 14, 20);

          autoTable(doc, {
            startY: 30,
            head: [["No", "Nama", "Jenis Surat", "Status"]],
            body: flatData.map((item, index) => [
              index + 1,
              item.nama,
              item.jenisSurat,
              item.status,
            ]),
          });

          const pdfBuffer = doc.output("arraybuffer");

          return new Response(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            },
          });
        }

        break;
      }

      // =========================
      // KEGIATAN
      // =========================
      case "kegiatan": {
        data = await db.kegiatan.findMany({
          orderBy: { date: "asc" },
        });

        filename = "data-kegiatan";

        if (format === "csv") {
          const headers = [
            "title",
            "description",
            "date",
            "endDate",
            "time",
            "location",
            "category",
            "status",
            "createdAt",
          ];

          const csv = toCSV(data, headers);

          return new NextResponse(csv, {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="${filename}.csv"`,
            },
          });
        }

        if (format === "pdf") {
          const doc = new jsPDF();

          doc.setFontSize(18);

          doc.text("Data Kegiatan Desa", 14, 20);

          autoTable(doc, {
            startY: 30,
            head: [["No", "Judul", "Tanggal", "Lokasi"]],
            body: data.map((item, index) => [
              index + 1,
              item.title,
              item.date,
              item.location,
            ]),
          });

          const pdfBuffer = doc.output("arraybuffer");

          return new Response(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            },
          });
        }

        break;
      }

      // =========================
      // GALERI
      // =========================
      case "galeri": {
        data = await db.galeri.findMany({
          orderBy: { createdAt: "desc" },
        });

        filename = "data-galeri";

        if (format === "csv") {
          const headers = ["title", "category", "album", "createdAt"];

          const csv = toCSV(data, headers);

          return new NextResponse(csv, {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition": `attachment; filename="${filename}.csv"`,
            },
          });
        }

        if (format === "pdf") {
          const doc = new jsPDF();

          doc.setFontSize(18);

          doc.text("Data Galeri Desa", 14, 20);

          autoTable(doc, {
            startY: 30,
            head: [["No", "Judul", "Kategori", "Album"]],
            body: data.map((item, index) => [
              index + 1,
              item.title,
              item.category,
              item.album || "-",
            ]),
          });

          const pdfBuffer = doc.output("arraybuffer");

          return new Response(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            },
          });
        }

        break;
      }

      default:
        return NextResponse.json(
          {
            error:
              "Tipe export tidak valid. Gunakan: penduduk, surat, kegiatan, galeri",
          },
          { status: 400 },
        );
    }

    // =========================
    // DEFAULT JSON
    // =========================
    return NextResponse.json({
      data,
      type,
      total: data.length,
    });
  } catch (error) {
    console.error("Export data error:", error);

    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
      },
      {
        status: 500,
      },
    );
  }
}
