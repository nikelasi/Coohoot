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
   *  'data' => array[ Quiz ],
   *  'total_pages' => int,
   *  'current_page' => int
   * ]
   */
  public function getAll(int $limit = 12) {

    $quizzes = Quiz::where("visibility", "public")
      ->whereNotNull("owner_id")
      ->with("owner:id,username,pfp_url")
      ->paginate($limit);

    return [
      "next_page" => $quizzes->nextPageUrl(),
      "prev_page" => $quizzes->previousPageUrl(),
      "data" => $quizzes->items(),
      "total_pages" => $quizzes->lastPage(),
      "current_page" => $quizzes->currentPage(),
      "per_page" => $quizzes->perPage()
    ];

  }

  /**
   * Get a quiz by id
   * 
   * @param string $id
   * @return Quiz
   */
  public function get(string $id) {

    return Quiz::where("id", $id)
      ->where("visibility", "!=", "private")
      ->whereNotNull("owner_id")
      ->with("owner:id,username,pfp_url")
      ->first();
    
  }

}
