<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
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

  public static $rules = [
    'owner_id' => 'required|exists:users,id',
    'title' => 'required|min:3',
    'description' => 'required',
    'thumbnail' => 'b64image|b64mimes:jpeg,jpg,png|b64max:10240',
    'visibility' => 'required|in:public,private,unlisted'
  ];

  public function owner() {
    return $this->belongsTo(User::class);
  }

}
