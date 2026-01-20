# 📋 Pages Structure Plan - QR Code Platform

This document outlines all the pages needed for the QR Code Platform application, organized by user type and functionality.

## 🏠 Public Pages (Guest Users)

### 1. Landing Page (`/`) ✅ _Implemented_

**Purpose**: Main marketing page to attract and convert visitors
**Contents**:

- Hero section with value proposition
- Call-to-action buttons (Sign Up, Try Free)
- **Public QR Code Generator**:
    - QR type selection (URL, vCard, WiFi, SMS, Email, Phone, Location, Event)
    - Dynamic content forms based on selected type
    - Live QR code preview with customization
    - Design customization (colors, patterns, gradients, logo)
    - Client-side download (PNG, SVG, JPEG, WebP)
    - No authentication required
- Feature highlights (dynamic QR, analytics, customization)
- Sticky preview card for better UX
- Reuses existing form components from authenticated Create page

### 2. About Page (`/about`)

**Purpose**: Explain the platform and its benefits
**Contents**:

- Platform overview and mission
- Key features explanation with visuals
- Use cases and real-world examples
- Team information
- Company story

### 3. Pricing Page (`/pricing`)

**Purpose**: Display subscription options and convert to paid plans
**Contents**:

- Subscription tiers (Free, Pro, Enterprise)
- Feature comparison table
- FAQ section about pricing
- Usage limits and benefits
- Contact sales for enterprise

## 🔐 Authentication Pages (From Laravel Breeze)

### 4. Login (`/login`) ✅ _Already created_

### 5. Register (`/register`) ✅ _Already created_

### 6. Forgot Password (`/forgot-password`) ✅ _Already created_

### 7. Reset Password (`/reset-password`) ✅ _Already created_

### 8. Verify Email (`/verify-email`) ✅ _Already created_

## 📊 Main Dashboard Area (Authenticated Users)

### 9. Dashboard (`/dashboard`)

**Purpose**: Main overview page for logged-in users
**Contents**:

- Overview stats cards (total QR codes, scans this month, active codes)
- Recent activity feed
- Quick actions panel (Create QR, View Analytics)
- Charts showing scan trends over time
- Top performing QR codes list

## 🎯 QR Code Management

### 10. QR Codes List (`/qr-codes`)

**Purpose**: Manage all user's QR codes
**Contents**:

- Data table with QR codes (name, type, scans, created date, status)
- Search and filter functionality
- Bulk actions (delete, export, activate/deactivate)
- Pagination
- Status indicators
- Quick preview on hover

### 11. Create QR Code (`/qr-codes/create`)

**Purpose**: Create new QR codes with customization
**Contents**:

- QR type selection tabs (URL, vCard, WiFi, SMS, Email, Phone, Location, Event)
- Dynamic content input forms based on type
- Design customization panel:
    - Color picker for foreground/background
    - Logo upload with preview
    - Style patterns (dots, shapes)
    - Size and error correction settings
- Live preview of QR code
- Export format selection
- Save and download options

### 12. Edit QR Code (`/qr-codes/{id}/edit`)

**Purpose**: Modify existing QR code content and design
**Contents**:

- Same form structure as create page
- Pre-populated with existing data
- Change tracking for dynamic QR codes
- Preview of changes
- Version history (future feature)

### 13. QR Code Details (`/qr-codes/{id}`)

**Purpose**: View and manage individual QR code
**Contents**:

- Large QR code preview
- Download in multiple formats
- QR code information (type, content, created date)
- Quick analytics overview
- Recent scans list
- Share options (email, social, embed code)
- Edit and delete actions
- Duplicate option

## 📈 Analytics & Reporting

### 14. Analytics Dashboard (`/analytics`) ✅ _Implemented_

**Purpose**: Overall analytics and insights
**Contents**:

- Key metrics dashboard (total scans, unique scanners, active QR codes)
- Scans over time visualization (bar charts)
- Device and OS breakdown charts
- Top performing QR codes list
- **Advanced Filtering**:
    - Date range selection (7 days, 30 days, month, year, custom)
    - QR code filtering (all or specific QR)
    - Quick range presets
- **CSV Export**: Export filtered analytics data
- Real-time data from `qr_scans` table

### 15. QR Code Analytics (`/qr-codes/{id}/analytics`) ✅ _Implemented_

**Purpose**: Detailed analytics for specific QR code
**Contents**:

- Scan timeline chart with date range filtering
- Device type breakdown (Mobile, Desktop, Tablet)
- Location breakdown (top countries and cities)
- Referrer information (traffic sources)
- Peak scanning hours heatmap
- Recent scans log (last 10 scans with details)
- **Date Range Filtering**: Apply custom date ranges to all metrics
- **CSV Export**: Export individual QR analytics data

## 🎨 Design & Templates

