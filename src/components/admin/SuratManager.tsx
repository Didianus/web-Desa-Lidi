"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  FileSpreadsheet,
  Search,
} from "lucide-react";

interface Surat {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  jenisSurat: string;
  keterangan: string | null;
  noSurat: string | null;
  status: string;
  createdAt: string;
  user?: { name: string };
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Menunggu",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
  },
  diproses: {
    label: "Diproses",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: FileText,
  },
  selesai: {
    label: "Selesai",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: CheckCircle,
  },
  ditolak: {
    label: "Ditolak",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
};

const jenisSuratLabel: Record<string, string> = {
  domisili: "Surat Domisili",
  usaha: "Surat Usaha",
  kelahiran: "Surat Kelahiran",
  kematian: "Surat Kematian",
};

export function SuratManager() {
  const { toast } = useToast();
  const [list, setList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [selected, setSelected] = useState<Surat | null>(null);

  // Search, Filter, Pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const totalPages = Math.ceil(total / limit);

  const fetchData = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (filterJenis !== "semua") params.set("jenisSurat", filterJenis);
    params.set("page", String(page));
    params.set("limit", String(limit));

    fetch(`/api/surat?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setList(d.surat || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page, filterStatus, filterJenis]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/surat/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast({
        title: "Berhasil",
        description: `Status surat diubah ke ${statusConfig[status]?.label || status}`,
      });
      setLoading(true);
      fetchData();
      setDetailOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengubah status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await fetch(`/api/surat/${id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Surat berhasil dihapus" });
      setLoading(true);
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Gagal menghapus",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: string) => {
    try {
      const res = await fetch(`/api/export?type=surat&format=${format}`);
      if (format === "csv") {
        const text = await res.text();
        const blob = new Blob([text], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `surat_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `surat_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast({
        title: "Berhasil",
        description: `Data berhasil diexport sebagai ${format.toUpperCase()}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengexport data",
        variant: "destructive",
      });
    }
  };

  const handlePrint = (surat: Surat) => {
    setSelected(surat);
    setPrintOpen(true);
  };

  const handleVerify = async (id: string) => {
    const noSurat = `SUR/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
    try {
      await fetch(`/api/surat/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "diproses", noSurat }),
      });
      toast({
        title: "Diverifikasi",
        description: `Surat diverifikasi dengan No: ${noSurat}`,
      });
      setLoading(true);
      fetchData();
      setDetailOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Gagal memverifikasi",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    const printContent = document.getElementById("surat-print");
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Surat</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Times New Roman', serif; color: black; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleStatusFilter = (status: string) => {
    setLoading(true);
    setFilterStatus(status);
    setPage(1);
  };

  const handleJenisFilter = (jenis: string) => {
    setLoading(true);
    setFilterJenis(jenis);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Surat
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Kelola pengajuan surat warga
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <Download className="w-4 h-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                <FileJson className="w-4 h-4 mr-2" /> Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama atau NIK..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Select value={filterJenis} onValueChange={handleJenisFilter}>
          <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Jenis</SelectItem>
            <SelectItem value="domisili">Surat Domisili</SelectItem>
            <SelectItem value="usaha">Surat Usaha</SelectItem>
            <SelectItem value="kelahiran">Surat Kelahiran</SelectItem>
            <SelectItem value="kematian">Surat Kematian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "diproses", "selesai", "ditolak"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border dark:border-gray-700"}`}
          >
            {s === "all" ? "Semua" : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-md dark:bg-gray-900 dark:border dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Pemohon
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">
                    Jenis Surat
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                    No. Surat
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      Memuat...
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      Belum ada surat
                    </td>
                  </tr>
                ) : (
                  list.map((item) => {
                    const sc =
                      statusConfig[item.status] || statusConfig.pending;
                    return (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {item.nama}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              NIK: {item.nik}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {jenisSuratLabel[item.jenisSurat] || item.jenisSurat}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                          {item.noSurat || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${sc.color} text-xs`}>
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelected(item);
                                setDetailOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>
                            {item.status === "selesai" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePrint(item)}
                              >
                                <Printer className="w-4 h-4 text-emerald-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(item.id)}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {(page - 1) * limit + 1} -{" "}
            {Math.min(page * limit, total)} dari {total} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="gap-1 dark:bg-gray-800 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hal {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="gap-1 dark:bg-gray-800 dark:border-gray-700"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Detail Pengajuan Surat
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nama
                  </p>
                  <p className="font-medium dark:text-white">{selected.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    NIK
                  </p>
                  <p className="font-medium dark:text-white">{selected.nik}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Alamat
                  </p>
                  <p className="font-medium dark:text-white">
                    {selected.alamat}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Jenis Surat
                  </p>
                  <p className="font-medium dark:text-white">
                    {jenisSuratLabel[selected.jenisSurat]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No. Surat
                  </p>
                  <p className="font-mono font-medium dark:text-white">
                    {selected.noSurat || "Belum diterbitkan"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <Badge className={statusConfig[selected.status]?.color}>
                    {statusConfig[selected.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tanggal
                  </p>
                  <p className="font-medium dark:text-white">
                    {new Date(selected.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                {selected.keterangan && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Keterangan
                    </p>
                    <p className="font-medium dark:text-white">
                      {selected.keterangan}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                {selected.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleVerify(selected.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Verifikasi
                    </Button>
                    <Button
                      onClick={() => updateStatus(selected.id, "ditolak")}
                      variant="destructive"
                      className="flex-1"
                    >
                      Tolak
                    </Button>
                  </>
                )}
                {selected.status === "diproses" && (
                  <Button
                    onClick={() => updateStatus(selected.id, "selesai")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Selesaikan
                  </Button>
                )}
                {selected.status === "selesai" && (
                  <Button
                    onClick={() => {
                      setDetailOpen(false);
                      handlePrint(selected);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Surat
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="max-w-2xl dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Cetak Surat</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="pt-4">
              <div
                id="surat-print"
                className="bg-white text-black p-8 rounded-lg border space-y-6"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                {/* KOP SURAT */}
                <div className="text-center border-b-4 border-black pb-4">
                  <h2 className="text-lg font-bold">
                    PEMERINTAH KOTA MANGGARAI TIMUR
                  </h2>
                  <h3 className="text-base font-bold">KECAMATAN RANA MESE</h3>
                  <h1 className="text-xl font-bold mt-1">DESA LIDI</h1>
                  <p className="text-xs mt-1">
                    Jl. Raya Lidi No. 1, Lidi | Telp. 085773617907
                  </p>
                </div>

                {/* JUDUL SURAT */}
                <div className="text-center">
                  <h2 className="text-lg font-bold underline">
                    {jenisSuratLabel[selected.jenisSurat]?.toUpperCase()}
                  </h2>
                  <p className="text-sm">Nomor: {selected.noSurat || "-"}</p>
                </div>

                {/* ISI SURAT */}
                <div className="text-sm leading-relaxed space-y-3">
                  <p>
                    Yang bertanda tangan di bawah ini, Kepala Desa Lidi,
                    Kecamatan Rana Mese, Kota Manggarai Timur, dengan ini
                    menerangkan bahwa:
                  </p>
                  <table className="w-auto">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-4">Nama</td>
                        <td className="pr-2">:</td>
                        <td className="font-bold">{selected.nama}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-4">NIK</td>
                        <td className="pr-2">:</td>
                        <td>{selected.nik}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-4">Alamat</td>
                        <td className="pr-2">:</td>
                        <td>{selected.alamat}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    {selected.jenisSurat === "domisili" &&
                      `Adalah benar warga Desa Lidi yang berdomisili di ${selected.alamat}.`}
                    {selected.jenisSurat === "usaha" &&
                      `Adalah benar warga Desa Lidi yang memiliki usaha di wilayah Desa Lidi.`}
                    {selected.jenisSurat === "kelahiran" &&
                      `Adalah benar warga Desa Lidi sebagaimana tersebut di atas.`}
                    {selected.jenisSurat === "kematian" &&
                      `Adalah benar warga Desa Lidi yang telah meninggal dunia.`}
                  </p>
                  {selected.keterangan && (
                    <p>Keterangan tambahan: {selected.keterangan}</p>
                  )}
                  <p>
                    Demikian surat ini dibuat untuk dapat dipergunakan
                    sebagaimana mestinya.
                  </p>
                </div>

                {/* TTD */}
                <div className="flex justify-end pt-4">
                  <div className="text-center">
                    <p className="text-sm">
                      Manggarai Timur,{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm font-bold">Kepala Desa Lidi</p>
                    <div className="h-20" />
                    <p className="text-sm font-bold underline">Pak Dedos</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <Printer className="w-4 h-4" /> Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1 gap-2 dark:bg-gray-800 dark:border-gray-700"
                >
                  <Printer className="w-4 h-4" /> Cetak
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPrintOpen(false)}
                  className="flex-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print-specific CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #surat-print,
          #surat-print * {
            visibility: visible;
          }
          #surat-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
