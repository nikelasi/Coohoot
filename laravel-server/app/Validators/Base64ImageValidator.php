<?php

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Concerns\ValidatesAttributes;
use Symfony\Component\HttpFoundation\File\File;

class Base64ImageValidator {

  use ValidatesAttributes;

  public function validateBase64Image(string $attribute, $value, array $parameters, Validator $validator): bool {
    return !empty($value)
      ? $validator->validateImage($attribute, $this->convertToFile($value))
      : true;
  }

  public function validateBase64Mimes(string $attribute, $value, array $parameters, Validator $validator): bool {
    return !empty($value)
      ? $validator->validateMimes($attribute, $this->convertToFile($value), $parameters)
      : true;
  }

  public function validateBase64Max(string $attribute, $value, array $parameters, Validator $validator): bool {
    return !empty($value)
      ? $validator->validateMax($attribute, $this->convertToFile($value), $parameters)
      : true;
  }

  /**
   * Convert base64 image string to file
   *
   * @param string $base64Image
   * @return File
   */
  protected function convertToFile($base64Image) {
    if (!preg_match('/^data:image\/(\w+);base64,/', $base64Image)) {
      return null; // not a base64 image
    }
    [,$base64Image] = explode(';', $base64Image); // get rid of `data:image/*;`
    [,$base64Image] = explode(',', $base64Image); // get rid of `base64,`
    $binaryData = base64_decode($base64Image); // decode base64 image
    $tmpFilePath = tempnam(sys_get_temp_dir(), 'b64'); // create a temporary file at /tmp/b64*
    file_put_contents($tmpFilePath, $binaryData);
    return new File($tmpFilePath);
  }
}
