<?php

namespace App\Services;

use App\Models\User;

use Illuminate\Support\Facades\Hash;

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

  /**
   * Delete a user
   * 
   * @param User $user
   * @return void
   */
  public function delete(User $user) {
    $user->delete();
  }

  /**
   * Update a user's password
   * 
   * @param User $user
   * @param string $password
   * @return void
   */
  public function updatePassword(User $user, string $password) {
    $user->password = Hash::make($password);
    $user->save();
  }

}