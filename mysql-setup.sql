-- ============================================
-- MySQL Setup Script untuk Desa Lidi
-- Jalankan di MySQL/MariaDB server Anda
-- ============================================

-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS desa_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 2. Buat User MySQL (ganti password sesuai keinginan)
CREATE USER IF NOT EXISTS 'desa_user'@'localhost' IDENTIFIED BY 'desa_password_2024';
CREATE USER IF NOT EXISTS 'desa_user'@'%' IDENTIFIED BY 'desa_password_2024';

-- 3. Berikan Hak Akses
GRANT ALL PRIVILEGES ON desa_db.* TO 'desa_user'@'localhost';
GRANT ALL PRIVILEGES ON desa_db.* TO 'desa_user'@'%';
FLUSH PRIVILEGES;

-- 4. Gunakan Database
USE desa_db;

-- ============================================
-- Tabel akan dibuat otomatis oleh Prisma DB Push
-- Jika ingin import manual, gunakan: 
--   mysql -u desa_user -p desa_db < desa_db_backup.sql
-- ============================================

SELECT '✅ Database desa_db berhasil dibuat!' AS status;
