<?php

namespace App\Services;

use GoogleDriveService;

use App\Models\User;
use App\Models\UserToken;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use App\Mail\EmailVerificationMail;

class AuthService {

  public function __construct(GoogleDriveService $drive) {
    $this->drive = $drive;
  }

  /**
   * Registers a new user.
   * 
   * @param array[
   *  'username' => string,
   *  'email' => string,
   *  'password' => string,
   *  'pfp' => string
   * ] $user
   * @return void
   */
  public function registerUser($user, $pfp) {
    $user = User::create([
      'username' => $user['username'],
      'email' => $user['email'],
      'password' => Hash::make($user['password']),
      'pfp_url' => $this->drive->uploadPfp($pfp)
    ]);

    $this->createVerificationToken($user->id, 'email_verification');
  }

  /**
   * Creates a email verification token for the given user.
   * 
   * @param string $uuid The user's UUID
   * @return void
   */
  public function createVerificationToken($uuid) {
    $user = User::find($uuid);

    if ($user->verified) {
      return;
    }
    
    $token = UserToken::create([
      'user_id' => $uuid,
      'type' => 'email_verification'
    ]);

    Mail::to($user->email)->send(new EmailVerificationMail($user, $token));
  }

  /**
   * Attempt to verify the user's email with given token.
   * 
   * @param string $token The user's email verification token
   * @return bool Whether verification was successful
   */
  public function verifyUser($token) {
    $token = UserToken::where('token', $token)->first();

    if ($token) {
      $user = User::find($token->user_id);
      $user->verified = true;
      $user->save();

      $token->delete();

      return true;
    }

    return false;
  }

  /**
   * Attempt to login the user with given credentials.
   * 
   * @param array[
   *  'username' => string,
   *  'email' => string,
   *  'password' => string,
   * ] $credentials
   * @return (string|null) A token if the attempt was successful, null otherwise
   */
  public function login($credentials) {

    if (isset($credentials['username'])) {
      $user = User::where('username', $credentials['username'])->first();
    } else if (isset($credentials['email'])) {
      $user = User::where('email', $credentials['email'])->first();
    }

    if ($user && Hash::check($credentials['password'], $user->password)) {
      $token = auth()->login($user);
      return $token;
    }

    return null;
  }

}