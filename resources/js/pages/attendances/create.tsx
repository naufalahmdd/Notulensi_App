import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Meeting } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function Create({ meeting }: { meeting: Meeting }) {
    const sigPad = useRef<SignatureCanvas | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        position: '',
        status: 'Hadir',
        signature: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');

        if (data.status === 'Hadir') {
            if (sigPad.current?.isEmpty()) {
                setErrorMsg('Mohon isi tanda tangan Anda.');
                return;
            }

            const signatureData = sigPad.current?.getCanvas().toDataURL('image/png');

            transform((currentData) => ({
                ...currentData,
                signature: signatureData,
            }));

            post(route('attendances.store', meeting.id), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('6. SUKSES!');
                    sigPad.current?.clear();
                    setIsSuccess(true);
                },
                onError: (errors) => {
                    console.error('6. GAGAL! Laravel menolak data:', errors);
                },
            });
        } else {
            transform((currentData) => ({
                ...currentData,
                signature: null,
            }));

            post(route('attendances.store', meeting.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSuccess(true);
                },
                onError: (errors) => {
                    console.error('GAGAL! Laravel menolak data:', errors);
                },
            });
        }
    };

    const clearSignature = () => {
        sigPad.current?.clear();
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
                <Head title={`Berhasil - ${meeting.title}`} />
                <div className="w-full max-w-md">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                            <CheckCircle2 className="mb-4 h-20 w-20 text-green-500" />
                            <CardTitle className="mb-2 text-2xl text-green-700">Absensi Berhasil!</CardTitle>
                            <CardDescription className="text-muted-foreground text-base">
                                Terima kasih, <span className="font-semibold">{data.name}</span>.<br />
                                Data kehadiran Anda untuk rapat <strong>{meeting.title}</strong> telah tersimpan di sistem.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Head title={`Absensi > ${meeting.title}`} />

            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Daftar Hadir</CardTitle>
                        <CardDescription className="mt-2 font-medium">{meeting.title}</CardDescription>
                        <p className="text-muted-foreground mt-1 text-xs">
                            {new Date(meeting.start_time).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="mb-2 block">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama..."
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Jabatan */}
                            <div>
                                <Label htmlFor="position" className="mb-2 block">
                                    Jabatan
                                </Label>
                                <Input
                                    id="position"
                                    type="text"
                                    placeholder="Contoh: Hakim Anggota, Panitera..."
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    required
                                />
                                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
                            </div>

                            {/* Status Kehadiran */}
                            <div>
                                <Label htmlFor="status" className="mb-2 block">
                                    Status Kehadiran
                                </Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Hadir">Hadir</SelectItem>
                                            <SelectItem value="Izin">Izin</SelectItem>
                                            <SelectItem value="Sakit">Sakit</SelectItem>
                                            <SelectItem value="Tugas Luar">Tugas Luar</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                            </div>

                            {/* Kanvas Tanda Tangan (Hanya muncul jika status "Hadir") */}
                            {data.status === 'Hadir' && (
                                <div className="pt-2">
                                    <div className="mb-2 flex items-center justify-between">
                                        <Label htmlFor="signature" className="mb-2 block">
                                            Tanda Tangan
                                        </Label>
                                        <button type="button" onClick={clearSignature} className="text-xs text-red-500 hover:text-red-700">
                                            Hapus Coretan
                                        </button>
                                    </div>
                                    <div className="border-border bg-muted overflow-hidden border-2 border-dashed">
                                        <SignatureCanvas
                                            ref={sigPad}
                                            penColor="black"
                                            canvasProps={{
                                                className: 'w-full h-40 cursor-crosshair',
                                            }}
                                        />
                                    </div>
                                    {errorMsg && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
                                </div>
                            )}

                            {/* Tombol Submit */}
                            <Button type="submit" disabled={processing}>
                                {processing ? <Spinner /> : 'Kirim Absensi'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
