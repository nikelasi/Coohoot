<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Quizzes
 *
 * id            - uuid      - The quiz's ID
 * owner_id      - uuid      - The quiz's owner id
 * title         - string    - The quiz's title
 * description   - string    - The quiz's description
 * thumbnail_url - string    - The quiz's thumbnail URL
 * visibility    - enum      - The quiz's visibility ( public, private, or unlisted )
 * created_at    - timestamp - The time the quiz was created
 * updated_at    - timestamp - The time the quiz was last updated
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("owner_id")->nullable();
            $table->string("title");
            $table->string("description")->nullable();
            $table->string("thumbnail_url")->nullable();
            $table->enum("visibility", ["public", "private", "unlisted"])->default("public");
            $table->boolean("published")->default(false);
            $table->timestamps();
            
            $table->foreign("owner_id")->references("id")->on("users")->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quizzes');
    }
};
