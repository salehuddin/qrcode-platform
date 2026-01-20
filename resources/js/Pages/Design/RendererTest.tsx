import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { CustomQRRenderer } from '@/lib/custom-qr-renderer';
import { BODY_SHAPES, EYE_FRAME_SHAPES, EYE_BALL_SHAPES } from '@/lib/qr-shapes';
import { ShapeSelector } from '@/Components/ShapeSelector';

export default function RendererTest({}: PageProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState({
    data: 'https://example.com',
    bodyShapeId: 'square',
    eyeFrameShapeId: 'square',
    eyeBallShapeId: 'square',
    dotsColor: '#000000',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#000000',
    cornersDotsColor: '#000000',
  });

  const generateQR = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const renderer = new CustomQRRenderer({
        ...options,
        size: 300,
      });

      const svg = await renderer.renderToSVG();
      setSvgContent(svg);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update container when svgContent changes
  useEffect(() => {
    if (svgContent && containerRef.current) {
      containerRef.current.innerHTML = svgContent;
    }
  }, [svgContent]);

  // Auto-generate on mount and when options change
  useEffect(() => {
    generateQR();
  }, [options]);

  const downloadSVG = async () => {
    try {
      const renderer = new CustomQRRenderer({
        ...options,
        size: 1000,
      });
      await renderer.downloadAsSVG('qrcode.svg');
    } catch (err) {
      console.error('Error downloading SVG:', err);
    }
  };

  const downloadPNG = async () => {
    try {
      const renderer = new CustomQRRenderer({
        ...options,
        size: 1000,
      });
      await renderer.downloadAsPNG('qrcode.png');
    } catch (err) {
      console.error('Error downloading PNG:', err);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Custom QR Renderer Test
        </h2>
      }
    >
      <Head title="Renderer Test" />

      <div className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* QR Data */}
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Content</CardTitle>
                  <CardDescription>Enter the data to encode in your QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="qr-data">URL or Text</Label>
                    <Input
                      id="qr-data"
                      type="text"
                      value={options.data}
                      onChange={(e) => setOptions({ ...options, data: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shape Customization */}
              <Card>
                <CardHeader>
                  <CardTitle>Shape Customization</CardTitle>
                  <CardDescription>Choose custom shapes for your QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ShapeSelector
                    label="Body Shape"
                    shapes={BODY_SHAPES}
                    selected={options.bodyShapeId}
                    onChange={(id) => setOptions({ ...options, bodyShapeId: id })}
                  />

                  <ShapeSelector
                    label="Eye Frame Shape"
                    shapes={EYE_FRAME_SHAPES}
                    selected={options.eyeFrameShapeId}
                    onChange={(id) => setOptions({ ...options, eyeFrameShapeId: id })}
                  />

                  <ShapeSelector
                    label="Eye Ball Shape"
                    shapes={EYE_BALL_SHAPES}
                    selected={options.eyeBallShapeId}
                    onChange={(id) => setOptions({ ...options, eyeBallShapeId: id })}
                  />
                </CardContent>
              </Card>

              {/* Color Customization */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Customization</CardTitle>
                  <CardDescription>Customize the colors of your QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dots-color">Dots Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dots-color"
                          type="color"
                          value={options.dotsColor}
                          onChange={(e) => setOptions({ ...options, dotsColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={options.dotsColor}
                          onChange={(e) => setOptions({ ...options, dotsColor: e.target.value })}
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={options.backgroundColor}
                          onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={options.backgroundColor}
                          onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corner-square-color">Corner Square Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="corner-square-color"
                          type="color"
                          value={options.cornersSquareColor}
                          onChange={(e) => setOptions({ ...options, cornersSquareColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={options.cornersSquareColor}
                          onChange={(e) => setOptions({ ...options, cornersSquareColor: e.target.value })}
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corner-dots-color">Corner Dots Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="corner-dots-color"
                          type="color"
                          value={options.cornersDotsColor}
                          onChange={(e) => setOptions({ ...options, cornersDotsColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={options.cornersDotsColor}
                          onChange={(e) => setOptions({ ...options, cornersDotsColor: e.target.value })}
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Sticky Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-8 bg-white">
                    <div 
                      ref={containerRef}
                      className="w-full flex items-center justify-center"
                      style={{ minHeight: '300px' }}
                    >
                      {isGenerating && (
                        <p className="text-muted-foreground">Generating...</p>
                      )}
                      {!svgContent && !isGenerating && (
                        <p className="text-muted-foreground">QR code will appear here</p>
                      )}
                    </div>

                    {svgContent && (
                      <div className="flex gap-2 mt-4 w-full">
                        <Button onClick={downloadSVG} variant="outline" className="flex-1" size="sm">
                          Download SVG
                        </Button>
                        <Button onClick={downloadPNG} variant="outline" className="flex-1" size="sm">
                          Download PNG
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
