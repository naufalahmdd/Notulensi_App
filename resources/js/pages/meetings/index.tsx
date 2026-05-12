import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meeting } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock, Edit3, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meetings',
        href: '/meetings',
    },
];

export default function Index({ meetings }: { meetings: Meeting[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setItemToDelete(id);
        setIsDialogOpen(true);
    };

    const executeDelete = () => {
        if (itemToDelete) {
            router.delete(route('meetings.destroy', itemToDelete), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setItemToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meetings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-5 flex w-full items-center justify-end">
                        <Button asChild type="button" variant="outline">
                            <Link href={route('meetings.create')}>
                                <Plus /> Tambah Rapat Baru
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Rapat</CardTitle>
                            <CardDescription>Daftar rapat yang tersedia</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {meetings.length === 0 ? (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <CalendarClock />
                                        </EmptyMedia>
                                        <EmptyTitle>Belum Ada Rapat</EmptyTitle>
                                        <EmptyDescription>Anda belum memiliki rapat yang tersedia.</EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent className="flex-row justify-center gap-2">
                                        <Button asChild type="button" variant="outline">
                                            <Link href={route('meetings.create')}>
                                                <Plus /> Tambah Rapat Baru
                                            </Link>
                                        </Button>
                                    </EmptyContent>
                                </Empty>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Judul Rapat</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Lokasi</TableHead>
                                            <TableHead>Jenis Rapat</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {meetings.map((meeting) => (
                                            <TableRow key={meeting.id}>
                                                <TableCell>{meeting.title}</TableCell>
                                                <TableCell>{meeting.start_time}</TableCell>
                                                <TableCell>{meeting.location}</TableCell>
                                                <TableCell>{meeting.type}</TableCell>
                                                <TableCell className="flex gap-2">
                                                    <Button variant="outline" size="sm" type="button">
                                                        <Link href={route('meetings.edit', meeting.id)}>
                                                            <Edit3 />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" type="button" onClick={() => confirmDelete(meeting.id)}>
                                                        <Trash2 />
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm" type="button">
                                                        <Link href={route('meetings.show', meeting.id)}>
                                                            <Eye />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data rapat dan seluruh isi notulensinya akan dihapus permanen dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDelete} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600">
                            Ya, Hapus Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
