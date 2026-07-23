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
    $userIds = User::pluck('id')->toArray();
    $tickets = Ticket::all();

    $replies = [
      'Terima kasih telah menghubungi kami. Kami sedang meninjau masalah Anda dan akan segera memberikan update.',
      'Kami sudah mengidentifikasi masalahnya. Tim teknis sedang mengerjakan perbaikan.',
      'Mohon maaf atas ketidaknyamanannya. Bisa tolong berikan screenshot error yang muncul?',
      'Masalah ini sudah kami eskalasi ke tim development. Estimasi perbaikan 1-2 hari kerja.',
      'Kami sudah melakukan perbaikan. Mohon dicoba kembali dan beri tahu kami jika masih bermasalah.',
      'Terima kasih informasinya. Kami akan melakukan pengecekan lebih lanjut.',
      'Masalah ini sudah diperbaiki pada update terakhir. Silakan clear cache browser Anda.',
      'Kami memerlukan informasi tambahan untuk menyelesaikan tiket ini. Mohon kirimkan detail browser dan OS yang digunakan.',
    ];

    foreach ($tickets as $ticket) {
      $responderId = $userIds[array_rand($userIds)];

      // First reply
      TicketResponse::create([
        'ticket_id' => $ticket->id,
        'user_id' => $responderId,
        'message' => $replies[array_rand($replies)],
        'created_at' => $ticket->created_at->addHours(rand(1, 12)),
      ]);

      // Optional second reply for in_progress/resolved tickets
      if (in_array($ticket->status, ['resolved', 'in_progres'])) {
        TicketResponse::create([
          'ticket_id' => $ticket->id,
          'user_id' => $userIds[array_rand($userIds)],
          'message' => $replies[array_rand($replies)],
          'created_at' => $ticket->created_at->addHours(rand(25, 48)),
        ]);
      }
    }
  }
}
