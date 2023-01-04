<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QuizService;

class QuizController extends Controller {

    public function __construct(QuizService $quizService) {
        $this->quizService = $quizService;

        $this->middleware("auth.jwt")->only([
            "getMine"
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

        // TODO: validate request

        $quiz = $this->quizService->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Quiz created',
            'quiz' => $quiz
        ], 201);
    }

}
