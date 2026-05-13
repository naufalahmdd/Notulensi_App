<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    // Tambahkan baris ini untuk mengizinkan kolom-kolom ini diisi dari form
    protected $fillable = [
        'title',
        'start_time',
        'location',
        'leader_name',
        'notary_name',
        'type',
    ];

    /**
     * Relasi ke Notulensi (Satu rapat punya satu notulensi)
     */
    public function minute()
    {
        return $this->hasOne(Minute::class); // Pastikan model Anda bernama Minute
    }

    /**
     * Relasi ke Tindak Lanjut / Action Items (Satu rapat bisa punya banyak tugas)
     */
    public function actionItems()
    {
        return $this->hasMany(ActionItem::class);
    }

    /**
     * Relasi ke Temuan Rapat (Satu rapat bisa punya banyak temuan)
     */
    public function meetingFindings()
    {
        return $this->hasMany(MeetingFinding::class);
    }
}