### 16. Templates (`/templates`)

**Purpose**: Browse and use pre-made QR designs
**Contents**:

- Template gallery with categories
- Template preview cards
- Filter by industry, color, style
- "Use Template" functionality
- Custom template creation
- Template sharing (future feature)

### 17. Design Studio (`/design`) ✅ _Implemented_

**Purpose**: Advanced QR code customization
**Contents**:

- Advanced design tools with live preview
- Template gallery (admin-created templates)
- Brand kit management (save and apply design presets)
- Custom color schemes with gradients
- Pattern and shape customization
- Logo upload and sizing
- Save as template (admin only)
- Apply templates to current design

### 17.5. Custom QR Shapes (Prototype) ⏸️ _On Hold_

**Purpose**: Advanced shape customization with unlimited design possibilities
**Test Pages**:

- Shape Gallery (`/design/shapes`) - Visual preview of all custom shapes
- Renderer Test (`/design/renderer-test`) - Interactive testing of custom renderer

**Features Implemented**:

- Custom SVG shape library:
    - 10 body shapes (square, rounded, dots, classy, classy-rounded, extra-rounded, diamond, star, heart, hexagon)
    - 5 eye frame shapes (square, rounded, extra-rounded, circle, leaf)
    - 5 eye ball shapes (square, rounded, dot, diamond, star)
- Visual shape selector component (5 shapes per row grid)
- Custom QR renderer using `qrcode` library
- Direct QR matrix generation (no image sampling)
- SVG and PNG export functionality
- Auto-regeneration on option changes

**Status**: Prototype complete but on hold
**Reason**: Rendering quality issues and eye alignment artifacts
**Documentation**: See `CUSTOM_QR_SHAPES_README.md` for full details
**Future**: Consider hybrid approach using `qr-code-styling` for supported shapes

## 👥 Team & User Management

### 18. Team Members (`/team`) ✅ _Implemented_

**Purpose**: Manage organization members and permissions
**Contents**:

- Team members table with roles
- Invite new members via email
- Role management (Admin, Editor, Viewer)
- Pending invitations display
- Remove members from organization
- Email invitation system with tokens
- Organization switching capability

### 19. User Profile (`/profile`)

**Purpose**: Personal account management
**Contents**:

- Personal information form
- Profile picture upload
- Change password
- Account preferences
- API keys management
- Two-factor authentication settings
- Account deletion option

## ⚙️ Settings & Configuration

### 20. Organization Settings (`/settings/organization`) ✅ _Implemented_

**Purpose**: Configure organization-wide settings
**Contents**:

- Organization profile information (name, description)
- Organization update functionality
- Team member management integration
- Invitation system
- Future: Branding settings, custom domains, integrations

### 20.5. User Preferences (`/settings/preferences`) ✅ _Implemented_

**Purpose**: Personal user preferences and customization
**Contents**:

- **Appearance Settings**:
    - Theme selection (Light, Dark, System)
    - Font size (Small, Normal, Large)
- **Interface Settings**:
    - Compact mode toggle (reduce spacing in lists)
- **Analytics Settings**:
    - Default date range for analytics views
- Persistent settings stored in database
- Real-time application across the platform

### 21. Subscription & Billing (`/billing`)

**Purpose**: Manage subscription and payments
**Contents**:

- Current plan information and usage
- Usage statistics with limits
- Upgrade/downgrade options
- Billing history table
- Payment methods management
- Invoice downloads
- Subscription cancellation

## 🔧 Admin Pages (Admin Users Only)

### 22. Admin Dashboard (`/admin`) ✅ _Implemented_

**Purpose**: Platform-wide administration
**Contents**:

- Platform statistics overview (users, organizations, subscriptions)
- User growth charts
- System health monitoring
- Revenue summary (MRR, ARR, ARPU, churn rate)
- Recent activity feed
- Quick access to admin functions

### 23. User Management (`/admin/users`) ✅ _Implemented_

**Purpose**: Manage all platform users
**Contents**:

- All users table with details
- User information (name, email, role, organization)
- Account status indicators
- Plan information
- Last seen timestamps
- Future: Search/filter, user impersonation, bulk actions

### 24. Template Management (`/admin/templates`) ✅ _Implemented_

**Purpose**: Manage platform-wide QR code templates
**Contents**:

- Template gallery with QR previews
- Delete templates
- Create new templates (via Design Studio)
- Template categories
- Template configuration management

## 📞 Support & Help

### 24. Help Center (`/help`)

**Purpose**: Self-service documentation and tutorials
**Contents**:

- Knowledge base articles
- Video tutorials
- Step-by-step guides
- FAQ sections
- Search functionality
- Categories and tags

### 25. Contact/Support (`/contact`)

**Purpose**: Customer support and feedback
**Contents**:

