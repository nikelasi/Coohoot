<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// MIME types (that probably will be in the built files)
const MIME_TYPES = [
    "js" => "application/javascript",
    "css" => "text/css",
    "png" => "image/png",
    "jpg" => "image/jpeg",
    "jpeg" => "image/jpeg",
    "gif" => "image/gif",
    "svg" => "image/svg+xml"
];

// Serve the build for any routes that aren't the following: /assets, /api
Route::get('/{any}', function() {
    return File::get(public_path() . '/client/index.html');
})->where('any', '(?!(assets|api|cloud)).*');

// Serve the assets from build
Route::get('/assets/{path}', function($path) {
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    $mime_type = MIME_TYPES[$ext] ?? "text/plain";
    return response()->file(public_path() . '/client/assets/' . $path, [
        "Content-Type" => $mime_type
    ]);
});

// Controller based routes
Route::group([
    'namespace' => 'App\Http\Controllers'
], function() {

    // Image routes
    Route::get('/cloud/{path}', 'ImageController@serve')->where('path', '.*');

});