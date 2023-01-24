<?php

namespace App\Services;

use GoogleDriveService;

use App\Models\Quiz;

class QuizService {

  public function __construct(GoogleDriveService $drive) {
    $this->drive = $drive;
  }

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
      ->where("published", true)
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
   * Get all quizzes created by the authenticated user
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
  public function getMyQuizzes(int $limit = 12) {

    $quizzes = Quiz::where("owner_id", auth()->user()->id)
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
      ->where(function($query) {
        $query->where("visibility", "!=", "private")
          ->where("published", true);
      })
      ->when(auth()->user(), function($query) {
        $query->orWhere("owner_id", auth()->user()->id);
      })
      ->whereNotNull("owner_id")
      ->with("owner:id,username,pfp_url")
      ->first();
    
  }

  /**
   * Creates a quiz and returns the created quiz
   * 
   * @return Quiz
   */
  public function create() {
    $quiz = request([
      "title",
      "description",
      "visibility",
      "thumbnail_url"
    ]);

    $thumbnail_url = $this->drive->uploadQuizThumbnail($quiz["thumbnail_url"]);

    return Quiz::create([
      "owner_id" => auth()->user()->id,
      "title" => $quiz["title"],
      "description" => $quiz["description"],
      "visibility" => $quiz["visibility"],
      "thumbnail_url" => $thumbnail_url
    ]);
  }

  /**
   * Publishes a quiz, checks whether it can be published
   * 
   * @return boolean whether it was published
   */
  public function publish() {
    $quiz = Quiz::find(request()->quiz_id);
    // TODO: validate quiz
    $quiz->published = true;
    $quiz->save();
    return true;
  }

}
