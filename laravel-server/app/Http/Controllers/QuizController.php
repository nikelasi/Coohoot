<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\QuizService;

class QuizController extends Controller {

    public function __construct(QuizService $quizService) {
        $this->quizService = $quizService;
    }

    public function getAll() {
        $quizzes = $this->quizService->getAll();
        return response()->json([
            'success' => true,
            ...$quizzes
        ], 200);
    }

}
