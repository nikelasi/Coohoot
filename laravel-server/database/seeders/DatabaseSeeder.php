<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $user = new \App\Models\User();
        $user->username = "math";
        $user->email = "math@nj.sg";
        $user->password = \Hash::make("password");
        $user->pfp_url = "https://coohoot.nj.sg/cloud/default_pfp.png";
        $user->verified = true;
        $user->save();

        for ($i = 0; $i < 48; $i++) {
            $quiz = new \App\Models\Quiz();
            $quiz->title = "Math Qn " . $i;
            $quiz->thumbnail_url = "https://coohoot.nj.sg/cloud/default_thumbnail.png";
            $quiz->description = "This is quiz " . $i;
            $quiz->visibility = "public";
            $quiz->published = true;
            $quiz->owner_id = $user->id;
            $quiz->save();

            $num1 = rand(1, 100);
            $num2 = rand(1, 100);
            $sum = $num1 + $num2;

            $question = new \App\Models\Question();
            $question->quiz_id = $quiz->id;
            $question->question = "What is ".$num1." + ".$num2."?";
            $question->type = "short-answer";
            $question->time = 20;
            $question->image_url = null;
            $question->prev_question = null;
            $question->options = [];
            $question->answers = ["/^".$sum."$/"];
            $question->save();
        }
    }

}
