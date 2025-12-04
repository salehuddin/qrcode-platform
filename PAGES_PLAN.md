# 📋 Pages Structure Plan - QR Code Platform

This document outlines all the pages needed for the QR Code Platform application, organized by user type and functionality.

## 🏠 Public Pages (Guest Users)

### 1. Landing Page (`/`)
**Purpose**: Main marketing page to attract and convert visitors
**Contents**:
- Hero section with value proposition
- Feature highlights (dynamic QR, analytics, customization)
- Pricing tiers preview
- Social proof and testimonials
- Call-to-action buttons (Sign Up, Try Free)

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

### 4. Login (`/login`) ✅ *Already created*
### 5. Register (`/register`) ✅ *Already created*
### 6. Forgot Password (`/forgot-password`) ✅ *Already created*
### 7. Reset Password (`/reset-password`) ✅ *Already created*
### 8. Verify Email (`/verify-email`) ✅ *Already created*

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

### 14. Analytics Dashboard (`/analytics`)
**Purpose**: Overall analytics and insights
**Contents**:
- Key metrics dashboard
- Geographic heat map of scans
- Device and browser breakdown charts
- Time-based analytics (hourly, daily, weekly, monthly)
- Top performing QR codes
- Conversion funnel
- Export reports (CSV, PDF)

### 15. QR Code Analytics (`/qr-codes/{id}/analytics`)
**Purpose**: Detailed analytics for specific QR code
**Contents**:
- Scan timeline chart
- Geographic distribution map
- Device statistics pie charts
- Referrer information
- Unique vs repeat scans
- Peak scanning times
- User behavior flow

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

### 17. Design Studio (`/design`)
**Purpose**: Advanced QR code customization
**Contents**:
- Advanced design tools
- Logo management library
- Custom color schemes
- Pattern and shape editor
- Background image options
- Brand kit integration
- Export custom templates

## 👥 Team & User Management

### 18. Team Members (`/team`)
**Purpose**: Manage organization members and permissions
**Contents**:
- Team members table with roles
- Invite new members form
- Role management (Admin, Editor, Viewer)
- Permission settings per member
- Member activity overview
- Remove/deactivate members

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

### 20. Organization Settings (`/settings`)
**Purpose**: Configure organization-wide settings
**Contents**:
- Organization profile information
- Branding settings (logo, colors)
- Custom domain configuration
- Default QR code settings
- Integration settings (Google Analytics, webhooks)
- Data export options

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

### 22. Admin Dashboard (`/admin`)
**Purpose**: Platform-wide administration
**Contents**:
- Platform statistics overview
- User growth metrics
- System health monitoring
- Revenue and subscription metrics
- Recent user activity
- Support ticket summary

### 23. User Management (`/admin/users`)
**Purpose**: Manage all platform users
**Contents**:
- All users table with search/filter
- User details and account status
- Subscription management
- Support ticket access
- User impersonation (for support)
- Bulk actions for user management

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
- [ ] Analytics Dashboard (`/analytics`)
- [ ] QR Code Analytics (`/qr-codes/{id}/analytics`)
- [ ] Edit QR Code (`/qr-codes/{id}/edit`)


### Phase 3: Team & Management (Week 5-6) - COLLABORATION
- [ ] Team Members (`/team`)
- [ ] Organization Settings (`/settings`)
- [ ] Design Studio (`/design`)
- [ ] Subscription & Billing (`/billing`)

### Phase 4: Admin & Polish (Week 7-8) - ADMIN & MARKETING
- [ ] Admin Dashboard (`/admin`)
- [ ] User Management (`/admin/users`)
- [ ] Help Center (`/help`)
- [ ] Landing Page (`/`)
- [ ] About Page (`/about`)
- [ ] Pricing Page (`/pricing`)
- [ ] Contact/Support (`/contact`)

---

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
├── Auth/ (Breeze pages)
├── Dashboard.tsx
├── QRCode/
│   ├── Index.tsx (list)
│   ├── Create.tsx
│   ├── Edit.tsx
│   └── Show.tsx (details)
├── Analytics/
│   ├── Dashboard.tsx
│   └── QRCodeAnalytics.tsx
├── Team/
│   └── Index.tsx
├── Settings/
│   ├── Organization.tsx
│   ├── Profile.tsx
│   └── Billing.tsx
├── Templates/
│   └── Index.tsx
├── Admin/
│   ├── Dashboard.tsx
│   └── Users.tsx
├── Public/
│   ├── Landing.tsx
│   ├── About.tsx
│   ├── Pricing.tsx
│   └── Contact.tsx
└── Help/
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
