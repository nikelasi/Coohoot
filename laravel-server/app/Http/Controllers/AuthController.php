<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use AuthService;

class AuthController extends Controller {

    public function __construct(AuthService $authService) {
        $this->authService = $authService;

        $this->middleware('auth.jwt')->only([
            'logout',
            'me'
        ]);
    }

    public function register(Request $request) {
        // TODO: Validation

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
        // TODO: Validation

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
        // TODO: Validation

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

    public function me(Request $request) {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'user' => $user
        ], 200);
    }
}
