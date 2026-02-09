import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    QrCode, 
    BarChart3, 
    Settings, 
    Users, 
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    LogOut,
    User,
    Palette,
    Mail,
    Bell
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { Switch } from '@/Components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { useTheme } from '@/Components/ThemeProvider';
import { router } from '@inertiajs/react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
}

interface AppSidebarProps {
    user: {
        name: string;
        email: string;
        is_platform_admin?: boolean;
    };
}

export function AppSidebar({ user }: AppSidebarProps) {
    const { props } = usePage();
    // @ts-ignore
    const currentOrganization = props.auth?.current_organization;
    const [collapsed, setCollapsed] = useState(false);
    const { theme, setTheme } = useTheme();
    
    // Calculate actual dark mode state (including system preference)
    const isDarkMode = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            active: route().current('dashboard'),
        },
        {
            title: 'QR Codes',
            href: '/qr-codes',
            icon: QrCode,
            active: route().current('qr-codes.*'),
        },
        {
            title: 'Analytics',
            href: '/analytics',
            icon: BarChart3,
            active: route().current('analytics'),
        },
        {
            title: 'Design Studio',
            href: '/design',
            icon: Palette,
            active: route().current('design.*'),
        },
        {
            title: 'Settings',
            icon: Settings,
            active: route().current('settings.*') || route().current('team.*'),
            subItems: [
                {
                    title: 'Organization',
                    href: '/settings/organization',
                    active: route().current('settings.organization.show'),
                },
                {
                    title: 'Teams & Members',
                    href: '/team',
                    active: route().current('team.index'),
                },
                ...(user.is_platform_admin ? [
                    {
                        title: 'Email Settings',
                        href: '/admin/email-settings',
                        active: route().current('admin.email-settings'),
                    },
                    {
                        title: 'Notifications',
                        href: '/admin/notification-settings',
                        active: route().current('admin.notification-settings'),
                    }
                ] : [])
            ]
        },
    ];

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const toggleDarkMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <TooltipProvider>
            <div
                className={cn(
                    'relative flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
                    collapsed ? 'w-16' : 'w-64'
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold overflow-hidden">
                            {currentOrganization?.logo_url ? (
                                <img 
                                    src={currentOrganization.logo_url} 
                                    alt={currentOrganization.name} 
                                    className="h-8 w-8 object-contain rounded"
                                />
                            ) : (
                                <QrCode className="h-6 w-6 text-primary shrink-0" />
                            )}
                            <span className="text-lg truncate">{currentOrganization?.name || 'QR Platform'}</span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn('h-8 w-8', collapsed && 'mx-auto')}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        
                        if (item.subItems) {
                            return (
                                <div key={item.title} className="space-y-1">
                                    {!collapsed && (
                                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {item.title}
                                        </div>
                                    )}
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent',
                                                subItem.active
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                    : 'text-sidebar-foreground',
                                                collapsed && 'justify-center'
                                            )}
                                        >
                                            {collapsed ? (
                                                <Icon className="h-5 w-5 shrink-0" />
                                            ) : (
                                                <span className="pl-8">{subItem.title}</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            );
                        }

                        const navButton = (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent',
                                    item.active
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : 'text-sidebar-foreground',
                                    collapsed && 'justify-center'
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.title}</span>}
                            </Link>
                        );

                        if (collapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{item.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return navButton;
                    })}
                </nav>

                <Separator />

                {/* Dark Mode Toggle */}
                <div className="p-2">
                    <div
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2',
                            collapsed && 'justify-center'
                        )}
                    >
                        {isDarkMode ? (
                            <Moon className="h-5 w-5 shrink-0" />
                        ) : (
                            <Sun className="h-5 w-5 shrink-0" />
                        )}
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-sm">Dark Mode</span>
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={toggleDarkMode}
                                />
                            </>
                        )}
                    </div>
                </div>

                <Separator />

                {/* User Profile */}
                <div className="p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'w-full justify-start gap-3 px-3 py-2 h-auto',
                                    collapsed && 'justify-center px-2'
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                            {user.email}
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings/preferences" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings/notifications" className="cursor-pointer">
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notifications</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </TooltipProvider>
    );
}
