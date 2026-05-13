"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Filter } from "lucide-react";

interface GaleriItem {
  id: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  umum: "bg-gray-100 text-gray-700",
  kegiatan: "bg-emerald-100 text-emerald-700",
  pembangunan: "bg-amber-100 text-amber-700",
  budaya: "bg-purple-100 text-purple-700",
};

const placeholderColors = [
  "from-emerald-400 to-emerald-600",
  "from-teal-400 to-teal-600",
  "from-cyan-400 to-cyan-600",
  "from-green-400 to-green-600",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
];

export function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/galeri?limit=50")
      .then((r) => r.json())
      .then((d) => setItems(d.galeri || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);
  const categories = ["all", ...new Set(items.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Galeri Desa</h1>
          <p className="text-emerald-200 mt-2">
            Dokumentasi kegiatan dan kehidupan Desa Lidi
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              {cat === "all"
                ? "Semua"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, idx) => (
              <Card
                key={item.id}
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${placeholderColors[idx % placeholderColors.length]} relative overflow-hidden`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                    <div className="p-3 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <Badge
                    className={`${categoryColors[item.category] || "bg-gray-100 text-gray-700"} text-xs mt-1`}
                  >
                    {item.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada foto di galeri</p>
          </div>
        )}
      </div>
    </div>
  );
}
