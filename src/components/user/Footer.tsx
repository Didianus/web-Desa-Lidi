"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Trees,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const { setCurrentPage } = useAppStore();
  const [profil, setProfil] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profil")
      .then((r) => r.json())
      .then((d) => setProfil(d.profil))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Trees className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {profil?.namaDesa || "Desa Lidi"}
                </h3>
                <p className="text-emerald-300 text-xs">
                  {profil?.kecamatan || "Kecamatan Rana Mese"}
                </p>
              </div>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Website resmi Pemerintah {profil?.namaDesa || "Desa Lidi"}.
              Melayani masyarakat dengan transparan dan profesional.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { key: "home", label: "Home" },
                { key: "profil", label: "Profil Desa" },
                { key: "berita", label: "Berita" },
                { key: "pengumuman", label: "Pengumuman" },
                { key: "galeri", label: "Galeri" },
                { key: "layanan-surat", label: "Layanan Surat" },
              ].map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.key as any);
                      window.scrollTo(0, 0);
                    }}
                    className="text-emerald-200 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-emerald-200">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{profil?.alamat || "Jl. Desa Lidi No. 1"}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-emerald-200">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{profil?.telepon || "085773617907"}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-emerald-200">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{profil?.email || "desa@Lidi.go.id"}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-base mb-4">Media Sosial</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/desalidi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com/desalidi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://youtube.com/@desalidi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6 p-4 bg-emerald-800 rounded-lg">
              <p className="text-sm font-medium text-emerald-200">
                Jam Pelayanan
              </p>
              <p className="text-xs text-emerald-300 mt-1">
                Senin - Jumat: 08.00 - 15.00 WIB
              </p>
              <p className="text-xs text-emerald-300">Sabtu - Minggu: Tutup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-emerald-300">
              © {new Date().getFullYear()} {profil?.namaDesa || "Desa Lidi"}.
              Hak cipta dilindungi.
            </p>
            <p className="text-xs text-emerald-400">
              Pemerintah {profil?.kabupaten || "Manggarai Timur"} -{" "}
              {profil?.provinsi || "Nusa Tenggara Timur"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
