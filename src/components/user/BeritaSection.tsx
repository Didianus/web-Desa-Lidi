"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";

interface Berita {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  author: { name: string };
}

export function BeritaSection() {
  const { setCurrentPage } = useAppStore();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/berita?published=true&limit=3")
      .then((r) => r.json())
      .then((d) => setBeritaList(d.berita || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Berita Terbaru</h2>
            <p className="text-gray-500 mt-2">
              Informasi terkini dari Desa Lidi
            </p>
            <div className="w-20 h-1 bg-emerald-500 mt-3 rounded-full" />
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage("berita")}
            className="hidden md:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="grid md:grid-cols-3 gap-6">
            {beritaList.map((berita) => (
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
                  <Badge
                    variant="secondary"
                    className="mt-3 bg-emerald-50 text-emerald-700 text-xs"
                  >
                    {berita.author?.name || "Admin"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="md:hidden mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage("berita")}
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
