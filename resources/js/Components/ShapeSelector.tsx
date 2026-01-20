import { QRShape } from '@/lib/qr-shapes';
import { cn } from '@/lib/utils';

interface ShapeSelectorProps {
  label: string;
  shapes: QRShape[];
  selected: string;
  onChange: (shapeId: string) => void;
}

export function ShapeSelector({ label, shapes, selected, onChange }: ShapeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-5 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            type="button"
            onClick={() => onChange(shape.id)}
            className={cn(
              "relative aspect-square p-2 rounded-lg border-2 transition-all",
              "hover:border-primary hover:bg-accent/50",
              "flex items-center justify-center",
              selected === shape.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border bg-background"
            )}
            title={shape.name}
          >
            <svg
              viewBox={shape.viewBox}
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={shape.svgPath}
                fill="currentColor"
                fillRule="evenodd"
                className="text-foreground"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
