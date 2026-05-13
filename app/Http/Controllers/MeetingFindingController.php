<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingFinding;
use Illuminate\Http\Request;

class MeetingFindingController extends Controller
{
    public function store(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'permasalahan' => 'required|string',
            'pembahasan' => 'nullable|string',
            'kondisi' => 'nullable|string',
            'penyebab' => 'nullable|string',
            'tindak_lanjut' => 'required|string',
            'kategori' => 'nullable|string|max:255',
        ]);

        $meeting->meetingFindings()->create($validated);

        return back()->with('success', 'Temuan berhasil ditambahkan!');
    }

    public function update(Request $request, MeetingFinding $finding)
    {
        $validated = $request->validate([
            'permasalahan' => 'required|string',
            'pembahasan' => 'nullable|string',
            'kondisi' => 'nullable|string',
            'penyebab' => 'nullable|string',
            'tindak_lanjut' => 'required|string',
            'kategori' => 'nullable|string|max:255',
        ]);

        $finding->update($validated);

        return back()->with('success', 'Temuan berhasil diperbarui!');
    }

    public function destroy(MeetingFinding $finding)
    {
        $finding->delete();

        return back()->with('success', 'Temuan berhasil dihapus!');
    }
}
