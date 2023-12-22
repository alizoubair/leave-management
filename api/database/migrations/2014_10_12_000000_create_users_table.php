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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('cin');
            $table->string('genre');
            $table->string('role');
            $table->string('date_naissance');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');
            $table->string('image', 2048)->nullable();
            $table->integer('score')->default('22');
            $table->boolean('verifie');
            $table->boolean('user_active');
            $table->foreignId('departement_id')
                  ->constrained()
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->string('poste');      
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
