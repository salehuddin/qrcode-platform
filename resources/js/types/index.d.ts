export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface DashboardStats {
    total_qr_codes: number;
    active_qr_codes: number;
    total_scans: number;
    scans_this_month: number;
    top_performing_codes: Array<{
        id: number;
        name: string;
        type: string;
        scan_count: number;
    }>;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
