<?php

namespace App\Services;

use App\Models\User;

class UserService {

  /**
   * Get a user by username
   * 
   * @param string $username
   * @return (User|null) The user
   */
  public function getByUsername(string $username) {
    return User::where('username', $username)->first();
  }

}