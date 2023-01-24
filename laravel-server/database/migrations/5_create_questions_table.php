<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quiz_id');
            $table->uuid('prev_question');
            $table->enum('type', ['mcq', 'msq', 'short-answer']);
            $table->string('image_url');
            $table->longText('qn_content');
            $table->longText('ans_content');
            
            $table->foreign('quiz_id')->references('id')->on('quizzes');
        });

        Schema::update('questions', function (Blueprint $table) {
            $table->foreign('prev_question')->references('id')->on('questions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
};
