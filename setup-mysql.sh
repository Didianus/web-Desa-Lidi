#!/bin/bash
# ============================================
# Setup MySQL untuk Aplikasi Desa Lidi
# ============================================
# 
# Cara Penggunaan:
#   chmod +x setup-mysql.sh
#   ./setup-mysql.sh
#
# Prasyarat:
#   - MySQL 5.7+ atau MariaDB 10.3+ sudah terinstall
#   - Akses root ke MySQL
# ============================================

set -e

echo "🚀 Setup MySQL untuk Aplikasi Desa Lidi"
echo "============================================"

# Konfigurasi
DB_NAME="desa_db"
DB_USER="desa_user"
DB_PASS="desa_password_2024"
DB_HOST="localhost"
DB_PORT="3306"

# Minta konfirmasi
echo ""
echo "Konfigurasi:"
echo "  Database: $DB_NAME"
echo "  User:     $DB_USER"
echo "  Password: $DB_PASS"
echo "  Host:     $DB_HOST"
echo "  Port:     $DB_PORT"
echo ""
read -p "Lanjutkan? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Dibatalkan."
    exit 0
fi

# 1. Buat database dan user
echo ""
echo "📦 Membuat database dan user MySQL..."
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASS';
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;
SELECT 'Database berhasil dibuat!' AS status;
EOF

echo "✅ Database dan user berhasil dibuat!"

# 2. Update .env file
echo ""
echo "📝 Mengupdate file .env..."

cat > .env << ENVEOF
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
ENVEOF

echo "✅ File .env telah diupdate!"
echo "   DATABASE_URL=mysql://${DB_USER}:****@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# 3. Update Prisma schema ke MySQL
echo ""
echo "🔄 Mengupdate Prisma schema ke MySQL..."

# Cek apakah sudah mysql
if grep -q 'provider = "mysql"' prisma/schema.prisma; then
    echo "   Sudah menggunakan MySQL, skip."
else
    sed -i 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma
    echo "   Provider diubah dari sqlite ke mysql."
fi

# 4. Generate Prisma Client
echo ""
echo "⚙️  Generating Prisma Client..."
bunx prisma generate

# 5. Push schema ke MySQL
echo ""
echo "📤 Push schema ke MySQL database..."
bunx prisma db push

# 6. Jalankan seeder
echo ""
echo "🌱 Menjalankan seeder..."
bunx prisma db seed

echo ""
echo "🎉 Setup MySQL selesai!"
echo ""
echo "Untuk menjalankan aplikasi:"
echo "  bun run dev"
echo ""
echo "Akun demo:"
echo "  Admin:      admin / admin123"
echo "  Kepala Desa: kepala_desa / admin123"
echo "  Warga:      warga_budi / admin123"
