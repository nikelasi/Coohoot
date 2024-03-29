<?php

namespace App\Services;

use GoogleDriveService;

use App\Models\Quiz;
use App\Models\Question;

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
      ->when(request()->query("search"), function($query) {
        $query->where("title", "like", "%" . request()->query("search") . "%");
      })
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
      ->when(request()->query("search"), function($query) {
        $query->where("title", "like", "%" . request()->query("search") . "%");
      })
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
   * Get all quizzes created by the requested user
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
  public function getOtherQuizzes(int $limit = 12) {

    $quizzes = Quiz::whereRelation("owner", "username", request()->route("username"))
      ->where("visibility", "public")
      ->where("published", true)
      ->with("owner:id,username,pfp_url")
      ->when(request()->query("search"), function($query) {
        $query->where("title", "like", "%" . request()->query("search") . "%");
      })
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

    $quiz = Quiz::where("id", $id)
      ->where(function($query) {
        $query->where("visibility", "!=", "private")
          ->where("published", true)
          ->when(auth()->user(), function($query) {
            $query->orWhere("owner_id", auth()->user()->id);
          });
      })
      ->whereNotNull("owner_id")
      ->with("owner:id,username,pfp_url")
      ->first();

    if (!$quiz) {
      return null;
    }
    
    $questions = $this->getQuestions($quiz);
    if (auth()->user() && $quiz->owner_id !== auth()->user()->id) {
      $quiz->questions = array_map(function($question) {
        return [
          "question" => $question->question,
          "time" => $question->time,
          "type" => $question->type,
          "options" => $question->options,
          "image_url" => $question->image_url
        ];
      }, $questions);
    } else {
      $quiz->questions = array_map(function ($question) {
        return [
          "id" => $question->id,
          "time" => $question->time,
          "type" => $question->type,
          "question" => $question->question,
          "options" => $question->options,
          "image_url" => $question->image_url,
          "answers" => $question->answers,
          "responses" => array_map(function ($answer) use ($question) {
            $correct = $answer["correct"];
            $answer = $answer["answer"];
            if ($answer) {
              if ($question->type === "mcq") {
                $answer = array_values(array_filter($question->options, function ($option) use ($answer) {
                  return $option["id"] === $answer;
                }))[0]["value"];
              }
            }
            return [
              "answer" => $answer,
              "correct" => $correct,
            ];
          }, $question->answers()->get()->toArray())
        ];
      }, $questions);
      $quiz->average_score = $quiz->responses()->avg("score");
      $quiz->total_responses = $quiz->responses()->count();
    }
    
    return $quiz;
  }

  /**
   * Creates a quiz and returns the created quiz
   * 
   * @return Quiz
   */
  public function create() {

    $thumbnail_url = $this->drive->uploadQuizThumbnail(request("thumbnail_url"));

    return Quiz::create([
      "owner_id" => auth()->user()->id,
      ...request()->only([
        "title",
        "description",
        "visibility"
      ]),
      "thumbnail_url" => $thumbnail_url
    ]);
  }

  /**
   * Edit a quiz's details
   * 
   * @return boolean whether it was edited or not
   */
  public function editDetails() {
    $quiz = Quiz::find(request()->route("id"));
    if ($quiz->owner_id !== auth()->user()->id) {
      return false;
    }
    $thumbnail_url = $quiz->thumbnail_url;
    if (request("thumbnail_url")) {
      $thumbnail_url = $this->drive->uploadQuizThumbnail(request("thumbnail_url"));
    }
    $quiz->update([
      ...request()->only([
        "title",
        "description",
        "visibility"
      ]),
      "thumbnail_url" => $thumbnail_url
    ]);
    return true;
  }

  /**
   * Deletes a quiz
   * 
   * @return boolean whether it was deleted
   */
  public function delete() {
    $quiz = Quiz::find(request()->route("id"));
    if ($quiz->owner_id !== auth()->user()->id) {
      return false;
    }
    $quiz->delete();
    return true;
  }

  /**
   * Publishes a quiz, checks whether it can be published
   */
  public function publish() {
    $quiz = Quiz::find(request("quiz_id"));
    $quiz->published = true;
    $quiz->save();
  }

  /**
   * Unpublishes a quiz
   * 
   * @return boolean whether it was unpublished
   */
  public function unpublish() {
    $quiz = Quiz::find(request("quiz_id"));
    if ($quiz->owner_id !== auth()->user()->id) {
      return false;
    }
    // TODO: delete responses
    $quiz->published = false;
    $quiz->save();
    return true;
  }

  /**
   * Gets all questions for a quiz
   * 
   * @param Quiz $quiz
   * 
   * @return array[ Question ]
   */
  public function getQuestions(Quiz $quiz) {

    $prevId = null;
    $questions = [];

    while (true) {
      $question = Question::where("quiz_id", $quiz->id)
        ->where("prev_question", $prevId)
        ->first();
      if (!$question) {
        break;
      }
      $questions[] = $question;
      $prevId = $question->id;
    }

    return $questions;
    
  }

}
