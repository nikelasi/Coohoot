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
        Route::get('me', 'AuthController@me');
    });

    // Debug routes
    Route::group([
        'prefix' => 'debug'
    ], function() {
        Route::get('getimageurl', 'ImageController@imageUrl');
    });

    // User routes
    Route::group([
        'prefix' => 'users'
    ], function() {
        Route::get('{username}', 'UserController@get');
    });

});
