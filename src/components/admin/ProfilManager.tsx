"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Settings } from "lucide-react";

export function ProfilManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch("/api/profil")
      .then((r) => r.json())
      .then((d) => {
        setForm(d.profil || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Berhasil",
        description: "Profil desa berhasil diupdate",
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengupdate profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Desa</h1>
          <p className="text-gray-500 text-sm">Edit informasi profil desa</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Perubahan
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-8 space-y-8">
          {/* Info Umum */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Informasi Umum
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nama Desa</Label>
                <Input
                  value={form.namaDesa || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, namaDesa: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Kecamatan</Label>
                <Input
                  value={form.kecamatan || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kecamatan: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Kabupaten/Kota</Label>
                <Input
                  value={form.kabupaten || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kabupaten: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Provinsi</Label>
                <Input
                  value={form.provinsi || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, provinsi: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Kode Pos</Label>
                <Input
                  value={form.kodePos || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kodePos: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Kepala Desa</Label>
                <Input
                  value={form.kepalaDesa || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kepalaDesa: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Telepon</Label>
                <Input
                  value={form.telepon || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, telepon: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={form.email || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Alamat</Label>
                <Input
                  value={form.alamat || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, alamat: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Sejarah & Sambutan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Sejarah & Sambutan
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Sejarah Desa</Label>
                <Textarea
                  value={form.sejarah || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sejarah: e.target.value }))
                  }
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <div>
                <Label>Sambutan Kepala Desa</Label>
                <Textarea
                  value={form.sambutanKepalaDesa || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sambutanKepalaDesa: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <div>
                <Label>Visi</Label>
                <Textarea
                  value={form.visi || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, visi: e.target.value }))
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label>Misi</Label>
                <Textarea
                  value={form.misi || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, misi: e.target.value }))
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Data Penduduk */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Data Penduduk</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Jumlah Penduduk</Label>
                <Input
                  type="number"
                  value={form.jumlahPenduduk || 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      jumlahPenduduk: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Jumlah KK</Label>
                <Input
                  type="number"
                  value={form.jumlahKK || 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      jumlahKK: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Jumlah Laki-laki</Label>
                <Input
                  type="number"
                  value={form.jumlahLaki || 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      jumlahLaki: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Jumlah Perempuan</Label>
                <Input
                  type="number"
                  value={form.jumlahPerempuan || 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      jumlahPerempuan: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Luas Wilayah (Km²)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.luasWilayah || 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      luasWilayah: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
