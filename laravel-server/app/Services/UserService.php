<?php

namespace App\Services;

use App\Models\User;

use Illuminate\Support\Facades\Hash;
use GoogleDriveService;

class UserService {

  public function __construct(GoogleDriveService $drive) {
    $this->drive = $drive;
  }

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

  /**
   * Update a user's pfp
   * 
   * @param User $user
   * @param string $base64 The base64 encoded image
   * @return void
   */
  public function updatePfp(User $user, string $base64) {
    $pfp = $this->drive->uploadPfp($base64);
    $user->pfp_url = $pfp;
    $user->save();
  }

}