<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'name',
        'position', 
        'status',
        'signature_path',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
