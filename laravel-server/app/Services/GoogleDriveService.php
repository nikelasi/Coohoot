<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class GoogleDriveService {

  public function __construct() {
    $this->disk = Storage::disk('google');
  }

  /**
   * Upload an image to Google Drive
   * 
   * @param string $img The base64 encoded image
   * @param string $ext The image extension
   * @return string The image URL
   */
  public function uploadImage(string $img, string $ext) {
    $img_id = Str::uuid()->toString();
    $path = "images/{$img_id}.{$ext}";
    $this->disk->put($path, base64_decode($contents));
    return $this->getMediaUrl($path);
  }

  /**
   * Get the media URL for a file
   * 
   * @param string $path The file path
   * @return string The media URL
   */
  protected function getMediaUrl(string $path) {
    return $this->disk->getAdapter()->getUrl($path);
  }

}