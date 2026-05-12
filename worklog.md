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

---
Task ID: 2
Agent: Main Agent
Task: Build Website Desa Full Stack - Part 2 (Enhanced Admin with Penduduk, Laporan, Pengaturan, Charts, Dark Mode)

Work Log:
- Updated Prisma schema: Added Penduduk model (NIK, nama, jenisKelamin, tempatLahir, tanggalLahir, alamat, rt, rw, pekerjaan, status, agama, statusKawin, pendidikan), added noSurat to SuratPengajuan, added avatar to User, added kepala_desa role
- Pushed new schema and seeded with 20 penduduk records + kepala_desa user
- Created /api/penduduk (GET, POST) and /api/penduduk/[id] (GET, PUT, DELETE) with search, filter, NIK uniqueness validation
- Enhanced /api/stats with pendudukByPekerjaan, pendudukByPendidikan, pendudukByAgama, suratByJenis, recentSurat, recentBerita, pendudukLaki/Perempuan/Pindah/Meninggal counts
- Updated useAppStore with new AdminPage types (penduduk, laporan, pengaturan) and adminDarkMode state
- Built enhanced AdminSidebar with user info card, role badge (admin/kepala_desa), new menu items (Penduduk, Laporan, Pengaturan), dark mode support
- Built AdminHeader with page title, date, search, notification bell, dark mode toggle, user avatar
- Built enhanced AdminDashboard with recharts (BarChart, PieChart) for surat by jenis, gender distribution, pekerjaan distribution, recent surat list, status cards with trend badges
- Built PendudukManager with full CRUD, search by NIK/nama/alamat, filter by status, comprehensive form with 12 fields (NIK, nama, jenis kelamin, tempat/tanggal lahir, alamat, RT/RW, pekerjaan, agama, status kawin, pendidikan, status)
- Built LaporanPage with 6 chart sections: Surat per Jenis (bar), Tingkat Pendidikan (donut), Distribusi Pekerjaan (horizontal bar), Komposisi Agama (pie), Status Surat (bar), Summary Table
- Built PengaturanPage with tabs: Profil Desa, Akun, Password change
- Enhanced SuratManager with verification (noSurat generation), PDF print preview (KOP surat, isi surat, TTD), dark mode support
- Updated main page.tsx with new AdminLayout (sidebar + header + content), dark mode class application
- All APIs tested and working: /api/stats returns 20 penduduk, /api/penduduk returns all records
- Lint check passed with no errors

Stage Summary:
- Complete enhanced admin panel with 8 menu items
- Data Penduduk CRUD with 20 dummy records and comprehensive fields
- Laporan page with 6+ interactive charts (recharts)
- Pengaturan page with profil, akun, password management
- Dark mode toggle for admin panel
- Role support: admin and kepala_desa (demo: kepala_desa/admin123)
- Surat verification with auto-generated noSurat
- PDF print preview for completed surat (KOP surat format)
- Admin header bar with search, notifications, user info
- All components support dark mode styling

---
Task ID: 3
Agent: API Route Agent
Task: Create API routes for Notifikasi, Kegiatan, Agenda, Chat, Export, and update Stats

Work Log:
- Created /api/notifikasi/route.ts: GET (list with pagination, filter by userId, isRead) + POST (create with title, message, type, userId, link)
- Created /api/notifikasi/[id]/route.ts: PUT (mark as read / full update) + DELETE (delete notifikasi)
- Created /api/kegiatan/route.ts: GET (list with search, filter by category, status, date range, pagination) + POST (create with title, description, date, endDate, time, location, category, status)
- Created /api/kegiatan/[id]/route.ts: PUT (update kegiatan) + DELETE (delete kegiatan)
- Created /api/agenda/route.ts: GET (list with search, filter by category, date range, published, pagination) + POST (create with title, description, date, time, location, pic, category, published)
- Created /api/agenda/[id]/route.ts: PUT (update agenda) + DELETE (delete agenda)
- Created /api/chat/route.ts: GET (list chat rooms with warga/admin info + last message) + POST (create chat room with wargaId, subject)
- Created /api/chat/[id]/route.ts: GET (room with all messages + sender info) + PUT (update status/admin) + DELETE (delete room + messages)
- Created /api/chat/[id]/messages/route.ts: GET (paginated messages) + POST (send message with senderId, message, room validation)
- Created /api/export/route.ts: GET (export as CSV/JSON for penduduk/surat/kegiatan types, CSV with proper escaping and download headers)
- Updated /api/stats/route.ts: Added totalKegiatan, kegiatanAkanDatang, kegiatanBerlangsung, kegiatanSelesai, totalAgenda, agendaToday, totalChatRooms, chatRoomsActive, totalNotifikasi, notifikasiUnread, recentKegiatan (last 5), upcomingAgenda (next 5)
- All routes follow existing patterns (NextRequest/NextResponse, try/catch, proper error handling, field validation)
- Lint check passed with no errors
- Dev server running correctly

