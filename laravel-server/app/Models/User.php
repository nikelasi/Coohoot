<?php

namespace App\Models;

use HasUuids;
use Tymon\JWTAuth\Contracts\JWTSubject;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use HasUuids;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'pfp_url'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password'
    ];

    public static $rules = [
        'username' => 'required|string|min:2|max:50|unique:users|regex:/^[a-zA-Z0-9.]+$/',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8|max:50|regex:/^(?=.*\d)(?=.*[@$!%*#?&]).*$/',
        'pfp' => 'mimes:jpeg,jpg,png|max:10240'
    ];

    // JWT
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }

}
