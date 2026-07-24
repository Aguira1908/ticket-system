# Sistem Tiket Dukungan (Support Ticket System)

Aplikasi tiket dukungan sederhana yang dibangun untuk penilaian teknis Full-Stack Developer. Pengguna dapat mengirimkan tiket tanpa akun; admin login untuk memperbarui status tiket dan membalasnya.

## Teknologi (Tech Stack)

- **Backend Utama**: Laravel 13 (PHP 8.3+) + PostgreSQL 15, REST API dengan autentikasi token Sanctum untuk tindakan admin
- **Backend Kedua**: Node.js + TypeScript (Express) — endpoint mandiri `GET /api/stats`, tanpa koneksi DB
- **Frontend**: Next.js 16 (App Router) + React + TypeScript + Tailwind CSS
- **Database**: PostgreSQL 15 (melalui Docker)

## Struktur Proyek

```
support-ticket-system/
├── backend-laravel/         # API Utama
├── frontend-nextjs/         # UI untuk pengguna & admin
├── second-backend-node/     # Endpoint stats mandiri
├── docker-compose.yml       # Hanya PostgreSQL
├── .env.example             # Template konfigurasi DB Docker Compose
├── package.json             # Orkestrasi dev root (concurrently)
├── AI-USAGE.md
└── README.md
```

## Prasyarat

- PHP >= 8.3 dan Composer
- Node.js >= 20 dan npm
- Docker dan Docker Compose

## Instruksi Setup

### 1. Kloning repositori dan instal dependensi root

Dependensi root hanya digunakan untuk menjalankan ketiga server secara bersamaan (`npm run dev`).

```bash
git clone <repo-url>
cd support-ticket-system
npm install
```

### 2. Database (PostgreSQL melalui Docker)

Di direktori root repositori:

```bash
cp .env.example .env
```

Buka `.env` dan atur `DB_PASSWORD` ke nilai apa pun (misal: `secret`) — file ini tidak pernah di-commit ke git.

```bash
docker compose up -d
```

`docker-compose.yml` berada di root repositori, dan Docker Compose secara otomatis membaca `${DB_PORT}`, `${DB_DATABASE}`, `${DB_USERNAME}`, `${DB_PASSWORD}` dari `.env` root untuk substitusi variabelnya sendiri. Ini adalah **file yang terpisah** dari `backend-laravel/.env` (Laravel membaca `.env`-nya sendiri dari foldernya sendiri) — lihat catatan pada langkah 3.

### 3. Backend (Laravel)

```bash
cd backend-laravel
cp .env.example .env
```

