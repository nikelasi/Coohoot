<?php

use App\Models\Quiz;

class SessionService {

  public function __constuct() {

  }

  public function create() {
    $quiz = Quiz::find(request()->quiz_id);
    
  }

}