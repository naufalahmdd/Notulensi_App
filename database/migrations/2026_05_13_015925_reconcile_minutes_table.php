<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE minutes CHANGE main_content opening_speech LONGTEXT NULL');
        Schema::table('minutes', function (Blueprint $table) {
            $table->longText('closing_statement')->nullable()->after('opening_speech');
        });
    }

    public function down(): void
    {
        Schema::table('minutes', function (Blueprint $table) {
            $table->dropColumn('closing_statement');
        });
        DB::statement('ALTER TABLE minutes CHANGE opening_speech main_content LONGTEXT NULL');
    }
};
