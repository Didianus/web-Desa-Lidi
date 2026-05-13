"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppStore } from "@/stores/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Loader2,
  Trees,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export function RegisterPage() {
  const { toast } = useToast();
  const { login } = useAuthStore();
  const { setCurrentPage } = useAppStore();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    nik: "",
    alamat: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!form.username || !form.password || !form.name) {
      toast({
        title: "Error",
        description: "Username, password, dan nama lengkap harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (form.username.length < 3) {
      toast({
        title: "Error",
        description: "Username minimal 3 karakter",
        variant: "destructive",
      });
      return;
    }

    if (form.password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (form.nik && !/^\d{16}$/.test(form.nik)) {
      toast({
        title: "Error",
        description: "NIK harus 16 digit angka",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          name: form.name,
          nik: form.nik || undefined,
          alamat: form.alamat || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registrasi gagal");

      // Auto login after successful registration
      login(data.user, data.token);
      setSuccess(true);
      toast({ title: "Registrasi Berhasil!", description: data.message });
    } catch (err: any) {
      toast({
        title: "Registrasi Gagal",
        description: err.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registrasi Berhasil!
            </h2>
            <p className="text-gray-500 mb-6">
              Akun warga Anda telah berhasil dibuat. Anda sudah login otomatis.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setCurrentPage("dashboard-warga")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-6"
              >
                Ke Dashboard Warga
              </Button>
              <Button
                onClick={() => setCurrentPage("chat-warga")}
                variant="outline"
                className="w-full py-6"
              >
                Chat dengan Admin Desa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl max-h-[95vh] overflow-y-auto">
        <CardContent className="p-8">
          <button
            onClick={() => setCurrentPage("login")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Login
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trees className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Daftar Akun Warga
            </h1>
            <p className="text-gray-500 mt-1">
              Buat akun untuk mengakses layanan desa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="mt-1"
                required
              />
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Minimal 3 karakter"
                className="mt-1"
                required
              />
            </div>

            {/* NIK */}
            <div>
              <Label htmlFor="nik">NIK (Opsional)</Label>
              <Input
                id="nik"
                value={form.nik}
                onChange={(e) =>
                  handleChange(
                    "nik",
                    e.target.value.replace(/\D/g, "").slice(0, 16),
                  )
                }
                placeholder="16 digit NIK"
                className="mt-1"
                maxLength={16}
              />
              <p className="text-xs text-gray-400 mt-1">
                Diisi jika Anda warga Desa Lidi
              </p>
            </div>

            {/* Alamat */}
            <div>
              <Label htmlFor="alamat">Alamat (Opsional)</Label>
              <Input
                id="alamat"
                value={form.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Contoh: RT 01/RW 03, Jl. Merpati No. 10"
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Minimal 6 karakter"
                className="mt-1"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="Ulangi password"
                className="mt-1"
                required
              />
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Password tidak cocok
                  </p>
                )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-5 h-5 mr-2" />
              )}
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <button
                onClick={() => setCurrentPage("login")}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Login di sini
              </button>
            </p>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 font-medium mb-1">
              ℹ️ Informasi:
            </p>
            <p className="text-xs text-amber-600">
              Akun yang didaftarkan otomatis berperan sebagai{" "}
              <strong>Warga</strong>. Dengan akun warga, Anda dapat mengajukan
              surat, chat dengan admin desa, dan mengakses layanan desa lainnya.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
