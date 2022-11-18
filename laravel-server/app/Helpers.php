<?php

namespace App;

class Helpers {

  /**
   * Get an associative array of info about the given base64 encoded image
   * 
   * @param string $img The base64 encoded image
   * @return array[
   *  'input' => string,
   *  'contents' => string,
   *  'ext' => string,
   *  'size' => int
   * ]
   */
  public static function getB64ImageInfo(string $img) {
    $parts = explode(';base64,', $img);
    $ext = explode('image/', $parts[0])[1];
    $size = strlen(base64_decode($img));
    return [
      'input' => $img,
      'contents' => base64_decode($parts[1]),
      'ext' => $ext,
      'size' => $size
    ];
  }
}