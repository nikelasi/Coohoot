<?php

namespace App\Models;

use HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\MassPrunable;

class UserToken extends Model
{
    use HasUuids;
    use MassPrunable;

    protected $table = 'user_tokens';

    protected static function boot() {
        parent::boot();

        static::creating(function ($model) {
            $model->token = bin2hex(random_bytes(32));
            $model->expires_at = now()->addMinutes(10);
        });
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function prunable() {
        return static::where('expires_at', '<', now());
    }
}
