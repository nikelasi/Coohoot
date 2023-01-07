<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use HasUuids;

class Session extends Model
{
  use HasUuids;
  use HasFactory;

  protected $table = 'sessions';

  protected $fillable = [
    'owner_id',
    'title',
    'description',
    'thumbnail_url',
    'visibility',
    'type'
  ];

  public function owner() {
    return $this->belongsTo(User::class);
  }

}
