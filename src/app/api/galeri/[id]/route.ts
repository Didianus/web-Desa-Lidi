import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { title, image, category, album, images } = body;

    const galeri = await db.galeri.update({
      where: { id },
      data: {
        title,
        image,
        category,
        album,
        images,
      },
    });

    return NextResponse.json({ galeri });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Gagal update galeri" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await db.galeri.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Gagal hapus galeri" }, { status: 500 });
  }
}
