import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meeting } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Copy, FileText } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rapat',
        href: '/meetings',
    },
    {
        title: 'Detail Rapat',
        href: '/meetings/:id',
    },
];

export default function Show({ meeting }: { meeting: Meeting }) {
    const [copied, setCopied] = useState(false);

    const attendanceLink = `${window.location.origin}/absen/${meeting.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(attendanceLink);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    const formattedDate = new Date(meeting.start_time).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Rapat > ${meeting.title}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end items-center mb-6 gap-6">
                        <Button asChild type="button" size="sm">
                            <Link href={route('meetings.minutes', meeting.id)}>
                                Buka Notulensi <FileText />
                            </Link>
                        </Button>
                        <Button type="button" variant="default" size="sm">
                            Selesaikan Rapat <CheckCircle />
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex w-full justify-between">
                                <div className="">
                                    <CardTitle className="text-2xl">{meeting.title}</CardTitle>
                                    <CardDescription className="text-md font-medium">Template: {meeting.type.replace('_', ' ')}</CardDescription>
                                </div>
                                <div>
                                    <Badge>{meeting.status.replace('_', ' ')}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <p className="text-muted-foreground mb-1">Waktu Pelaksanaan</p>
                                    <p className="font-medium">{formattedDate} WIB</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Lokasi</p>
                                    <p className="font-medium">{meeting.location}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Pimpinan Rapat</p>
                                    <p className="font-medium">{meeting.leader_name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Notulis</p>
                                    <p className="font-medium">{meeting.notary_name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-[320px_auto] mt-10 gap-5">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Link Absensi</CardTitle>
                                <CardDescription className="mt-2 font-medium">Bagikan link berikut untuk mengumpulkan daftar hadir:</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <Input readOnly value={attendanceLink} />
                                    <Button
                                        onClick={handleCopy}
                                        variant="outline"
                                        size="icon"
                                        className={copied ? 'transition-all' : 'transition-all'}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle />
                                            </>
                                        ) : (
                                            <>
                                                <Copy />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>

                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
