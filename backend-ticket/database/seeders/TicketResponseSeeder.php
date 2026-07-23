<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketResponse;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketResponseSeeder extends Seeder
{
    /**
     * Seed the ticket_responses table with realistic replies.
     */
    public function run(): void
    {
        $adminId = User::where('role', 'admin')->first()->id;
        $agentId = User::where('role', 'author')->first()->id;
        $tickets = Ticket::all();

        $agentReplies = [
            'Terima kasih telah menghubungi kami. Kami sedang meninjau masalah Anda dan akan segera memberikan update.',
            'Kami sudah mengidentifikasi masalahnya. Tim teknis sedang mengerjakan perbaikan.',
            'Mohon maaf atas ketidaknyamanannya. Bisa tolong berikan screenshot error yang muncul?',
            'Masalah ini sudah kami eskalasi ke tim development. Estimasi perbaikan 1-2 hari kerja.',
            'Kami sudah melakukan perbaikan. Mohon dicoba kembali dan beri tahu kami jika masih bermasalah.',
            'Terima kasih informasinya. Kami akan melakukan pengecekan lebih lanjut.',
            'Masalah ini sudah diperbaiki pada update terakhir. Silakan clear cache browser Anda.',
            'Kami memerlukan informasi tambahan untuk menyelesaikan tiket ini. Mohon kirimkan detail browser dan OS yang digunakan.',
        ];

        $userReplies = [
            'Baik, terima kasih atas responnya. Saya akan menunggu update selanjutnya.',
            'Sudah saya coba lagi tapi masih error. Berikut saya lampirkan screenshotnya.',
            'Masalahnya sudah teratasi. Terima kasih banyak atas bantuannya!',
            'Saya menggunakan Chrome versi terbaru di Windows 11.',
            'Oke, saya akan clear cache dulu dan coba lagi.',
        ];

        foreach ($tickets as $ticket) {
            $ticketOwnerId = $ticket->user_id;
            $responderId = rand(0, 1) === 0 ? $agentId : $adminId;

            // Agent/admin first reply
            TicketResponse::create([
                'ticket_id' => $ticket->id,
                'user_id' => $responderId,
                'message' => $agentReplies[array_rand($agentReplies)],
                'created_at' => $ticket->created_at->addHours(rand(1, 12)),
            ]);

            // User reply
            if (rand(0, 1) === 1) {
                TicketResponse::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticketOwnerId,
                    'message' => $userReplies[array_rand($userReplies)],
                    'created_at' => $ticket->created_at->addHours(rand(13, 24)),
                ]);
            }

            // Optional second agent reply for closed/in_progress tickets
            if (in_array($ticket->status, ['closed', 'in_progres'])) {
                TicketResponse::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $responderId,
                    'message' => $agentReplies[array_rand($agentReplies)],
                    'created_at' => $ticket->created_at->addHours(rand(25, 48)),
                ]);
            }
        }
    }
}
