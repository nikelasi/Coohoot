<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class ValidationServiceProvider extends ServiceProvider {
  /**
   * Register services.
   *
   * @return void
   */
  public function register() {}

  /**
   * Bootstrap services.
   *
   * @return void
   */
  public function boot() {

    Validator::extend(
      'b64max',
      'App\Validators\Base64ImageValidator@validateBase64Max',
      'The :attribute may not be greater than :max kilobytes.'
    );

    Validator::extend(
      'b64image',
      'App\Validators\Base64ImageValidator@validateBase64Image',
      'The :attribute must be an image.'
    );

    Validator::extend(
      'b64mimes',
      'App\Validators\Base64ImageValidator@validateBase64Mimes',
      'The :attribute must be a file of type: :values.'
    );

    // Set error messages
    Validator::replacer('base64max', function ($message, $attribute, $rule, $parameters, $validator) {
        return str_replace(':max', $parameters[0], $message);
    });

    Validator::replacer('base64image', function ($message, $attribute, $rule, $parameters, $validator) {
        return $message;
    });

    Validator::replacer('b64mimes', function ($message, $attribute, $rule, $parameters, $validator) {
        $msg = str_replace(':values', implode(',', $parameters), $message);
        $msg = str_replace(':attribute', $validator->getDisplayableAttribute($attribute), $msg);
        return $msg;
    });

  }
}
