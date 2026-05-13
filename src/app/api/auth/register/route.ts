import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, nik, alamat } = await request.json();

    // Validate required fields
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Username, password, dan nama lengkap harus diisi" },
        { status: 400 },
      );
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username minimal 3 karakter" },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Validate name length
    if (name.length < 3) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 3 karakter" },
        { status: 400 },
      );
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan, silakan pilih username lain" },
        { status: 409 },
      );
    }

    // Validate NIK if provided
    if (nik) {
      if (!/^\d{16}$/.test(nik)) {
        return NextResponse.json(
          { error: "NIK harus 16 digit angka" },
          { status: 400 },
        );
      }
      const existingPenduduk = await db.penduduk.findUnique({ where: { nik } });
      if (existingPenduduk) {
        return NextResponse.json(
          { error: "NIK sudah terdaftar dalam sistem" },
          { status: 409 },
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with role warga
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: "warga",
      },
    });

    // If NIK provided, create penduduk record linked to user
    if (nik && alamat) {
      await db.penduduk.create({
        data: {
          nik,
          nama: name,
          alamat,
          jenisKelamin: "Laki-laki", // or get from request
          pekerjaan: "Belum Bekerja",
          status: "aktif",
        },
      });
    }

    // Generate token for auto-login
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil! Selamat datang di Desa Lidi",
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
