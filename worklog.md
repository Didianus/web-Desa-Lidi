---
Task ID: 1
Agent: Main Agent
Task: Build Website Desa Full Stack - Part 1 (Foundation, API, User Pages, Admin Dashboard)

Work Log:
- Installed dependencies: bcryptjs, jsonwebtoken, @types/bcryptjs, @types/jsonwebtoken
- Created complete Prisma schema with 7 models: User, Berita, Pengumuman, Galeri, SuratPengajuan, ProfilDesa, StrukturOrganisasi
- Pushed schema and seeded database with comprehensive sample data
- Created auth utilities (JWT sign/verify, bcrypt hash/compare)
- Created Zustand stores: useAppStore (routing/view mode) and useAuthStore (auth state with persist)
- Created all API routes:
  - /api/auth/login (POST), /api/auth/me (GET)
  - /api/berita (GET, POST), /api/berita/[id] (GET, PUT, DELETE)
  - /api/pengumuman (GET, POST), /api/pengumuman/[id] (PUT, DELETE)
  - /api/galeri (GET, POST), /api/galeri/[id] (DELETE)
  - /api/surat (GET, POST), /api/surat/[id] (GET, PUT, DELETE)
  - /api/profil (GET, PUT)
  - /api/stats (GET)
  - /api/users (GET, POST)
- Created user-facing components:
  - Navbar (responsive with mobile sheet)
  - Footer (4-column with links, contact, social media)
  - HeroSection (gradient background, stats, CTA buttons)
  - SambutanSection (kepala desa welcome)
  - StatistikSection (population data cards)
  - BeritaSection (latest news preview)
  - PengumumanSection (latest announcements)
  - ProfilDesa (tabs: Sejarah, Visi Misi, Struktur Org, Data Penduduk)
  - BeritaPage & BeritaDetail (search, grid, detail view)
  - PengumumanPage (priority filters, border indicators)
  - GaleriPage (category filters, grid with hover effects)
  - LayananSuratPage (form with 4 jenis surat, info sidebar)
  - KontakPage (contact form, map placeholder, office hours)
  - LoginPage (JWT auth with demo credentials)
- Created admin components:
  - AdminSidebar (collapsible with menu items)
  - AdminDashboard (welcome banner, stats cards, surat status)
  - BeritaManager (CRUD with dialog, table)
  - PengumumanManager (CRUD with priority select)
  - GaleriManager (grid view with add/delete)
  - SuratManager (status management with detail dialog)
  - ProfilManager (comprehensive profile editing)
  - UserManager (add users with role selection)
- Created main page.tsx with client-side routing (UserLayout / AdminLayout)
- Updated layout.tsx with Indonesian locale and proper metadata
- Updated globals.css with emerald/green primary color theme
- Tested all APIs: /api/stats, /api/profil, /api/auth/login all returning 200 OK
- Lint check passed with no errors

Stage Summary:
- Complete full-stack website desa with 2 views (User + Admin)
- Green/emerald color theme throughout
- JWT authentication working (admin/admin123)
- All CRUD APIs functional
- Responsive design with mobile support
- Client-side routing via Zustand state management