Buka `backend-laravel/.env` dan atur kelima nilai ini agar **sama persis** dengan yang baru saja Anda atur di `.env` root (kedua file ini terpisah dan tidak sinkron secara otomatis):

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ticket_system_db
DB_USERNAME=postgres
DB_PASSWORD=          # nilai yang sama dengan .env root
```

Kemudian lanjutkan:

```bash
composer install
php artisan key:generate
php artisan install:api
```

Tambahkan baris ini secara manual ke `.env` (digunakan untuk CORS, tidak terkait dengan konfigurasi database):

```
FRONTEND_URL=http://localhost:3000
```

Kemudian jalankan migrasi dan masukkan (seed) data sampel:

```bash
php artisan migrate --seed
```

Login admin dari seed (untuk menguji fitur admin):

- Email: `admin@example.com`
- Password: `password`

### 4. Backend kedua (Node.js)

```bash
cd ../second-backend-node
npm install
```

### 5. Frontend (Next.js)

```bash
cd ../frontend-nextjs
cp .env.local.example .env.local
npm install
```

## Variabel Lingkungan (Environment Variables)

**Root `.env`** (hanya digunakan oleh `docker-compose.yml`)

| Variabel    | Deskripsi                                               | Contoh           |
| ----------- | ------------------------------------------------------- | ---------------- |
| DB_PORT     | Port host yang dipetakan ke container Postgres          | 5432             |
| DB_DATABASE | Nama database                                           | ticket_system_db |
| DB_USERNAME | Pengguna (user) database                                | postgres         |
| DB_PASSWORD | Password database (isi secara manual, jangan di-commit) | —                |

File ini juga menyertakan `DB_CONNECTION` dan `DB_HOST` sebagai template kemudahan (Docker Compose sendiri tidak membaca keduanya) — variabel-variabel tersebut ada agar kelima nilainya mudah disalin langsung ke `backend-laravel/.env` di bawah ini.

**backend-laravel/.env**

| Variabel      | Deskripsi                                                                                | Contoh                |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------- |
| DB_CONNECTION | Driver database                                                                          | pgsql                 |
| DB_HOST       | Host database (Laravel berjalan secara native, terhubung ke container melalui localhost) | 127.0.0.1             |
| DB_PORT       | Port database                                                                            | 5432                  |
| DB_DATABASE   | Nama database                                                                            | ticket_system_db      |
| DB_USERNAME   | Pengguna database                                                                        | postgres              |
| DB_PASSWORD   | Password database (isi secara manual, jangan di-commit)                                  | —                     |
| FRONTEND_URL  | Origin CORS yang diizinkan                                                               | http://localhost:3000 |

**frontend-nextjs/.env.local**

| Variabel            | Deskripsi            | Contoh                    |
| ------------------- | -------------------- | ------------------------- |
| NEXT_PUBLIC_API_URL | Base URL API Laravel | http://localhost:8000/api |

**second-backend-node** — tidak ada variabel lingkungan yang diperlukan. Opsional: `PORT` (default ke 4000).

## Migrasi Database

```bash
cd backend-laravel
php artisan migrate                 # jalankan migrasi yang tertunda
php artisan migrate:fresh --seed    # reset dan reseed semuanya (hanya untuk dev)
```

## Menjalankan Aplikasi

Dari root repositori, jalankan ketiga server sekaligus:

```bash
npm run dev
```

Atau jalankan masing-masing secara individu:

```bash
npm run dev:backend   # Laravel  → http://localhost:8000
npm run dev:frontend  # Next.js  → http://localhost:3000
npm run dev:node      # Node     → http://localhost:4000
```

## Menjalankan Pengujian (Tests)

```bash
cd backend-laravel
php artisan test
```

Mencakup satu unit test, satu feature/integration test, dan satu validation/authorization test — lihat `backend-laravel/tests/`.

## Arsitektur

- **Pemisahan publik vs admin, bukan full auth untuk semua orang**: membuat dan melihat tiket tidak memerlukan akun, sesuai dengan bagian "Fitur Pengguna" dari brief. Hanya pembaruan status dan balasan — "Fitur Admin" — yang dikunci dengan autentikasi token Laravel Sanctum, di-seed secara manual tanpa endpoint registrasi publik.
- **Server Components untuk membaca, Client Components untuk interaktivitas**: halaman daftar dan detail tiket mengambil data di sisi server pada Next.js; form, filter, dan tindakan admin adalah client components yang memanggil API Laravel secara langsung.
- **Backend kedua berlapis (Layered second backend)**: bahkan untuk sebuah endpoint tunggal, layanan Node/TypeScript dibagi menjadi route → controller → service untuk menunjukkan pemisahan tanggung jawab, tanpa menambahkan abstraksi yang tidak diperlukan (tanpa DI container, tanpa layer repository).
- **Bentuk error API yang konsisten**: Laravel mengembalikan `{ message, errors? }` untuk semua respons error; kelas `ApiError` frontend memusatkan parsing sehingga setiap form dapat memetakan error pada level field tanpa boilerplate yang berulang.
- **Dua file `.env`, disinkronkan secara manual**: `docker-compose.yml` berada di root repositori dan membaca `.env` tingkat proyek Docker Compose sendiri (juga di root) untuk interpolasi variabel — ini harus terpisah dari `backend-laravel/.env`, yang dibaca secara independen oleh Laravel. Alih-alih menyembunyikannya, kedua file didokumentasikan secara eksplisit dalam Instruksi Setup dengan contoh nilai yang cocok.

## Batasan yang Diketahui

- Autentikasi admin menggunakan tabel `users` yang di-seed secara manual tanpa pendaftaran publik atau alur reset password — dapat diterima untuk ruang lingkup penilaian ini tetapi belum siap untuk produksi (production-ready).
- Tidak ada kontrol paginasi di UI — API mendukung paginasi (`?page=`), tetapi frontend hanya merender halaman pertama.
- Hanya PostgreSQL yang menggunakan Docker; Laravel, Next.js, dan backend Node berjalan secara native untuk mematuhi batas waktu penilaian.
- Tidak ada pembatasan kecepatan (rate limiting) pada endpoint pembuatan tiket publik (hanya endpoint login yang memiliki `throttle:5,1`).
- Menjalankan `php artisan migrate --seed` lebih dari sekali dapat membuat duplikat user admin jika seeder menggunakan `create()` alih-alih `firstOrCreate()` — tidak masalah untuk satu pengaturan lokal, namun layak diperbaiki untuk penggunaan berulang.
- Kredensial database diduplikasi di `.env` root dan `backend-laravel/.env` (Docker Compose dan Laravel masing-masing membaca `.env` dari direktorinya sendiri) dan harus disinkronkan secara manual — dipilih daripada flag command-line (`--env-file`) untuk menjaga instruksi setup tetap sederhana bagi reviewer yang tidak familier dengan resolusi env-file Docker Compose.

## Apa yang Akan Saya Tingkatkan Dengan Lebih Banyak Waktu

- Mengarahkan Docker Compose pada satu file `.env` (mis. `docker compose --env-file backend-laravel/.env up -d`) untuk menghapus kredensial DB yang diduplikasi antara root dan `backend-laravel/`.
- `docker-compose.yml` yang mencakup ketiga layanan untuk setup menggunakan satu perintah sesungguhnya.
- UI Paginasi pada daftar tiket.
- Pembatasan kecepatan (Rate limiting) pada `POST /api/tickets` untuk mencegah pengiriman spam.
- Pengujian frontend otomatis (React Testing Library) bersamaan dengan test suite backend.
- Kelas policy Laravel yang eksplisit daripada mengandalkan "semua orang di tabel users adalah admin."

## Perkiraan Waktu yang Dihabiskan

~24 jam.

## Tangkapan Layar (Screenshots) / Demo

Lihat folder `/screenshots` atau [tautan ke video demo].
