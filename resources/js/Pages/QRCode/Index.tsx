import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, QRCode } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { useState, useMemo } from 'react';
import Checkbox from '@/Components/Checkbox';

// Mock data for development
const mockQRCodes: QRCode[] = [
    {
        id: '1',
        name: 'Restaurant Menu',
        type: 'url',
        mode: 'dynamic',
        content: 'https://restaurant.com/menu',
        destination_url: 'https://restaurant.com/menu',
        is_active: true,
        scan_count: 156,
        unique_scans: 134,
        last_scanned_at: '2024-01-20 14:30:00',
        created_at: '2024-01-15 10:00:00',
        updated_at: '2024-01-20 14:30:00',
        design: {
            foreground_color: '#000000',
            background_color: '#ffffff',
            pattern: 'square',
            error_correction: 'M'
        },
        user_id: 1
    },
    {
        id: '2',
        name: 'Business Card',
        type: 'vcard',
        mode: 'static',
        content: 'John Doe Contact Info',
        is_active: true,
        scan_count: 89,
        unique_scans: 76,
        last_scanned_at: '2024-01-19 16:45:00',
        created_at: '2024-01-10 09:15:00',
        updated_at: '2024-01-18 11:22:00',
        design: {
            foreground_color: '#1f2937',
            background_color: '#f3f4f6',
            pattern: 'rounded',
            error_correction: 'M'
        },
        user_id: 1
    },
    {
        id: '3',
        name: 'WiFi Network',
        type: 'wifi',
        mode: 'static',
        content: 'Guest WiFi Access',
        is_active: false,
        scan_count: 23,
        unique_scans: 19,
        last_scanned_at: '2024-01-18 09:12:00',
        created_at: '2024-01-12 15:30:00',
        updated_at: '2024-01-17 12:45:00',
        design: {
            foreground_color: '#2563eb',
            background_color: '#ffffff',
            pattern: 'dots',
            error_correction: 'H'
        },
        user_id: 1
    },
    {
        id: '4',
        name: 'Contact Form',
        type: 'url',
        mode: 'dynamic',
        content: 'https://company.com/contact',
        destination_url: 'https://company.com/contact',
        is_active: true,
        scan_count: 67,
        unique_scans: 54,
        last_scanned_at: '2024-01-21 08:15:00',
        created_at: '2024-01-14 13:20:00',
        updated_at: '2024-01-21 08:15:00',
        design: {
            foreground_color: '#dc2626',
            background_color: '#fef2f2',
            pattern: 'rounded',
            error_correction: 'M'
        },
        user_id: 1
    }
];

interface QRCodeIndexProps extends PageProps {
    qrCodes?: QRCode[];
}

export default function QRCodeIndex({ qrCodes = mockQRCodes }: QRCodeIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [modeFilter, setModeFilter] = useState<'all' | 'static' | 'dynamic'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'scans' | 'recent'>('recent');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            url: '🔗',
            vcard: '👤',
            wifi: '📶',
            sms: '💬',
            email: '📧',
            phone: '📞',
            location: '📍',
            event: '📅'
        };
        return icons[type] || '📱';
    };

    const filteredAndSortedQRCodes = useMemo(() => {
        let filtered = qrCodes.filter(qr => {
            // Search filter
            const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' ? qr.is_active : !qr.is_active);
            
            // Mode filter
            const matchesMode = modeFilter === 'all' || qr.mode === modeFilter;
            
            return matchesSearch && matchesStatus && matchesMode;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'scans') {
                return b.scan_count - a.scan_count;
            } else {
                // 'recent'
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return filtered;
    }, [qrCodes, searchTerm, statusFilter, modeFilter, sortBy]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredAndSortedQRCodes.map(qr => qr.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const isAllSelected = filteredAndSortedQRCodes.length > 0 && 
        filteredAndSortedQRCodes.every(qr => selectedIds.has(qr.id));
    const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    QR Codes
                </h2>
            }
        >
            <Head title="QR Codes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Button asChild>
                                <Link href="/qr-codes/create">
                                    Create New QR Code
                                </Link>
                            </Button>
                        </div>
                        {/* Stats Overview */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total QR Codes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{qrCodes.length}</div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active QR Codes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {qrCodes.filter(qr => qr.is_active).length}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Scans
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Filters & Sort</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-4">
                                    {/* Search */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Search</label>
                                        <Input
                                            placeholder="Search by name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-8 text-xs"
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Status</label>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => setStatusFilter('all')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    statusFilter === 'all'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setStatusFilter('active')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    statusFilter === 'active'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Active
                                            </button>
                                            <button
                                                onClick={() => setStatusFilter('inactive')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    statusFilter === 'inactive'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Inactive
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mode Filter */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Mode</label>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => setModeFilter('all')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    modeFilter === 'all'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setModeFilter('static')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    modeFilter === 'static'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Static
                                            </button>
                                            <button
                                                onClick={() => setModeFilter('dynamic')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                    modeFilter === 'dynamic'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                Dynamic
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sort */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as any)}
                                            className="w-full h-8 text-xs border border-gray-200 rounded-md px-2 py-1"
                                        >
                                            <option value="recent">Recently Created</option>
                                            <option value="name">Name (A-Z)</option>
                                            <option value="scans">Most Scans</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bulk Actions */}
                        {selectedIds.size > 0 && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="pt-6 flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-900">
                                        {selectedIds.size} selected
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                                            Clear
                                        </Button>
                                        <Button variant="default" size="sm">
                                            Edit Selected
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Delete Selected
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* QR Codes Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedQRCodes.map((qr) => (
                                <Card key={qr.id} className="hover:shadow-lg transition-shadow relative">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <Checkbox
                                                    checked={selectedIds.has(qr.id)}
                                                    onChange={(e) => handleSelectOne(qr.id, e.target.checked)}
                                                    className="mt-1"
                                                />
                                                <div className="text-2xl">{getTypeIcon(qr.type)}</div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{qr.name}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
                                                        <Badge 
                                                            variant={qr.is_active ? "default" : "secondary"}
                                                        >
                                                            {qr.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {qr.type.toUpperCase()}
                                                        </Badge>
                                                        <Badge variant={qr.mode === 'dynamic' ? 'default' : 'outline'} className="ml-1">
                                                            {(qr.mode || 'static').toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* QR Code Preview */}
                                            <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                                                <div 
                                                    className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl"
                                                    style={{ 
                                                        backgroundColor: qr.design.background_color,
                                                        color: qr.design.foreground_color 
                                                    }}
                                                >
                                                    ⬜
                                                </div>
                                            </div>
                                            
                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-muted-foreground">Scans</div>
                                                    <div className="font-medium">{qr.scan_count}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">Unique</div>
                                                    <div className="font-medium">{qr.unique_scans}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Last Scanned */}
                                            <div className="text-xs text-muted-foreground">
                                                {qr.last_scanned_at 
                                                    ? `Last scanned: ${new Date(qr.last_scanned_at).toLocaleDateString()}`
                                                    : 'Never scanned'
                                                }
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button asChild size="sm" className="flex-1">
                                                    <Link href={`/qr-codes/${qr.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/qr-codes/${qr.id}/edit`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredAndSortedQRCodes.length === 0 && (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <div className="text-6xl mb-4">📱</div>
                                    <h3 className="text-lg font-medium mb-2">No QR Codes Yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Create your first QR code to get started
                                    </p>
                                    <Button asChild>
                                        <Link href="/qr-codes/create">
                                            Create Your First QR Code
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}