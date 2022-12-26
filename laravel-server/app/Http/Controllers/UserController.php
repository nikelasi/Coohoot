<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use AuthService;

use App\Models\User;

class UserController extends Controller {

    public function __construct(UserService $usersService, AuthService $authService) {
        $this->usersService = $usersService;
        $this->authService = $authService;

        $this->middleware('auth.jwt')->only([
            'me',
            'updatePassword',
            'delete'
        ]);
    }

    public function me(Request $request) {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'user' => $user
        ], 200);
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

    public function updatePassword(Request $request) {
            
        // Validation
        if ($errors = $this->validate($request, [
            'new_password' => User::$rules['password'],
        ], [
            'new_password.regex' => 'Password must contain at least one number and one special character.',
        ])) {
            return $errors;
        }

        $user = auth()->user();
        $verified = $this->authService->verifyPassword($request->password, $user);

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password'
            ], 401);
        }

        $this->usersService->updatePassword($user, $request->new_password);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully'
        ], 200);

    }
    
}
