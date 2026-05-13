"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppStore } from "@/stores/useAppStore";
import { FileText, Send, CheckCircle, Clock, Loader2 } from "lucide-react";

const jenisSurat = [
  { value: "domisili", label: "Surat Domisili", icon: "🏠" },
  { value: "usaha", label: "Surat Usaha", icon: "💼" },
  { value: "kelahiran", label: "Surat Kelahiran", icon: "👶" },
  { value: "kematian", label: "Surat Kematian", icon: "🕊️" },
];

export function LayananSuratPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { setCurrentPage } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    alamat: "",
    jenisSurat: "",
    keterangan: "",
  });

  // Pre-fill form with logged-in user data
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, nama: user.name }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.nik || !form.alamat || !form.jenisSurat) {
      toast({
        title: "Error",
        description: "Semua field wajib harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/surat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id || undefined }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({
        nama: "",
        nik: "",
        alamat: "",
        jenisSurat: "",
        keterangan: "",
      });
      toast({
        title: "Berhasil",
        description: "Pengajuan surat berhasil dikirim",
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengirim pengajuan surat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Layanan Surat</h1>
          <p className="text-emerald-200 mt-2">
            Ajukan surat secara online dengan mudah
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Info Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {jenisSurat.map((js) => (
            <Card
              key={js.value}
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setForm((f) => ({ ...f, jenisSurat: js.value }))}
            >
              <CardContent className="p-5 text-center">
                <span className="text-3xl">{js.icon}</span>
                <p className="font-medium text-gray-900 mt-2 text-sm">
                  {js.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                {success ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      Pengajuan Berhasil!
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Surat Anda sedang diproses. Silakan cek status pengajuan
                      secara berkala.
                    </p>
                    <Button
                      onClick={() => {
                        setSuccess(false);
                        if (user?.role === "warga")
                          setCurrentPage("dashboard-warga");
                      }}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 mr-2"
                    >
                      {user?.role === "warga"
                        ? "Ke Dashboard"
                        : "Ajukan Surat Lagi"}
                    </Button>
                    <Button
                      onClick={() => setSuccess(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Ajukan Surat Lagi
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Form Pengajuan Surat
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <Label htmlFor="nama">Nama Lengkap *</Label>
                        <Input
                          id="nama"
                          value={form.nama}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, nama: e.target.value }))
                          }
                          placeholder="Masukkan nama lengkap"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nik">NIK *</Label>
                        <Input
                          id="nik"
                          value={form.nik}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, nik: e.target.value }))
                          }
                          placeholder="Masukkan NIK (16 digit)"
                          maxLength={16}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alamat">Alamat *</Label>
                        <Textarea
                          id="alamat"
                          value={form.alamat}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, alamat: e.target.value }))
                          }
                          placeholder="Masukkan alamat lengkap"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Jenis Surat *</Label>
                        <Select
                          value={form.jenisSurat}
                          onValueChange={(v) =>
                            setForm((f) => ({ ...f, jenisSurat: v }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Pilih jenis surat" />
                          </SelectTrigger>
                          <SelectContent>
                            {jenisSurat.map((js) => (
                              <SelectItem key={js.value} value={js.value}>
                                {js.icon} {js.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Textarea
                          id="keterangan"
                          value={form.keterangan}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              keterangan: e.target.value,
                            }))
                          }
                          placeholder="Keterangan tambahan (opsional)"
                          className="mt-1"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 py-6"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        {loading ? "Mengirim..." : "Kirim Pengajuan"}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-2 space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Informasi Layanan
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Waktu Proses
                      </p>
                      <p className="text-xs text-gray-500">
                        1-3 hari kerja setelah pengajuan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Pengambilan
                      </p>
                      <p className="text-xs text-gray-500">
                        Di kantor desa pada jam pelayanan
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-emerald-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-emerald-800 mb-2">
                  Syarat Pengajuan
                </h3>
                <ul className="text-sm text-emerald-700 space-y-2">
                  <li>✅ Warga Desa Lidi</li>
                  <li>✅ Membawa KTP asli saat pengambilan</li>
                  <li>✅ Mengisi formulir dengan data yang benar</li>
                  <li>✅ Surat dapat diambil setelah selesai diproses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
