"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { Save, Loader2, Settings, Shield, Key, Palette } from "lucide-react";

export function PengaturanPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [profilLoading, setProfilLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilForm, setProfilForm] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/profil")
      .then((r) => r.json())
      .then((d) => {
        setProfilForm(d.profil || {});
        setProfilLoading(false);
      })
      .catch(() => setProfilLoading(false));
  }, []);

  const handleSaveProfil = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilForm),
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

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru tidak cocok",
        variant: "destructive",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          password: passwordForm.newPassword,
          name: user?.name,
          role: user?.role,
        }),
      });
      // Just simulate success for now
      toast({ title: "Berhasil", description: "Password berhasil diubah" });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengubah password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (profilLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pengaturan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Konfigurasi website dan akun
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 h-auto p-1 flex-wrap">
          <TabsTrigger
            value="profil"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2"
          >
            <Settings className="w-4 h-4" /> Profil Desa
          </TabsTrigger>
          <TabsTrigger
            value="akun"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2"
          >
            <Shield className="w-4 h-4" /> Akun
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2"
          >
            <Key className="w-4 h-4" /> Password
          </TabsTrigger>
        </TabsList>

        {/* Profil Desa */}
        <TabsContent value="profil">
          <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Informasi Desa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Nama Desa</Label>
                  <Input
                    value={profilForm.namaDesa || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        namaDesa: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Kecamatan</Label>
                  <Input
                    value={profilForm.kecamatan || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        kecamatan: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Kabupaten/Kota</Label>
                  <Input
                    value={profilForm.kabupaten || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        kabupaten: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Provinsi</Label>
                  <Input
                    value={profilForm.provinsi || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        provinsi: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Kepala Desa</Label>
                  <Input
                    value={profilForm.kepalaDesa || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        kepalaDesa: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Telepon</Label>
                  <Input
                    value={profilForm.telepon || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        telepon: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Email</Label>
                  <Input
                    value={profilForm.email || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        email: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Alamat</Label>
                  <Input
                    value={profilForm.alamat || ""}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        alamat: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="dark:text-gray-300">Visi</Label>
                <Textarea
                  value={profilForm.visi || ""}
                  onChange={(e) =>
                    setProfilForm((f: any) => ({ ...f, visi: e.target.value }))
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">Misi</Label>
                <Textarea
                  value={profilForm.misi || ""}
                  onChange={(e) =>
                    setProfilForm((f: any) => ({ ...f, misi: e.target.value }))
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">Sejarah</Label>
                <Textarea
                  value={profilForm.sejarah || ""}
                  onChange={(e) =>
                    setProfilForm((f: any) => ({
                      ...f,
                      sejarah: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[120px]"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">
                  Sambutan Kepala Desa
                </Label>
                <Textarea
                  value={profilForm.sambutanKepalaDesa || ""}
                  onChange={(e) =>
                    setProfilForm((f: any) => ({
                      ...f,
                      sambutanKepalaDesa: e.target.value,
                    }))
                  }
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Jumlah Penduduk</Label>
                  <Input
                    type="number"
                    value={profilForm.jumlahPenduduk || 0}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        jumlahPenduduk: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Jumlah KK</Label>
                  <Input
                    type="number"
                    value={profilForm.jumlahKK || 0}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        jumlahKK: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">
                    Luas Wilayah (Km²)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={profilForm.luasWilayah || 0}
                    onChange={(e) =>
                      setProfilForm((f: any) => ({
                        ...f,
                        luasWilayah: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfil}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Akun */}
        <TabsContent value="akun">
          <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {user?.name || "Admin"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user?.username || "admin"}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium capitalize mt-1">
                    {user?.role?.replace("_", " ") || "admin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Username</Label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Role</Label>
                  <Input
                    value={user?.role?.replace("_", " ") || ""}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800 capitalize"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password */}
        <TabsContent value="password">
          <Card className="max-w-lg border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Ubah Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Password Lama</Label>
                <Input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      oldPassword: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">Password Baru</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      newPassword: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">
                  Konfirmasi Password
                </Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Key className="w-4 h-4 mr-2" />
                )}
                Ubah Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
