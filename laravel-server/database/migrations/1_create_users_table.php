<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Users
 * 
 * id         - uuid      - The user's ID
 * username   - string    - The user's username
 * email      - string    - The user's email
 * password   - string    - The user's password hash
 * pfp_url    - string    - The user's profile picture URL
 * verified   - bool      - Whether the user's email is verified
 * created_at - timestamp - The time the user was created
 * updated_at - timestamp - The time the user was last updated
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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('pfp_url')->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
