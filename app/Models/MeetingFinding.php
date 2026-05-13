<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeetingFinding extends Model
{
    protected $fillable = [
        'meeting_id',
        'permasalahan',
        'pembahasan',
        'kondisi',
        'penyebab',
        'tindak_lanjut',
        'kategori',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
