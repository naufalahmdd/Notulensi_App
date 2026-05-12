// @ts-nocheck
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, CheckSquare, FileText, Save, Users } from 'lucide-react';

// Atur toolbar untuk React Quill (opsional tapi bikin keren)
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'table'],
        ['clean'],
    ],
};

export default function Minutes({ meeting, minute, actionItems }) {
    // Siapkan form Inertia. Jika notulensi sudah ada sebelumnya, tampilkan. Jika belum, kosongkan.
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        main_content: minute?.main_content || '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Kirim data ke route yang sudah kita buat di web.php
        post(route('meetings.minutes.save', meeting.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Notulensi - ${meeting.title}`} />

            <div className="w-full px-5 py-6">
                {/* Bagian Header Atas */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Editor Notulensi</h1>
                        <p className="text-sm">
                            Status Rapat: <Badge variant="outline">{meeting.status}</Badge>
                        </p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Button asChild variant="outline">
                            <Link href={`/meetings/${meeting.id}`}>
                                <ArrowLeft /> Kembali
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={route('meetings.export', meeting.id)} target="_blank" rel="noopener noreferrer">
                                <FileText /> Export Word
                            </a>
                        </Button>
                    </div>
                </div>

                {/* IMPLEMENTASI GRID TAILWIND (Kiri 250px, Kanan sisa layar) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
                    {/* ================= KOLOM KIRI (SIDEBAR) ================= */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base">Informasi Rapat</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 text-sm">
                                <p className="font-semibold">{meeting.title}</p>
                                <p className="mt-1">{new Date(meeting.start_time).toLocaleDateString('id-ID')}</p>
                                <Badge className="mt-2">{meeting.type}</Badge>
                            </CardContent>
                        </Card>

                        {/* Menu Navigasi Cepat (Hanya UI / Visualisasi) */}
                        <Card>
                            <CardContent className="p-2">
                                <nav className="flex flex-col space-y-1">
                                    <Button variant="ghost" className="justify-start">
                                        <FileText /> Teks Notulensi
                                    </Button>
                                    <Button variant="ghost" className="justify-start">
                                        <CheckSquare className="mr-2 h-4 w-4" /> Tindak Lanjut ({actionItems?.length || 0})
                                    </Button>
                                    <Button variant="ghost" className="justify-start">
                                        <Users className="mr-2 h-4 w-4" /> Daftar Hadir
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ================= KOLOM KANAN (EDITOR UTAMA) ================= */}
                    <div>
                        <Card className="flex h-full min-h-[600px] flex-col">
                            <form onSubmit={submit} className="flex h-full flex-col">
                                <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
                                    <div>
                                        <CardTitle className="text-lg">Catatan Rapat</CardTitle>
                                        <CardDescription>Ketik hasil pembahasan rapat di sini</CardDescription>
                                    </div>
                                    <Button type="submit" size="sm" disabled={processing}>
                                        <Save />
                                        {processing ? <Spinner /> : 'Simpan Draft'}
                                    </Button>
                                </CardHeader>

                                <CardContent className="flex-grow p-0">
                                    {/* Notifikasi jika sukses */}
                                    {recentlySuccessful && (
                                        <div className="bg-green-100 p-2 text-center text-sm text-green-700">Notulensi berhasil disimpan!</div>
                                    )}

                                    {/* REACT QUILL EDITOR */}
                                    {/* Custom CSS class "editor-container" agar tinggi editornya full */}
                                    <div className="h-[500px]">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.main_content}
                                            onChange={(value) => setData('main_content', value)}
                                            modules={modules}
                                            className="h-full"
                                            placeholder="Mulai mengetik notulensi..."
                                        />
                                    </div>
                                </CardContent>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sedikit trik CSS agar editor Quill memenuhi ruang container-nya */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .ql-container { font-size: 16px; height: calc(100% - 42px); }
                .ql-editor { min-height: 100%; }
            `,
                }}
            />
        </AppLayout>
    );
}
