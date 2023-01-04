<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use Helpers;

class GoogleDriveService {

  public function __construct() {
    $this->disk = Storage::disk('google');
  }

  /**
   * Upload quiz thumbnail to Google Drive
   * 
   * @param string $base64image
   * @return string The image URL
   */
  public function uploadQuizThumbnail($base64image) {
    return $this->upload('quiz_thumbnails', 'default_quiz.png', $base64image);
  }

  /**
   * Upload profile picture to Google Drive
   * 
   * @param string $base64image
   * @return string The image URL
   */
  public function uploadPfp($base64image) {
    return $this->upload('pfp', 'default_pfp.png', $base64image);
  }

  /**
   * Abstraction to upload an image to Google Drive
   * 
   * @param string $path The path to upload the image to
   * @param string $default_image The default image to use if $base64image is empty
   * @param string $base64image The base64 encoded image
   */
  protected function upload($path, $default_image, $base64image) {
    if (!$base64image) {
      return "https://coohoot.nj.sg/cloud/{$default_image}";
    }

    ['ext' => $ext] = Helpers::getB64ImageInfo($base64image);
    $id = Str::uuid()->toString();
    $path = "{$path}/{$id}.{$ext}";
    return $this->uploadImage($path, $base64image);
  }

  /**
   * Upload an image to Google Drive
   * 
   * @param string $path The path to upload the image to
   * @param string $base64image The base64 encoded image
   * @return string The image URL
   */
  protected function uploadImage(string $path, string $base64image) {
    ['contents' => $contents] = Helpers::getB64ImageInfo($base64image);
    $this->disk->put($path, $contents);
    return "https://coohoot.nj.sg/cloud/".$path; // return $this->getMediaUrl($path);
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

  // Debug functions
  public function getUrl($path) {
    return $this->getMediaUrl($path);
  }

}