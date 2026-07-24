# 🎫 Sistem Tiket Support

Aplikasi full-stack untuk membuat dan mengelola tiket support. User bisa membuat tiket, admin bisa mengubah status dan membalas tiket.

**Dibuat sebagai Technical Assessment Full-Stack Developer.**

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Fitur](#fitur)
- [Cara Setup](#cara-setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Akun Default](#akun-default)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Second Backend (Node.js)](#second-backend-nodejs)
- [Struktur Proyek](#struktur-proyek)
- [Keterbatasan](#keterbatasan)

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend Utama** | PHP 8.3 · Laravel 13 |
| **Frontend** | React 19 · TypeScript · Inertia.js · Tailwind CSS 4 |
| **Autentikasi** | Laravel Sanctum (API Token) |
| **Database** | SQLite (development) / PostgreSQL (production via Docker) |
| **Build Tool** | Vite 8 |
| **Testing** | Pest PHP 4 |
| **Backend Kedua** | Node.js · Express 5 · TypeScript |

---

## Fitur

### 👤 User
- Lihat daftar tiket (paginasi, 15 per halaman)
- Buat tiket baru (nama, email, subjek, deskripsi)
- Lihat detail tiket beserta balasan admin
- Status tiket ditampilkan dengan indikator visual (Open / In Progress / Resolved)
- Validasi form di sisi client

### 🔐 Admin
- Login dengan email/password (Sanctum token auth)
- Ubah status tiket (Open ↔ In Progress ↔ Resolved)
- Balas tiket
- Filter tiket berdasarkan status
- Logout (revoke token)

### 🛠 Teknis
- RESTful API dengan HTTP status code yang benar
- Validasi input di server
- Loading & error states
- Layout responsif (Tailwind CSS)
- Migrasi database dengan relasi
- Data sample (20 tiket, 3 user)
- Rate limiting pada endpoint login (5 percobaan/menit)
- Automated test dengan Pest PHP

---

## Cara Setup

### Prasyarat

- **PHP** >= 8.3
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker & Docker Compose** (opsional, untuk PostgreSQL)

### 1. Clone Repository

```bash
git clone https://github.com/Aguira1908/ticket-system.git
cd ticket-system
```

### 2. Install Dependencies Root

```bash
npm install
```

### 3. Setup Backend Laravel

```bash
cd backend-ticket

composer install
cp .env.example .env
php artisan key:generate
npm install
```

### 4. Setup Database

```bash
cd backend-ticket

# Buat tabel
php artisan migrate

# Isi data sample
php artisan db:seed
```

Atau reset sekaligus isi ulang:

```bash
php artisan migrate:fresh --seed
```

### 5. Setup Second Backend (Node.js)

```bash
cd second-backend-node
npm install
```

### 6. (Opsional) PostgreSQL via Docker

```bash
# Dari root directory
docker compose up -d
```

Lalu update `backend-ticket/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ticket_system_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

---

## Menjalankan Aplikasi

### Jalankan Semua Sekaligus

Dari root directory:

```bash
npm run dev
```

Perintah ini menjalankan 3 service bersamaan menggunakan `concurrently`:
- 🔵 Laravel backend (`php artisan serve`)
- 🟣 Vite dev server (`npm run dev`)
- 🟡 Node.js second backend (`npm run dev`)

### Jalankan Satu Per Satu

**Laravel Backend:**
```bash
cd backend-ticket
php artisan serve
# → http://localhost:8000
```

**Vite Dev Server (terminal terpisah):**
```bash
cd backend-ticket
npm run dev
```

**Node.js Second Backend:**
```bash
cd second-backend-node
npm run dev
# → http://localhost:4000
```

### URL Akses

| Service | URL |
|---------|-----|
| Aplikasi Utama | http://localhost:8000 |
| API Utama | http://localhost:8000/api |
| API Statistik (Node.js) | http://localhost:4000/api/stats |

---

## Akun Default

| Akun | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `password` |
| Support Agent | `support@gmail.com` | `password` |
| Budi Santoso | `budi@gmail.com` | `password` |

---

## Database

### Skema Tabel

#### `tickets`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint (PK) | Auto-increment |
| `requester_name` | string(255) | Nama pengirim tiket |
| `requester_email` | string(255) | Email pengirim tiket |
| `subject` | string(255) | Subjek tiket |
| `description` | text | Deskripsi masalah |
| `status` | enum | `open` \| `in_progress` \| `resolved` (default: `open`) |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

#### `ticket_responses`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint (PK) | Auto-increment |
| `ticket_id` | bigint (FK) | Referensi ke `tickets.id` (cascade delete) |
| `user_id` | bigint (FK) | Referensi ke `users.id` (cascade delete) |
| `message` | text | Isi balasan |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diperbarui |

---

## API Documentation

### Endpoint Publik (Tanpa Autentikasi)

#### `POST /api/tickets` — Buat Tiket Baru

```json
{
  "requester_name": "John Doe",
  "requester_email": "john@example.com",
  "subject": "Tidak bisa akses akun",
  "description": "Akun saya terkunci sejak kemarin pagi..."
}
```

| Field | Validasi |
|-------|----------|
| `requester_name` | wajib, string, max:255 |
| `requester_email` | wajib, email, max:255 |
| `subject` | wajib, string, max:255 |
| `description` | wajib, string |

**Sukses:** `201 Created` · **Validasi gagal:** `422 Unprocessable Entity`

---

#### `GET /api/tickets` — Daftar Semua Tiket

| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `status` | string | Filter: `open`, `in_progress`, `resolved` |
| `page` | int | Nomor halaman (15 item/halaman) |

**Response:** `200 OK`

---

#### `GET /api/tickets/{ticket}` — Detail Tiket

**Response:** `200 OK` — Tiket dengan eager-loaded `responses.user`
**Tidak ditemukan:** `404 Not Found`

---

#### `POST /api/login` — Login

```json
{
  "email": "admin@gmail.com",
  "password": "password"
}
```

**Sukses:** `200 OK` (mengembalikan token + data user)
**Gagal:** `401 Unauthorized`

> ⚡ Rate limited: **5 percobaan per menit**

---

### Endpoint Admin (Butuh `Authorization: Bearer <token>`)

#### `PATCH /api/tickets/{ticket}/status` — Ubah Status Tiket

```json
{
  "status": "in_progress"
}
```

**Validasi:** `status` harus salah satu dari: `open`, `in_progress`, `resolved`

---

#### `POST /api/tickets/{ticket}/responses` — Balas Tiket

```json
{
  "message": "Kami sedang menyelidiki masalah ini."
}
```

**Validasi:** `message` wajib, string

---

#### `POST /api/logout` — Logout

Menghapus token akses yang sedang digunakan.

---

## Second Backend (Node.js)

> Untuk menunjukkan kemampuan di teknologi selain PHP, disertakan service Node.js yang berdiri sendiri.

Backend kedua ini adalah aplikasi **Node.js + Express 5 + TypeScript** yang menyediakan endpoint statistik tiket. Service ini berjalan independen dan tidak terhubung ke database Laravel.

### Tech Stack

| Teknologi | Versi |
|-----------|-------|
| Node.js | >= 18.x |
| Express | 5.2.0 |
| TypeScript | 5.6.3 |
| tsx (dev runner) | 4.16.0 |

### Cara Menjalankan

```bash
cd second-backend-node
npm install
npm run dev
# → http://localhost:4000
```

### Arsitektur

Menggunakan pola **Controller → Service → Data** dengan pemisahan yang jelas:

```
second-backend-node/
├── src/
│   ├── controllers/
│   │   └── stats.controller.ts    # Handle request & response
│   ├── data/
│   │   └── tickets.example.json   # Data contoh tiket (JSON)
│   ├── middlewares/
│   │   └── errorHandler.ts        # 404 handler & global error handler
│   ├── routes/
│   │   └── stats.routes.ts        # Definisi route
│   ├── services/
│   │   └── stats.service.ts       # Logika bisnis (perhitungan statistik)
│   ├── types/
│   │   └── types.ts               # TypeScript type definitions
│   ├── app.ts                     # Setup Express app
│   └── server.ts                  # Entry point server (port 4000)
├── package.json
└── tsconfig.json
```

### API Endpoint

#### `GET /api/stats` — Statistik Tiket

Mengembalikan ringkasan statistik dari data tiket contoh.

**Contoh Response:**

```json
{
  "total": 18,
  "by_status": {
    "open": 6,
    "in_progress": 6,
    "resolved": 6
  },
  "average_responses_per_ticket": 1.39,
  "resolution_rate_percent": 33.33
}
```

| Field | Keterangan |
|-------|------------|
| `total` | Jumlah total tiket |
| `by_status` | Jumlah tiket per status |
| `average_responses_per_ticket` | Rata-rata respons per tiket |
| `resolution_rate_percent` | Persentase tiket yang sudah resolved |

### Yang Didemonstrasikan

- Setup server Node.js dengan Express 5
- Konfigurasi TypeScript dengan strict mode
- Desain RESTful endpoint
- Pemisahan concern (controller/service/route/middleware)
- Error handling (404 not found + global error handler)
- Type safety dengan TypeScript interfaces

---

## Testing

### Jalankan Semua Test

```bash
cd backend-ticket
php artisan test
```

Atau langsung dengan Pest:

```bash
cd backend-ticket
./vendor/bin/pest
```

Test berjalan menggunakan **SQLite in-memory** untuk kecepatan dan isolasi.

---

## Struktur Proyek

```
support-ticket-system/
├── backend-ticket/                  # Laravel 13 + Inertia.js + React
│   ├── app/
│   │   ├── Http/Controllers/Api/    # AuthController, TicketController, UserController
│   │   ├── Models/                  # Ticket, TicketResponse, User
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/              # Migrasi database
│   │   └── seeders/                 # Data sample
│   ├── resources/js/                # React + TypeScript frontend
│   ├── routes/                      # API & web routes
│   └── tests/                      # Pest PHP tests
├── second-backend-node/             # Node.js + Express 5 + TypeScript
│   └── src/                        # Controller, Service, Route, Middleware
├── screenshots/                     # Screenshot aplikasi
├── docker-compose.yml               # Container PostgreSQL
├── package.json                     # Script monorepo (concurrently)
├── AI-USAGE.md                      # Dokumentasi penggunaan AI
└── README.md                        # File ini
```

---

## Keterbatasan

1. **Tidak ada registrasi user** — Hanya user yang sudah di-seed yang bisa login
2. **Tiket tidak terhubung ke akun** — Pengirim tiket tidak bisa tracking via login
3. **Frontend single-page** — Semua komponen React ada di `welcome.tsx`
4. **Tidak ada real-time update** — Harus refresh manual untuk melihat perubahan
5. **Tidak ada upload file** — User tidak bisa melampirkan file ke tiket
6. **Tidak ada notifikasi email** — Tidak ada email saat status berubah
7. **Tidak ada role-based access** — Semua user yang login dianggap admin
8. **Second backend independen** — Service Node.js tidak terhubung ke database utama

---

## Estimasi Waktu

| Pekerjaan | Waktu |
|-----------|-------|
| Setup & perencanaan arsitektur | ~1 jam |
| Desain skema database & migrasi | ~30 menit |
| Backend API (controller, validasi, auth) | ~2 jam |
| Frontend (React + Inertia.js, styling) | ~3 jam |
| Database seeder & data sample | ~30 menit |
| Setup testing & tulis test | ~1 jam |
| Second backend (Node.js) | ~30 menit |
| Dokumentasi (README, AI-USAGE) | ~1 jam |
| Debugging & review | ~1 jam |
| **Total** | **~10.5 jam** |

---

## Lisensi

Proyek ini dibuat sebagai submission technical assessment.
