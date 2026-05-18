import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin321", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: hashedPassword,
      name: "Administrator Desa",
    },
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator Desa",
      role: "admin",
    },
  });

  // Create kepala desa user
  await prisma.user.upsert({
    where: { username: "kepala_desa" },
    update: {
      password: hashedPassword,
      name: "Pak Dedos",
    },
    create: {
      username: "kepala_desa",
      password: hashedPassword,
      name: "Pak Dedos",
      role: "kepala_desa",
    },
  });

  // Create profil desa
  await prisma.profilDesa.upsert({
    where: { id: "profil-1" },
    update: {},
    create: {
      id: "profil-1",
      namaDesa: "Desa Lidi",
      kecamatan: "Kecamatan Rana Mese",
      kabupaten: "kabupaten Manggarai Timur",
      provinsi: "Nusa Tenggara Timur",
      kodePos: "40533",
      sejarah:
        'Desa Lidi merupakan salah satu desa yang terletak di Kecamatan Rana Mese, Kabupaten Manggarai Timur, Nusa Tenggara Timur. Desa ini memiliki sejarah panjang yang dimulai sejak era kolonial Belanda. Pada awalnya, desa ini merupakan kawasan pertanian yang subur dengan mata air yang melimpah. Seiring berjalannya waktu, Desa Lidi berkembang menjadi desa yang modern dengan berbagai fasilitas dan infrastruktur yang memadai. Nama "Lidi" diambil dari kata "Ijuk" yang berarti Kukuh dan kuat, mencerminkan semangat masyarakat yang selalu ingin maju dan berkembang.',
      visi: "Mewujudkan Desa Lidi yang Maju, Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan",
      misi: "1. Meningkatkan kualitas pelayanan publik kepada masyarakat\n2. Mengembangkan potensi ekonomi desa berbasis pertanian dan UMKM\n3. Meningkatkan infrastruktur desa yang berkualitas dan merata\n4. Membangun sumber daya manusia yang kompeten dan berkarakter\n5. Melestarikan budaya dan kearifan lokal\n6. Mewujudkan tata kelola pemerintahan yang transparan dan akuntabel",
      kepalaDesa: "Pak Dedos",
      sambutanKepalaDesa:
        "Salom. Selamat datang di website resmi Desa Lidi. Website ini merupakan media informasi dan komunikasi antara Pemerintah Desa dengan masyarakat. Melalui website ini, kami berkomitmen untuk memberikan pelayanan yang terbaik dan transparan kepada seluruh masyarakat Desa Lidi. Semoga website ini dapat menjadi sarana yang bermanfaat bagi kita semua. Tabe.",
      fotoKepalaDesa: "",
      luasWilayah: 3.5,
      jumlahPenduduk: 8542,
      jumlahKK: 2345,
      jumlahLaki: 4280,
      jumlahPerempuan: 4262,
      telepon: "085773617907",
      email: "desa@lidi.go.id",
      alamat: "Jl. Raya Lidi No. 1, Rana Mese, Manggarai Timur, NTT",
    },
  });

  // Create struktur organisasi
  const strukturData = [
    { nama: "Pak Dedos", jabatan: "Kepala Desa", urutan: 1 },
    { nama: "Dedi Mulyadi, S.H", jabatan: "Sekretaris Desa", urutan: 2 },
    { nama: "Ir. Bambang Sutrisno", jabatan: "Kaur Keuangan", urutan: 3 },
    { nama: "Siti Nurhaliza, S.Pd", jabatan: "Kaur Tata Usaha", urutan: 4 },
    { nama: "Agus Riyanto", jabatan: "Kasi Pemerintahan", urutan: 5 },
    { nama: "Rina Wulandari, S.Kom", jabatan: "Kasi Pelayanan", urutan: 6 },
    { nama: "Ujang Suryana", jabatan: "Kasi Kesejahteraan", urutan: 7 },
    { nama: "Dewi Safitri", jabatan: "Kadus 1", urutan: 8 },
    { nama: "Rahmat Hidayat", jabatan: "Kadus 2", urutan: 9 },
    { nama: "Yuni Astuti", jabatan: "Kadus 3", urutan: 10 },
  ];
  for (const item of strukturData) {
    await prisma.strukturOrganisasi.upsert({
      where: { id: `struktur-${item.urutan}` },
      update: {},
      create: { id: `struktur-${item.urutan}`, ...item },
    });
  }

  // Create berita
  const beritaData = [
    {
      title: "Program Vaksinasi COVID-19 Tahap 3 Berhasil Dilaksanakan",
      content:
        "Desa Lidi berhasil melaksanakan program vaksinasi COVID-19 tahap 3 yang diselenggarakan pada tanggal 15 Maret 2024 di Balai Desa. Kegiatan ini diikuti oleh lebih dari 500 warga dan berjalan dengan lancar dan tertib. Kepala Desa Pak Dedos menyampaikan apresiasi kepada seluruh warga yang telah berpartisipasi.",
      authorId: admin.id,
      published: true,
    },
    {
      title: "Pembangunan Jalan Desa Tahap II Dimulai",
      content:
        "Pembangunan jalan desa tahap II resmi dimulai pada Senin, 10 April 2024. Pembangunan ini mencakup pengerasan jalan sepanjang 2 km di RT 03 dan RT 05. Dana pembangunan berasal dari Dana Desa tahun anggaran 2024 dengan total anggaran sebesar Rp 500 juta.",
      authorId: admin.id,
      published: true,
    },
    {
      title: "Festival Budaya Desa Lidi 2024",
      content:
        "Desa Lidi akan mengadakan Festival Budaya tahunan yang rencananya akan dilaksanakan pada tanggal 25-27 Mei 2024 di Lapangan Desa. Festival ini akan menampilkan berbagai kesenian tradisional seperti tarian caci, musik daerah, angklung, dan berbagai kuliner khas desa.",
      authorId: admin.id,
      published: true,
    },
    {
      title: "Pelatihan UMKM Digital untuk Warga Desa",
      content:
        "Pemerintah Desa Lidi bekerja sama dengan Dinas Koperasi dan UMKM Kota Lidi mengadakan pelatihan UMKM Digital. Pelatihan ini diikuti oleh 50 peserta dari berbagai bidang usaha seperti kuliner, kerajinan, dan pertanian.",
      authorId: admin.id,
      published: true,
    },
    {
      title: "Posyandu Rutin Bulan Ini",
      content:
        "Posyandu rutin akan dilaksanakan setiap hari Rabu di masing-masing RW. Kegiatan ini meliputi penimbangan balita, pemberian imunisasi, dan konsultasi kesehatan ibu dan anak.",
      authorId: admin.id,
      published: true,
    },
  ];
  for (let i = 0; i < beritaData.length; i++) {
    await prisma.berita.upsert({
      where: { id: `berita-${i + 1}` },
      update: {},
      create: { id: `berita-${i + 1}`, ...beritaData[i] },
    });
  }

  // Create pengumuman
  const pengumumanData = [
    {
      title: "Pengumuman Libur Hari Raya Idul Fitri 1445 H",
      content:
        "Diberitahukan kepada seluruh warga Desa Lidi bahwa pelayanan di kantor desa akan diliburkan pada tanggal 10-14 April 2024.",
      priority: "penting",
      published: true,
    },
    {
      title: "Jadwal Pelayanan Surat Baru",
      content:
        "Mulai tanggal 1 Mei 2024, pelayanan surat di kantor desa akan dibuka setiap hari Senin-Jumat pukul 08.00-15.00 WIB.",
      priority: "penting",
      published: true,
    },
    {
      title: "Musyawarah Desa (Musdes) Tahun 2024",
      content:
        "Pemerintah Desa Lidi akan mengadakan Musyawarah Desa pada tanggal 20 April 2024 di Balai Desa.",
      priority: "normal",
      published: true,
    },
    {
      title: "Program Kartu Indonesia Pintar (KIP)",
      content:
        "Bagi warga yang memiliki anak usia sekolah dan belum memiliki KIP, dapat mendaftar di kantor desa.",
      priority: "biasa",
      published: true,
    },
  ];
  for (let i = 0; i < pengumumanData.length; i++) {
    await prisma.pengumuman.upsert({
      where: { id: `pengumuman-${i + 1}` },
      update: {},
      create: { id: `pengumuman-${i + 1}`, ...pengumumanData[i] },
    });
  }

  // Create galeri
  const galeriData = [
    { title: "Balai Desa Lidi", image: "", category: "umum" },
    { title: "Vaksinasi Warga", image: "", category: "kegiatan" },
    { title: "Pembangunan Jalan", image: "", category: "pembangunan" },
    { title: "Festival Budaya 2023", image: "", category: "budaya" },
    { title: "Kerja Bakti", image: "", category: "kegiatan" },
    { title: "Taman Desa", image: "", category: "umum" },
    { title: "Pelatihan UMKM", image: "", category: "kegiatan" },
    { title: "Upacara HUT RI", image: "", category: "kegiatan" },
  ];
  for (let i = 0; i < galeriData.length; i++) {
    await prisma.galeri.upsert({
      where: { id: `galeri-${i + 1}` },
      update: {},
      create: { id: `galeri-${i + 1}`, ...galeriData[i] },
    });
  }

  // Create surat pengajuan
  const suratData = [
    {
      nama: "Budi Santoso",
      nik: "3201701234560001",
      alamat: "RT 01/RW 03, Desa Lidi",
      jenisSurat: "domisili",
      keterangan: "Untuk keperluan pendaftaran kerja",
      status: "selesai",
      noSurat: "001/DS/2024",
      userId: admin.id,
    },
    {
      nama: "Siti Aminah",
      nik: "3201701234560002",
      alamat: "RT 02/RW 01, Desa Lidi",
      jenisSurat: "usaha",
      keterangan: "Untuk pengajuan pinjaman modal usaha",
      status: "diproses",
      userId: admin.id,
    },
    {
      nama: "Rahmat Hidayat",
      nik: "3201701234560003",
      alamat: "RT 05/RW 02, Desa Lidi",
      jenisSurat: "kelahiran",
      keterangan: "Kelahiran anak kedua",
      status: "pending",
    },
    {
      nama: "Dewi Lestari",
      nik: "3201701234560004",
      alamat: "RT 03/RW 01, Desa Lidi",
      jenisSurat: "kematian",
      keterangan: "Kematian anggota keluarga",
      status: "ditolak",
    },
    {
      nama: "Agus Pratama",
      nik: "3201701234560005",
      alamat: "RT 04/RW 02, Desa Lidi",
      jenisSurat: "domisili",
      keterangan: "Untuk pendaftaran sekolah anak",
      status: "pending",
    },
  ];
  for (let i = 0; i < suratData.length; i++) {
    await prisma.suratPengajuan.upsert({
      where: { id: `surat-${i + 1}` },
      update: {},
      create: { id: `surat-${i + 1}`, ...suratData[i] },
    });
  }

  // Create penduduk dummy data
  const pendudukData = [
    {
      nik: "3201701010001001",
      nama: "Budi Santoso",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1985-03-15"),
      alamat: "Jl. Desa Lidi",
      rt: "001",
      rw: "003",
      pekerjaan: "Wiraswasta",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001002",
      nama: "Siti Aminah",
      jenisKelamin: "Perempuan",
      tempatLahir: "Bandung",
      tanggalLahir: new Date("1990-07-22"),
      alamat: "Jl. Desa Lidi",
      rt: "002",
      rw: "001",
      pekerjaan: "Guru",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001003",
      nama: "Rahmat Hidayat",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1978-01-10"),
      alamat: "Jl. desa Lidi",
      rt: "005",
      rw: "002",
      pekerjaan: "PNS",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S2",
    },
    {
      nik: "3201701010001004",
      nama: "Dewi Lestari",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1995-11-30"),
      alamat: "Jl. desa Lidi",
      rt: "003",
      rw: "001",
      pekerjaan: "Karyawan Swasta",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Belum Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001005",
      nama: "Agus Pratama",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1982-05-18"),
      alamat: "Jl. desa Lidi",
      rt: "004",
      rw: "002",
      pekerjaan: "Petani",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "SMA",
    },
    {
      nik: "3201701010001006",
      nama: "Rina Wulandari",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1988-09-05"),
      alamat: "Jl. Desa Lidi",
      rt: "001",
      rw: "001",
      pekerjaan: "Ibu Rumah Tangga",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "D3",
    },
    {
      nik: "3201701010001007",
      nama: "Ujang Suryana",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1975-12-20"),
      alamat: "Jl. Desa Lidi",
      rt: "006",
      rw: "003",
      pekerjaan: "Pedagang",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "SMP",
    },
    {
      nik: "3201701010001008",
      nama: "Yuni Astuti",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1993-04-14"),
      alamat: "Jl. Desa Lidi",
      rt: "002",
      rw: "002",
      pekerjaan: "Perawat",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "D3",
    },
    {
      nik: "3201701010001009",
      nama: "Dedi Mulyadi",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1980-08-25"),
      alamat: "Jl. Desa Lidi",
      rt: "003",
      rw: "003",
      pekerjaan: "PNS",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001010",
      nama: "Sri Mulyani",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1992-02-28"),
      alamat: "Jl. Desa Lidi",
      rt: "004",
      rw: "001",
      pekerjaan: "Wiraswasta",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Belum Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001011",
      nama: "Heru Setiawan",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1987-06-08"),
      alamat: "Jl. Desa Lidi",
      rt: "001",
      rw: "002",
      pekerjaan: "Sopir",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "SMA",
    },
    {
      nik: "3201701010001012",
      nama: "Ani Rohayati",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1991-10-12"),
      alamat: "Jl. desa Lidi",
      rt: "005",
      rw: "001",
      pekerjaan: "Karyawan Swasta",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001013",
      nama: "Bambang Sutrisno",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1970-03-22"),
      alamat: "Jl. desa Lidi",
      rt: "006",
      rw: "002",
      pekerjaan: "Pensiunan",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001014",
      nama: "Linda Permata",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1998-01-05"),
      alamat: "Jl. desa Lidi",
      rt: "002",
      rw: "003",
      pekerjaan: "Mahasiswa",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Belum Kawin",
      pendidikan: "SMA",
    },
    {
      nik: "3201701010001015",
      nama: "Eko Prasetyo",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1983-07-19"),
      alamat: "Jl. desa Lidi",
      rt: "003",
      rw: "002",
      pekerjaan: "TNI",
      status: "pindah",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
    {
      nik: "3201701010001016",
      nama: "Nurhasanah",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1976-04-30"),
      alamat: "Jl. desa Lidi",
      rt: "004",
      rw: "003",
      pekerjaan: "Ibu Rumah Tangga",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "SMP",
    },
    {
      nik: "3201701010001017",
      nama: "Wahyu Hidayat",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("2000-09-15"),
      alamat: "Jl. desa Lidi",
      rt: "001",
      rw: "001",
      pekerjaan: "Pelajar",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Belum Kawin",
      pendidikan: "SMA",
    },
    {
      nik: "3201701010001018",
      nama: "Ratna Dewi",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1986-12-03"),
      alamat: "Jl. desa Lidi",
      rt: "005",
      rw: "003",
      pekerjaan: "Bidang Desa",
      status: "aktif",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "D3",
    },
    {
      nik: "3201701010001019",
      nama: "Suparman",
      jenisKelamin: "Laki-laki",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1968-02-14"),
      alamat: "Jl. desa Lidi",
      rt: "006",
      rw: "001",
      pekerjaan: "Petani",
      status: "meninggal",
      agama: "Katolik",
      statusKawin: "Kawin",
      pendidikan: "SD",
    },
    {
      nik: "3201701010001020",
      nama: "Fitri Handayani",
      jenisKelamin: "Perempuan",
      tempatLahir: "Lidi",
      tanggalLahir: new Date("1994-08-27"),
      alamat: "Jl. desa Lidi",
      rt: "002",
      rw: "002",
      pekerjaan: "Karyawan Swasta",
      status: "aktif",
      agama: "Kristen",
      statusKawin: "Kawin",
      pendidikan: "S1",
    },
  ];
  for (let i = 0; i < pendudukData.length; i++) {
    await prisma.penduduk.upsert({
      where: { id: `penduduk-${i + 1}` },
      update: {},
      create: { id: `penduduk-${i + 1}`, ...pendudukData[i] },
    });
  }

  // Create notifikasi
  const notifikasiData = [
    {
      title: "Surat Baru Masuk",
      message: "Ada pengajuan surat baru dari Budi Santoso",
      type: "info",
      userId: admin.id,
      isRead: false,
    },
    {
      title: "Kegiatan Hari Ini",
      message: "Musyawarah Desa akan dilaksanakan hari ini di Balai Desa",
      type: "warning",
      isRead: false,
    },
    {
      title: "Surat Selesai",
      message: "Surat domisili atas nama Siti Aminah telah selesai diproses",
      type: "success",
      isRead: true,
    },
    {
      title: "Peringatan Sistem",
      message: "Backup database belum dilakukan minggu ini",
      type: "danger",
      isRead: false,
    },
    {
      title: "Chat Baru",
      message: "Warga Dewi Lestari mengirim pesan baru",
      type: "info",
      isRead: false,
    },
  ];
  for (let i = 0; i < notifikasiData.length; i++) {
    await prisma.notifikasi.upsert({
      where: { id: `notifikasi-${i + 1}` },
      update: {},
      create: { id: `notifikasi-${i + 1}`, ...notifikasiData[i] },
    });
  }

  // Create kegiatan
  const kegiatanData = [
    {
      title: "Musyawarah Desa (Musdes)",
      description: "Musyawarah desa untuk membahas program kerja tahun 2024",
      date: new Date("2025-03-15"),
      endDate: new Date("2025-03-15"),
      time: "09:00",
      location: "Balai Desa",
      category: "pemerintahan",
      status: "akan_datang",
    },
    {
      title: "Posyandu Balita",
      description:
        "Kegiatan posyandu rutin untuk penimbangan balita dan imunisasi",
      date: new Date("2025-03-10"),
      endDate: new Date("2025-03-10"),
      time: "08:00",
      location: "Puskesmas Desa",
      category: "sosial",
      status: "akan_datang",
    },
    {
      title: "Festival Budaya Desa",
      description: "Pesta kesenian dan budaya desa tahunan",
      date: new Date("2025-03-20"),
      endDate: new Date("2025-03-22"),
      time: "08:00",
      location: "Lapangan Desa",
      category: "budaya",
      status: "akan_datang",
    },
    {
      title: "Pelatihan UMKM Digital",
      description: "Pelatihan pemasaran digital untuk UMKM desa",
      date: new Date("2025-03-05"),
      endDate: new Date("2025-03-06"),
      time: "09:00",
      location: "Aula Desa",
      category: "pendidikan",
      status: "akan_datang",
    },
    {
      title: "Kerja Bakti Bersih Desa",
      description: "Kegiatan gotong royong membersihkan lingkungan desa",
      date: new Date("2025-03-08"),
      time: "07:00",
      location: "Seluruh wilayah desa",
      category: "sosial",
      status: "akan_datang",
    },
    {
      title: "Rapat RT/RW",
      description: "Rapat koordinasi RT/RW se-Desa Lidi",
      date: new Date("2025-02-28"),
      time: "19:00",
      location: "Balai Desa",
      category: "pemerintahan",
      status: "selesai",
    },
    {
      title: "Vaksinasi COVID-19",
      description: "Program vaksinasi booster untuk warga desa",
      date: new Date("2025-02-20"),
      time: "08:00",
      location: "Puskesmas Desa",
      category: "sosial",
      status: "selesai",
    },
    {
      title: "Upacara HUT RI",
      description: "Upacara peringatan Hari Kemerdekaan RI",
      date: new Date("2025-02-17"),
      time: "07:00",
      location: "Lapangan Desa",
      category: "umum",
      status: "selesai",
    },
  ];
  for (let i = 0; i < kegiatanData.length; i++) {
    await prisma.kegiatan.upsert({
      where: { id: `kegiatan-${i + 1}` },
      update: {},
      create: { id: `kegiatan-${i + 1}`, ...kegiatanData[i] },
    });
  }

  // Create agenda
  const agendaData = [
    {
      title: "Pelayanan Surat Mingguan",
      description: "Pelayanan pembuatan surat keterangan",
      date: new Date("2025-03-03"),
      time: "08:00 - 15:00",
      location: "Kantor Desa",
      pic: "Rina Wulandari",
      category: "pelayanan",
      published: true,
    },
    {
      title: "Rapat Koordinasi Perangkat Desa",
      description: "Rapat rutin perangkat desa",
      date: new Date("2025-03-04"),
      time: "09:00 - 11:00",
      location: "Ruang Rapat Desa",
      pic: "H. Ahmad Suryadi",
      category: "rapat",
      published: true,
    },
    {
      title: "Senam Sehat Bersama",
      description: "Kegiatan senam pagi rutin setiap minggu",
      date: new Date("2025-03-05"),
      time: "06:00 - 07:00",
      location: "Lapangan Desa",
      pic: "Yuni Astuti",
      category: "kegiatan",
      published: true,
    },
    {
      title: "Konsultasi Hukum Gratis",
      description: "Konsultasi hukum gratis untuk warga",
      date: new Date("2025-03-07"),
      time: "09:00 - 12:00",
      location: "Kantor Desa",
      pic: "Dedi Mulyadi",
      category: "pelayanan",
      published: true,
    },
    {
      title: "Jadwal Imunisasi",
      description: "Imunisasi dasar untuk balita",
      date: new Date("2025-03-12"),
      time: "08:00 - 12:00",
      location: "Puskesmas Desa",
      pic: "Yuni Astuti",
      category: "kegiatan",
      published: true,
    },
    {
      title: "Rapat BPBD",
      description: "Rapat badan penanggulangan bencana daerah",
      date: new Date("2025-03-14"),
      time: "14:00 - 16:00",
      location: "Balai Desa",
      pic: "Agus Riyanto",
      category: "rapat",
      published: false,
    },
    {
      title: "Lomba 17 Agustus",
      description: "Berbagai lomba memperingati HUT RI",
      date: new Date("2025-03-17"),
      time: "07:00 - 17:00",
      location: "Lapangan Desa",
      pic: "Siti Nurhaliza",
      category: "kegiatan",
      published: true,
    },
    {
      title: "Penyaluran Bansos",
      description: "Penyaluran bantuan sosial tahap I",
      date: new Date("2025-03-25"),
      time: "08:00 - 14:00",
      location: "Balai Desa",
      pic: "Ir. Bambang Sutrisno",
      category: "umum",
      published: true,
    },
  ];
  for (let i = 0; i < agendaData.length; i++) {
    await prisma.agenda.upsert({
      where: { id: `agenda-${i + 1}` },
      update: {},
      create: { id: `agenda-${i + 1}`, ...agendaData[i] },
    });
  }

  // Create warga users for chat
  const warga1 = await prisma.user.upsert({
    where: { username: "warga_budi" },
    update: {},
    create: {
      username: "warga_budi",
      password: hashedPassword,
      name: "Budi Santoso",
      role: "warga",
    },
  });

  const warga2 = await prisma.user.upsert({
    where: { username: "warga_dewi" },
    update: {},
    create: {
      username: "warga_dewi",
      password: hashedPassword,
      name: "Dewi Lestari",
      role: "warga",
    },
  });

  // Chat room 1
  const room1 = await prisma.chatRoom.upsert({
    where: { id: "chat-room-1" },
    update: {},
    create: {
      id: "chat-room-1",
      wargaId: warga1.id,
      adminId: admin.id,
      subject: "Pertanyaan tentang surat domisili",
      status: "active",
    },
  });

  // Chat room 2
  const room2 = await prisma.chatRoom.upsert({
    where: { id: "chat-room-2" },
    update: {},
    create: {
      id: "chat-room-2",
      wargaId: warga2.id,
      subject: "Informasi jadwal posyandu",
      status: "active",
    },
  });

  // Messages for room 1
  const messages1 = [
    {
      roomId: room1.id,
      senderId: warga1.id,
      message:
        "Selamat pagi, saya ingin bertanya tentang persyaratan pembuatan surat domisili.",
      isRead: true,
    },
    {
      roomId: room1.id,
      senderId: admin.id,
      message:
        "Selamat pagi Pak Budi. Untuk surat domisili, Anda perlu membawa KTP asli, KK, dan surat pengantar dari RT/RW setempat.",
      isRead: true,
    },
    {
      roomId: room1.id,
      senderId: warga1.id,
      message: "Baik, terima kasih. Apakah bisa diurus hari ini?",
      isRead: true,
    },
    {
      roomId: room1.id,
      senderId: admin.id,
      message:
        "Bisa Pak, kantor desa buka sampai pukul 15:00 WIB. Silakan datang dengan membawa berkas yang diperlukan.",
      isRead: false,
    },
  ];

  const messages2 = [
    {
      roomId: room2.id,
      senderId: warga2.id,
      message:
        "Selamat siang, saya ingin menanyakan jadwal posyandu bulan ini.",
      isRead: true,
    },
    {
      roomId: room2.id,
      senderId: admin.id,
      message:
        "Siang Bu Dewi. Posyandu rutin dilaksanakan setiap hari Rabu minggu ke-2 dan ke-4.",
      isRead: false,
    },
  ];

  for (const msg of [...messages1, ...messages2]) {
    await prisma.chatMessage.create({ data: msg });
  }

  console.log(
    "✅ Seed data berhasil dimasukkan! (termasuk 20 data penduduk, kepala_desa user, notifikasi, kegiatan, agenda, chat rooms & messages)",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
