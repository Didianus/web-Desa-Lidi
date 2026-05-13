"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  LogIn,
  LogOut,
  Shield,
  Trees,
  UserPlus,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { key: "home", label: "Home" },
  { key: "profil", label: "Profil Desa" },
  { key: "berita", label: "Berita" },
  { key: "pengumuman", label: "Pengumuman" },
  { key: "kegiatan", label: "Kegiatan" },
  { key: "galeri", label: "Galeri" },
  { key: "layanan-surat", label: "Layanan Surat" },
  { key: "kontak", label: "Kontak" },
] as const;

export function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    setMobileMenuOpen,
    mobileMenuOpen,
    setViewMode,
  } = useAppStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (key: string) => {
    setCurrentPage(key as any);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Trees className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-emerald-700 leading-tight">
                Desa Lidi
              </h1>
              <p className="text-[10px] md:text-xs text-emerald-600 font-medium">
                Kec. Rana Mese, kab.Manggarai Timur
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.key
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated &&
              (user?.role === "admin" || user?.role === "kepala_desa") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("admin")}
                  className="hidden md:flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
            {isAuthenticated && user?.role === "warga" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage("dashboard-warga")}
                  className={`hidden md:flex items-center gap-2 border-emerald-200 ${currentPage === "dashboard-warga" ? "bg-emerald-50 text-emerald-700" : "text-emerald-700 hover:bg-emerald-50"}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage("chat-warga")}
                  className={`hidden md:flex items-center gap-2 ${currentPage === "chat-warga" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Button>
              </>
            )}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setViewMode("user");
                  setCurrentPage("home");
                }}
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage("register")}
                  className="items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setCurrentPage("login")}
                  className="items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetTitle className="px-6 pt-6 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <Trees className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-emerald-700">Desa Lidi</h2>
                      <p className="text-xs text-gray-500">Menu Navigasi</p>
                    </div>
                  </div>
                </SheetTitle>
                <div className="px-4 py-2 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNav(item.key)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        currentPage === item.key
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-4 border-t space-y-2">
                    {isAuthenticated &&
                      (user?.role === "admin" ||
                        user?.role === "kepala_desa") && (
                        <button
                          onClick={() => {
                            setViewMode("admin");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                        </button>
                      )}
                    {isAuthenticated && user?.role === "warga" && (
                      <>
                        <button
                          onClick={() => {
                            setCurrentPage("dashboard-warga");
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            currentPage === "dashboard-warga"
                              ? "bg-emerald-100 text-emerald-700"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                          Warga
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage("chat-warga");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" /> Chat Admin
                        </button>
                      </>
                    )}
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          logout();
                          setViewMode("user");
                          setCurrentPage("home");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setCurrentPage("register");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" /> Daftar Akun Warga
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage("login");
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-2"
                        >
                          <LogIn className="w-4 h-4" /> Login
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
