<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use HasUuids;

class Quiz extends Model
{
  use HasUuids;
  use HasFactory;

  protected $table = 'quizzes';

  protected $fillable = [
    'owner_id',
    'title',
    'description',
    'thumbnail_url',
    'visibility'
  ];

  public function owner() {
    return $this->belongsTo(User::class);
  }

}
