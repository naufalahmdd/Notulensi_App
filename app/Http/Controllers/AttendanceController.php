<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    // 1. Menampilkan Halaman Form Absen Publik
    public function create(Meeting $meeting)
    {
        return Inertia::render('attendances/create', [
            'meeting' => $meeting
        ]);
    }

    // 2. Menyimpan Data Absen & Mengubah Base64 ke Gambar
    public function store(Request $request, Meeting $meeting)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'status' => 'required|in:Hadir,Izin,Sakit,Tugas Luar',
            'signature' => 'nullable|string',
        ]);

        $signaturePath = null;

        if ($request->status === 'Hadir' && $request->signature) {
            $image_parts = explode(";base64,", $request->signature);
            $image_base64 = base64_decode($image_parts[1]);

            $fileName = 'signatures/absen_' . $meeting->id . '_' . uniqid() . '.png';

            Storage::disk('public')->put($fileName, $image_base64);

            $signaturePath = $fileName;
        }

        Attendance::create([
            'meeting_id' => $meeting->id,
            'name' => $request->name,
            'position' => $request->position,
            'status' => $request->status,
            'signature_path' => $signaturePath,
        ]);

        return back()->with('message', 'Terima kasih, absensi Anda berhasil disimpan!');
    }
}
