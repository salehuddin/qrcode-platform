import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { AppSidebar } from '@/Components/AppSidebar';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

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
