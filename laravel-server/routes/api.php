<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'namespace' => 'App\Http\Controllers'
], function() {

    // Auth routes
    Route::group([
        'prefix' => 'auth'
    ], function() {
        Route::post('register', 'AuthController@register');
        Route::post('login', 'AuthController@login');
        Route::post('verify-email', 'AuthController@verifyEmail');
        Route::post('logout', 'AuthController@logout');

        // Password reset routes
        Route::group([
            'prefix' => 'password-reset'
        ], function() {
            Route::post('request', 'AuthController@requestPasswordReset');
            Route::post('check', 'AuthController@checkPasswordResetToken');
            Route::post('/', 'AuthController@resetPassword');
        });
    });

    // User routes
    Route::group([
        'prefix' => 'users'
    ], function() {
        Route::get('me', 'UserController@me');
        Route::get('{username}', 'UserController@get');
        Route::delete('/', 'UserController@delete');
        Route::put('change-password', 'UserController@updatePassword');
        Route::put('update-pfp', 'UserController@updatePfp');
    });

    // Quizzes routes
    Route::group([
        'prefix' => 'quizzes'
    ], function() {
        Route::post('/', 'QuizController@create');
        Route::get('/', 'QuizController@getAll');
        Route::get('/mine', 'QuizController@getMine');
        Route::get('/by/{username}', 'QuizController@getOthers');
        Route::get('/{id}', 'QuizController@get');
        Route::delete('/{id}', 'QuizController@delete');
    });

    // Debug routes
    Route::group([
        'prefix' => 'debug'
    ], function() {
        Route::get('getimageurl', 'ImageController@imageUrl');
    });

});