- Contact form with categories
- Support ticket system
- Live chat integration placeholder
- Knowledge base suggestions
- Response time expectations

---

## 🎯 Implementation Priority

### Phase 1: Core Pages (Week 1-2) - FOUNDATION

- [x] Landing Page (`/`) - Public home page with QR generator
- [x] Dashboard (`/dashboard`)
- [x] QR Codes List (`/qr-codes`)
- [x] Create QR Code (`/qr-codes/create`)
- [x] QR Code Details (`/qr-codes/{id}`)
- [x] User Profile (`/profile`)

### Phase 1.5: Customization Module (Current Sprint) - DESIGN

- [x] Color Picker (Foreground, Background)
- [x] Gradient Color Support
- [x] Pattern & Style Selection (Dots, Rounded, Square)
- [x] Eye/Marker Customization (corner squares & dots types)
- [x] Logo Upload & Sizing (centered logo)
- [x] Real-time Preview Integration (qr-code-styling + exports)

### Phase 2: Analytics & Features (Week 3-4) - FUNCTIONALITY

- [x] Analytics Dashboard (`/analytics`)
- [x] QR Code Analytics (`/qr-codes/{id}/analytics`)
- [x] Team Management (`/team`)
- [x] Role-Based Access Control
- [x] Audit Logs (User & QR Code levels)
- [x] Vector Exports (PDF, SVG, EPS)

## 🏗️ Page Implementation Strategy

### For Each Page, We'll Create:

1. **React Component** (`resources/js/Pages/{PageName}.tsx`)
    - TypeScript interface for props
    - Basic layout structure
    - Placeholder content initially
    - Proper navigation and breadcrumbs

2. **Laravel Route** (`routes/web.php`)
    - Route definition with appropriate middleware
    - Controller method if needed

3. **Controller Method** (if needed)
    - Data fetching logic
    - Authorization checks
    - Return Inertia response

4. **Initial Structure**:
    - Page title and meta tags
    - Breadcrumb navigation
    - Main content area with placeholders
    - Action buttons and navigation
    - Loading and error states

### Mock Data Strategy:

- Create TypeScript interfaces for all data types
- Use placeholder data for development
- Implement proper loading states
- Plan for real API integration later

---

## 📁 File Organization

```
resources/js/Pages/
├── Auth/ (Breeze pages) ✅
├── Dashboard.tsx ✅
├── Welcome.tsx ✅
├── QRCode/ ✅
│   ├── Index.tsx (list)
│   ├── Create.tsx
│   ├── Show.tsx (details)
│   └── Partials/ (CustomizeForm, QRCodePreview, etc.)
├── Analytics/ ✅
│   ├── Dashboard.tsx
│   └── QRCodeAnalytics.tsx
├── Team/ ✅
│   ├── Index.tsx
│   └── Partials/ (InviteMemberModal, etc.)
├── Design/ ✅
│   ├── Index.tsx (Design Studio)
│   ├── ShapeGallery.tsx (Custom shapes preview) ⏸️
│   └── RendererTest.tsx (Custom renderer test) ⏸️
├── Folders/ ✅
│   └── Index.tsx
├── Tags/ ✅
│   └── Index.tsx
├── Settings/ ✅
│   ├── Organization/ (Show.tsx)
│   ├── Preferences.tsx
│   └── Profile/ (Edit.tsx, partials)
├── Admin/ ✅
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   └── Templates.tsx
├── Public/ ✅
│   └── Welcome.tsx (Landing page with public QR generator)
├── Components/ ✅
│   └── HeroSection.tsx (Hero section for landing page)
└── Help/ (Future)
    └── Index.tsx
```

This plan serves as our roadmap for creating all necessary pages in the QR Code Platform application.

## 🎨 UI Component Library

**Shadcn/ui** will be used for all UI components throughout the application:

- **Components**: Button, Input, Card, Table, Dialog, Select, Tabs, etc.
- **Theme**: Consistent design system with custom color palette
- **Accessibility**: All components follow WAI-ARIA guidelines
- **TypeScript**: Full type safety with proper interfaces
- **Customization**: Tailwind CSS for custom styling when needed

### Shadcn/ui Components We'll Use:

- `Button` - Primary actions, secondary buttons, icon buttons
- `Card` - QR code cards, stats cards, content containers
- `Input` - Form inputs, search fields
- `Table` - QR codes list, analytics tables, user management
- `Dialog` - Modals, confirmations, forms
- `Select` - Dropdowns, filters
- `Tabs` - QR type selection, settings navigation
- `Badge` - Status indicators, labels
- `Avatar` - User profiles, team members
- `Chart` - Analytics visualizations (with Recharts integration)
- `Form` - All form handling with validation
- `Toast` - Notifications and alerts
- `Command` - Search and command palette
- `DataTable` - Advanced tables with sorting, filtering, pagination
