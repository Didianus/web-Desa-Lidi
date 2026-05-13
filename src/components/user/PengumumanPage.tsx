"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, Calendar } from "lucide-react";

interface Pengumuman {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

const priorityConfig: Record<
  string,
  { icon: any; color: string; bg: string; badge: string; border: string }
> = {
  penting: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700 border-red-200",
    border: "border-l-red-500",
  },
  normal: {
    icon: Bell,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    border: "border-l-emerald-500",
  },
  biasa: {
    icon: Info,
    color: "text-gray-600",
    bg: "bg-gray-50",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    border: "border-l-gray-400",
  },
};

export function PengumumanPage() {
  const [list, setList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/pengumuman?limit=20")
      .then((r) => r.json())
      .then((d) => setList(d.pengumuman || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? list : list.filter((p) => p.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Pengumuman</h1>
          <p className="text-emerald-200 mt-2">
            Pengumuman resmi dari Pemerintah Desa Lidi
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: "all", label: "Semua" },
            { key: "penting", label: "🔴 Penting" },
            { key: "normal", label: "🟢 Normal" },
            { key: "biasa", label: "⚪ Biasa" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-md animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const config =
                priorityConfig[item.priority] || priorityConfig.normal;
              return (
                <Card
                  key={item.id}
                  className={`border-0 shadow-md border-l-4 ${config.border}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <config.icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {item.title}
                          </h3>
                          <Badge variant="outline" className={config.badge}>
                            {item.priority === "penting"
                              ? "Penting"
                              : item.priority === "normal"
                                ? "Normal"
                                : "Biasa"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada pengumuman</p>
          </div>
        )}
      </div>
    </div>
  );
}
