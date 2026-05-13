<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;

class MeetingController extends Controller
{
    // 1. Menampilkan daftar rapat (Read)
    public function index()
    {
        // Mengambil data rapat terbaru
        $meetings = Meeting::latest()->get();

        return Inertia::render('meetings/index', [
            'meetings' => $meetings
        ]);
    }

    // 2. Menampilkan form tambah rapat (Create)
    public function create()
    {
        return Inertia::render('meetings/create');
    }

    // 3. Menyimpan data rapat ke database (Store)
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'location' => 'required|string|max:255',
            'leader_name' => 'required|string|max:255',
            'notary_name' => 'required|string|max:255',
            'type' => 'required|in:BULANAN,TINDAK_LANJUT,HAWASBID,MONEV_PTIP',
        ]);

        Meeting::create($validated);

        // Redirect kembali ke halaman index dengan pesan sukses
        return redirect()->route('meetings.index')->with('message', 'Rapat berhasil dibuat!');
    }

    // 4. Menghapus data rapat (Delete)
    public function destroy(Meeting $meeting)
    {
        // Hapus data dari database
        $meeting->delete();

        // Redirect kembali ke halaman index dengan pesan sukses
        return redirect()->route('meetings.index')->with('message', 'Data rapat berhasil dihapus!');
    }

    // 5. Menampilkan form edit (Edit)
    public function edit(Meeting $meeting)
    {
        // Kirim data rapat yang dipilih ke halaman Edit
        return Inertia::render('meetings/edit', [
            'meeting' => $meeting
        ]);
    }

    // 6. Menyimpan perubahan data ke database (Update)
    public function update(Request $request, Meeting $meeting)
    {
        // Validasi input sama seperti saat Create
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'location' => 'required|string|max:255',
            'leader_name' => 'required|string|max:255',
            'notary_name' => 'required|string|max:255',
            'type' => 'required|in:BULANAN,TINDAK_LANJUT,HAWASBID,MONEV_PTIP',
        ]);

        // Update data di database
        $meeting->update($validated);

        // Redirect kembali dengan pesan sukses
        return redirect()->route('meetings.index')->with('message', 'Data rapat berhasil diperbarui!');
    }

    // Menampilkan halaman detail / isi notulensi
    public function show(Meeting $meeting)
    {
        return Inertia::render('meetings/show', [
            'meeting' => $meeting
        ]);
    }

    public function minutes(Meeting $meeting)
    {
        // Ambil data notulensi yang sudah ada (jika ada)
        $minute = $meeting->minute;

        // Ambil daftar tindak lanjut (Action Items)
        $actionItems = $meeting->actionItems()->latest()->get();

        // Ambil daftar temuan rapat
        $meetingFindings = $meeting->meetingFindings()->latest()->get();

        return Inertia::render('meetings/minutes', [
            'meeting' => $meeting,
            'minute' => $minute,
            'actionItems' => $actionItems,
            'meetingFindings' => $meetingFindings,
        ]);
    }

    public function exportWord(Meeting $meeting)
    {
        $meeting->load(['minute', 'meetingFindings']);

        $templateFile = match ($meeting->type) {
            'BULANAN' => 'template_bulanan.docx',
            'HAWASBID' => 'template_hawasbid.docx',
            'MONEV_PTIP' => 'template_monev_ptip.docx',
            default => 'template_tindak_lanjut.docx',
        };

        $path = storage_path('app/public/templates/' . $templateFile);

        if (!file_exists($path)) {
            abort(404, 'Template dokumen ' . $templateFile . ' tidak ditemukan.');
        }

        $template = new TemplateProcessor($path);
        $variables = $template->getVariables();

        $template->setValue('title', strtoupper($meeting->title));
        $template->setValue('date', \Carbon\Carbon::parse($meeting->start_time)->translatedFormat('j F Y'));
        $template->setValue('leader_name', $meeting->leader_name);
        $template->setValue('notary_name', $meeting->notary_name);
        $template->setValue('location', $meeting->location);

        $htmlContent = $meeting->minute?->opening_speech ?? '';

        if (!empty($htmlContent)) {
            $htmlContent = str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlContent);
            $cleanContent = strip_tags($htmlContent);
            $cleanContent = str_replace('&nbsp;', ' ', $cleanContent);
            $cleanContent = html_entity_decode($cleanContent, ENT_QUOTES, 'UTF-8');
            $cleanContent = htmlspecialchars($cleanContent, ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $cleanContent = str_replace("\n", '</w:t><w:br/><w:t>', $cleanContent);
        } else {
            $cleanContent = '';
        }

        $template->setValue('opening', $cleanContent);

        $findings = $meeting->meetingFindings;
        if ($findings->count() > 0 && in_array('no', $variables)) {
            $template->cloneRow('no', $findings->count());

            foreach ($findings as $i => $item) {
                $r = $i + 1;
                $template->setValue("no#{$r}", $r);
                $template->setValue("permasalahan#{$r}", htmlspecialchars((string) $item->permasalahan, ENT_XML1 | ENT_QUOTES, 'UTF-8'));
                $template->setValue("kondisi#{$r}", htmlspecialchars((string) $item->kondisi, ENT_XML1 | ENT_QUOTES, 'UTF-8'));
                $template->setValue("penyebab#{$r}", htmlspecialchars((string) $item->penyebab, ENT_XML1 | ENT_QUOTES, 'UTF-8'));
                $template->setValue("rekomendasi#{$r}", htmlspecialchars((string) $item->tindak_lanjut, ENT_XML1 | ENT_QUOTES, 'UTF-8'));
            }
        }

        $typeLabel = $meeting->type;
        $dateLabel = \Carbon\Carbon::parse($meeting->start_time)->format('Ymd');
        $tempFileName = "LHP_{$typeLabel}_{$dateLabel}.docx";
        $tempFilePath = storage_path('app/public/' . $tempFileName);

        $template->saveAs($tempFilePath);

        return response()->download($tempFilePath)->deleteFileAfterSend(true);
    }

    public function saveMinutes(Request $request, Meeting $meeting)
    {
        $request->validate([
            'opening_speech' => 'nullable|string',
            'closing_statement' => 'nullable|string',
        ]);

        $meeting->minute()->updateOrCreate(
            ['meeting_id' => $meeting->id],
            [
                'opening_speech' => $request->opening_speech,
                'closing_statement' => $request->closing_statement,
            ]
        );

        return back()->with('success', 'Notulensi berhasil disimpan!');
    }
}
