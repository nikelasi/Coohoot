<?php

namespace App\Services;

use GoogleDriveService;

use App\Models\User;
use App\Models\UserToken;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use App\Mail\EmailVerificationMail;
use App\Mail\PasswordResetMail;

class AuthService {

  public function __construct(GoogleDriveService $drive, UserService $usersService) {
    $this->drive = $drive;
    $this->usersService = $usersService;
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
  public function createVerificationToken($uuid, $token_type = 'email_verification') {
    $user = User::find($uuid);

    if ($token_type === 'email_verification' && $user->verified) {
      return;
    }
    
    $token = UserToken::create([
      'user_id' => $uuid,
      'type' => $token_type
    ]);

    if ($token_type === 'email_verification') {
      Mail::to($user->email)->send(new EmailVerificationMail($user, $token));
    } else if ($token_type === 'password_reset') {
      Mail::to($user->email)->send(new PasswordResetMail($user, $token));
    }
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

      if (strtotime($token->expires_at) < time()) {
        $token->delete();
        return false;
      }

      $user = User::find($token->user_id);
      $user->verified = true;
      $user->save();

      $token->delete();

      UserToken::where('user_id', $user->id)->delete(
        UserToken::where('type', 'email_verification')->get()
      );

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

    $user = null;
    if (isset($credentials['username'])) {
      $user = User::where('username', $credentials['username'])->first();
    } else if (isset($credentials['email'])) {
      $user = User::where('email', $credentials['email'])->first();
    }

    if ($this->verifyPassword($credentials['password'], $user)) {
      $token = auth()->login($user);

      if (!$user->verified) {
        $this->createVerificationToken($user->id, 'email_verification');
        throw new \Exception('Account not verified yet, check your email to verify.');
      }
      
      return $token;
    }

    return null;
  }

  /**
   * Verify the user's password and return whether it is correct.
   * 
   * @param string $password The user's password
   * @param User $user The user
   * @return bool Whether the password is correct
   */
  public function verifyPassword($password, $user) {
    return $user && Hash::check($password, $user->password);
  }

  // Password reset methods

  /**
   * Request a password reset for the given user.
   * 
   * @param array[
   *  'username' => string,
   *  'email' => string
   * ] $user_identification
   * @return bool Whether the request was successful
   */
  public function requestPasswordReset($user_identification) {

    $user = null;
    if (isset($user_identification['username'])) {
      $user = User::where('username', $user_identification['username'])->first();
    } else if (isset($user_identification['email'])) {
      $user = User::where('email', $user_identification['email'])->first();
    }

    if ($user) {
      $this->createVerificationToken($user->id, 'password_reset');
      return true;
    }
    return false;
  }

  /**
   * Check if the given token is valid for password reset.
   * 
   * @param string $token The user's password reset token
   * @return (string|null) The user's username if the token is valid, null otherwise
   */
  public function checkPasswordResetToken($token) {
    $token = UserToken::where('token', $token)
      ->where('type', 'password_reset')
      ->first();

    if (!$token) {
      return null;
    }

    if (strtotime($token->expires_at) < time()) {
      $token->delete();
      return null;
    }

    $user = User::find($token->user_id);
    return $user->username;
  }

  /**
   * Reset the user's password with the given token.
   * 
   * @param string $token The user's password reset token
   * @param string $password The new password
   * @return bool Whether the password reset was successful
   */
  public function resetPassword($token, $password) {
    $token = UserToken::where('token', $token)
      ->where('type', 'password_reset')
      ->first();

    if (!$token) {
      return false;
    }

    $user = User::find($token->user_id);
    $this->usersService->updatePassword($user, $password);

    $token->delete();

    UserToken::where('user_id', $user->id)->delete(
      UserToken::where('type', 'password_reset')->get()
    );

    return true;
  }

}