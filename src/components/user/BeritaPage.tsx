"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Calendar,
  Search,
  ArrowLeft,
  ArrowRight,
  UserCircle,
} from "lucide-react";

interface Berita {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author: { name: string };
}

export function BeritaPage() {
  const { setCurrentPage } = useAppStore();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/berita?published=true&limit=20")
      .then((r) => r.json())
      .then((d) => setBeritaList(d.berita || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = beritaList.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Berita Desa</h1>
          <p className="text-emerald-200 mt-2">
            Informasi terkini dari Desa Lidi
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-0 shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((berita) => (
              <Card
                key={berita.id}
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => {
                  useAppStore.getState().setSelectedBeritaId(berita.id);
                  setCurrentPage("berita-detail");
                }}
              >
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 relative overflow-hidden">
                  {berita.image ? (
                    <img
                      src={berita.image}
                      alt={berita.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {berita.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {berita.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {berita.author?.name || "Admin"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada berita ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BeritaDetail() {
  const { setCurrentPage, selectedBeritaId } = useAppStore();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBeritaId) {
      fetch(`/api/berita/${selectedBeritaId}`)
        .then((r) => r.json())
        .then((d) => setBerita(d.berita))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [selectedBeritaId]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!berita)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Berita tidak ditemukan</p>
        <Button
          onClick={() => setCurrentPage("berita")}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700"
        >
          Kembali
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage("berita")}
            className="text-emerald-200 hover:text-white hover:bg-emerald-500/50 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {berita.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-emerald-200 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1">
              <UserCircle className="w-4 h-4" />
              {berita.author?.name || "Admin"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {berita.image && (
          <img
            src={berita.image}
            alt={berita.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-lg"
          />
        )}
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="prose max-w-none">
              {berita.content.split("\n").map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
