<?php

namespace App\Services;

use App\Models\Quiz;

class QuizService {

  /**
   * Get all quizzes
   *
   * @param int $limit (default: 12)
   * @return array[
   *  'next_page' => string,
   *  'prev_page' => string,
   *  'quizzes' => array[ Quiz ],
   *  'total_pages' => int,
   *  'current_page' => int
   * ]
   */
  public function getAll(int $limit = 12) {

    $quizzes = Quiz::where("visibility", "public")
      ->whereNotNull("owner_id")
      ->paginate($limit);

    return [
      "next_page" => $quizzes->nextPageUrl(),
      "prev_page" => $quizzes->previousPageUrl(),
      "quizzes" => $quizzes->items(),
      "total_pages" => $quizzes->lastPage(),
      "current_page" => $quizzes->currentPage(),
      "per_page" => $quizzes->perPage()
    ];

  }

}
