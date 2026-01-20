import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { QrCode, Palette, Download, Zap } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 sm:py-32">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
            
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                        Create Beautiful QR Codes in{' '}
                        <span className="text-primary">Seconds</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Professional QR codes with full customization - colors, logos, patterns, and more. 
                        No signup required to get started.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" asChild>
                            <a href="#generator">
                                Try Free Generator
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/register">
                                Sign Up Free
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mx-auto mt-16 max-w-5xl">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
                                <QrCode className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">8 QR Types</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                URL, vCard, WiFi, SMS, Email, Phone, Location, Events
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
                                <Palette className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">Full Customization</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Colors, gradients, patterns, and corner styles
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
                                <Download className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">Vector Export</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Download as PNG, SVG, PDF, or EPS
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">Instant Preview</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                See changes in real-time as you customize
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
