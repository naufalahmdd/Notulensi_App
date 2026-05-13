// @ts-nocheck
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, CheckSquare, Edit3, FileText, Plus, Save, Trash2 } from 'lucide-react';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'table'],
        ['clean'],
    ],
};

const KATEGORI_OPTIONS = ['PTIP', 'Hukum', 'Sekretariat', 'Kepegawaian', 'Keuangan', 'Umum', 'Lainnya'];

const CONFIG = {
    BULANAN: {
        opening: { title: 'Bab I: Bahasan Materi Rapat', desc: 'Hasil monitoring dan evaluasi bulanan' },
        findings: { title: 'Bab II: Temuan', desc: 'Daftar temuan dan tindak lanjut' },
        closing: null,
    },
    HAWASBID: {
        opening: { title: 'Bab I: Pendahuluan', desc: 'Latar belakang dan dasar pengawasan' },
        findings: { title: 'Bab II: Uraian Hasil Pemeriksaan', desc: 'Temuan hasil pengawasan bidang' },
        closing: { title: 'Bab III: Kesimpulan & Rekomendasi', desc: 'Kesimpulan dan saran tindak lanjut' },
    },
    MONEV_PTIP: {
        opening: { title: 'Pembahasan', desc: 'Monitoring dan evaluasi PTIP' },
        findings: { title: 'Data Temuan & Tindak Lanjut', desc: 'Temuan monitoring dan evaluasi' },
        closing: null,
    },
    TINDAK_LANJUT: {
        opening: { title: 'Bab I: Bahasan', desc: 'Pembahasan tindak lanjut temuan' },
        findings: { title: 'Bab II: Temuan & Tindak Lanjut', desc: 'Daftar temuan dan status tindak lanjut' },
        closing: null,
    },
};

