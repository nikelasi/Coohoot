<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use AuthService;

class AuthController extends Controller {

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
        // $this->middleware(...)->only(['logout']);   
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

    }

    public function logout(Request $request) {

    }
}