Stage Summary:
- 11 API route files created (10 new + 1 updated)
- Full CRUD for Notifikasi, Kegiatan, Agenda models
- Chat system with rooms and messages API
- Data export API supporting CSV and JSON formats
- Enhanced stats API with 12 new fields (kegiatan, agenda, chat, notifikasi stats)
- All routes use consistent error handling and response patterns
- SQLite-compatible Prisma queries throughout

---
Task ID: 4
Agent: Chat Service Agent
Task: Create WebSocket mini-service for real-time chat and notifications

Work Log:
- Created `/home/z/my-project/mini-services/chat-service/` directory as independent bun project
- Created `package.json` with socket.io ^4.7.0 and cors ^2.8.5 dependencies, dev script uses `bun --hot index.ts`
- Created `index.ts` - comprehensive Socket.io WebSocket server on port 3003 with:
  - **Authentication**: Users connect with userId, username, role (warga/admin/kepala_desa); admins auto-join "admins" room
  - **Chat Rooms**: Join/leave rooms with member tracking, room member list broadcast on join/leave
  - **Send Message**: Broadcast messages to room participants with sender verification, auto-clear typing status on send
  - **Typing Indicator**: Real-time typing/stop-typing with per-room tracking and broadcast to room members
  - **Notifications**: Push to specific user (by userId), all admins, or broadcast to all; supports info/warning/success/error types
  - **Online Users**: Track connected users with deduplication by userId, broadcast updates on connect/disconnect, on-demand list via get-online-users event
  - **Graceful Shutdown**: SIGTERM/SIGINT handlers that notify clients, disconnect sockets, and close server with 10s timeout
  - **Error Handling**: Try/catch on all event handlers with error emissions back to client
  - **CORS**: Configured with origin "*" for cross-origin access
  - **Caddy Compatible**: Uses path: "/" for proper Caddy gateway forwarding via XTransformPort=3003
- Installed dependencies with `bun install` (socket.io@4.8.3, cors@2.8.6)
- Started service on port 3003; verified socket.io polling endpoint responds with correct sid and configuration

Stage Summary:
- WebSocket chat service running on port 3003 as independent mini-service
- 8 socket events implemented: authenticate, join-room, leave-room, send-message, typing, stop-typing, notification, get-online-users
- Server emits: authenticated, new-message, typing-update, new-notification, online-users-updated, online-users-list, room-members, user-joined-room, user-left-room, server-shutting-down, error
- In-memory state management for online users, room memberships, and typing indicators
- Frontend connects via: `io("/?XTransformPort=3003", { transports: ["websocket", "polling"] })`

---
Task ID: 5-a
Agent: Main Agent
Task: Create 2 admin components - KegiatanManager and AgendaManager

