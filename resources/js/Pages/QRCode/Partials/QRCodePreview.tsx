import { useEffect, useRef, useState } from 'react';
import { QRCustomization } from '@/types';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '@/Components/ui/button';

interface QRCodePreviewProps {
    data: string;
    customization: Partial<QRCustomization>;
    showDownloadButtons?: boolean;
}

export function QRCodePreview({ data, customization, showDownloadButtons = true }: QRCodePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<QRCodeStyling | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Fixed on-screen preview size; customization.width/height are used for exports
    const PREVIEW_SIZE = 260;

    useEffect(() => {
        if (!data || !containerRef.current) return;

        setIsGenerating(true);

        try {
            const hasGradient = customization.gradientEnabled;
            const gradient = hasGradient
                ? {
                      type: (customization.gradientType || 'linear') as any,
                      rotation:
                          typeof customization.gradientRotation === 'number'
                              ? customization.gradientRotation
                              : 0,
                      colorStops: [
                          {
                              offset: 0,
                              color:
                                  customization.gradientStartColor ||
                                  customization.dotsColor ||
                                  '#000000',
                          },
                          {
                              offset: 1,
                              color:
                                  customization.gradientEndColor ||
                                  customization.dotsColor ||
                                  '#000000',
                          },
                      ],
                  }
                : undefined;

            const options = {
                // Always render preview at a fixed on-screen size
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                data: data,
                dotsOptions: {
                    color: customization.dotsColor || '#000000',
                    type: (customization.dotsType || 'square') as any,
                    ...(gradient ? { gradient: gradient as any } : {}),
                },
                backgroundOptions: {
                    color: customization.backgroundColor || '#ffffff',
                },
                cornersSquareOptions: {
                    color: customization.cornersSquareColor || '#000000',
                    type: (customization.cornersSquareType || 'square') as any,
                },
                cornersDotOptions: {
                    color: customization.cornersDotsColor || '#000000',
                    type: (customization.cornersDotsType || 'dot') as any,
                },
                image: customization.image,
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 8,
                    imageSize: (customization.imageSize || 0.2) as number,
                },
                errorCorrectionLevel: (customization.errorCorrectionLevel || 'M') as any,
            };

            // Recreate the instance on every change to avoid stale previews when type/data change
            const instance = new QRCodeStyling(options);
            qrRef.current = instance;

            // Clear any previous canvas/SVG and append the new one
            containerRef.current.innerHTML = '';
            instance.append(containerRef.current);

            // Ensure the rendered element scales to fit the container
            const renderedElement = containerRef.current.querySelector('canvas, svg') as HTMLElement | null;
            if (renderedElement) {
                // Force the canvas/SVG to visually fit the preview box, regardless of intrinsic size
                renderedElement.style.width = '100%';
                renderedElement.style.maxWidth = '260px';
                renderedElement.style.height = 'auto';
                renderedElement.style.display = 'block';
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setIsGenerating(false);
        }

        return () => {
            // On cleanup, drop the reference and clear the container
            qrRef.current = null;
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [data, customization]);

    const downloadQRCode = (extension: 'png' | 'svg' | 'jpeg' | 'webp') => {
        if (!qrRef.current) return;

        const instance = qrRef.current;

        // Use a single square size for the exported image (based on customization.width)
        const exportSize = customization.width || PREVIEW_SIZE;

        // Bump size for export (square), then restore preview dimensions
        instance.update({ width: exportSize, height: exportSize } as any);
        instance.download({ name: 'qr-code', extension });
        instance.update({ width: PREVIEW_SIZE, height: PREVIEW_SIZE } as any);
    };

    const copyToClipboard = async () => {
        if (!containerRef.current) return;
        try {
            const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
                canvas.toBlob((blob) => {
                    if (blob) {
                        navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        alert('QR code copied to clipboard!');
                    }
                });
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">Configure your QR code to see a preview</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center bg-white rounded-lg border">
                <div
                    ref={containerRef}
                    className="flex justify-center w-full max-w-[260px] mx-auto"
                >
                    {isGenerating && (
                        <p className="text-muted-foreground">Generating QR code...</p>
                    )}
                </div>
            </div>

            {showDownloadButtons && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">
                        Download your QR code
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode('png')}
                        >
                            PNG
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode('svg')}
                        >
                            SVG
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode('jpeg')}
                        >
                            JPEG
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode('webp')}
                        >
                            WebP
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs"
                        onClick={copyToClipboard}
                    >
                        Copy to Clipboard
                    </Button>
                </div>
            )}
        </div>
    );
}