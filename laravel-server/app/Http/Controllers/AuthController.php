<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use AuthService;

use App\Models\User;

class AuthController extends Controller {

    public function __construct(AuthService $authService) {
        $this->authService = $authService;

        $this->middleware('auth.jwt')->only([
            'logout'
        ]);
    }

    public function register(Request $request) {

        // Validation
        if ($errors = $this->validate($request, User::$rules, [
            'username.regex' => 'Username can only contain letters, numbers and periods.',
            'password.regex' => 'Password must contain at least one number and one special character.',
        ])) {
            return $errors;
        }

        // Registering
        $this->authService->registerUser($request->only([
            'username',
            'email',
            'password'
        ]), $request->pfp);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Pending email verification.'
        ], 200);
    }

    public function verifyEmail(Request $request) {

        // Verifying
        $verified = $this->authService->verifyUser($request->token);

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.'
        ]);

    }

    public function login(Request $request) {

        // Logging in
        try {
            $token = $this->authService->login($request->only([
                'username',
                'email',
                'password'
            ]));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 401);
        }

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'token' => $token
        ], 200);
    }

    public function logout(Request $request) {
        auth()->logout();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ], 200);
    }

    // Password reset methods

    public function requestPasswordReset(Request $request) {

        // Requesting
        $sent = $this->authService->requestPasswordReset($request->only([
            'username',
            'email'
        ]));

        if (!$sent) {
            return response()->json([
                'success' => false,
                'message' => 'No user with that email or username found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password reset email sent.'
        ], 200);
        
    }

    public function checkPasswordResetToken(Request $request) {

        // Checking
        $username = $this->authService->checkPasswordResetToken($request->token);

        if (!$username) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token valid.',
            'username' => $username
        ], 200);

    }

    public function resetPassword(Request $request) {

        if ($errors = $this->validate($request, [
            'password' => User::$rules['password']
        ])) {
            return $errors;
        }

        // Resetting
        $reset = $this->authService->resetPassword($request->token, $request->password);

        if (!$reset) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.'
        ], 200);

    }
}
