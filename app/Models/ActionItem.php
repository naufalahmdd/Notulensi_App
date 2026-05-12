<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionItem extends Model
{
    use HasFactory;

    // Daftarkan kolom yang boleh diisi
    protected $fillable = [
        'meeting_id',
        'pic_name',
        'description',
        'deadline',
        'status',
    ];

    // Relasi balik ke Meeting
    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
