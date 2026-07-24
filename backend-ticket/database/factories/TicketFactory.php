<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
  protected $model = Ticket::class;

  public function definition(): array
  {
    return [
      'requester_name'  => $this->faker->name(),
      'requester_email' => $this->faker->safeEmail(),
      'subject'         => $this->faker->sentence(6),
      'description'     => $this->faker->paragraph(),
      'status'          => 'open',
    ];
  }
}
