# Custom QR Code Shapes Feature

## Overview

This feature enables advanced QR code customization with custom SVG shapes for body modules, eye frames, and eye balls. It provides unlimited design possibilities beyond the built-in shapes of standard QR libraries.

## Status

**⚠️ FEATURE ON HOLD** - Implemented but not integrated into production. Saved for future implementation.

## What's Built

### 1. Custom QR Renderer (`resources/js/lib/custom-qr-renderer.ts`)

A custom SVG-based QR code renderer that generates QR codes with custom shapes.

**Key Features:**

- Direct QR matrix generation using `qrcode` library
- Custom SVG shape rendering for body, eye frames, and eye balls
- Gradient support (linear and radial)
- Logo overlay support
- SVG and PNG export
- Accurate module positioning

**Dependencies:**

- `qrcode@1.5.4` - QR matrix generation
- `@types/qrcode` - TypeScript types

**Key Methods:**

```typescript
class CustomQRRenderer {
    constructor(options: CustomQROptions);
    async renderToSVG(): Promise<string>;
    async downloadAsSVG(filename: string): Promise<void>;
    async downloadAsPNG(filename: string): Promise<void>;

    private async generateQRMatrix(data: string): Promise<number[][]>;
    private isInEyeRegion(row: number, col: number): boolean;
    private renderModule(row, col, shape, color): string;
    private renderEyeFrame(startRow, startCol, shape, color): string;
    private renderEyeBall(startRow, startCol, shape, color): string;
}
```

### 2. Shape Definitions (`resources/js/lib/qr-shapes.ts`)

Comprehensive library of SVG shapes for QR code customization.

**Body Shapes (10 total):**

- Square
- Rounded
- Dots (Circle)
- Classy (Square with hollow center)
- Classy Rounded (Rounded with hollow center)
- Extra Rounded
- Diamond
- Star
- Heart
- Hexagon

**Eye Frame Shapes (5 total):**

- Square (thick outline)
- Rounded (thick outline)
- Extra Rounded (thick outline)
- Circle (thick outline)
- Leaf (rounded on opposite sides)

**Eye Ball Shapes (5 total):**

- Square
- Rounded
- Dot (Circle)
- Diamond
- Star

**Interface:**

```typescript
interface QRShape {
    id: string;
    name: string;
    category: "body" | "eye-frame" | "eye-ball";
    svgPath: string;
    viewBox: string;
}
```

### 3. Visual Shape Selector (`resources/js/Components/ShapeSelector.tsx`)

Reusable component for visual shape selection with grid layout.

**Features:**

- Grid display (5 shapes per row)
- SVG preview of each shape
- Hover and selection states
- Accessible with keyboard navigation

**Usage:**

```tsx
<ShapeSelector
    label="Body Shape"
    shapes={BODY_SHAPES}
    selected={selectedShapeId}
    onChange={(id) => handleShapeChange(id)}
/>
```

### 4. Test Page (`resources/js/Pages/Design/RendererTest.tsx`)

Interactive test page for the custom renderer at `/design/renderer-test`.

**Features:**

- 2-column layout (form + sticky preview)
- QR data input
- Visual shape selectors for body, eye frames, and eye balls
- Color customization with pickers
- Live preview with auto-regeneration
- SVG and PNG download

**Route:**

```php
Route::get('/design/renderer-test', [RendererTestController::class, 'index'])
    ->name('design.renderer-test');
```

### 5. Shape Gallery (`resources/js/Pages/Design/ShapeGallery.tsx`)

Visual gallery displaying all available shapes at `/design/shapes`.

**Features:**

- Organized by category (Body, Eye Frame, Eye Ball)
- Grid layout with shape previews
- Shape names displayed
- Useful for verification and selection

## Technical Implementation

### How It Works

1. **Matrix Generation:**
    - Uses `QRCode.create()` from `qrcode` library
    - Extracts actual QR matrix data (not image sampling)
    - Returns 2D array of 0s and 1s

2. **Shape Rendering:**
    - Iterates through matrix
    - Excludes 7x7 eye regions from body rendering
    - Renders custom SVG shapes for each module
    - Scales shapes to module size
    - Positions using SVG transforms

3. **Eye Region Handling:**
    - Clears 7x7 eye regions with background rectangles
    - Renders custom eye frames (7x7 modules)
    - Renders custom eye balls (3x3 modules in center)
    - Prevents double rendering with `isInEyeRegion()` check

4. **Export:**
    - SVG: Direct string output
    - PNG: SVG → Image → Canvas → Blob → Download

## Known Issues & Limitations

### 1. Eye Alignment Issue (UNRESOLVED)

**Problem:** Eye frames may not perfectly align with the underlying QR pattern, causing visible artifacts.

**Root Cause:** The custom renderer draws eye regions separately from the body, and there may be slight misalignment in the 7x7 eye region detection or rendering.

**Attempted Fixes:**

- Added `isInEyeRegion()` to exclude entire 7x7 regions
- Added background clearing rectangles before rendering eyes
- Switched from image sampling to direct matrix access

**Status:** Partially fixed but may still show artifacts in some cases.

### 2. Rendering Quality

