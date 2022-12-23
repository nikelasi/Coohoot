<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller {

    public function __construct(UserService $usersService) {
        $this->usersService = $usersService;
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
    
}
