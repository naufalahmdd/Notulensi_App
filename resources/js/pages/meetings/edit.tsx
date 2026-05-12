import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meeting } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rapat',
        href: '/meetings',
    },
    {
        title: 'Edit Rapat',
        href: '/meetings/:id/edit',
    },
];

export default function Edit({ meeting }: { meeting: Meeting }) {
    const formatDateTime = (dateString: string) => {
        if (!dateString) return '';
        return dateString.substring(0, 16).replace(' ', 'T');
    };

    const { data, setData, put, processing, errors } = useForm({
        title: meeting.title || '',
        start_time: formatDateTime(meeting.start_time),
        location: meeting.location || '',
        leader_name: meeting.leader_name || '',
        notary_name: meeting.notary_name || '',
        type: meeting.type || 'BULANAN',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('meetings.update', meeting.id));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Rapat: ${meeting.title}`} />
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
                            <Label htmlFor="template" className="mb-2 block">
                                Template Notulensi
                            </Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value as 'BULANAN' | 'TINDAK_LANJUT' | 'HAWASBID' | 'MONEV_PTIP')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Daftar Template</SelectLabel>
                                        <SelectItem value="BULANAN">Rapat Bulanan PN</SelectItem>
                                        <SelectItem value="TINDAK_LANJUT">Rapat Tindak Lanjut</SelectItem>
                                        <SelectItem value="HAWASBID">LHP Hawasbid</SelectItem>
                                        <SelectItem value="MONEV_PTIP">Monev & Tindak Lanjut PTIP</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                        </div>

                        {/* Judul Rapat */}
                        <div>
                            <Label className="mb-2 block">Judul Rapat</Label>
                            <Input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full" />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        {/* Grid untuk Waktu & Lokasi */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2 block">Waktu Pelaksanaan</Label>
                                <Input type="datetime-local" value={data.start_time} onChange={(e) => setData('start_time', e.target.value)} />
                                {errors.start_time && <p className="mt-1 text-sm text-red-500">{errors.start_time}</p>}
                            </div>
                            <div>
                                <Label className="mb-2 block">Lokasi Rapat</Label>
                                <Input type="text" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label className="mb-2 block">Pimpinan Rapat</Label>
                                <Input type="text" value={data.leader_name} onChange={(e) => setData('leader_name', e.target.value)} />
                                {errors.leader_name && <p className="mt-1 text-sm text-red-500">{errors.leader_name}</p>}
                            </div>
                            <div>
                                <Label className="mb-2 block">Notulis</Label>
                                <Input type="text" value={data.notary_name} onChange={(e) => setData('notary_name', e.target.value)} />
                                {errors.notary_name && <p className="mt-1 text-sm text-red-500">{errors.notary_name}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-4 border-t border-border pt-6">
                            <Link href={route('meetings.index')} className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                                Batal
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? <Spinner /> : 'Perbarui Data'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
