import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const chatRoom = await db.chatRoom.findUnique({
      where: { id },
      include: {
        warga: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      room: chatRoom,
      messages: chatRoom.messages,
    });
  } catch (error) {
    console.error("Get chat room error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.chatRoom.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Chat room tidak ditemukan" },
        { status: 404 },
      );
    }

    const { status, adminId } = body;

    const data: any = {};

    if (status !== undefined) data.status = status;
    if (adminId !== undefined) data.adminId = adminId;

    const chatRoom = await db.chatRoom.update({
      where: { id },
      data,
      include: {
        warga: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ chatRoom });
  } catch (error) {
    console.error("Update chat room error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await db.chatRoom.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Chat room tidak ditemukan" },
        { status: 404 },
      );
    }

    await db.chatMessage.deleteMany({
      where: { roomId: id },
    });

    await db.chatRoom.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Chat room berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete chat room error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
