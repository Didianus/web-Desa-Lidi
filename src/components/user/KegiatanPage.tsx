"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Kegiatan {
  id: string;
  title: string;
  description: string | null;
  date: string;
  endDate: string | null;
  time: string | null;
  location: string | null;
  category: string;
  status: string;
}

interface Agenda {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  pic: string | null;
  category: string;
}

const categoryColors: Record<string, string> = {
  umum: "bg-emerald-100 text-emerald-700",
  pemerintahan: "bg-blue-100 text-blue-700",
  sosial: "bg-amber-100 text-amber-700",
  budaya: "bg-purple-100 text-purple-700",
  pendidikan: "bg-cyan-100 text-cyan-700",
  rapat: "bg-blue-100 text-blue-700",
  kegiatan: "bg-amber-100 text-amber-700",
  pelayanan: "bg-cyan-100 text-cyan-700",
};

const categoryLabels: Record<string, string> = {
  umum: "Umum",
  pemerintahan: "Pemerintahan",
  sosial: "Sosial",
  budaya: "Budaya",
  pendidikan: "Pendidikan",
  rapat: "Rapat",
  kegiatan: "Kegiatan",
  pelayanan: "Pelayanan",
};

const statusColors: Record<string, string> = {
  akan_datang: "bg-blue-100 text-blue-700",
  berlangsung: "bg-emerald-100 text-emerald-700",
  selesai: "bg-gray-100 text-gray-600",
  dibatalkan: "bg-red-100 text-red-700",
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function KegiatanPage() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tab, setTab] = useState<"kegiatan" | "agenda">("kegiatan");

  useEffect(() => {
    Promise.all([
      fetch("/api/kegiatan?limit=50").then((r) => r.json()),
      fetch("/api/agenda?published=true&limit=50").then((r) => r.json()),
    ])
      .then(([kData, aData]) => {
        setKegiatan(kData.kegiatan || []);
        setAgenda(aData.agenda || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calMonth, calYear]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, { kegiatan: Kegiatan[]; agenda: Agenda[] }> = {};
    kegiatan.forEach((k) => {
      const d = new Date(k.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = { kegiatan: [], agenda: [] };
      map[key].kegiatan.push(k);
    });
    agenda.forEach((a) => {
      const d = new Date(a.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = { kegiatan: [], agenda: [] };
      map[key].agenda.push(a);
    });
    return map;
  }, [kegiatan, agenda]);

  const getDateKey = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const today = new Date();
  const isToday = (day: number) =>
    calYear === today.getFullYear() &&
    calMonth === today.getMonth() &&
    day === today.getDate();

  const selectedDateEvents = selectedDate
    ? eventsByDate[selectedDate] || { kegiatan: [], agenda: [] }
    : { kegiatan: [], agenda: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl font-bold">Kegiatan & Agenda Desa</h1>
          <p className="mt-2 text-emerald-200 text-lg">
            Jadwal kegiatan dan agenda Desa Lidi
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-md flex">
            <button
              onClick={() => setTab("kegiatan")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "kegiatan" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Kegiatan
            </button>
            <button
              onClick={() => setTab("agenda")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "agenda" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Agenda
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (calMonth === 0) {
                        setCalMonth(11);
                        setCalYear(calYear - 1);
                      } else setCalMonth(calMonth - 1);
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg font-bold text-gray-900">
                    {MONTHS[calMonth]} {calYear}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (calMonth === 11) {
                        setCalMonth(0);
                        setCalYear(calYear + 1);
                      } else setCalMonth(calMonth + 1);
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-gray-500 py-2"
                    >
                      {d}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => {
                    if (!day)
                      return <div key={`empty-${i}`} className="h-16" />;
                    const dateKey = getDateKey(day);
                    const events = eventsByDate[dateKey];
                    const hasEvents =
                      events &&
                      (events.kegiatan.length > 0 || events.agenda.length > 0);
                    return (
                      <button
                        key={dateKey}
                        onClick={() =>
                          setSelectedDate(hasEvents ? dateKey : null)
                        }
                        className={`h-16 p-1.5 rounded-lg text-left border transition-all hover:bg-gray-50 ${
                          isToday(day)
                            ? "border-emerald-400 ring-2 ring-emerald-200"
                            : "border-gray-100"
                        } ${selectedDate === dateKey ? "bg-emerald-50 border-emerald-400" : ""}`}
                      >
                        <span
                          className={`text-xs font-medium ${isToday(day) ? "text-emerald-600" : "text-gray-700"}`}
                        >
                          {day}
                        </span>
                        {hasEvents && (
                          <div className="mt-1 flex flex-wrap gap-0.5">
                            {events.kegiatan.length > 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                            {events.agenda.length > 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-gray-500">Kegiatan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <span className="text-xs text-gray-500">Agenda</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* List */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {tab === "kegiatan" ? "Daftar Kegiatan" : "Daftar Agenda"}
              </h2>
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  Memuat data...
                </div>
              ) : tab === "kegiatan" ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {kegiatan
                    .filter((k) => k.status !== "dibatalkan")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="shadow-sm border-0 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <Badge
                              className={`${statusColors[item.status] || ""} text-[10px] shrink-0 ml-2`}
                            >
                              {item.status === "akan_datang"
                                ? "Akan Datang"
                                : item.status === "berlangsung"
                                  ? "Berlangsung"
                                  : "Selesai"}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {new Date(item.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {item.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {item.time}
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {item.location}
                              </span>
                            )}
                          </div>
                          <Badge
                            className={`${categoryColors[item.category] || ""} text-[10px] mt-3`}
                          >
                            {categoryLabels[item.category] || item.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {agenda.map((item) => (
                    <Card
                      key={item.id}
                      className="shadow-sm border-0 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {item.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {item.time}
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          )}
                        </div>
                        <Badge
                          className={`${categoryColors[item.category] || ""} text-[10px] mt-3`}
                        >
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Selected Date */}
          <div>
            <Card className="shadow-lg border-0 sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  {selectedDate
                    ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "Pilih Tanggal"}
                </h3>
                {selectedDate ? (
                  selectedDateEvents.kegiatan.length === 0 &&
                  selectedDateEvents.agenda.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">
                      Tidak ada kegiatan pada tanggal ini
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateEvents.kegiatan.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
                            Kegiatan
                          </h4>
                          {selectedDateEvents.kegiatan.map((k) => (
                            <div
                              key={k.id}
                              className="p-3 bg-emerald-50 rounded-lg mb-2"
                            >
                              <p className="font-medium text-sm text-gray-900">
                                {k.title}
                              </p>
                              {k.time && (
                                <p className="text-xs text-gray-500">
                                  {k.time}
                                </p>
                              )}
                              {k.location && (
                                <p className="text-xs text-gray-500">
                                  📍 {k.location}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedDateEvents.agenda.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-pink-600 mb-2 uppercase tracking-wider">
                            Agenda
                          </h4>
                          {selectedDateEvents.agenda.map((a) => (
                            <div
                              key={a.id}
                              className="p-3 bg-pink-50 rounded-lg mb-2"
                            >
                              <p className="font-medium text-sm text-gray-900">
                                {a.title}
                              </p>
                              {a.time && (
                                <p className="text-xs text-gray-500">
                                  {a.time}
                                </p>
                              )}
                              {a.location && (
                                <p className="text-xs text-gray-500">
                                  📍 {a.location}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Klik tanggal pada kalender untuk melihat detail
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
