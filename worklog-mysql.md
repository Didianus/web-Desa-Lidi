---
Task ID: 1
Agent: main
Task: Migrate database from SQLite to MySQL

Work Log:
- Found pre-installed MariaDB binaries at /home/z/mysql/
- Started MariaDB server with custom socket path (/tmp/mysqld/mysqld.sock) and low memory settings
- Created desa_db database with utf8mb4 charset
- Updated prisma/schema.prisma: changed provider from sqlite to mysql, added @db.VarChar, @db.Text, @db.LongText annotations for MySQL compatibility
- Updated .env with DATABASE_URL=mysql://root:@localhost:3306/desa_db
- Ran `prisma migrate dev --name init` to create initial MySQL migration
- Ran seed script to populate MySQL database with dummy data
- Fixed DATABASE_URL env loading issue: bun doesn't properly pass .env to subprocess, created start.sh that exports DATABASE_URL explicitly
- Updated db.ts to use datasourceUrl parameter for explicit URL passing
- Verified: login API works with MySQL, register API creates new users in MySQL
- Added start.sh script that auto-starts MariaDB and Next.js with correct DATABASE_URL
- Added db:seed script to package.json
- Lint passes clean

Stage Summary:
- Database successfully migrated from SQLite to MySQL (MariaDB 11.8.6)
- All 13 tables created in desa_db: User, Penduduk, Berita, Pengumuman, Galeri, SuratPengajuan, ProfilDesa, StrukturOrganisasi, Notifikasi, Kegiatan, Agenda, ChatRoom, ChatMessage
- New user registrations now persist to MySQL database
- start.sh script auto-starts MariaDB + Next.js dev server
- Key files changed: prisma/schema.prisma, .env, src/lib/db.ts, package.json, start.sh