export default function Minutes({ meeting, minute, actionItems, meetingFindings }) {
    const cfg = CONFIG[meeting.type] || CONFIG.BULANAN;

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        opening_speech: minute?.opening_speech || '',
        closing_statement: minute?.closing_statement || '',
    });

    const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
    const [editingFinding, setEditingFinding] = useState(null);
    const [findingForm, setFindingForm] = useState({
        permasalahan: '',
        kondisi: '',
        penyebab: '',
        tindak_lanjut: '',
        kategori: '',
    });
    const [findingSubmitting, setFindingSubmitting] = useState(false);
    const [findingMsg, setFindingMsg] = useState('');

    const resetFindingForm = () => {
        setFindingForm({ permasalahan: '', kondisi: '', penyebab: '', tindak_lanjut: '', kategori: '' });
        setEditingFinding(null);
    };

    const openAddFinding = () => {
        resetFindingForm();
        setIsFindingModalOpen(true);
    };

    const openEditFinding = (finding) => {
        setEditingFinding(finding);
        setFindingForm({
            permasalahan: finding.permasalahan,
            kondisi: finding.kondisi || '',
            penyebab: finding.penyebab || '',
            tindak_lanjut: finding.tindak_lanjut,
            kategori: finding.kategori || '',
        });
        setIsFindingModalOpen(true);
    };

    const handleFindingSubmit = () => {
        setFindingSubmitting(true);
        const formData = { ...findingForm };

        if (editingFinding) {
            router.put(route('findings.update', editingFinding.id), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsFindingModalOpen(false);
                    resetFindingForm();
                    setFindingMsg('Temuan berhasil diperbarui!');
                    setFindingSubmitting(false);
                    setTimeout(() => setFindingMsg(''), 3000);
                },
                onError: () => setFindingSubmitting(false),
            });
        } else {
            router.post(route('meetings.findings.store', meeting.id), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsFindingModalOpen(false);
                    resetFindingForm();
                    setFindingMsg('Temuan berhasil ditambahkan!');
                    setFindingSubmitting(false);
                    setTimeout(() => setFindingMsg(''), 3000);
                },
                onError: () => setFindingSubmitting(false),
            });
        }
    };

    const handleDeleteFinding = (finding) => {
        if (!confirm('Hapus temuan ini?')) return;
        router.delete(route('findings.destroy', finding.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setFindingMsg('Temuan berhasil dihapus!');
                setTimeout(() => setFindingMsg(''), 3000);
            },
        });
    };

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('meetings.minutes.save', meeting.id), { preserveScroll: true });
    };

    const hasOpening = true;
    const hasFindings = cfg.findings !== null;
    const hasClosing = cfg.closing !== null;

    return (
        <AppLayout>
            <Head title={`Notulensi - ${meeting.title}`} />

            <div className="w-full px-5 py-6">
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
                    {/* ================= SIDEBAR ================= */}
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

                        <Card>
                            <CardContent className="p-2">
                                <nav className="flex flex-col space-y-1">
                                    <Button variant="ghost" className="justify-start" onClick={() => scrollTo('section-opening')}>
                                        <FileText /> {cfg.opening.title}
                                    </Button>
                                    {hasFindings && (
                                        <Button variant="ghost" className="justify-start" onClick={() => scrollTo('section-findings')}>
                                            <CheckSquare /> {cfg.findings.title} ({meetingFindings?.length || 0})
                                        </Button>
                                    )}
                                    {hasClosing && (
                                        <Button variant="ghost" className="justify-start" onClick={() => scrollTo('section-closing')}>
                                            <FileText /> {cfg.closing.title}
                                        </Button>
                                    )}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ================= MAIN CONTENT ================= */}
                    <div className="space-y-6">
                        <form onSubmit={submit}>
                            {/* SECTION: OPENING */}
                            <Card id="section-opening">
                                <CardHeader className="border-b px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{cfg.opening.title}</CardTitle>
                                            <CardDescription>{cfg.opening.desc}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {recentlySuccessful && (
                                        <div className="mb-3 rounded bg-green-100 p-2 text-center text-sm text-green-700">Notulensi berhasil disimpan!</div>
                                    )}
                                    <div className="h-[400px]">
                                        <ReactQuill
                                            theme="snow"
                                            value={data.opening_speech}
                                            onChange={(value) => setData('opening_speech', value)}
                                            modules={modules}
                                            className="h-full"
                                            placeholder="Ketik hasil pembahasan rapat..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SECTION: FINDINGS */}
                            {hasFindings && (
                                <Card id="section-findings" className="mt-6">
                                    <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
                                        <div>
                                            <CardTitle className="text-lg">{cfg.findings.title}</CardTitle>
                                            <CardDescription>{cfg.findings.desc}</CardDescription>
                                        </div>
                                        <Button type="button" size="sm" onClick={openAddFinding}>
                                            <Plus /> Tambah Temuan
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {findingMsg && (
                                            <div className="mb-3 rounded bg-green-100 p-2 text-center text-sm text-green-700">{findingMsg}</div>
                                        )}
                                        {(!meetingFindings || meetingFindings.length === 0) ? (
                                            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada temuan. Klik "Tambah Temuan" untuk menambahkan.</p>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12">No</TableHead>
                                                        <TableHead>Permasalahan</TableHead>
                                                        <TableHead>Kondisi</TableHead>
                                                        <TableHead>Penyebab</TableHead>
                                                        <TableHead>Tindak Lanjut</TableHead>
                                                        <TableHead>Kategori</TableHead>
                                                        <TableHead className="w-24">Aksi</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {meetingFindings.map((f, i) => (
                                                        <TableRow key={f.id}>
                                                            <TableCell className="align-top">{i + 1}</TableCell>
                                                            <TableCell className="max-w-[200px] whitespace-pre-wrap align-top">{f.permasalahan}</TableCell>
                                                            <TableCell className="max-w-[200px] whitespace-pre-wrap align-top">{f.kondisi}</TableCell>
                                                            <TableCell className="max-w-[200px] whitespace-pre-wrap align-top">{f.penyebab}</TableCell>
                                                            <TableCell className="max-w-[200px] whitespace-pre-wrap align-top">{f.tindak_lanjut}</TableCell>
                                                            <TableCell className="align-top">{f.kategori && <Badge variant="outline">{f.kategori}</Badge>}</TableCell>
                                                            <TableCell className="align-top">
                                                                <div className="flex gap-1">
                                                                    <Button type="button" variant="ghost" size="icon" onClick={() => openEditFinding(f)}>
                                                                        <Edit3 />
                                                                    </Button>
                                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteFinding(f)}>
                                                                        <Trash2 />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* SECTION: CLOSING */}
                            {hasClosing && (
                                <Card id="section-closing" className="mt-6">
                                    <CardHeader className="border-b px-4 py-3">
                                        <CardTitle className="text-lg">{cfg.closing.title}</CardTitle>
                                        <CardDescription>{cfg.closing.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="h-[300px]">
                                            <ReactQuill
                                                theme="snow"
                                                value={data.closing_statement}
                                                onChange={(value) => setData('closing_statement', value)}
                                                modules={modules}
                                                className="h-full"
                                                placeholder="Ketik kesimpulan dan rekomendasi..."
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* SAVE BUTTON */}
                            <div className="mt-6 flex justify-end">
                                <Button type="submit" size="lg" disabled={processing}>
                                    <Save />
                                    {processing ? <Spinner /> : 'Simpan Draft'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ================= FINDING DIALOG ================= */}
            <Dialog open={isFindingModalOpen} onOpenChange={setIsFindingModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingFinding ? 'Edit Temuan' : 'Tambah Temuan'}</DialogTitle>
                        <DialogDescription>
                            {editingFinding ? 'Ubah data temuan dan tindak lanjut.' : 'Masukkan data temuan baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="permasalahan">Permasalahan / Temuan</Label>
                            <textarea
                                id="permasalahan"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={findingForm.permasalahan}
                                onChange={(e) => setFindingForm({ ...findingForm, permasalahan: e.target.value })}
                                placeholder="Deskripsi permasalahan atau temuan"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="kondisi">Kondisi</Label>
                            <textarea
                                id="kondisi"
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={findingForm.kondisi}
                                onChange={(e) => setFindingForm({ ...findingForm, kondisi: e.target.value })}
                                placeholder="Kondisi saat ini (Ada/Tidak Ada/Berjalan)"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="penyebab">Penyebab</Label>
                            <textarea
                                id="penyebab"
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={findingForm.penyebab}
                                onChange={(e) => setFindingForm({ ...findingForm, penyebab: e.target.value })}
                                placeholder="Penyebab terjadinya temuan"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tindak_lanjut">Tindak Lanjut / Rekomendasi</Label>
                            <textarea
                                id="tindak_lanjut"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={findingForm.tindak_lanjut}
                                onChange={(e) => setFindingForm({ ...findingForm, tindak_lanjut: e.target.value })}
                                placeholder="Rekomendasi tindak lanjut"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="kategori">Kategori</Label>
                            <Select
                                value={findingForm.kategori}
                                onValueChange={(value) => setFindingForm({ ...findingForm, kategori: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {KATEGORI_OPTIONS.map((k) => (
                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsFindingModalOpen(false)}>Batal</Button>
                        <Button type="button" onClick={handleFindingSubmit} disabled={findingSubmitting}>
                            {findingSubmitting ? <Spinner /> : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
