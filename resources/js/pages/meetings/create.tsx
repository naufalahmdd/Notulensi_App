import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rapat',
        href: '/meetings',
    },
    {
        title: 'Buat Rapat',
        href: '/meetings/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        start_time: '',
        location: '',
        leader_name: '',
        notary_name: '',
        type: 'BULANAN',
    });

    // Fungsi untuk mengirim data ke Laravel
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('meetings.store'));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rapat > Buat Rapat" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 border-b pb-4">
                        <h3 className="text-lg font-bold">Informasi Dasar Rapat</h3>
                        <p className="text-muted-foreground text-sm">
                            Pilih template dan lengkapi data utama notulensi sebelum mengisi detail temuan/pembahasan.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="type" className="block mb-2">Tipe Template</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Pilih Template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Template</SelectLabel>
                                        <SelectItem value="BULANAN">Rapat Bulanan PN</SelectItem>
                                        <SelectItem value="TINDAK_LANJUT">Rapat Tindak Lanjut</SelectItem>
                                        <SelectItem value="HAWASBID">LHP Hawasbid</SelectItem>
                                        <SelectItem value="MONEV_PTIP">Monev & Tindak Lanjut PTIP</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="title" className="block mb-2">Judul Rapat</Label>
                            <Input
                                type="text"
                                placeholder="Contoh: Rapat Bulanan Oktober 2025"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="start_time" className="block mb-2">Waktu Pelaksanaan</Label>
                                <Input type="datetime-local" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} />
                                {errors.start_time && <p className="mt-1 text-sm text-red-500">{errors.start_time}</p>}
                            </div>
                            <div>
                                <Label htmlFor="location" className="block mb-2">Lokasi Rapat</Label>
                                <Input
                                    type="text"
                                    placeholder="Contoh: Ruang Rapat Utama"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="leader_name" className="block mb-2">Pimpinan Rapat</Label>
                                <Input
                                    type="text"
                                    placeholder="Nama Pimpinan Rapat"
                                    value={data.leader_name}
                                    onChange={(e) => setData('leader_name', e.target.value)}
                                />
                                {errors.leader_name && <p className="mt-1 text-sm text-red-500">{errors.leader_name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="notary_name" className="block mb-2">Notulis</Label>
                                <Input
                                    type="text"
                                    placeholder="Nama Notulis"
                                    value={data.notary_name}
                                    onChange={(e) => setData('notary_name', e.target.value)}
                                />
                                {errors.notary_name && <p className="mt-1 text-sm text-red-500">{errors.notary_name}</p>}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-4 border-t border-border pt-6">
                            <Link href={route('meetings.index')} className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                                Batal
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? <Spinner /> : 'Simpan Rapat'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
