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
  title: "Desa Sukamaju - Website Resmi Pemerintah Desa",
  description: "Website resmi Pemerintah Desa Sukamaju, Kecamatan Cimahi Selatan, Kota Cimahi, Jawa Barat. Melayani masyarakat dengan transparan dan profesional.",
  keywords: ["Desa Sukamaju", "Pemerintah Desa", "Cimahi", "Jawa Barat", "Layanan Desa"],
  authors: [{ name: "Pemerintah Desa Sukamaju" }],
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
