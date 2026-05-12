-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'admin',
    `avatar` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penduduk` (
    `id` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jenisKelamin` VARCHAR(15) NOT NULL,
    `tempatLahir` VARCHAR(50) NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `rt` VARCHAR(5) NOT NULL DEFAULT '001',
    `rw` VARCHAR(5) NOT NULL DEFAULT '001',
    `pekerjaan` VARCHAR(50) NOT NULL DEFAULT 'Belum Bekerja',
    `status` VARCHAR(15) NOT NULL DEFAULT 'aktif',
    `agama` VARCHAR(20) NOT NULL DEFAULT 'Islam',
    `statusKawin` VARCHAR(20) NOT NULL DEFAULT 'Belum Kawin',
    `pendidikan` VARCHAR(10) NOT NULL DEFAULT 'SD',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Penduduk_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berita` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(500) NULL,
    `images` TEXT NULL,
    `authorId` VARCHAR(30) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengumuman` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `priority` VARCHAR(15) NOT NULL DEFAULT 'normal',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeri` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `images` TEXT NULL,
    `album` VARCHAR(50) NOT NULL DEFAULT 'Umum',
    `category` VARCHAR(20) NOT NULL DEFAULT 'umum',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuratPengajuan` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `nik` VARCHAR(20) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `jenisSurat` VARCHAR(20) NOT NULL,
    `keterangan` TEXT NULL,
    `noSurat` VARCHAR(50) NULL,
    `status` VARCHAR(15) NOT NULL DEFAULT 'pending',
    `userId` VARCHAR(30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfilDesa` (
    `id` VARCHAR(191) NOT NULL,
    `namaDesa` VARCHAR(100) NOT NULL DEFAULT 'Desa Sukamaju',
    `kecamatan` VARCHAR(100) NOT NULL DEFAULT 'Kecamatan Sukamaju',
    `kabupaten` VARCHAR(100) NOT NULL DEFAULT 'Kabupaten Sukamaju',
    `provinsi` VARCHAR(50) NOT NULL DEFAULT 'Jawa Barat',
    `kodePos` VARCHAR(10) NOT NULL DEFAULT '12345',
    `sejarah` TEXT NOT NULL DEFAULT 'Sejarah desa akan diisi oleh admin.',
    `visi` TEXT NOT NULL DEFAULT 'Visi desa akan diisi oleh admin.',
    `misi` TEXT NOT NULL DEFAULT 'Misi desa akan diisi oleh admin.',
    `kepalaDesa` VARCHAR(100) NOT NULL DEFAULT 'H. Ahmad Suryadi',
    `sambutanKepalaDesa` TEXT NOT NULL DEFAULT 'Sambutan kepala desa akan diisi oleh admin.',
    `fotoKepalaDesa` VARCHAR(500) NOT NULL DEFAULT '',
    `luasWilayah` DOUBLE NOT NULL DEFAULT 0,
    `jumlahPenduduk` INTEGER NOT NULL DEFAULT 0,
    `jumlahKK` INTEGER NOT NULL DEFAULT 0,
    `jumlahLaki` INTEGER NOT NULL DEFAULT 0,
    `jumlahPerempuan` INTEGER NOT NULL DEFAULT 0,
    `telepon` VARCHAR(20) NOT NULL DEFAULT '(021) 1234567',
    `email` VARCHAR(100) NOT NULL DEFAULT 'desa@sukamaju.go.id',
    `alamat` VARCHAR(255) NOT NULL DEFAULT 'Jl. Raya Desa No. 1, Sukamaju',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StrukturOrganisasi` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jabatan` VARCHAR(100) NOT NULL,
    `foto` VARCHAR(500) NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifikasi` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(15) NOT NULL DEFAULT 'info',
    `userId` VARCHAR(30) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kegiatan` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `time` VARCHAR(10) NULL,
    `location` VARCHAR(255) NULL,
    `category` VARCHAR(20) NOT NULL DEFAULT 'umum',
    `status` VARCHAR(15) NOT NULL DEFAULT 'akan_datang',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agenda` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(20) NULL,
    `location` VARCHAR(255) NULL,
    `pic` VARCHAR(100) NULL,
    `category` VARCHAR(15) NOT NULL DEFAULT 'umum',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoom` (
    `id` VARCHAR(191) NOT NULL,
    `wargaId` VARCHAR(30) NOT NULL,
    `adminId` VARCHAR(30) NULL,
    `subject` VARCHAR(255) NOT NULL DEFAULT 'Pertanyaan Umum',
    `status` VARCHAR(15) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(30) NOT NULL,
    `senderId` VARCHAR(30) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Berita` ADD CONSTRAINT `Berita_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuratPengajuan` ADD CONSTRAINT `SuratPengajuan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_wargaId_fkey` FOREIGN KEY (`wargaId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `ChatRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