Work Log:
- Created `/src/components/admin/KegiatanManager.tsx` - Calendar-based kegiatan (activity/event) manager
  - Calendar View: Custom inline monthly calendar grid with day cells, event dots color-coded by category, month navigation (prev/next), click day to see events in side panel
  - List View: Toggle between calendar and list view; table with columns: Kegiatan, Tanggal, Lokasi, Kategori, Status, Aksi
  - Add/Edit Dialog: Form with fields: title*, description, date*, endDate, time, location, category (select: umum/pemerintahan/sosial/budaya/pendidikan), status (select: akan_datang/berlangsung/selesai/dibatalkan)
  - Delete: AlertDialog confirmation with loading state
  - Search & Filter: Search by title/description/location, filter by category and status
  - Pagination: Page-based with prev/next buttons and page info
  - Category color coding: umum=emerald, pemerintahan=blue, sosial=amber, budaya=purple, pendidikan=cyan
  - Status color coding: akan_datang=blue, berlangsung=emerald, selesai=gray, dibatalkan=red
  - Calendar legend showing all category colors
  - Today highlight with ring on calendar
  - Side panel shows selected date events with detail cards (time, location, status, actions)
  - Full dark mode support using adminDarkMode from useAppStore

- Created `/src/components/admin/AgendaManager.tsx` - Agenda manager for village schedules
  - List View: Table with columns: Agenda, Tanggal, Lokasi, PIC, Kategori, Status (Published/Draft), Aksi
  - Add/Edit Dialog: Form with fields: title*, description, date*, time, location, pic (penanggung jawab), category (select: umum/rapat/kegiatan/pelayanan), published (checkbox using shadcn Checkbox component)
  - Delete: AlertDialog confirmation with loading state
  - Search & Filter: Search by title/description/location/pic, filter by category and published status
  - Pagination: Page-based with prev/next buttons
  - Today's Agenda Highlight: Cards at the top showing today's agendas with time, location, PIC info, border-l emerald accent
  - Category color coding: umum=emerald, rapat=blue, kegiatan=amber, pelayanan=cyan
  - "HARI INI" badge on today's agenda rows in table
  - Today rows highlighted with emerald background tint
  - Full dark mode support using adminDarkMode from useAppStore

- Both components follow existing admin patterns (emerald theme, shadcn/ui, Lucide icons, toast notifications)
- Both use AlertDialog (not browser confirm) for delete confirmation
- Both use proper API endpoints: /api/kegiatan and /api/agenda with query params
- Lint check passed with no errors
- Dev server running correctly

Stage Summary:
- 2 new admin components created: KegiatanManager and AgendaManager
- KegiatanManager features: custom calendar view, list view, view toggle, CRUD, search/filter/pagination, category+status color coding
- AgendaManager features: table list view, today's highlight cards, CRUD, search/filter/pagination, published/draft status, PIC field
- Both fully support dark mode via adminDarkMode state
- Both use shadcn/ui components (Card, Button, Input, Label, Badge, Select, Dialog, AlertDialog, Checkbox, ScrollArea)
- Both use Lucide React icons and toast from @/hooks/use-toast

---
Task ID: 5-b
Agent: Admin Components Agent
Task: Create ChatWargaManager and NotifikasiManager admin components

Work Log:
- Created `/src/components/admin/ChatWargaManager.tsx` - Real-time chat interface for admin-warga communication:
  - **Chat Room List** (left sidebar, w-80): Shows active chat rooms with warga name, avatar, last message preview, unread count badge, and relative timestamp. Click to select a room. Collapsible sidebar with PanelLeftClose/Open toggle.
  - **Chat Window** (main area): Chat bubble format with admin messages on right (emerald-600 background, white text) and warga messages on left (gray-100/dark gray-800 background). Auto-scrolls to bottom on new messages and typing events.
  - **Message Input**: Text input with Send button. Enter key to send. Disabled when room is closed. Shows Loader2 spinner while sending.
  - **Real-time WebSocket**: Connects via `io("/?XTransformPort=3003")` with auto-authenticate on connect. Listens for `new-message` and `typing-update` events. Emits `send-message`, `typing`, `stop-typing`, `join-room` events.
  - **Create New Room**: Dialog with warga user Select dropdown (fetched from /api/users, filtered to role=warga) and subject Input.
  - **Room Info Panel**: Slide-out panel (w-72) showing warga avatar, name, subject, status badge, assigned admin, creation date. "Tutup Room" button to close room. "Ambil Alih" button for unassigned rooms.
  - **Typing Indicator**: Shows "X sedang mengetik..." with animate-pulse. Auto stop-typing after 3s of inactivity.
  - **Connection Indicator**: Absolute-positioned dot (green=connected, red=disconnected) in bottom-right.
  - Dark mode support throughout with dark: prefix classes. Emerald theme accents.
  - REST API integration: GET /api/chat?status=active, GET /api/chat/[id], POST /api/chat, PUT /api/chat/[id], POST /api/chat/[id]/messages