**Issue:** User prefers the rendering quality of `qr-code-styling` library over the custom renderer.

**Comparison:**

- `qr-code-styling`: Better anti-aliasing, smoother edges
- Custom renderer: More flexible but potentially lower quality

**Potential Solutions:**

- Use Canvas API instead of SVG for better rendering
- Apply anti-aliasing filters to SVG
- Hybrid approach: Use `qr-code-styling` for supported shapes, custom renderer for others

### 3. Limited Shape Support in qr-code-styling

**Issue:** The existing `qr-code-styling` library only supports these built-in shapes:

- Body: square, dots, rounded, classy, classy-rounded, extra-rounded
- Eye Frame: square, dot, extra-rounded
- Eye Ball: square, dot

**Impact:** Cannot use custom shapes (diamond, star, heart, hexagon, leaf) with the existing library.

## Files Created

```
resources/js/lib/
├── custom-qr-renderer.ts          # Custom QR renderer class
└── qr-shapes.ts                   # Shape definitions (SVG paths)

resources/js/Components/
└── ShapeSelector.tsx              # Visual shape selector component

resources/js/Pages/Design/
├── RendererTest.tsx               # Test page for custom renderer
└── ShapeGallery.tsx               # Shape gallery page

app/Http/Controllers/
├── RendererTestController.php     # Controller for test page
└── ShapeGalleryController.php     # Controller for shape gallery

routes/web.php                     # Routes added for test pages
```

## Future Implementation Steps

### Phase 1: Fix Eye Alignment

1. Debug eye region detection
2. Verify 7x7 region boundaries
3. Test with different QR data sizes
4. Ensure perfect alignment

### Phase 2: Improve Rendering Quality

1. Research Canvas-based rendering
2. Implement anti-aliasing
3. Compare quality with qr-code-styling
4. Optimize SVG output

### Phase 3: Hybrid Approach (Recommended)

1. Use `qr-code-styling` for supported shapes
2. Use custom renderer only for unsupported shapes
3. Create mapping between shape IDs and library types
4. Seamless fallback system

### Phase 4: UI Integration

1. Create `ShapeSelector` component for production
2. Integrate into `CustomizeForm.tsx`
3. Update `QRCodePreview.tsx` to support custom renderer
4. Add shape selection to Create QR page
5. Add shape selection to public home page

### Phase 5: Organization Settings

1. Database migration for organization shape settings
2. Admin UI for toggling shape visibility
3. Filter available shapes based on org settings
4. API endpoints for shape management

## Testing Checklist

- [ ] QR codes scan correctly with all shape combinations
- [ ] Eye frames align perfectly with QR pattern
- [ ] No visible artifacts or double rendering
- [ ] All shapes render correctly
- [ ] Colors apply correctly
- [ ] Gradients work as expected
- [ ] Logo overlay works
- [ ] SVG export works
- [ ] PNG export works
- [ ] Responsive on mobile
- [ ] Performance is acceptable

## Dependencies

```json
{
    "qrcode": "^1.5.4",
    "@types/qrcode": "^1.5.5",
    "qr-code-styling": "^1.9.2"
}
```

## API Reference

### CustomQRRenderer

```typescript
interface CustomQROptions {
    data: string; // QR code data
    size: number; // Output size in pixels
    bodyShapeId: string; // Body shape ID from qr-shapes.ts
    eyeFrameShapeId: string; // Eye frame shape ID
    eyeBallShapeId: string; // Eye ball shape ID
    dotsColor: string; // Body dots color (hex)
    backgroundColor: string; // Background color (hex)
    cornersSquareColor: string; // Eye frame color (hex)
    cornersDotsColor: string; // Eye ball color (hex)
    gradient?: {
        enabled: boolean;
        type: "linear" | "radial";
        rotation: number;
        startColor: string;
        endColor: string;
    };
    logo?: string; // Logo image URL
    logoSize?: number; // Logo size ratio (0-1)
}
```

### Shape Utilities

```typescript
// Get all shapes
const { body, eyeFrame, eyeBall } = getAllShapes();

// Get shape by ID
const shape = getShapeById("body", "rounded");
```

## Notes

- All SVG paths use `fill-rule="evenodd"` for proper outline rendering
- Eye frame shapes are 30x30 viewBox (7x7 modules)
- Body and eye ball shapes are 10x10 viewBox (1x1 or 3x3 modules)
- Module size is calculated as `size / matrixSize`
- QR error correction level is set to 'M' (Medium)

## Resources

- [qrcode library](https://www.npmjs.com/package/qrcode)
- [qr-code-styling library](https://www.npmjs.com/package/qr-code-styling)
- [QR Code Specification](https://www.qrcode.com/en/about/standards.html)
- [SVG Path Reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)

## Author Notes

This feature was developed to provide unlimited QR code design possibilities. While the core functionality is complete, the rendering quality and eye alignment issues need to be resolved before production deployment.

**Recommendation:** Consider a hybrid approach using `qr-code-styling` for standard shapes and the custom renderer only for advanced shapes not supported by the library.

---

**Last Updated:** 2026-01-20  
**Status:** On Hold - Ready for Future Implementation
