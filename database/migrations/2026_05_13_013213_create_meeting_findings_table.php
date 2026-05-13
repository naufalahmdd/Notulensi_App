<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meeting_findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->onDelete('cascade');
            $table->text('permasalahan');           // Permasalahan / Temuan
            $table->text('pembahasan')->nullable(); // Pembahasan
            $table->text('kondisi')->nullable();  // Kondisi (Ada/Tidak Ada/Berjalan)
            $table->text('penyebab')->nullable();      // Penyebab
            $table->text('tindak_lanjut');    // Tindak Lanjut / Rekomendasi
            $table->string('kategori')->nullable(); // Misal: 'PTIP', 'Hukum', 'Sekretariat'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_findings');
    }
};