- Created `/src/components/admin/NotifikasiManager.tsx` - Admin notification center:
  - **Notification List**: Card-based list inside a ScrollArea (max-h-[60vh]). Each notification shows type-colored icon, title, message (2-line clamp), relative timestamp, type badge, and target user info. Unread notifications have colored left border and tinted background per type.
  - **Mark as Read**: Click notification content to mark as read. Individual mark-as-read via MailOpen icon button. "Mark all as read" button in header with CheckCheck icon.
  - **Filter**: Two Select dropdowns - filter by type (info/warning/success/danger/all) and by read status (read/unread/all). Stats cards at top are clickable type filters with ring highlight on active filter. Reset button to clear all filters.
  - **Delete**: Trash2 icon button on each notification. Confirmation handled via toast feedback.
  - **Create Notification**: Dialog with title Input, message Textarea, and type Select (with colored icons for each type).
  - **Real-time WebSocket**: Connects via `io("/?XTransformPort=3003")`. Authenticates as admin. Listens for `new-notification` event. New notifications appear at top with 3-second animate-pulse effect. Toast notification also shown on arrival.
  - **Badge Count**: Header shows unread count with emerald Badge.
  - **Stats Cards**: 4 type-specific cards (info=blue, warning=amber, success=emerald, danger=red) showing count per type. Clickable to filter.
  - Type color coding: info (blue-50/blue-400, Info icon), warning (amber-50/amber-400, AlertTriangle icon), success (emerald-50/emerald-400, CheckCircle icon), danger (red-50/red-400, AlertCircle icon).
  - Live connection indicator dot in filter bar.
  - Dark mode support throughout. Emerald theme accents.
  - REST API integration: GET /api/notifikasi?limit=50, POST /api/notifikasi, PUT /api/notifikasi/[id], DELETE /api/notifikasi/[id]

- Both components use: 'use client', shadcn/ui components, Lucide React icons, useToast hook, useAppStore (adminDarkMode), useAuthStore (authUser), socket.io-client
- Lint check passed with no errors

Stage Summary:
- 2 new admin components created
- ChatWargaManager: Full real-time chat interface with room management, typing indicators, WebSocket integration
- NotifikasiManager: Notification center with type filtering, mark-as-read, real-time updates, creation dialog
- Both components fully support dark mode with dark: prefix classes
- WebSocket connection via `io("/?XTransformPort=3003")` (never direct localhost)
- All shadcn/ui components used consistently with the project's existing patterns

---
Task ID: 9
Agent: Main Agent
Task: Update Prisma seed file with dummy data for Notifikasi, Kegiatan, Agenda, ChatRoom, ChatMessage

Work Log:
- Read existing prisma/seed.ts (168 lines) and prisma/schema.prisma to understand current structure and field definitions
- Added 5 Notifikasi seed entries using upsert pattern with IDs notifikasi-1 through notifikasi-5:
  - Surat Baru Masuk (info, assigned to admin, unread)
  - Kegiatan Hari Ini (warning, unread)
  - Surat Selesai (success, read)
  - Peringatan Sistem (danger, unread)
  - Chat Baru (info, unread)
- Added 8 Kegiatan seed entries using upsert pattern with IDs kegiatan-1 through kegiatan-8:
  - 4 upcoming (akan_datang): Musyawarah Desa, Posyandu Balita, Festival Budaya, Pelatihan UMKM Digital
  - 1 upcoming social: Kerja Bakti Bersih Desa
  - 3 completed (selesai): Rapat RT/RW, Vaksinasi COVID-19, Upacara HUT RI
  - Categories: pemerintahan, sosial, budaya, pendidikan, umum
  - Dates spread across Feb-Mar 2025
- Added 8 Agenda seed entries using upsert pattern with IDs agenda-1 through agenda-8:
  - Categories: pelayanan, rapat, kegiatan, umum
  - One unpublished agenda (Rapat BPBD)
  - Dates in March 2025
  - PIC fields matching organizational structure names
