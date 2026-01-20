import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { BODY_SHAPES, EYE_FRAME_SHAPES, EYE_BALL_SHAPES, QRShape } from '@/lib/qr-shapes';
import { Badge } from '@/Components/ui/badge';

interface ShapeCardProps {
  shape: QRShape;
  size?: number;
}

function ShapeCard({ shape, size = 80 }: ShapeCardProps) {
  const scale = size / 10; // Assuming viewBox is 0 0 10 10 for most shapes
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-3">
          {/* Shape Preview */}
          <div 
            className="flex items-center justify-center bg-muted/30 rounded-lg border"
            style={{ width: size, height: size }}
          >
            <svg
              width={size}
              height={size}
              viewBox={shape.viewBox}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={shape.svgPath}
                fill="currentColor"
                fillRule="evenodd"
                className="text-foreground"
              />
            </svg>
          </div>
          
          {/* Shape Info */}
          <div className="text-center">
            <p className="font-medium text-sm">{shape.name}</p>
            <Badge variant="outline" className="mt-1 text-xs">
              {shape.id}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ShapeGallery({}: PageProps) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          QR Code Shape Gallery
        </h2>
      }
    >
      <Head title="Shape Gallery" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Body Shapes */}
          <Card>
            <CardHeader>
              <CardTitle>Body Shapes</CardTitle>
              <CardDescription>
                Patterns for the QR code dots/modules ({BODY_SHAPES.length} shapes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {BODY_SHAPES.map((shape) => (
                  <ShapeCard key={shape.id} shape={shape} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eye Frame Shapes */}
          <Card>
            <CardHeader>
              <CardTitle>Eye Frame Shapes</CardTitle>
              <CardDescription>
                Shapes for the corner square frames ({EYE_FRAME_SHAPES.length} shapes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {EYE_FRAME_SHAPES.map((shape) => (
                  <ShapeCard key={shape.id} shape={shape} size={100} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eye Ball Shapes */}
          <Card>
            <CardHeader>
              <CardTitle>Eye Ball Shapes</CardTitle>
              <CardDescription>
                Shapes for the center dots in corner squares ({EYE_BALL_SHAPES.length} shapes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {EYE_BALL_SHAPES.map((shape) => (
                  <ShapeCard key={shape.id} shape={shape} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Total Shapes</h3>
                  <p className="text-sm text-muted-foreground">
                    Available for QR code customization
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {BODY_SHAPES.length + EYE_FRAME_SHAPES.length + EYE_BALL_SHAPES.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {BODY_SHAPES.length} body + {EYE_FRAME_SHAPES.length} frame + {EYE_BALL_SHAPES.length} ball
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
