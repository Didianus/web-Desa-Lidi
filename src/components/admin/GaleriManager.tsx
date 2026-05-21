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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Search,
  X,
} from "lucide-react";

interface GaleriItem {
  id: string;
  title: string;
  image: string;
  images?: string;
  category: string;
  album?: string;
  createdAt: string;
}

export function GaleriManager() {
  const { toast } = useToast();
  const [list, setList] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GaleriItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    image: "",
    category: "umum",
    album: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Search, Filter, Pagination
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("semua");
  const [filterAlbum, setFilterAlbum] = useState("semua");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const totalPages = Math.ceil(total / limit);

  const allAlbums = Array.from(
    new Set(
      list
        .map((item) => item.album?.trim())
        .filter(
          (album): album is string =>
            typeof album === "string" && album.length > 0,
        ),
    ),
  );

  const fetchData = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterCategory !== "semua") params.set("category", filterCategory);
    if (filterAlbum !== "semua") params.set("album", filterAlbum);
    params.set("page", String(page));
    params.set("limit", String(limit));

    fetch(`/api/galeri?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setList(d.galeri || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page, filterCategory, filterAlbum]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async () => {
    if (!form.title) {
      toast({
        title: "Error",
        description: "Judul harus diisi",
        variant: "destructive",
      });
      return;
    }
    const allImages = [form.image, ...imageUrls].filter(Boolean);
    if (allImages.length === 0) {
      toast({
        title: "Error",
        description: "Minimal satu gambar harus diisi",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const body = {
        ...form,
        image: allImages[0],
        images: allImages.length > 0 ? JSON.stringify(allImages) : undefined,
      };
      const url = editing ? `/api/galeri/${editing.id}` : "/api/galeri";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Berhasil",
        description: `Foto berhasil ${editing ? "diupdate" : "ditambahkan"}`,
      });
      setDialogOpen(false);
      setEditing(null);
      setForm({ title: "", image: "", category: "umum", album: "" });
      setImageUrls([]);
      setLoading(true);
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: `Gagal ${editing ? "mengupdate" : "menambahkan"} foto`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await fetch(`/api/galeri/${id}`, { method: "DELETE" });
      toast({ title: "Berhasil", description: "Foto berhasil dihapus" });
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
      const res = await fetch(`/api/export?type=galeri&format=${format}`);

      if (format === "csv") {
        const text = await res.text();

        const blob = new Blob([text], {
          type: "text/csv",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `galeri.csv`;

        a.click();

        URL.revokeObjectURL(url);
      } else if (format === "pdf") {
        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `galeri.pdf`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);
      } else {
        const data = await res.json();

        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `galeri.json`;

        a.click();

        URL.revokeObjectURL(url);
      }

      toast({
        title: "Berhasil",
        description: `Data berhasil diexport sebagai ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Gagal mengexport data",
        variant: "destructive",
      });
    }
  };

  const openEdit = (item: GaleriItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      image: item.image || "",
      category: item.category,
      album: item.album || "",
    });
    try {
      const parsed = item.images ? JSON.parse(item.images) : [];
      setImageUrls(
        Array.isArray(parsed) && parsed.length > 1 ? parsed.slice(1) : [],
      );
    } catch {
      setImageUrls([]);
    }
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", image: "", category: "umum", album: "" });
    setImageUrls([]);
    setDialogOpen(true);
  };

  const addImageUrl = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleFilterCategoryChange = (v: string) => {
    setLoading(true);
    setFilterCategory(v);
    setPage(1);
  };

  const handleFilterAlbumChange = (v: string) => {
    setLoading(true);
    setFilterAlbum(v);
    setPage(1);
  };

  const categoryBadge: Record<string, string> = {
    umum: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    kegiatan:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pembangunan:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    budaya:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Galeri
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Kelola foto galeri desa
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
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="w-4 h-4 mr-2" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                <FileJson className="w-4 h-4 mr-2" /> Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreate}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Foto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="dark:text-white">
                  {editing ? "Edit Foto" : "Tambah Foto"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">
                    Judul *
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">
                    URL Gambar Utama *
                  </label>

                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        image: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/gambar.jpg"
                    className="mt-1"
                  />

                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mt-4 border"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium dark:text-gray-300">
                      Gambar Tambahan
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImageUrl}
                      className="h-7 text-xs gap-1"
                    >
                      <Plus className="w-3 h-3" /> Tambah Gambar
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={url}
                          onChange={(e) =>
                            updateImageUrl(index, e.target.value)
                          }
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">
                    Kategori
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umum">Umum</SelectItem>
                      <SelectItem value="kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="pembangunan">Pembangunan</SelectItem>
                      <SelectItem value="budaya">Budaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">
                    Album
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={
                        form.album && allAlbums.includes(form.album)
                          ? form.album
                          : "__new__"
                      }
                      onValueChange={(v) => {
                        if (v !== "__new__")
                          setForm((f) => ({ ...f, album: v }));
                        else setForm((f) => ({ ...f, album: "" }));
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Pilih atau buat album baru" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__new__">+ Album Baru</SelectItem>
                        {allAlbums.map((album, index) => (
                          <SelectItem key={`${album}-${index}`} value={album}>
                            {album}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(!allAlbums.includes(form.album) || form.album === "") && (
                      <Input
                        value={form.album}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, album: e.target.value }))
                        }
                        placeholder="Nama album baru..."
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {editing ? "Update" : "Simpan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari galeri berdasarkan judul..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Select
          value={filterCategory}
          onValueChange={handleFilterCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[160px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            <SelectItem value="umum">Umum</SelectItem>
            <SelectItem value="kegiatan">Kegiatan</SelectItem>
            <SelectItem value="pembangunan">Pembangunan</SelectItem>
            <SelectItem value="budaya">Budaya</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAlbum} onValueChange={handleFilterAlbumChange}>
          <SelectTrigger className="w-full sm:w-[160px] dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Album</SelectItem>
            {allAlbums.map((album, index) => (
              <SelectItem key={`${album}-${index}`} value={album}>
                {album}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))
        ) : list.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            Belum ada foto
          </div>
        ) : (
          list.map((item) => (
            <Card
              key={item.id}
              className="border-0 shadow-md overflow-hidden group dark:bg-gray-900 dark:border dark:border-gray-800"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.album && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/50 text-white text-[10px]">
                      {item.album}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.title}
                </p>
                <Badge
                  className={`${categoryBadge[item.category] || "bg-gray-100"} text-xs mt-1`}
                >
                  {item.category}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
    </div>
  );
}
