"use client";

import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  FileText,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";

export function HeroSection() {
  const { setCurrentPage } = useAppStore();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-emerald-100 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            Kec. Rana Mese, Kab. Manggarai, NTT
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Selamat Datang di
            <span className="block text-emerald-300 mt-2">Desa Lidi</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100 leading-relaxed mb-8">
            Maju, Mandiri, Sejahtera, dan Berbudaya. Mewujudkan tata kelola
            pemerintahan yang baik dan transparan untuk masyarakat Desa Lidi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => setCurrentPage("profil")}
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold text-base px-8"
            >
              Profil Desa
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage("layanan-surat")}
              className="border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8"
            >
              <FileText className="w-5 h-5 mr-2" />
              Layanan Surat
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            {[
              { icon: Users, value: "8.542", label: "Penduduk" },
              { icon: MapPin, value: "3.5", label: "Km² Luas" },
              { icon: FileText, value: "2.345", label: "Kepala KK" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-emerald-200">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
          <path d="M0,64 C480,120 960,20 1440,80 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
