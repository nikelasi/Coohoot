<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QuizService;
use App\Models\Quiz;

class QuizController extends Controller {

    public function __construct(QuizService $quizService) {
        $this->quizService = $quizService;

        $this->middleware("auth.jwt")->only([
            "getMine",
            "create",
            "editDetails",
            "delete",
            "publish",
            "unpublish"
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

        if ($this->quizService->publish()) {
            return response()->json([
                'success' => true,
                'message' => 'Quiz published'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to publish quiz'
        ], 400);

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

}
