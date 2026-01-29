import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import { ThemeProvider } from '@/Components/ThemeProvider';

window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // @ts-ignore
        const userTheme = props.initialPage?.props?.auth?.user?.settings?.theme || 'system';

        root.render(
            <ThemeProvider defaultTheme="system" initialTheme={userTheme} storageKey="qr-platform-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Handle session timeout / CSRF token mismatch
// When session expires, force full page reload instead of rendering error inline
router.on('error', (event) => {
    const response = (event.detail as any).response;
    if (response?.status === 419 || response?.status === 401) {
        window.location.reload();
    }
});
