<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QuizService;
use App\Models\Quiz;
use App\Models\Response;
use App\Models\Answer;

class QuizController extends Controller {

    public function __construct(QuizService $quizService) {
        $this->quizService = $quizService;

        $this->middleware("auth.jwt")->only([
            "getMine",
            "create",
            "editDetails",
            "delete",
            "publish",
            "unpublish",
            "saveQuestions"
        ]);
    }

    public function getAll() {

        $limit = request()->query("limit", 12);
        $quizzes = $this->quizService->getAll($limit);

        return response()->json([
            'success' => true,
            ...$quizzes
        ], 200);
    }

    public function getMine() {

        $limit = request()->query("limit", 12);
        $quizzes = $this->quizService->getMyQuizzes($limit);

        return response()->json([
            'success' => true,
            ...$quizzes
        ], 200);
    }

    public function getOthers() {

        $limit = request()->query("limit", 12);
        $quizzes = $this->quizService->getOtherQuizzes($limit);

        return response()->json([
            'success' => true,
            ...$quizzes
        ], 200);
    }

    public function get(string $id) {

        // validate if id is a uuid
        if (!preg_match('/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i', $id)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid id'
            ], 400);
        }
            
        $quiz = $this->quizService->get($id);

        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quiz found',
            'quiz' => $quiz
        ], 200);
    }

    public function create() {

        if ($errors = $this->validate(request(), [
            'title' => Quiz::$rules['title'],
            'thumbnail' => Quiz::$rules['thumbnail'],
            'visibility' => Quiz::$rules['visibility']
        ])) {
            return $errors;
        }

        $quiz = $this->quizService->create();

        return response()->json([
            'success' => true,
            'message' => 'Quiz created',
            'quiz' => $quiz
        ], 201);
    }

    public function editDetails() {
        
        if ($errors = $this->validate(request(), [
            'title' => Quiz::$rules['title'],
            'thumbnail' => Quiz::$rules['thumbnail'],
            'visibility' => Quiz::$rules['visibility']
        ])) {
            return $errors;
        }

        if ($this->quizService->editDetails()) {
            return response()->json([
                'success' => true,
                'message' => 'Quiz details edited'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to edit quiz details'
        ]);
    }

    public function delete() {
            
        if ($this->quizService->delete()) {
            return response()->json([
                'success' => true,
                'message' => 'Quiz deleted'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to delete quiz'
        ], 400);
    }

    public function publish() {

        $quiz = Quiz::find(request("quiz_id"));
        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found'
            ], 404);
        }

        if ($quiz->owner_id !== auth()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        if ($quiz->questions->count() < 1) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz must have at least 1 question'
            ], 400);
        }

        $this->quizService->publish();
        return response()->json([
            'success' => true,
            'message' => 'Quiz published'
        ]);

    }

    public function unpublish() {

        if ($this->quizService->unpublish()) {
            return response()->json([
                'success' => true,
                'message' => 'Quiz unpublished'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to unpublish quiz'
        ], 400);

    }

    public function saveQuestions() {
            
        // skip validation assume everything correct

        $quizId = request()->route('id');
        $quiz = Quiz::query()->find($quizId);
        
        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found'
            ], 404);
        }

        if ($quiz->owner->id !== auth()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $prevId = null;
        $questionIds = [];
        $questions = [];
        foreach (request()->input('questions') as $question) {
            $qnId = $question['id'];
            if (str_contains($qnId, 'local$')) {
                $qnId = str_replace('local$', '', $qnId);
                $qn = $quiz->questions()->create([
                    "prev_question" => $prevId,
                    ...$question
                ]);
                $prevId = $qn->id;
                $questionIds[] = $qn->id;
                $questions[] = $qn;
            } else {
                $qn = $quiz->questions()->find($qnId);
                $qn->update([
                    "prev_question" => $prevId,
                    ...$question
                ]);
                $prevId = $qn->id;
                $questionIds[] = $qn->id;
                $questions[] = $qn;
            }
        }

        $quiz->questions()->whereNotIn('id', $questionIds)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Questions saved',
            'questions' => $questions
        ]);
    }

    public function submitResponse() {
        $quizId = request()->route('id');
        $quiz = Quiz::query()->find($quizId);
        
        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not found'
            ], 404);
        }

        if (!$quiz->published) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not published, cannot submit response'
            ], 400);
        }

        $response = Response::create([
            'quiz_id' => $quizId,
            'score' => 0
        ]);

        $responseId = $response->id;
        $questions = $this->quizService->getQuestions($quiz);
        $answers = request('answers');

        if (count($questions) !== count($answers)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid number of answers'
            ], 400);
        }

        foreach ($questions as $index => $question) {
            $answer = $answers[$index];
            if ($answer === null) {
                $correct = false;
            } else {
                if ($question->type === 'mcq') {
                    $correct = in_array($answer, $question->answers);
                } else {
                    $correct = false;
                    foreach ($question->answers as $regex) {
                        if (preg_match($regex, $answer)) {
                            $correct = true;
                            break;
                        }
                    }
                }
            }
            if ($correct) $response->increment('score');
            Answer::create([
                'response_id' => $responseId,
                'question_id' => $question['id'],
                'answer' => $answer,
                'correct' => $correct
            ]);
            $answers[$index] = [
                'answer' => $answer,
                'correct' => $correct
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Response submitted',
            'score' => $response->score,
            'answers' => $answers
        ]);
    }
}
