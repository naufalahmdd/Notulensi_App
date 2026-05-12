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

        return Inertia::render('meetings/minutes', [
            'meeting' => $meeting,
            'minute' => $minute,
            'actionItems' => $actionItems
        ]);
    }

    public function exportWord(Meeting $meeting)
    {
        // 1. Ambil relasi (notulensi & action items)
        $meeting->load(['minute', 'actionItems']);

        // 2. Pilih template berdasarkan tipe rapat
        $templateFile = match ($meeting->type) {
            'BULANAN' => 'template_bulanan.docx',
            'HAWASBID' => 'template_hawasbid.docx',
            'MONEV_PTIP' => 'template_monev_ptip.docx',
            default => 'template_tindak_lanjut.docx',
        };

        $path = storage_path('app/public/templates/' . $templateFile); // Sesuaikan folder

        // 3. Inisialisasi Template Processor
        $template = new TemplateProcessor($path);

        // 4. Isi variabel sederhana
        $template->setValue('title', $meeting->title);
        $template->setValue('date', date('d-m-Y', strtotime($meeting->start_time)));
        $template->setValue('leader_name', $meeting->leader_name);
        $template->setValue('notary_name', $meeting->notary_name);
        $template->setValue('location', $meeting->location);


        $htmlContent = $meeting->minute->main_content;

        // 1. Ubah tag paragraf/enter dari HTML menjadi Enter biasa (\n)
        $htmlContent = str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlContent);

        // 2. Buang semua tag HTML yang tersisa (seperti <strong>, <em>, dll)
        $cleanContent = strip_tags($htmlContent);

        // 3. BARU: Ubah &nbsp; menjadi spasi biasa dan decode entitas HTML lainnya
        $cleanContent = str_replace('&nbsp;', ' ', $cleanContent);
        $cleanContent = html_entity_decode($cleanContent, ENT_QUOTES, 'UTF-8');

        // 4. KUNCI ANTI CORRUPT: Ubah simbol &, <, > menjadi entitas XML yang aman
        $cleanContent = htmlspecialchars($cleanContent, ENT_XML1 | ENT_QUOTES, 'UTF-8');

        // 5. Ubah Enter (\n) menjadi tag line-break khusus Word (<w:br/>)
        $cleanContent = str_replace("\n", '</w:t><w:br/><w:t>', $cleanContent);

        // 6. Masukkan ke dalam template
        $template->setValue('content', $cleanContent);

        // 5. MENGISI TABEL (Untuk Monev/Hawasbid)
        if ($meeting->actionItems->count() > 0) {
            $template->cloneRow('no', $meeting->actionItems->count());

            foreach ($meeting->actionItems as $index => $item) {
                $row = $index + 1;
                $template->setValue('no#' . $row, $row);
                $template->setValue('bagian#' . $row, $item->pic_name);
                $template->setValue('kondisi#' . $row, $item->description);
                $template->setValue('rekomendasi#' . $row, $item->status);
            }
        }

        // 6. Simpan & Download
        $tempFileName = 'Notulensi_' . $meeting->id . '.docx';
        $tempFilePath = storage_path('app/public/' . $tempFileName);

        $template->saveAs($tempFilePath);

        return response()->download($tempFilePath)->deleteFileAfterSend(true);
    }

    public function saveMinutes(Request $request, Meeting $meeting)
    {
        // 1. Validasi input
        $request->validate([
            'main_content' => 'nullable|string',
        ]);

        // 2. Simpan ke database menggunakan updateOrCreate
        $meeting->minute()->updateOrCreate(
            ['meeting_id' => $meeting->id],
            ['main_content' => $request->main_content]
        );

        return back()->with('success', 'Notulensi berhasil disimpan!');
    }
}
