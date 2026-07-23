<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Seed the tickets table with 20 realistic support tickets.
     */
    public function run(): void
    {
        $users = User::where('role', 'user')->pluck('id')->toArray();

        $tickets = [
            [
                'subject' => 'Tidak bisa login ke akun saya',
                'description' => 'Saya sudah mencoba beberapa kali untuk login tetapi selalu gagal. Pesan error yang muncul adalah "Invalid credentials". Saya yakin password saya benar karena baru saja reset kemarin.',
                'status' => 'open',
            ],
            [
                'subject' => 'Pembayaran gagal diproses',
                'description' => 'Saya mencoba melakukan pembayaran untuk pesanan #12345 tetapi transaksi gagal. Saldo sudah terpotong di rekening saya namun status pesanan masih belum terbayar.',
                'status' => 'open',
            ],
            [
                'subject' => 'Fitur export data tidak berfungsi',
                'description' => 'Ketika saya klik tombol export CSV di halaman laporan, file yang terdownload kosong. Sudah dicoba di Chrome dan Firefox, hasilnya sama saja.',
                'status' => 'in_progres',
            ],
            [
                'subject' => 'Request perubahan email akun',
                'description' => 'Saya ingin mengubah email akun saya dari budi@lama.com ke budi@baru.com. Mohon bantuannya karena di pengaturan tidak ada opsi untuk mengubah email.',
                'status' => 'closed',
            ],
            [
                'subject' => 'Bug pada halaman dashboard',
                'description' => 'Grafik statistik di dashboard tidak menampilkan data bulan ini. Data terakhir yang ditampilkan adalah bulan lalu. Sudah coba refresh dan clear cache browser.',
                'status' => 'open',
            ],
            [
                'subject' => 'Notifikasi email tidak terkirim',
                'description' => 'Saya tidak menerima notifikasi email sejak 3 hari lalu. Sudah cek folder spam dan tidak ada. Notifikasi di aplikasi tetap muncul normal.',
                'status' => 'in_progres',
            ],
            [
                'subject' => 'Halaman lambat saat buka laporan',
                'description' => 'Halaman laporan bulanan membutuhkan waktu lebih dari 30 detik untuk loading. Hal ini terjadi setiap kali saya filter data dengan rentang waktu lebih dari 1 bulan.',
                'status' => 'open',
            ],
            [
                'subject' => 'Error 500 saat upload file',
                'description' => 'Setiap kali saya mencoba upload file PDF berukuran lebih dari 5MB, muncul error 500 Internal Server Error. File yang lebih kecil bisa diupload tanpa masalah.',
                'status' => 'closed',
            ],
            [
                'subject' => 'Permintaan reset password',
                'description' => 'Saya lupa password akun saya dan link reset password yang dikirim ke email sudah expired. Mohon dikirim ulang link reset password.',
                'status' => 'closed',
            ],
            [
                'subject' => 'Data duplikat di tabel pengguna',
                'description' => 'Saya menemukan ada data pengguna yang duplikat di daftar pengguna. User dengan nama "Test User" muncul 3 kali dengan email yang berbeda-beda.',
                'status' => 'in_progres',
            ],
            [
                'subject' => 'Tampilan mobile tidak responsif',
                'description' => 'Ketika dibuka di smartphone, sidebar navigasi menutupi seluruh konten dan tombol close tidak terlihat. Ini terjadi di semua browser mobile.',
                'status' => 'open',
            ],
            [
                'subject' => 'Integrasi API pihak ketiga gagal',
                'description' => 'Koneksi ke API payment gateway tiba-tiba terputus sejak tadi pagi. Response yang diterima timeout setelah 60 detik. Mohon dicek apakah ada perubahan konfigurasi.',
                'status' => 'open',
            ],
            [
                'subject' => 'Permintaan fitur: dark mode',
                'description' => 'Saya ingin mengusulkan penambahan fitur dark mode pada aplikasi. Akan sangat membantu bagi pengguna yang sering bekerja di malam hari.',
                'status' => 'open',
            ],
            [
                'subject' => 'Masalah dengan pencarian data',
                'description' => 'Fitur search di halaman daftar produk tidak mengembalikan hasil yang tepat. Ketika saya cari "laptop", hasilnya malah menampilkan semua produk elektronik.',
                'status' => 'in_progres',
            ],
            [
                'subject' => 'Akun terkunci setelah 3 kali salah password',
                'description' => 'Akun saya terkunci karena 3 kali salah memasukkan password. Saya sudah menunggu 30 menit tapi masih belum bisa login kembali.',
                'status' => 'closed',
            ],
            [
                'subject' => 'Format tanggal salah di laporan',
                'description' => 'Tanggal di laporan ekspor ditampilkan dalam format MM/DD/YYYY padahal seharusnya DD/MM/YYYY sesuai standar Indonesia. Ini menyebabkan kebingungan.',
                'status' => 'open',
            ],
            [
                'subject' => 'Gagal menghapus item dari keranjang',
                'description' => 'Tombol hapus di halaman keranjang belanja tidak berfungsi. Ketika diklik, tidak terjadi apa-apa. Sudah coba di berbagai browser.',
                'status' => 'open',
            ],
            [
                'subject' => 'Sertifikat SSL expired',
                'description' => 'Browser menampilkan peringatan bahwa sertifikat SSL website sudah expired. Pengunjung tidak bisa mengakses website karena warning ini.',
                'status' => 'in_progres',
            ],
            [
                'subject' => 'Backup database gagal',
                'description' => 'Job backup otomatis yang dijadwalkan setiap malam gagal 3 hari berturut-turut. Log error menunjukkan "disk space insufficient".',
                'status' => 'open',
            ],
            [
                'subject' => 'Hak akses user tidak sesuai',
                'description' => 'User dengan role "viewer" bisa mengakses menu edit dan delete. Seharusnya role viewer hanya bisa melihat data tanpa bisa melakukan perubahan.',
                'status' => 'closed',
            ],
        ];

        foreach ($tickets as $index => $ticket) {
            Ticket::create([
                'user_id' => $users[$index % count($users)],
                'subject' => $ticket['subject'],
                'description' => $ticket['description'],
                'status' => $ticket['status'],
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