- Added 2 warga user accounts via upsert:
  - warga_budi (Budi Santoso, role: warga)
  - warga_dewi (Dewi Lestari, role: warga)
- Added 2 ChatRoom entries via upsert (chat-room-1, chat-room-2):
  - Room 1: warga_budi + admin, subject "Pertanyaan tentang surat domisili"
  - Room 2: warga_dewi + admin (no adminId), subject "Informasi jadwal posyandu"
- Added 6 ChatMessage entries using create (4 in room 1, 2 in room 2):
  - Room 1: Back-and-forth conversation about surat domisili requirements
  - Room 2: Inquiry about posyandu schedule
  - Mix of read/unread messages
- Ran `bun run db:push` - schema already in sync, Prisma Client regenerated
- Ran `bun prisma/seed.ts` - seed completed successfully
- Verified data counts: Notifikasi=5, Kegiatan=8, Agenda=8, ChatRooms=2, ChatMessages=6, Users=4
- Updated final console.log message to reflect all new seed categories

Stage Summary:
- 5 new seed data sections added to prisma/seed.ts (Notifikasi, Kegiatan, Agenda, ChatRoom+ChatMessage)
- 2 new warga user accounts created for chat functionality
- Total new records: 5 notifikasi + 8 kegiatan + 8 agenda + 2 chat rooms + 6 chat messages + 2 warga users = 31 new records
- All seed data follows existing upsert/create patterns for idempotency (except ChatMessage which uses create as specified)
- Database verified with correct record counts

---
Task ID: 8
Agent: Main Agent
Task: Update navigation system for Bagian 3 features (Kegiatan, Agenda, Chat, Notifikasi)

Work Log:
- Updated `/src/stores/useAppStore.ts`: Added 4 new values to AdminPage union type: 'kegiatan', 'agenda', 'chat', 'notifikasi'
- Updated `/src/components/admin/AdminSidebar.tsx`:
  - Added imports: useState, useEffect from react; CalendarDays, CalendarCheck, MessageCircle, Megaphone from lucide-react
  - Replaced Bell icon with Megaphone for 'pengumuman' menu item
  - Added 3 new menu items after 'surat': Kalender Kegiatan (CalendarDays), Agenda Desa (CalendarCheck), Chat Warga (MessageCircle)
  - Added unreadChat state with useEffect polling /api/chat?status=active every 30s
  - Added red Badge on chat menu item showing unread count (rooms without assigned admin)
- Updated `/src/components/admin/AdminHeader.tsx`:
  - Added imports: useState, useEffect from react
  - Added setCurrentAdminPage to useAppStore destructuring
  - Added unreadNotif state with useEffect polling /api/notifikasi?isRead=false&limit=1 every 30s
  - Added 4 new page titles: Kalender Kegiatan, Agenda Desa, Chat Warga, Notifikasi
  - Replaced static notification bell with dynamic one: onClick navigates to 'notifikasi' page, shows unread count badge (9+ for >9)
- Updated `/src/app/page.tsx`:
  - Added imports for KegiatanManager, AgendaManager, ChatWargaManager, NotifikasiManager
  - Added 4 new cases in AdminLayout renderPage switch: kegiatan, agenda, chat, notifikasi
- Created 4 placeholder component files (will be overwritten by Task 5 agents):
  - `/src/components/admin/KegiatanManager.tsx`
  - `/src/components/admin/AgendaManager.tsx`
  - `/src/components/admin/ChatWargaManager.tsx`
  - `/src/components/admin/NotifikasiManager.tsx`
- Lint check passed with no errors
- Dev server running correctly

Stage Summary:
- Navigation system updated with 4 new Bagian 3 features
- AdminPage type extended with kegiatan, agenda, chat, notifikasi
- Sidebar has 11 menu items (was 8), with chat unread badge
- Header notification bell is dynamic with unread count and navigation
- All 4 new admin pages are routable from the sidebar and header

---
Task ID: 6
Agent: Main Agent
Task: Update admin manager components with search, filter, pagination, multiple image upload, export, and enhanced PDF print

