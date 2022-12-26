<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use AuthService;

class UserController extends Controller {

    public function __construct(UserService $usersService, AuthService $authService) {
        $this->usersService = $usersService;
        $this->authService = $authService;

        $this->middleware('auth.jwt')->only([
            'delete'
        ]);
    }

    public function get($username) {
        $user = $this->usersService->getByUsername($username);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No user with that username',
                'user' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'User found',
            'user' => $user
        ], 200);
    }

    public function delete(Request $request) {

        $password = $request->header('Confirmation-Password');

        $user = auth()->user();
        $verified = $this->authService->verifyPassword($password, $user);

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password'
            ], 401);
        }

        auth()->logout();
        $this->usersService->delete($user);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }
    
}
