<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'quiz_id',
        'prev_question',
        'time',
        'type',
        'image_url',
        'question',
        'options',
        'answers'
    ];

    protected $casts = [
        'options' => 'array',
        'answers' => 'array'
    ];

    public static $rules = [];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }

}