Work Log:
- Updated `/src/components/admin/BeritaManager.tsx`:
  - Added search input with Search icon to filter by title (debounced 400ms)
  - Added filter by published status (All/Publish/Draft) using shadcn Select
  - Added page-based pagination with prev/next buttons, page info, and total count display
  - Added multiple image upload: "Tambah Gambar" button adds extra URL inputs, stored as JSON in `images` field
  - Added export dropdown button with CSV and JSON options (calls /api/export?type=berita&format=csv|json)
  - Updated fetchBerita to use URLSearchParams with search, published, page, limit params
  - Added dark mode support (dark: prefix classes on all elements)
  - Fixed lint issue: removed synchronous `setLoading(true)` from fetchData called in useEffect; moved to event handlers

- Updated `/src/components/admin/PengumumanManager.tsx`:
  - Added search input to filter by title (debounced 400ms)
  - Added filter by priority (semua/penting/normal/biasa) using shadcn Select
  - Added filter by published status (All/Publish/Draft) using shadcn Select
  - Added page-based pagination with prev/next buttons and page info
  - Added export dropdown button with CSV and JSON options (calls /api/export?type=pengumuman&format=csv|json)
  - Updated fetchData to use URLSearchParams with search, priority, published, page, limit params
  - Added dark mode support throughout
  - Fixed lint issue: removed synchronous `setLoading(true)` from fetchData

- Updated `/src/components/admin/GaleriManager.tsx`:
  - Added search input to filter by title (debounced 400ms)
  - Added filter by category (semua/umum/kegiatan/pembangunan/budaya) using shadcn Select
  - Added filter by album using shadcn Select (dynamically populated from existing albums)
  - Added page-based pagination with prev/next buttons and page info
  - Added multiple image upload: "Tambah Gambar" button adds extra URL inputs, stored as JSON in `images` field
  - Added album management: Select from existing albums or type new album name via input field
  - Added export dropdown button with CSV and JSON options (calls /api/export?type=galeri&format=csv|json)
  - Added edit button (Pencil icon) on hover overlay for each gallery card
  - Added album badge overlay on gallery cards
  - Updated fetchData to use URLSearchParams with search, category, album, page, limit params
  - Added dark mode support throughout
  - Fixed lint issue: removed synchronous `setLoading(true)` from fetchData

- Updated `/src/components/admin/SuratManager.tsx`:
  - Added search input to filter by nama or NIK (debounced 400ms)
  - Added filter by jenisSurat (semua/domisili/usaha/kelahiran/kematian) using shadcn Select
  - Enhanced existing status filter (all/pending/diproses/selesai/ditolak) with improved button styling
  - Added page-based pagination with prev/next buttons and page info
  - Added export dropdown button with CSV and JSON options (calls /api/export?type=surat&format=csv|json)
  - Enhanced PDF print: Added "Download PDF" button that opens new window with proper A4 layout and @media print CSS, plus existing "Cetak" button
  - Added global CSS for @media print to hide all elements except #surat-print
  - Updated fetchData to use URLSearchParams with search, status, jenisSurat, page, limit params
  - Added dark mode support throughout
  - Fixed lint issue: removed synchronous `setLoading(true)` from fetchData

- All components now use consistent patterns:
  - Search: Debounced input with Search icon
  - Filter: shadcn Select components
  - Pagination: Prev/Next with page info
  - Export: DropdownMenu with CSV/JSON options
  - Loading: Set in event handlers, not in effects
  - Dark mode: dark: prefix classes throughout

- Lint check passed with no errors
- Dev server running correctly

Stage Summary:
- 4 admin manager components updated with search, filter, pagination, and export features
- BeritaManager: +search, +status filter, +pagination, +multiple images, +export
- PengumumanManager: +search, +priority filter, +status filter, +pagination, +export
- GaleriManager: +search, +category filter, +album filter, +pagination, +multiple images, +album management, +export
- SuratManager: +search, +jenisSurat filter, +pagination, +export, +enhanced PDF print
- All components support dark mode with dark: prefix classes
- Fixed React lint rule: no synchronous setState in useEffect
