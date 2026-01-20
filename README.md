# 🎯 QRCode Platform

**Dynamic QR Code & Link Management Platform** built with Laravel + React + TypeScript

[![Laravel](https://img.shields.io/badge/Laravel-10+-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

## ✨ Features

### 🎨 Dynamic QR Code Management

- **Editable Links**: Update destination URLs without changing QR codes
- **Multiple QR Types**: URL, vCard, WiFi, SMS, Email, Phone, Location, Events
- **Custom Styling**: Colors, patterns, gradients, and logo embedding
- **Export Formats**: PNG, SVG, PDF, EPS with vector support

### 📊 Analytics & Tracking

- **Real-time Analytics**: Scan tracking with geographic data and time-series visualization
- **Device Insights**: Browser, OS, and device type detection with breakdown charts
- **Performance Metrics**: Unique vs total scans, peak hours, location breakdown
- **Advanced Filtering**: Date range selection, QR code filtering, custom periods
- **CSV Export**: Export analytics data for external analysis
- **Individual QR Analytics**: Detailed scan timeline, referrers, and recent scans log

### 👥 Team Collaboration

- **Role-Based Access**: Admin, Editor, Viewer permissions with granular control
- **Multi-tenant Architecture**: Organization-based data isolation
- **Team Management**: Invite members, manage permissions, view activity
- **Brand Consistency**: Template locking, brand kits, and design presets
- **Folder Organization**: Hierarchical folder structure for QR code management
- **Tag System**: Flexible tagging for categorization and filtering

### 🔒 Enterprise Features

- **Custom Domains**: Use your own branded short domains (planned)
- **API Access**: Programmatic QR code generation and management (planned)
- **Advanced Security**: Role-based access control, activity audit logs
- **User Preferences**: Persistent theme, font size, compact mode, analytics defaults
- **Subscription Management**: Multiple pricing tiers with usage limits (planned)

## 🚀 Tech Stack

### Backend

- **Laravel 10+** - PHP web framework with Eloquent ORM
- **Laravel Sanctum** - SPA authentication
- **Laravel Queues** - Background job processing
- **MySQL/PostgreSQL** - Primary database
- **Redis** - Caching and session storage

### Frontend

- **React 18** - Component-based UI framework
- **TypeScript** - Type safety and better DX
- **Inertia.js** - Server-side rendering with React
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern, accessible component library
- **Vite** - Fast development build tool

### QR Code & Image Processing

- **endroid/qr-code** - PHP QR code generation library
- **Intervention Image** - Image manipulation for logos
- **SVG Support** - Scalable vector graphics for print quality

## 📋 Project Structure

```
qrcode-platform/
├── 📄 PRD.md                     # Product Requirements Document
├── 📄 PAGES_PLAN.md             # Complete pages structure plan
├── app/                         # Laravel application code
│   ├── Http/Controllers/        # API and web controllers
│   ├── Models/                  # Eloquent models
│   └── Services/               # Business logic services
├── resources/js/               # React + TypeScript frontend
│   ├── Components/             # Reusable UI components
│   ├── Pages/                  # Inertia.js pages
│   ├── types/                  # TypeScript definitions
│   └── app.tsx                 # Main application entry
├── database/migrations/        # Database schema migrations
├── routes/                     # Web and API routes
└── public/                     # Public assets
```

## 🛠️ Development Setup

### Prerequisites

- **PHP 8.2+** with required extensions
- **Composer** for PHP dependency management
- **Node.js 18+** and npm for frontend assets
- **MySQL/PostgreSQL** database
- **Redis** (optional, for caching)

### Quick Start with Laragon (Windows)

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/qrcode-platform.git
    cd qrcode-platform
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install --legacy-peer-deps
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure database**
    - Update `.env` with your database credentials
    - Create database: `qrcode_platform`

6. **Run migrations**

    ```bash
    php artisan migrate
    ```

7. **Build frontend assets**

    ```bash
    npm run dev    # Development with hot reload
    npm run build  # Production build
    ```

8. **Start development server**
    - With Laragon: Access `http://qrcode-platform.test`
    - Without Laragon: `php artisan serve` → `http://localhost:8000`

### Alternative Setup (Docker)

```bash
# Using Laravel Sail
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

## 📚 Documentation

- **[PRD.md](PRD.md)** - Complete product requirements and technical specifications
- **[PAGES_PLAN.md](PAGES_PLAN.md)** - Detailed pages structure and implementation plan
- **[CUSTOM_QR_SHAPES_README.md](CUSTOM_QR_SHAPES_README.md)** - Custom QR shapes feature (on hold for future implementation)
- **API Documentation** - Coming soon with Laravel API resources

## 🎯 Roadmap

### Phase 1: Foundation (Week 1-2) ✅

- [x] Laravel + React + TypeScript setup
- [x] Shadcn/ui integration
- [x] Authentication system (Laravel Breeze)
- [x] Basic project structure
- [x] Core page creation (Dashboard, QR List, Create QR)
- [x] Public home page with QR generator

### Phase 2: Core Features (Week 3-4) ✅

- [x] QR code generation engine
- [x] Advanced customization (colors, logos, gradients, patterns)
- [x] URL shortening service (Dynamic QRs)
- [x] Analytics foundation (Mock data &amp; Routes)

### Phase 3: Advanced Features (Week 5-6) ✅

- [x] Advanced design tools (Design Studio)
- [x] Team management (Organizations, Invitations, Roles)
- [x] Template system (Admin template management)
- [x] Brand Kits (Reusable design presets)
- [x] Folder organization system
- [x] Tag management system
- [x] QR code soft deletes (Trash functionality)

### Phase 4: Enterprise & Polish (Week 7-8) ✅

- [x] Admin dashboard
- [x] Admin user management
- [x] Admin template management
- [x] Export functionality (Vector formats: PNG, SVG, PDF, EPS)
- [x] Real-time analytics with scan tracking
- [x] Advanced analytics filtering (date range, QR code selection)
- [x] CSV export for analytics data
- [x] User preferences (theme, font size, compact mode, analytics defaults)
- [x] Activity logging (QR codes and user actions)
- [x] Database performance optimization (indexed analytics queries)

### Phase 5: API & Integrations (Future) 🔮

- [ ] RESTful API for QR code management
- [ ] Subscription system with Stripe integration
- [ ] Custom domain support
- [ ] Webhook integrations
- [ ] Third-party analytics integrations
- [ ] **Custom QR Shapes** (Prototype completed - see CUSTOM_QR_SHAPES_README.md)
    - Custom SVG shape library (10 body, 5 eye frame, 5 eye ball shapes)
    - Visual shape selector component
    - Custom QR renderer with direct matrix generation
    - Shape gallery for preview
    - On hold pending rendering quality improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards for PHP
- Use TypeScript for all React components
- Follow conventional commits for commit messages
- Write tests for new features
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Laravel** - The PHP framework for web artisans
- **React** - A JavaScript library for building user interfaces
- **Shadcn/ui** - Beautifully designed components
- **Tailwind CSS** - A utility-first CSS framework
- **endroid/qr-code** - QR code generation for PHP

---

**Built with ❤️ for the QR code community**

[🌟 Star this repo](https://github.com/yourusername/qrcode-platform) if you find it helpful!

[🌟 Star this repo](https://github.com/yourusername/qrcode-platform) if you find it helpful!
