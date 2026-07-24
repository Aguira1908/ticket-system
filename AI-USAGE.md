# Dokumentasi Penggunaan AI

## Tools AI yang Digunakan

| Tool | Versi / Model | Kegunaan |
|------|---------------|----------|
| **Google Gemini (Antigravity)** | Claude Opus 4.6 | Pembuatan kode, panduan arsitektur, debugging, dokumentasi |
| **GitHub Copilot** | VS Code Extension | Autocomplete kode saat menulis |

---

## Bagian yang Dibantu AI

### 1. Scaffolding & Arsitektur Proyek
- Membuat struktur proyek Laravel dengan React starter kit
- Menyarankan layout monorepo dengan `backend-ticket/` dan `second-backend-node/`
- Merekomendasikan Inertia.js + React untuk pendekatan SPA

### 2. Desain Skema Database
- Membantu merancang migrasi `tickets` dan `ticket_responses`
- Menyarankan penggunaan `enum` di level database untuk kolom `status`
- Merekomendasikan cascade delete pada foreign key

### 3. Logika Controller API
- Membuat boilerplate `Api\TicketController` dengan operasi CRUD
- Membantu implementasi aturan validasi request
- Menyarankan eager loading relasi `responses.user` untuk menghindari N+1 query

### 4. Autentikasi
- Memandu setup Laravel Sanctum untuk token authentication
- Membuat `Api\AuthController` dengan endpoint login/logout
- Mengkonfigurasi middleware `auth:sanctum` dan rate limiting

### 5. Database Seeder
- Membuat data tiket sample dalam bahasa Indonesia (20 tiket)
- Membuat seeder response dan user (3 akun staff)

### 6. Frontend (React + TypeScript + Inertia.js)
- Membantu membangun komponen `welcome.tsx`
- Membuat utility function dan setup Inertia.js

### 7. Second Backend (Node.js)
- Membuat struktur proyek Express 5 + TypeScript
- Menyusun arsitektur Controller → Service → Data
- Membuat endpoint statistik tiket (`GET /api/stats`)
- Setup TypeScript interfaces dan error handling middleware

### 8. Testing & Dokumentasi
- Konfigurasi Pest PHP dengan SQLite in-memory
- Membuat file README.md dan AI-USAGE.md ini

---

## Contoh Output AI yang Kurang Optimal

### Masalah: N+1 Query pada Listing Tiket

**Yang dibuat AI:**

```php
public function index(Request $request)
{
    $query = Ticket::query();

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return response()->json($query->paginate(15));
}
```

**Masalahnya:**

Kode di atas tidak menyertakan eager loading relasi `responses`. Setiap tiket memicu query terpisah untuk mengambil response-nya — ini adalah masalah **N+1 query**. Dengan 15 tiket per halaman, hasilnya 16 query, bukan 2.

**Perbaikan saya:**

```php
public function index(Request $request)
{
    $query = Ticket::with('responses'); // Tambah eager loading

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return response()->json($query->paginate(15));
}
```

Menambahkan `::with('responses')` mengurangi jumlah query dari N+1 menjadi hanya 2 query.

**Cara saya menemukan masalah ini:**

Saya memeriksa query menggunakan `DB::listen()` saat development dan melihat query `SELECT * FROM ticket_responses WHERE ticket_id = ?` yang berulang-ulang. Pengalaman sebelumnya dengan ORM membantu saya mengenali masalah ini.

---

## Cara Review dan Testing Kode AI

### Proses Review

1. **Review baris per baris** — Setiap kode dari AI dibaca dan dipahami sebelum diterima
2. **Pahami alasannya** — Untuk setiap saran, saya pastikan paham *mengapa* AI merekomendasikan pendekatan tertentu
3. **Audit keamanan** — Khusus dicek:
   - Tidak ada SQL injection (Eloquent menggunakan parameterized queries)
   - Mass assignment protection (`$fillable` diset dengan benar)
   - Middleware autentikasi diterapkan di route admin
   - Password di-hash dengan benar
   - Tidak ada credentials yang di-hardcode
   - Rate limiting pada endpoint login

### Proses Testing

1. **Testing API manual** — Test setiap endpoint dengan input valid dan invalid
   - Cek HTTP status code (200, 201, 401, 404, 422)
   - Verifikasi pesan error validasi
   - Test alur autentikasi (login → token → request → logout)

2. **Automated test** — Jalankan Pest test suite (`php artisan test`)

3. **Edge case yang ditest manual:**
   - Submit tiket dengan field kosong → 422
   - Format email tidak valid → 422
   - Akses route admin tanpa token → 401
   - Request tiket yang tidak ada → 404
   - Melebihi rate limit login → 429

4. **Testing frontend** — Test semua alur user di browser

---

## Kesimpulan

Tools AI digunakan sebagai **alat bantu percepatan**, bukan pengganti pemahaman. Setiap kode yang dihasilkan AI direview untuk kebenaran, keamanan, dan performa sebelum dimasukkan. Saya bertanggung jawab penuh atas semua kode yang disubmit dan bisa menjelaskan setiap bagian dari codebase ini.
