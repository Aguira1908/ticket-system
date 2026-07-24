# Dokumentasi Penggunaan AI

## Tools AI yang Digunakan

Claude (Sonnet) digunakan sepanjang proses perencanaan, review kode backend (Laravel), desain backend kedua (Node.js/TypeScript), implementasi frontend (Next.js), debugging, dan penyusunan dokumentasi.

## Tugas yang Dibantu AI

- **Perencanaan**: memecah brief assessment menjadi rencana bertahap yang disesuaikan dengan bobot rubric penilaian, termasuk keputusan scope eksplisit ("wajib dikerjakan" vs "boleh dilewati kalau waktu mepet") supaya hasil akhirnya sesuai dengan yang diminta tidak kurang, tidak berlebihan.
- **Backend (Laravel)**: review dan refactor controller ticket & auth (menghapus try/catch berlebih yang menutupi error asli, diganti dengan exception handling bawaan Laravel dan route model binding), membantu mendesain pendekatan otorisasi admin (token Sanctum, tanpa endpoint registrasi publik).
- **Backend kedua (Node.js/TypeScript)**: mendesain dan mengimplementasikan endpoint standalone Express + TypeScript (`GET /api/stats`) dengan struktur berlapis route -> controller -> service, sengaja tanpa abstraksi tambahan (tanpa DI container, tanpa repository layer) karena tidak dibutuhkan untuk satu endpoint.
- **Frontend (Next.js)**: implementasi halaman list, detail, buat tiket, dan login; admin actions; state autentikasi lewat React Context; penanganan loading/error/not-found sesuai konvensi App Router.
- **Debugging**: mendiagnosis ketidakcocokan TypeScript 7 dengan `ts-node` (konflik peer dependency dan crash saat runtime), serta ketidakcocokan parameter route (`{id}` di route vs parameter `Ticket $ticket` yang di-type di controller, yang menyebabkan implicit route model binding gagal).
- **Dokumentasi**: menyusun struktur README dan file ini.

## Contoh Output AI yang Salah atau Perlu Diperbaiki

Saat saya bertanya kenapa pembuatan tiket tidak perlu login sementara aksi admin perlu, jawaban pertama Claude adalah "karena hal itu tidak disebutkan secara eksplisit di soal" yang saya tunjukkan sebagai argumen lemah dan tidak konsisten, karena logika yang sama seharusnya juga berarti admin tidak perlu login (yang juga tidak disebutkan eksplisit). Claude mengakui alasan itu keliru dan memberikan penjelasan yang lebih kuat: pembagian struktural soal antara "User Features" dan "Admin Features", ditambah kriteria penilaian eksplisit "Authorization awareness" di rubric, adalah dasar sebenarnya yang membenarkan aksi admin perlu digerbangi otorisasi. Keputusan teknis akhirnya tidak berubah, tapi saya memastikan memahami dan bisa mempertanggungjawabkan sendiri alasannya bukan menerima begitu saja justifikasi pertama yang diberikan AI.

## Bagaimana Saya Mereview dan Menguji Kode Hasil AI

- Menjalankan setiap endpoint backend secara manual lewat `curl` (buat tiket, list dan filter, update status, tambah response, login dan logout) sebelum menganggap bagian manapun selesai.
- Menemukan bug di mana kode yang disarankan melakukan eager loading dengan mereferensikan kolom `username`, padahal migration `users` yang saya buat sendiri kolomnya `name` bug ini ditemukan lewat pengecekan manual sebelum masuk ke kode final.
- Memperbaiki sendiri ketidakcocokan route model binding (route pakai `{id}`, controller mengharapkan `Ticket $ticket`) setelah diuji dan ditemukan errornya.
- Membaca dan memahami setiap file sebelum menambahkannya ke project tidak meng-commit kode yang tidak bisa saya jelaskan sendiri.
