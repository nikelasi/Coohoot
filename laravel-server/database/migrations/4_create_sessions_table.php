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
        Schema::create('sessions', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("owner_id")->nullable();
            $table->string("title");
            $table->string("description")->nullable();
            $table->string("thumbnail_url")->nullable();
            $table->enum("visibility", ["public", "private", "unlisted"])->default("public");
            $table->enum("type", ["realtime", "asynchronous"])->default("asynchronous");
            $table->boolean("published")->default(true);
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
        Schema::dropIfExists('sessions');
    }
};
