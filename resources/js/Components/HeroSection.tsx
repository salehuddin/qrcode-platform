import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Company Badge */}
                    <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
                        <span className="font-semibold text-primary">Light Up 7</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">Internal QR Code Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                        QR Code Management
                        <span className="block text-primary mt-2">Made Simple</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Create, customize, and manage QR codes for Light Up 7. Track analytics, organize with folders, and collaborate with your team—all in one place.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" asChild>
                            <a href="/login">
                                Staff Login
                            </a>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <a href="#generator">
                                Try QR Generator
                            </a>
                        </Button>
                    </div>

                    {/* Feature Highlights */}
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="flex flex-col items-center">
                            <div className="text-4xl mb-3">📊</div>
                            <h3 className="font-semibold text-foreground">Analytics</h3>
                            <p className="text-sm text-muted-foreground mt-1">Track scans and performance</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl mb-3">👥</div>
                            <h3 className="font-semibold text-foreground">Team Collaboration</h3>
                            <p className="text-sm text-muted-foreground mt-1">Work together seamlessly</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl mb-3">🎨</div>
                            <h3 className="font-semibold text-foreground">Custom Designs</h3>
                            <p className="text-sm text-muted-foreground mt-1">Brand your QR codes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-primary/30 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
        </section>
    );
}
