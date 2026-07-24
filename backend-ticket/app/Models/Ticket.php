<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $requester_name
 * @property string $requester_email
 * @property string $subject
 * @property string $description
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Ticket extends Model
{
  use HasFactory;

  protected $fillable = [
    'requester_name',
    'requester_email',
    'subject',
    'description',
    'status',
  ];

  /**
   * @return HasMany<TicketResponse, $this>
   */
  public function responses(): HasMany
  {
    return $this->hasMany(TicketResponse::class);
  }

  public function scopeStatus(Builder $query, string $status): Builder
  {
    return $query->where('status', $status);
  }
}
