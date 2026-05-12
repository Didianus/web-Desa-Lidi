import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator Desa',
      role: 'admin',
    },
  })

  // Create profil desa
  await prisma.profilDesa.upsert({
    where: { id: 'profil-1' },
    update: {},
    create: {
      id: 'profil-1',
      namaDesa: 'Desa Sukamaju',
      kecamatan: 'Kecamatan Cimahi Selatan',
      kabupaten: 'Kota Cimahi',
      provinsi: 'Jawa Barat',
      kodePos: '40533',
      sejarah: 'Desa Sukamaju merupakan salah satu desa yang terletak di Kecamatan Cimahi Selatan, Kota Cimahi, Jawa Barat. Desa ini memiliki sejarah panjang yang dimulai sejak era kolonial Belanda. Pada awalnya, desa ini merupakan kawasan pertanian yang subur dengan mata air yang melimpah. Seiring berjalannya waktu, Desa Sukamaju berkembang menjadi desa yang modern dengan berbagai fasilitas dan infrastruktur yang memadai. Nama "Sukamaju" diambil dari kata "Suka" yang berarti senang dan "Maju" yang berarti bergerak ke depan, mencerminkan semangat masyarakat yang selalu ingin maju dan berkembang.',
      visi: 'Mewujudkan Desa Sukamaju yang Maju, Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Transparan',
      misi: '1. Meningkatkan kualitas pelayanan publik kepada masyarakat\n2. Mengembangkan potensi ekonomi desa berbasis pertanian dan UMKM\n3. Meningkatkan infrastruktur desa yang berkualitas dan merata\n4. Membangun sumber daya manusia yang kompeten dan berkarakter\n5. Melestarikan budaya dan kearifan lokal\n6. Mewujudkan tata kelola pemerintahan yang transparan dan akuntabel',
      kepalaDesa: 'H. Ahmad Suryadi, S.Sos',
      sambutanKepalaDesa: 'Assalamualaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Desa Sukamaju. Website ini merupakan media informasi dan komunikasi antara Pemerintah Desa dengan masyarakat. Melalui website ini, kami berkomitmen untuk memberikan pelayanan yang terbaik dan transparan kepada seluruh masyarakat Desa Sukamaju. Semoga website ini dapat menjadi sarana yang bermanfaat bagi kita semua. Wassalamualaikum Warahmatullahi Wabarakatuh.',
      fotoKepalaDesa: '',
      luasWilayah: 3.5,
      jumlahPenduduk: 8542,
      jumlahKK: 2345,
      jumlahLaki: 4280,
      jumlahPerempuan: 4262,
      telepon: '(022) 6654321',
      email: 'desa@sukamaju-cimahi.go.id',
      alamat: 'Jl. Raya Sukamaju No. 1, Cimahi Selatan',
    },
  })

  // Create struktur organisasi
  const strukturData = [
    { nama: 'H. Ahmad Suryadi, S.Sos', jabatan: 'Kepala Desa', urutan: 1 },
    { nama: 'Dedi Mulyadi, S.H', jabatan: 'Sekretaris Desa', urutan: 2 },
    { nama: 'Ir. Bambang Sutrisno', jabatan: 'Kaur Keuangan', urutan: 3 },
    { nama: 'Siti Nurhaliza, S.Pd', jabatan: 'Kaur Tata Usaha', urutan: 4 },
    { nama: 'Agus Riyanto', jabatan: 'Kasi Pemerintahan', urutan: 5 },
    { nama: 'Rina Wulandari, S.Kom', jabatan: 'Kasi Pelayanan', urutan: 6 },
    { nama: 'Ujang Suryana', jabatan: 'Kasi Kesejahteraan', urutan: 7 },
    { nama: 'Dewi Safitri', jabatan: 'Kadus 1', urutan: 8 },
    { nama: 'Rahmat Hidayat', jabatan: 'Kadus 2', urutan: 9 },
    { nama: 'Yuni Astuti', jabatan: 'Kadus 3', urutan: 10 },
  ]

  for (const item of strukturData) {
    await prisma.strukturOrganisasi.upsert({
      where: { id: `struktur-${item.urutan}` },
      update: {},
      create: {
        id: `struktur-${item.urutan}`,
        ...item,
      },
    })
  }

  // Create berita
  const beritaData = [
    {
      title: 'Program Vaksinasi COVID-19 Tahap 3 Berhasil Dilaksanakan',
      content: 'Desa Sukamaju berhasil melaksanakan program vaksinasi COVID-19 tahap 3 yang diselenggarakan pada tanggal 15 Maret 2024 di Balai Desa. Kegiatan ini diikuti oleh lebih dari 500 warga dan berjalan dengan lancar dan tertib. Kepala Desa H. Ahmad Suryadi menyampaikan apresiasi kepada seluruh warga yang telah berpartisipasi dalam program vaksinasi ini. "Ini menunjukkan kesadaran masyarakat kita terhadap kesehatan," ujarnya. Program vaksinasi ini bekerja sama dengan Puskesmas Kecamatan Cimahi Selatan dan didukung oleh tim medis dari RSUD Cimahi.',
      authorId: admin.id,
      published: true,
    },
    {
      title: 'Pembangunan Jalan Desa Tahap II Dimulai',
      content: 'Pembangunan jalan desa tahap II resmi dimulai pada Senin, 10 April 2024. Pembangunan ini mencakup pengerasan jalan sepanjang 2 km di RT 03 dan RT 05 yang sebelumnya masih berupa jalan tanah. Dana pembangunan berasal dari Dana Desa tahun anggaran 2024 dengan total anggaran sebesar Rp 500 juta. Pelaksanaan pembangunan ditargetkan selesai dalam waktu 3 bulan. Warga sangat antusias menyambut program pembangunan ini karena akan sangat memudahkan akses transportasi terutama saat musim hujan.',
      authorId: admin.id,
      published: true,
    },
    {
      title: 'Festival Budaya Desa Sukamaju 2024',
      content: 'Desa Sukamaju akan mengadakan Festival Budaya tahunan yang rencananya akan dilaksanakan pada tanggal 25-27 Mei 2024 di Lapangan Desa. Festival ini akan menampilkan berbagai kesenian tradisional seperti wayang golek, jaipong, angklung, dan berbagai kuliner khas desa. Ketua Panitia Dedi Mulyadi mengatakan bahwa festival ini bertujuan untuk melestarikan budaya lokal sekaligus menjadi daya tarik wisata. "Kami berharap festival ini bisa menjadi agenda tahunan yang dinanti masyarakat," tambahnya.',
      authorId: admin.id,
      published: true,
    },
    {
      title: 'Pelatihan UMKM Digital untuk Warga Desa',
      content: 'Dalam rangka meningkatkan kapasitas pelaku UMKM di desa, Pemerintah Desa Sukamaju bekerja sama dengan Dinas Koperasi dan UMKM Kota Cimahi mengadakan pelatihan UMKM Digital. Pelatihan ini diikuti oleh 50 peserta dari berbagai bidang usaha seperti kuliner, kerajinan, dan pertanian. Materi yang diberikan meliputi pemasaran digital, pengelolaan keuangan, dan penggunaan aplikasi pembayaran digital. Peserta sangat antusias mengikuti pelatihan ini dan berharap bisa meningkatkan omzet usaha mereka.',
      authorId: admin.id,
      published: true,
    },
    {
      title: 'Posyandu Rutin Bulan Ini',
      content: 'Posyandu rutin akan dilaksanakan setiap hari Rabu di masing-masing RW. Kegiatan ini meliputi penimbangan balita, pemberian imunisasi, dan konsultasi kesehatan ibu dan anak. Ibu-ibu yang memiliki balita diharapkan dapat menghadiri kegiatan ini sesuai jadwal yang telah ditentukan oleh kader posyandu masing-masing RW.',
      authorId: admin.id,
      published: true,
    },
  ]

  for (let i = 0; i < beritaData.length; i++) {
    await prisma.berita.upsert({
      where: { id: `berita-${i + 1}` },
      update: {},
      create: {
        id: `berita-${i + 1}`,
        ...beritaData[i],
      },
    })
  }

  // Create pengumuman
  const pengumumanData = [
    {
      title: 'Pengumuman Libur Hari Raya Idul Fitri 1445 H',
      content: 'Diberitahukan kepada seluruh warga Desa Sukamaju bahwa dalam rangka Hari Raya Idul Fitri 1445 H, pelayanan di kantor desa akan diliburkan pada tanggal 10-14 April 2024. Pelayanan akan kembali normal pada tanggal 15 April 2024. Mohon maaf atas ketidaknyamanan ini.',
      priority: 'penting',
      published: true,
    },
    {
      title: 'Jadwal Pelayanan Surat Baru',
      content: 'Mulai tanggal 1 Mei 2024, pelayanan surat di kantor desa akan dibuka setiap hari Senin-Jumat pukul 08.00-15.00 WIB. Pengajuan surat secara online tetap bisa dilakukan melalui website ini. Surat yang diajukan online dapat diambil di kantor desa maksimal 3 hari kerja setelah pengajuan.',
      priority: 'penting',
      published: true,
    },
    {
      title: 'Musyawarah Desa (Musdes) Tahun 2024',
      content: 'Pemerintah Desa Sukamaju akan mengadakan Musyawarah Desa (Musdes) pada tanggal 20 April 2024 di Balai Desa mulai pukul 09.00 WIB. Seluruh elemen masyarakat diundang untuk berpartisipasi dalam musyawarah ini yang akan membahas program pembangunan desa tahun 2024.',
      priority: 'normal',
      published: true,
    },
    {
      title: 'Program Kartu Indonesia Pintar (KIP)',
      content: 'Bagi warga yang memiliki anak usia sekolah dan belum memiliki KIP, dapat mendaftar di kantor desa dengan membawa Kartu Keluarga, KTP, dan Surat Keterangan Tidak Mampu dari RT/RW. Pendaftaran dibuka sampai dengan 30 April 2024.',
      priority: 'biasa',
      published: true,
    },
  ]

  for (let i = 0; i < pengumumanData.length; i++) {
    await prisma.pengumuman.upsert({
      where: { id: `pengumuman-${i + 1}` },
      update: {},
      create: {
        id: `pengumuman-${i + 1}`,
        ...pengumumanData[i],
      },
    })
  }

  // Create galeri
  const galeriData = [
    { title: 'Balai Desa Sukamaju', image: '', category: 'umum' },
    { title: 'Vaksinasi Warga', image: '', category: 'kegiatan' },
    { title: 'Pembangunan Jalan', image: '', category: 'pembangunan' },
    { title: 'Festival Budaya 2023', image: '', category: 'budaya' },
    { title: 'Kerja Bakti', image: '', category: 'kegiatan' },
    { title: 'Taman Desa', image: '', category: 'umum' },
    { title: 'Pelatihan UMKM', image: '', category: 'kegiatan' },
    { title: 'Upacara HUT RI', image: '', category: 'kegiatan' },
  ]

  for (let i = 0; i < galeriData.length; i++) {
    await prisma.galeri.upsert({
      where: { id: `galeri-${i + 1}` },
      update: {},
      create: {
        id: `galeri-${i + 1}`,
        ...galeriData[i],
      },
    })
  }

  // Create sample surat pengajuan
  const suratData = [
    {
      nama: 'Budi Santoso',
      nik: '3201701234560001',
      alamat: 'RT 01/RW 03, Desa Sukamaju',
      jenisSurat: 'domisili',
      keterangan: 'Untuk keperluan pendaftaran kerja',
      status: 'selesai',
      userId: admin.id,
    },
    {
      nama: 'Siti Aminah',
      nik: '3201701234560002',
      alamat: 'RT 02/RW 01, Desa Sukamaju',
      jenisSurat: 'usaha',
      keterangan: 'Untuk pengajuan pinjaman modal usaha',
      status: 'diproses',
      userId: admin.id,
    },
    {
      nama: 'Rahmat Hidayat',
      nik: '3201701234560003',
      alamat: 'RT 05/RW 02, Desa Sukamaju',
      jenisSurat: 'kelahiran',
      keterangan: 'Kelahiran anak kedua',
      status: 'pending',
    },
  ]

  for (let i = 0; i < suratData.length; i++) {
    await prisma.suratPengajuan.upsert({
      where: { id: `surat-${i + 1}` },
      update: {},
      create: {
        id: `surat-${i + 1}`,
        ...suratData[i],
      },
    })
  }

  console.log('✅ Seed data berhasil dimasukkan!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
