# 🛠️ Development Requirements - QRCode Platform

## 🎨 UI Component Library: Shadcn/ui

**All pages and components MUST use Shadcn/ui components** for consistency, accessibility, and maintainability.

### Core Shadcn/ui Components to Use:

#### 📝 Form Components
- `Button` - Primary, secondary, destructive, ghost variants
- `Input` - Text inputs, email, password, search fields
- `Label` - Form field labels with proper accessibility
- `Textarea` - Multi-line text inputs
- `Select` - Dropdown selectors with search functionality
- `Checkbox` - Boolean selections
- `RadioGroup` - Single selection from multiple options
- `Switch` - Toggle switches for settings

#### 📊 Data Display
- `Table` - Data tables with sorting, filtering, pagination
- `Card` - Content containers, stats cards, QR code cards
- `Badge` - Status indicators, labels, categories
- `Avatar` - User profile pictures, team member avatars
- `Separator` - Visual dividers between sections

#### 🗂️ Navigation & Layout
- `Tabs` - QR type selection, settings navigation
- `NavigationMenu` - Main navigation bar
- `Breadcrumb` - Page hierarchy navigation
- `Sheet` - Slide-out panels for mobile menus
- `ScrollArea` - Custom scrollable areas

#### 💬 Feedback & Overlays
- `Dialog` - Modal dialogs, confirmations, forms
- `AlertDialog` - Destructive action confirmations
- `Toast` - Notifications and alerts
- `Tooltip` - Helpful information on hover
- `Popover` - Floating content panels
- `HoverCard` - Rich hover information cards

#### 📈 Data Visualization
- `Progress` - Progress bars for uploads, processing
- `Chart` (with Recharts) - Analytics charts and graphs
- `Calendar` - Date pickers and scheduling
- `Command` - Command palette and search

### 🎨 Theming & Customization

#### Color Scheme
```css
/* Primary colors for QR Code Platform */
--primary: 230 54% 52%;        /* Blue for primary actions */
--primary-foreground: 0 0% 98%;

--secondary: 220 14% 96%;      /* Light gray for secondary */
--secondary-foreground: 220 9% 46%;

--accent: 142 76% 36%;         /* Green for success states */
--accent-foreground: 355 7% 97%;

--destructive: 0 84% 60%;      /* Red for dangerous actions */
--destructive-foreground: 0 0% 98%;
```

#### Component Variants
- **Buttons**: `default`, `secondary`, `outline`, `ghost`, `destructive`
- **Cards**: `default`, `elevated`, `outlined`
- **Badges**: `default`, `secondary`, `success`, `warning`, `destructive`

### 📁 Component Organization

```
resources/js/components/
├── ui/                        # Shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   └── ...
├── forms/                     # Form-specific components
│   ├── qr-form.tsx
│   ├── user-form.tsx
│   └── settings-form.tsx
├── charts/                    # Analytics charts
│   ├── scan-timeline.tsx
│   ├── device-breakdown.tsx
│   └── geographic-chart.tsx
├── qr/                       # QR-specific components
│   ├── qr-preview.tsx
│   ├── qr-customizer.tsx
│   └── qr-gallery.tsx
└── layout/                   # Layout components
    ├── sidebar.tsx
    ├── header.tsx
    └── breadcrumbs.tsx
```

## 🎯 Component Development Standards

### 1. TypeScript Requirements
- **All components** must be TypeScript with proper interfaces
- Define props interfaces for all components
- Use generic types where appropriate
- Export types for reusability

```typescript
interface QRCodeCardProps {
  qrCode: QRCode
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  className?: string
}

export function QRCodeCard({ qrCode, onEdit, onDelete, className }: QRCodeCardProps) {
  // Component implementation
}
```

### 2. Accessibility (A11Y) Standards
- Use proper ARIA labels and descriptions
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Include focus indicators
- Test with screen readers

### 3. Responsive Design
- Mobile-first approach
- Use Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Ensure touch targets are at least 44px
- Test on various screen sizes

### 4. Component Composition
- Favor composition over inheritance
- Use the `cn()` utility for class merging
- Support custom className props
- Implement proper forwarded refs

```typescript
import { cn } from '@/lib/utils'

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
}

export function CustomCard({ title, children, className, ...props }: CustomCardProps) {
  return (
    <Card className={cn('p-6', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
```

## 🔧 Installation & Setup

### Installing Shadcn/ui Components
```bash
# Add individual components as needed
npx shadcn@latest add button card input table dialog select tabs badge

# For analytics pages
npx shadcn@latest add chart calendar command

# For forms
npx shadcn@latest add form label textarea checkbox radio-group switch

# For navigation
npx shadcn@latest add navigation-menu breadcrumb sheet scroll-area

# For feedback
npx shadcn@latest add toast tooltip popover hover-card alert-dialog
```

### Component Import Pattern
```typescript
// ✅ Correct - Import from ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// ❌ Incorrect - Don't import from external packages directly
import { Button } from '@radix-ui/react-button'
```

## 📊 Data Flow & State Management

### 1. Inertia.js Props
- Use Inertia's props for server-side data
- Type all page props with interfaces
- Handle loading states properly

### 2. Local State
- Use React hooks (`useState`, `useEffect`, `useReducer`)
- Keep state close to where it's used
- Use context sparingly for deeply nested props

### 3. Forms
- Use React Hook Form with Shadcn/ui form components
- Implement proper validation with Zod schemas
- Handle form submission with Inertia

## 🎨 Design System Guidelines

### Colors
- Use CSS custom properties for theming
- Stick to the defined color palette
- Use semantic color names (primary, destructive, etc.)

### Typography
- Use Tailwind's typography scale
- Maintain consistent font weights
- Ensure proper contrast ratios

### Spacing
- Use Tailwind's spacing scale (4, 6, 8, 12, 16, etc.)
- Be consistent with padding and margins
- Use gap for flex and grid layouts

### Animations
- Use Tailwind's transition utilities
- Keep animations subtle and purposeful
- Respect users' motion preferences

## ✅ Quality Checklist

Before creating any component, ensure:

- [ ] Uses Shadcn/ui components as base
- [ ] Has proper TypeScript interfaces
- [ ] Includes accessibility attributes
- [ ] Is responsive across screen sizes
- [ ] Handles loading and error states
- [ ] Has consistent styling with design system
- [ ] Follows component composition patterns
- [ ] Includes proper documentation/comments

## 🚀 Getting Started

When creating new pages:

1. **Start with Shadcn/ui components**
2. **Create proper TypeScript interfaces**
3. **Use the layout components**
4. **Implement responsive design**
5. **Add accessibility attributes**
6. **Test across devices and browsers**

This ensures consistency, maintainability, and a great user experience across the entire QRCode Platform.