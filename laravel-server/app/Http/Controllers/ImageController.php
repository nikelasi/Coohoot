<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use GoogleDriveService;

class ImageController extends Controller {

    public function __construct(GoogleDriveService $gd) {
        $this->gd = $gd;
    }

    public function serve($path) {
        try {
            $url = $this->gd->getUrl($path);
        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "File not found."
            ], 404);
        }
        return redirect($url);
    }

    public function imageUrl(Request $request) {
        $path = $request->query('path');
        $url = $this->gd->getUrl($path);
        return response()->json([
            'path' => $path,
            'url' => $url
        ], 200);
    }
}
