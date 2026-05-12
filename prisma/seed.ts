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

  // Create kepala desa user
  await prisma.user.upsert({
    where: { username: 'kepala_desa' },
    update: {},
    create: {
      username: 'kepala_desa',
      password: hashedPassword,
      name: 'H. Ahmad Suryadi, S.Sos',
      role: 'kepala_desa',
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
      create: { id: `struktur-${item.urutan}`, ...item },
    })
  }

  // Create berita
  const beritaData = [
    { title: 'Program Vaksinasi COVID-19 Tahap 3 Berhasil Dilaksanakan', content: 'Desa Sukamaju berhasil melaksanakan program vaksinasi COVID-19 tahap 3 yang diselenggarakan pada tanggal 15 Maret 2024 di Balai Desa. Kegiatan ini diikuti oleh lebih dari 500 warga dan berjalan dengan lancar dan tertib. Kepala Desa H. Ahmad Suryadi menyampaikan apresiasi kepada seluruh warga yang telah berpartisipasi.', authorId: admin.id, published: true },
    { title: 'Pembangunan Jalan Desa Tahap II Dimulai', content: 'Pembangunan jalan desa tahap II resmi dimulai pada Senin, 10 April 2024. Pembangunan ini mencakup pengerasan jalan sepanjang 2 km di RT 03 dan RT 05. Dana pembangunan berasal dari Dana Desa tahun anggaran 2024 dengan total anggaran sebesar Rp 500 juta.', authorId: admin.id, published: true },
    { title: 'Festival Budaya Desa Sukamaju 2024', content: 'Desa Sukamaju akan mengadakan Festival Budaya tahunan yang rencananya akan dilaksanakan pada tanggal 25-27 Mei 2024 di Lapangan Desa. Festival ini akan menampilkan berbagai kesenian tradisional seperti wayang golek, jaipong, angklung, dan berbagai kuliner khas desa.', authorId: admin.id, published: true },
    { title: 'Pelatihan UMKM Digital untuk Warga Desa', content: 'Pemerintah Desa Sukamaju bekerja sama dengan Dinas Koperasi dan UMKM Kota Cimahi mengadakan pelatihan UMKM Digital. Pelatihan ini diikuti oleh 50 peserta dari berbagai bidang usaha seperti kuliner, kerajinan, dan pertanian.', authorId: admin.id, published: true },
    { title: 'Posyandu Rutin Bulan Ini', content: 'Posyandu rutin akan dilaksanakan setiap hari Rabu di masing-masing RW. Kegiatan ini meliputi penimbangan balita, pemberian imunisasi, dan konsultasi kesehatan ibu dan anak.', authorId: admin.id, published: true },
  ]
  for (let i = 0; i < beritaData.length; i++) {
    await prisma.berita.upsert({ where: { id: `berita-${i + 1}` }, update: {}, create: { id: `berita-${i + 1}`, ...beritaData[i] } })
  }

  // Create pengumuman
  const pengumumanData = [
    { title: 'Pengumuman Libur Hari Raya Idul Fitri 1445 H', content: 'Diberitahukan kepada seluruh warga Desa Sukamaju bahwa pelayanan di kantor desa akan diliburkan pada tanggal 10-14 April 2024.', priority: 'penting', published: true },
    { title: 'Jadwal Pelayanan Surat Baru', content: 'Mulai tanggal 1 Mei 2024, pelayanan surat di kantor desa akan dibuka setiap hari Senin-Jumat pukul 08.00-15.00 WIB.', priority: 'penting', published: true },
    { title: 'Musyawarah Desa (Musdes) Tahun 2024', content: 'Pemerintah Desa Sukamaju akan mengadakan Musyawarah Desa pada tanggal 20 April 2024 di Balai Desa.', priority: 'normal', published: true },
    { title: 'Program Kartu Indonesia Pintar (KIP)', content: 'Bagi warga yang memiliki anak usia sekolah dan belum memiliki KIP, dapat mendaftar di kantor desa.', priority: 'biasa', published: true },
  ]
  for (let i = 0; i < pengumumanData.length; i++) {
    await prisma.pengumuman.upsert({ where: { id: `pengumuman-${i + 1}` }, update: {}, create: { id: `pengumuman-${i + 1}`, ...pengumumanData[i] } })
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
    await prisma.galeri.upsert({ where: { id: `galeri-${i + 1}` }, update: {}, create: { id: `galeri-${i + 1}`, ...galeriData[i] } })
  }

  // Create surat pengajuan
  const suratData = [
    { nama: 'Budi Santoso', nik: '3201701234560001', alamat: 'RT 01/RW 03, Desa Sukamaju', jenisSurat: 'domisili', keterangan: 'Untuk keperluan pendaftaran kerja', status: 'selesai', noSurat: '001/DS/2024', userId: admin.id },
    { nama: 'Siti Aminah', nik: '3201701234560002', alamat: 'RT 02/RW 01, Desa Sukamaju', jenisSurat: 'usaha', keterangan: 'Untuk pengajuan pinjaman modal usaha', status: 'diproses', userId: admin.id },
    { nama: 'Rahmat Hidayat', nik: '3201701234560003', alamat: 'RT 05/RW 02, Desa Sukamaju', jenisSurat: 'kelahiran', keterangan: 'Kelahiran anak kedua', status: 'pending' },
    { nama: 'Dewi Lestari', nik: '3201701234560004', alamat: 'RT 03/RW 01, Desa Sukamaju', jenisSurat: 'kematian', keterangan: 'Kematian anggota keluarga', status: 'ditolak' },
    { nama: 'Agus Pratama', nik: '3201701234560005', alamat: 'RT 04/RW 02, Desa Sukamaju', jenisSurat: 'domisili', keterangan: 'Untuk pendaftaran sekolah anak', status: 'pending' },
  ]
  for (let i = 0; i < suratData.length; i++) {
    await prisma.suratPengajuan.upsert({ where: { id: `surat-${i + 1}` }, update: {}, create: { id: `surat-${i + 1}`, ...suratData[i] } })
  }

  // Create penduduk dummy data
  const pendudukData = [
    { nik: '3201701010001001', nama: 'Budi Santoso', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1985-03-15'), alamat: 'Jl. Merpati No. 10', rt: '001', rw: '003', pekerjaan: 'Wiraswasta', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001002', nama: 'Siti Aminah', jenisKelamin: 'Perempuan', tempatLahir: 'Bandung', tanggalLahir: new Date('1990-07-22'), alamat: 'Jl. Kenanga No. 5', rt: '002', rw: '001', pekerjaan: 'Guru', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001003', nama: 'Rahmat Hidayat', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1978-01-10'), alamat: 'Jl. Anggrek No. 15', rt: '005', rw: '002', pekerjaan: 'PNS', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S2' },
    { nik: '3201701010001004', nama: 'Dewi Lestari', jenisKelamin: 'Perempuan', tempatLahir: 'Jakarta', tanggalLahir: new Date('1995-11-30'), alamat: 'Jl. Melati No. 8', rt: '003', rw: '001', pekerjaan: 'Karyawan Swasta', status: 'aktif', agama: 'Islam', statusKawin: 'Belum Kawin', pendidikan: 'S1' },
    { nik: '3201701010001005', nama: 'Agus Pratama', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1982-05-18'), alamat: 'Jl. Dahlia No. 22', rt: '004', rw: '002', pekerjaan: 'Petani', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'SMA' },
    { nik: '3201701010001006', nama: 'Rina Wulandari', jenisKelamin: 'Perempuan', tempatLahir: 'Garut', tanggalLahir: new Date('1988-09-05'), alamat: 'Jl. Mawar No. 3', rt: '001', rw: '001', pekerjaan: 'Ibu Rumah Tangga', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'D3' },
    { nik: '3201701010001007', nama: 'Ujang Suryana', jenisKelamin: 'Laki-laki', tempatLahir: 'Cianjur', tanggalLahir: new Date('1975-12-20'), alamat: 'Jl. Flamboyan No. 17', rt: '006', rw: '003', pekerjaan: 'Pedagang', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'SMP' },
    { nik: '3201701010001008', nama: 'Yuni Astuti', jenisKelamin: 'Perempuan', tempatLahir: 'Cimahi', tanggalLahir: new Date('1993-04-14'), alamat: 'Jl. Bougenville No. 9', rt: '002', rw: '002', pekerjaan: 'Perawat', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'D3' },
    { nik: '3201701010001009', nama: 'Dedi Mulyadi', jenisKelamin: 'Laki-laki', tempatLahir: 'Bandung', tanggalLahir: new Date('1980-08-25'), alamat: 'Jl. Cempaka No. 12', rt: '003', rw: '003', pekerjaan: 'PNS', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001010', nama: 'Sri Mulyani', jenisKelamin: 'Perempuan', tempatLahir: 'Tasikmalaya', tanggalLahir: new Date('1992-02-28'), alamat: 'Jl. Teratai No. 6', rt: '004', rw: '001', pekerjaan: 'Wiraswasta', status: 'aktif', agama: 'Islam', statusKawin: 'Belum Kawin', pendidikan: 'S1' },
    { nik: '3201701010001011', nama: 'Heru Setiawan', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1987-06-08'), alamat: 'Jl. Seroja No. 20', rt: '001', rw: '002', pekerjaan: 'Sopir', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'SMA' },
    { nik: '3201701010001012', nama: 'Ani Rohayati', jenisKelamin: 'Perempuan', tempatLahir: 'Sumedang', tanggalLahir: new Date('1991-10-12'), alamat: 'Jl. Raflesia No. 14', rt: '005', rw: '001', pekerjaan: 'Karyawan Swasta', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001013', nama: 'Bambang Sutrisno', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1970-03-22'), alamat: 'Jl. Edelweis No. 30', rt: '006', rw: '002', pekerjaan: 'Pensiunan', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001014', nama: 'Linda Permata', jenisKelamin: 'Perempuan', tempatLahir: 'Bogor', tanggalLahir: new Date('1998-01-05'), alamat: 'Jl. Lily No. 7', rt: '002', rw: '003', pekerjaan: 'Mahasiswa', status: 'aktif', agama: 'Islam', statusKawin: 'Belum Kawin', pendidikan: 'SMA' },
    { nik: '3201701010001015', nama: 'Eko Prasetyo', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('1983-07-19'), alamat: 'Jl. Kutilang No. 11', rt: '003', rw: '002', pekerjaan: 'TNI', status: 'pindah', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'S1' },
    { nik: '3201701010001016', nama: 'Nurhasanah', jenisKelamin: 'Perempuan', tempatLahir: 'Purwakarta', tanggalLahir: new Date('1976-04-30'), alamat: 'Jl. Kenari No. 25', rt: '004', rw: '003', pekerjaan: 'Ibu Rumah Tangga', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'SMP' },
    { nik: '3201701010001017', nama: 'Wahyu Hidayat', jenisKelamin: 'Laki-laki', tempatLahir: 'Cimahi', tanggalLahir: new Date('2000-09-15'), alamat: 'Jl. Mangga No. 18', rt: '001', rw: '001', pekerjaan: 'Pelajar', status: 'aktif', agama: 'Islam', statusKawin: 'Belum Kawin', pendidikan: 'SMA' },
    { nik: '3201701010001018', nama: 'Ratna Dewi', jenisKelamin: 'Perempuan', tempatLahir: 'Subang', tanggalLahir: new Date('1986-12-03'), alamat: 'Jl. Rambutan No. 4', rt: '005', rw: '003', pekerjaan: 'Bidang Desa', status: 'aktif', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'D3' },
    { nik: '3201701010001019', nama: 'Suparman', jenisKelamin: 'Laki-laki', tempatLahir: 'Karawang', tanggalLahir: new Date('1968-02-14'), alamat: 'Jl. Durian No. 16', rt: '006', rw: '001', pekerjaan: 'Petani', status: 'meninggal', agama: 'Islam', statusKawin: 'Kawin', pendidikan: 'SD' },
    { nik: '3201701010001020', nama: 'Fitri Handayani', jenisKelamin: 'Perempuan', tempatLahir: 'Cimahi', tanggalLahir: new Date('1994-08-27'), alamat: 'Jl. Salak No. 2', rt: '002', rw: '002', pekerjaan: 'Karyawan Swasta', status: 'aktif', agama: 'Kristen', statusKawin: 'Kawin', pendidikan: 'S1' },
  ]
  for (let i = 0; i < pendudukData.length; i++) {
    await prisma.penduduk.upsert({
      where: { id: `penduduk-${i + 1}` },
      update: {},
      create: { id: `penduduk-${i + 1}`, ...pendudukData[i] },
    })
  }

  console.log('✅ Seed data berhasil dimasukkan! (termasuk 20 data penduduk & kepala_desa user)')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
