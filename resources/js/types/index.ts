import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Meeting {
    id: number;
    title: string;
    start_time: string;
    location: string;
    leader_name: string;
    notary_name: string;
    status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED';
    type: 'BULANAN' | 'TINDAK_LANJUT' | 'HAWASBID' | 'MONEV_PTIP';
    created_at: string;
    updated_at: string;
}

export interface Minute {
    id: number;
    meeting_id: number;
    opening_speech?: string;
    closing_statement?: string;
    created_at: string;
    updated_at: string;
}

export interface MeetingFinding {
    id: number;
    meeting_id: number;
    permasalahan: string;
    pembahasan?: string;
    kondisi?: string;
    penyebab?: string;
    tindak_lanjut: string;
    kategori?: string;
    created_at: string;
    updated_at: string;
}
