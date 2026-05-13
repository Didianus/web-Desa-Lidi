-- AlterTable
ALTER TABLE `profildesa` MODIFY `namaDesa` VARCHAR(191) NOT NULL DEFAULT 'Desa Lidi',
    MODIFY `kecamatan` VARCHAR(191) NOT NULL DEFAULT 'Kecamatan Rana Mese',
    MODIFY `kabupaten` VARCHAR(191) NOT NULL DEFAULT 'Kabupaten Msnggsrsi Timur',
    MODIFY `provinsi` VARCHAR(191) NOT NULL DEFAULT 'NTT',
    MODIFY `sejarah` TEXT NOT NULL,
    MODIFY `visi` TEXT NOT NULL,
    MODIFY `misi` TEXT NOT NULL,
    MODIFY `kepalaDesa` VARCHAR(191) NOT NULL DEFAULT 'Pak Didi',
    MODIFY `sambutanKepalaDesa` TEXT NOT NULL,
    MODIFY `telepon` VARCHAR(191) NOT NULL DEFAULT '085773617907',
    MODIFY `email` VARCHAR(191) NOT NULL DEFAULT 'desa@Lidi.go.id',
    MODIFY `alamat` VARCHAR(191) NOT NULL DEFAULT 'Jl. Desa Lidi';
