<?php

namespace Tests\Unit;

use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketScopeTest extends TestCase
{
  use RefreshDatabase;

  public function test_status_scope_returns_only_matching_tickets(): void
  {
    Ticket::factory()->create(['status' => 'open']);
    Ticket::factory()->create(['status' => 'open']);
    Ticket::factory()->create(['status' => 'resolved']);

    $result = Ticket::query()->status('open')->get();

    $this->assertCount(2, $result);
    $this->assertTrue($result->every(fn(Ticket $ticket) => $ticket->status === 'open'));
  }

  public function test_status_scope_returns_empty_when_no_match(): void
  {
    Ticket::factory()->create(['status' => 'open']);

    $result = Ticket::query()->status('resolved')->get();

    $this->assertCount(0, $result);
  }
}
