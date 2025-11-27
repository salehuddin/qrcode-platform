import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    QrCode,
    Settings,
    Users,
    HelpCircle,
    LogOut,
    LayoutDashboard,
    FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    isActive?: boolean;
    children?: NavItem[];
}

export function Sidebar() {
    const currentRoute = (usePage().props.ziggy as any)?.route?.name || '';

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            icon: <LayoutDashboard className="h-4 w-4" />,
            isActive: currentRoute === 'dashboard',
        },
        {
            label: 'QR Codes',
            href: route('qr-codes.index'),
            icon: <QrCode className="h-4 w-4" />,
            isActive: currentRoute?.startsWith('qr-codes'),
        },
        {
            label: 'Analytics',
            href: route('analytics'),
            icon: <BarChart3 className="h-4 w-4" />,
            isActive: currentRoute === 'analytics',
        },
        {
            label: 'Admin',
            icon: <Users className="h-4 w-4" />,
            children: [
                {
                    label: 'Dashboard',
                    href: route('admin.dashboard'),
                    icon: <LayoutDashboard className="h-4 w-4" />,
                    isActive: currentRoute === 'admin.dashboard',
                },
                {
                    label: 'Users',
                    href: route('admin.users'),
                    icon: <Users className="h-4 w-4" />,
                    isActive: currentRoute === 'admin.users',
                },
            ],
        },
        {
            label: 'Settings',
            href: route('profile.edit'),
            icon: <Settings className="h-4 w-4" />,
            isActive: currentRoute === 'profile.edit',
        },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 bg-gray-50">
            <div className="h-full overflow-y-auto flex flex-col">
                {/* Logo / Branding */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            QR
                        </div>
                        <span className="font-semibold text-gray-900">QRCode</span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <div>
                                    <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                                        {item.label}
                                    </div>
                                    <div className="space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                                                    child.isActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                )}
                                            >
                                                {child.icon}
                                                <span>{child.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                                        item.isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 p-4 space-y-2">
                    <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                    </a>
                    <form method="POST" action={route('logout')}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
