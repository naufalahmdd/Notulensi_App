<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Minute extends Model
{
    use HasFactory;

    // Tambahkan baris ini untuk mengizinkan Laravel menyimpan data ke kolom-kolom ini
    protected $fillable = [
        'meeting_id',
        'main_content',
        'items', // Tambahkan ini jika Anda nanti butuh menyimpan JSON items
    ];

    // Sekalian pastikan Anda punya relasi balik ke Meeting
    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
