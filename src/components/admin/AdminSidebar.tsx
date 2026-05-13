"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Image,
  Users,
  FileText,
  CalendarDays,
  CalendarCheck,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Trees,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "berita", label: "Kelola Berita", icon: Newspaper },
  { key: "pengumuman", label: "Kelola Pengumuman", icon: Megaphone },
  { key: "galeri", label: "Kelola Galeri", icon: Image },
  { key: "penduduk", label: "Kelola Penduduk", icon: Users },
  { key: "surat", label: "Kelola Surat", icon: FileText },
  { key: "kegiatan", label: "Kalender Kegiatan", icon: CalendarDays },
  { key: "agenda", label: "Agenda Desa", icon: CalendarCheck },
  { key: "chat", label: "Chat Warga", icon: MessageCircle },
  { key: "laporan", label: "Laporan", icon: BarChart3 },
  { key: "pengaturan", label: "Pengaturan", icon: Settings },
] as const;

const roleBadge: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-emerald-100 text-emerald-700" },
  kepala_desa: { label: "Kepala Desa", color: "bg-amber-100 text-amber-700" },
};

export function AdminSidebar() {
  const {
    currentAdminPage,
    setCurrentAdminPage,
    setViewMode,
    adminSidebarOpen,
    setAdminSidebarOpen,
  } = useAppStore();
  const { logout, user } = useAuthStore();
  const [unreadChat, setUnreadChat] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      fetch("/api/chat?status=active")
        .then((r) => r.json())
        .then((d) => {
          const rooms = d.rooms || d.chatRooms || [];
          // Count rooms without assigned admin as "unread"
          setUnreadChat(rooms.filter((r: any) => !r.adminId).length);
        })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const roleInfo = roleBadge[user?.role || "admin"] || roleBadge.admin;

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col transition-all duration-300 ${
        adminSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {adminSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Trees className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900 dark:text-white">
                Admin Panel
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Desa Lidi
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAdminSidebarOpen(!adminSidebarOpen)}
          className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {adminSidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>

      <Separator className="dark:bg-gray-800" />

      {/* User Info */}
      {adminSidebarOpen && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || "Admin"}
              </p>
              <Badge className={`${roleInfo.color} text-[10px] px-1.5 py-0`}>
                {roleInfo.label}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentAdminPage(item.key as any)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentAdminPage === item.key
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {adminSidebarOpen && <span>{item.label}</span>}
            {adminSidebarOpen && item.key === "chat" && unreadChat > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 ml-auto">
                {unreadChat}
              </Badge>
            )}
          </button>
        ))}
      </nav>

      <Separator className="dark:bg-gray-800" />

      {/* Footer */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => setViewMode("user")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {adminSidebarOpen && <span>Kembali ke Website</span>}
        </button>
        <button
          onClick={() => {
            logout();
            setViewMode("user");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {adminSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
