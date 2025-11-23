export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface QRCode {
    id: string;
    name: string;
    type: QRCodeType;
    content: string;
    destination_url?: string;
    is_active: boolean;
    scan_count: number;
    unique_scans: number;
    last_scanned_at?: string;
    created_at: string;
    updated_at: string;
    design: QRCodeDesign;
    user_id: number;
}

export type QRCodeType = 
    | 'url' 
    | 'vcard' 
    | 'wifi' 
    | 'sms' 
    | 'email' 
    | 'phone' 
    | 'location' 
    | 'event';

export interface QRCodeDesign {
    foreground_color: string;
    background_color: string;
    logo_url?: string;
    pattern: 'square' | 'dots' | 'rounded';
    error_correction: 'L' | 'M' | 'Q' | 'H';
}

export interface ScanEvent {
    id: string;
    qr_code_id: string;
    ip_address: string;
    user_agent: string;
    device_type: string;
    browser: string;
    os: string;
    country?: string;
    city?: string;
    scanned_at: string;
}

export interface DashboardStats {
    total_qr_codes: number;
    active_qr_codes: number;
    total_scans: number;
    scans_this_month: number;
    top_performing_codes: QRCode[];
    recent_scans: ScanEvent[];
}

export type PageProps<T = Record<string, any>> = {
    auth: {
        user: User;
    };
    flash?: {
        message?: string;
        error?: string;
        success?: string;
    };
} & T

export type PagePropsWithData<T = {}> = PageProps & T;
