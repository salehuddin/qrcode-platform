import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo.png"
            alt="Application Logo"
            onError={(e) => {
                // Fallback to default styling if needed, or just let alt text show
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
