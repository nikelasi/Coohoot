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
            $table->uuid('prev_question')->nullable();
            $table->integer('time')->default(30);
            $table->enum('type', ['mcq', 'msq', 'short-answer']);
            $table->string('image_url');
            $table->string('question');
            $table->json('options')->nullable();
            $table->json('answers');
            
            $table->foreign('quiz_id')->references('id')->on('quizzes');
        });        

        Schema::table('questions', function (Blueprint $table) {
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
