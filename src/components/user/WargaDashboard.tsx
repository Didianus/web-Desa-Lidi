"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAppStore } from "@/stores/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  FileText,
  MessageSquare,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Calendar,
  Send,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface SuratData {
  id: string;
  nama: string;
  nik: string;
  jenisSurat: string;
  keterangan: string | null;
  noSurat: string | null;
  status: string;
  createdAt: string;
}

interface ChatRoomData {
  id: string;
  subject: string;
  status: string;
  lastMessage: {
    message: string;
    sender: { name: string };
    createdAt: string;
  } | null;
  admin: { name: string } | null;
}

interface NotifikasiData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function WargaDashboard() {
  const { user, token, logout } = useAuthStore();
  const { setCurrentPage, setViewMode } = useAppStore();
  const { toast } = useToast();
  const [suratList, setSuratList] = useState<SuratData[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [notifikasi, setNotifikasi] = useState<NotifikasiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [suratRes, chatRes, notifRes] = await Promise.all([
        fetch(`/api/surat?limit=5`),
        fetch(`/api/chat?wargaId=${user!.id}`),
        fetch(`/api/notifikasi?userId=${user!.id}&limit=5`),
      ]);

      if (suratRes.ok) {
        const suratData = await suratRes.json();
        // Filter surat milik user ini
        const mySurat =
          suratData.surat?.filter(
            (s: any) => s.user?.name === user!.name || s.userId === user!.id,
          ) || [];
        setSuratList(mySurat.slice(0, 5));
      }

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setChatRooms(chatData.chatRooms || []);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifikasi(notifData.notifikasi || []);
      }
    } catch (err) {
      console.error("Fetch dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "diproses":
        return <Loader2 className="w-4 h-4 text-blue-500" />;
      case "selesai":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "ditolak":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      diproses: "bg-blue-100 text-blue-700 border-blue-200",
      selesai: "bg-green-100 text-green-700 border-green-200",
      ditolak: "bg-red-100 text-red-700 border-red-200",
    };
    const labels: Record<string, string> = {
      pending: "Menunggu",
      diproses: "Diproses",
      selesai: "Selesai",
      ditolak: "Ditolak",
    };
    return (
      <Badge
        variant="outline"
        className={`${colors[status] || "bg-gray-100 text-gray-700"} text-xs`}
      >
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status] || status}</span>
      </Badge>
    );
  };

  const getJenisSuratLabel = (jenis: string) => {
    const labels: Record<string, string> = {
      domisili: "Surat Domisili",
      usaha: "Surat Keterangan Usaha",
      kelahiran: "Surat Kelahiran",
      kematian: "Surat Kematian",
      tidak_mampu: "Surat Keterangan Tidak Mampu",
      pengantar: "Surat Pengantar",
    };
    return labels[jenis] || jenis;
  };

  const getNotifIcon = (type: string) => {
    const colors: Record<string, string> = {
      info: "bg-blue-100 text-blue-600",
      warning: "bg-yellow-100 text-yellow-600",
      success: "bg-green-100 text-green-600",
      danger: "bg-red-100 text-red-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const handleLogout = () => {
    logout();
    setViewMode("user");
    setCurrentPage("home");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Selamat Datang, {user?.name}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Dashboard Warga Desa Lidi</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="self-start sm:self-auto text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card
          className="cursor-pointer hover:shadow-md transition-all hover:border-emerald-300 group"
          onClick={() => setCurrentPage("layanan-surat")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-medium text-sm text-gray-900">Ajukan Surat</p>
            <p className="text-xs text-gray-400 mt-1">Layanan Surat</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all hover:border-blue-300 group"
          onClick={() => setCurrentPage("chat-warga")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-medium text-sm text-gray-900">Chat Admin</p>
            <p className="text-xs text-gray-400 mt-1">Pesan langsung</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all hover:border-orange-300 group"
          onClick={() => setCurrentPage("kegiatan")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-medium text-sm text-gray-900">Kegiatan Desa</p>
            <p className="text-xs text-gray-400 mt-1">Jadwal & agenda</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all hover:border-purple-300 group"
          onClick={() => setCurrentPage("pengumuman")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-medium text-sm text-gray-900">Pengumuman</p>
            <p className="text-xs text-gray-400 mt-1">Info terbaru</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Surat & Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Surat Pengajuan */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Surat Pengajuan Saya
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage("layanan-surat")}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Ajukan Surat <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {suratList.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Belum ada pengajuan surat
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage("layanan-surat")}
                    className="mt-3 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    Ajukan Surat Sekarang
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {suratList.map((surat) => (
                    <div
                      key={surat.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {getJenisSuratLabel(surat.jenisSurat)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {surat.noSurat
                            ? `No. ${surat.noSurat}`
                            : "Belum ada nomor surat"}{" "}
                          •{" "}
                          {new Date(surat.createdAt).toLocaleDateString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                      {getStatusBadge(surat.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat dengan Admin */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chat dengan Admin
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage("chat-warga")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {chatRooms.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Belum ada percakapan</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage("chat-warga")}
                    className="mt-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Mulai Chat
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatRooms.slice(0, 3).map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setCurrentPage("chat-warga")}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {room.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {room.lastMessage
                            ? room.lastMessage.message
                            : "Belum ada pesan"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs flex-shrink-0 ${room.status === "active" ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                      >
                        {room.status === "active" ? "Aktif" : "Ditutup"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile & Notifications */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {user?.name}
                </h3>
                <Badge
                  variant="outline"
                  className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Warga Desa
                </Badge>
                <div className="mt-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Username</span>
                    <span className="font-medium text-gray-900">
                      {user?.username}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-emerald-600 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifikasi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifikasi.length === 0 ? (
                <div className="text-center py-6">
                  <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifikasi.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg ${notif.isRead ? "bg-gray-50" : "bg-orange-50 border border-orange-100"}`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.isRead ? "bg-gray-300" : "bg-orange-500"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${notif.isRead ? "text-gray-600" : "font-medium text-gray-900"}`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
