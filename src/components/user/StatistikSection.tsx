"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, User, UserCheck } from "lucide-react";

export function StatistikSection() {
  const [profil, setProfil] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profil")
      .then((r) => r.json())
      .then((d) => setProfil(d.profil))
      .catch(() => {});
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Jumlah Penduduk",
      value: profil?.jumlahPenduduk?.toLocaleString() || "0",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      icon: Home,
      label: "Kepala Keluarga",
      value: profil?.jumlahKK?.toLocaleString() || "0",
      color: "bg-teal-500",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      icon: User,
      label: "Laki-laki",
      value: profil?.jumlahLaki?.toLocaleString() || "0",
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      icon: UserCheck,
      label: "Perempuan",
      value: profil?.jumlahPerempuan?.toLocaleString() || "0",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Data Penduduk</h2>
          <p className="text-gray-500 mt-2">Statistik kependudukan Desa Lidi</p>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                <Home className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Luas Wilayah</p>
                <p className="text-lg font-bold text-gray-900">
                  {profil?.luasWilayah || 0} Km²
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kecamatan</p>
                <p className="text-lg font-bold text-gray-900">
                  {profil?.kecamatan || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kabupaten/Kota</p>
                <p className="text-lg font-bold text-gray-900">
                  {profil?.kabupaten || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
