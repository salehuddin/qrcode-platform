import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { AppSidebar } from '@/Components/AppSidebar';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    // Apply font size setting
    useEffect(() => {
        const fontSize = user.settings?.font_size || 'normal';
        const root = document.documentElement;
        
        // Remove existing font size classes
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        
        // Apply new font size class
        switch (fontSize) {
            case 'small':
                root.classList.add('text-sm');
                break;
            case 'large':
                root.classList.add('text-lg');
                break;
            default:
                root.classList.add('text-base');
        }
    }, [user.settings?.font_size]);

    // Apply compact mode setting
    useEffect(() => {
        const compactMode = user.settings?.compact_mode || false;
        const root = document.documentElement;
        
        if (compactMode) {
            root.classList.add('compact-mode');
        } else {
            root.classList.remove('compact-mode');
        }
    }, [user.settings?.compact_mode]);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <AppSidebar user={user} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                {header && (
                    <header className="bg-card border-b">
                        <div className="px-6 py-4">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
