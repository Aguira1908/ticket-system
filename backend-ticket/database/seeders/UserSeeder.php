<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  /**
   * Seed the users table with admin users.
   */
  public function run(): void
  {
    $users = [
      [
        'username' => 'Admin User',
        'email' => 'admin@gmail.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
      ],
      [
        'username' => 'Support Agent',
        'email' => 'support@gmail.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
      ],
      [
        'username' => 'Budi Santoso',
        'email' => 'budi@gmail.com',
        'email_verified_at' => now(),
        'password' => Hash::make('password'),
      ],
    ];

    foreach ($users as $user) {
      User::create($user);
    }
  }
}
