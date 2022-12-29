<?php

namespace App\Services;

use App\Models\Quiz;

class QuizService {

  /**
   * Get all quizzes
   *
   * @return array[
   *  'next_page' => string,
   *  'prev_page' => string,
   *  'quizzes' => array[ Quiz ],
   *  'total_pages' => int,
   *  'current_page' => int
   * ]
   */
  public function getAll() {

    $quizzes = Quiz::where("visibility", "public")
      ->whereNotNull("owner_id")
      ->paginate(12);

    return [
      "next_page" => $quizzes->nextPageUrl(),
      "prev_page" => $quizzes->previousPageUrl(),
      "quizzes" => $quizzes->items(),
      "total_pages" => $quizzes->lastPage(),
      "current_page" => $quizzes->currentPage()
    ];

  }

}
