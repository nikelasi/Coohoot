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

    public static $rules = [
        'quiz_id' => 'required|exists:quizzes,id',
        'prev_question' => 'exists:questions,id',
        'time' => 'integer|min:10|max:300',
        'type' => 'required|in:mcq,msq,short-answer',
        'image_url' => 'b64image|b64mimes:jpeg,jpg,png|b64max:10240',
        'question' => 'required',
        'options' => 'array',
        'answers' => 'required|array'
    ];

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }

}
