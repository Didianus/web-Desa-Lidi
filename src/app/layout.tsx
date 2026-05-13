import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Lidi - Website Resmi Pemerintah Desa",
  description:
    "Website resmi Pemerintah Desa Lidi, Kecamatan Rana Mese, Kab/Kota Manggarai Timur, NTT. Melayani masyarakat dengan transparan dan profesional.",
  keywords: [
    "Desa Lidi",
    "Pemerintah Desa",
    "Rana Mese",
    "Manggarai Timur",
    "Layanan Desa",
  ],
  authors: [{ name: "Pemerintah Desa Lidi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
