# 🚀 cPanel Deployment Guide - QRCode Platform

## Overview

This guide covers deploying your Laravel + React (Inertia.js) application to cPanel hosting and maintaining it after deployment.

## Prerequisites

### cPanel Requirements

- ✅ PHP 8.2+ with required extensions
- ✅ Composer installed
- ✅ Node.js 18+ and npm
- ✅ MySQL database
- ✅ SSH access (recommended)
- ✅ Git installed (for deployment automation)

### Check Your cPanel

1. **PHP Version**: cPanel → MultiPHP Manager → Select PHP 8.2+
2. **PHP Extensions**: Enable: `mbstring`, `xml`, `bcmath`, `pdo_mysql`, `zip`, `gd`, `curl`
3. **SSH Access**: cPanel → SSH Access → Enable
4. **Git**: Usually pre-installed, check via SSH: `git --version`

---

## 📦 Deployment Methods

### Method 1: Manual Deployment (Recommended for First Time)

#### Step 1: Prepare Your Application for Production

**1.1 Build Frontend Assets**

```bash
# On your local machine
cd c:/laragon/www/qrcode-platform
npm run build
```

**1.2 Optimize Laravel**

```bash
# Generate optimized autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**1.3 Create Production .env**
Create a `.env.production` file with production settings:

```env
APP_NAME="QRCode Platform"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### Step 2: Upload Files to cPanel

**2.1 Via File Manager (Small Projects)**

1. Compress your project: `zip -r qrcode-platform.zip .` (exclude `node_modules`, `.git`)
2. cPanel → File Manager → Upload ZIP
3. Extract in `public_html` or subdirectory

**2.2 Via FTP (Recommended)**

1. Use FileZilla or similar FTP client
2. Connect to your cPanel FTP
3. Upload all files EXCEPT:
    - `node_modules/`
    - `.git/`
    - `storage/logs/*`
    - `.env` (upload `.env.production` as `.env`)

**2.3 Via Git (Best Practice)**

```bash
# SSH into your cPanel
ssh username@yourdomain.com

# Navigate to web directory
cd public_html

# Clone your repository
git clone https://github.com/yourusername/qrcode-platform.git .

# Or if already cloned, pull latest
git pull origin main
```

#### Step 3: Configure cPanel

**3.1 Create MySQL Database**

1. cPanel → MySQL Databases
2. Create database: `username_qrcode`
3. Create user: `username_qruser`
4. Add user to database with ALL PRIVILEGES
5. Note credentials for `.env`

**3.2 Set Document Root**

1. cPanel → Domains → Manage
2. Set Document Root to: `public_html/public` (Laravel's public folder)
3. Save changes

**3.3 Configure .htaccess**
Ensure `public/.htaccess` exists with:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

#### Step 4: Install Dependencies via SSH

```bash
# SSH into your server
ssh username@yourdomain.com
cd public_html

# Install Composer dependencies
composer install --optimize-autoloader --no-dev

# Set permissions
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Generate app key (if not set)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Step 5: Set Permissions

```bash
# Set ownership (replace 'username' with your cPanel username)
chown -R username:username /home/username/public_html

# Set directory permissions
find /home/username/public_html -type d -exec chmod 755 {} \;

# Set file permissions
find /home/username/public_html -type f -exec chmod 644 {} \;

# Storage and cache need write permissions
chmod -R 775 storage bootstrap/cache
```

#### Step 6: Configure Cron Jobs (for Queue & Scheduler)

**cPanel → Cron Jobs**

Add this cron job to run Laravel scheduler every minute:

```bash
* * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1
```

For queue workers (if using queues):

```bash
* * * * * cd /home/username/public_html && php artisan queue:work --stop-when-empty >> /dev/null 2>&1
```

#### Step 7: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test registration and login
3. Create a QR code
4. Check analytics
5. Test all major features

---

### Method 2: Automated Deployment with Git Hooks

#### Setup Git Deployment

**1. Create Deploy Script**

Create `deploy.sh` in your project root:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/username/public_html

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install/update composer dependencies
echo "📦 Installing dependencies..."
composer install --optimize-autoloader --no-dev

# Run migrations
echo "🗄️ Running migrations..."
php artisan migrate --force

# Clear and cache
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "💾 Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
echo "🔒 Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

**2. Deploy with One Command**

```bash
ssh username@yourdomain.com 'cd public_html && ./deploy.sh'
```

---

## 🔄 Continuous Development Workflow

### Development → Production Pipeline

#### 1. Local Development

```bash
# Work on features locally
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature
```

#### 2. Merge to Main

```bash
# After testing locally
git checkout main
git merge feature/new-feature
git push origin main
```

#### 3. Deploy to Production

```bash
# SSH and run deploy script
ssh username@yourdomain.com 'cd public_html && ./deploy.sh'

# Or manually
ssh username@yourdomain.com
cd public_html
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

### Frontend Changes (React/Inertia)

**When you update React components:**

```bash
# 1. Build assets locally
npm run build

# 2. Commit built assets
git add public/build
git commit -m "build: Update frontend assets"
git push origin main

# 3. Deploy
ssh username@yourdomain.com 'cd public_html && git pull origin main'
```

**Alternative: Build on Server (if Node.js available)**

```bash
# In deploy.sh, add:
npm install
npm run build
```

---

## 🛠️ Common Deployment Issues & Fixes

### Issue 1: 500 Internal Server Error

**Fix:**

```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Common causes:
# - Missing .env file
# - Wrong APP_KEY
# - Database connection issues
# - Missing PHP extensions
```

### Issue 2: CSS/JS Not Loading

**Fix:**

```bash
# 1. Check APP_URL in .env
APP_URL=https://yourdomain.com

# 2. Rebuild assets
npm run build

# 3. Clear cache
php artisan config:clear
```

### Issue 3: Database Connection Failed

**Fix:**

```bash
# Check .env database credentials
# Ensure database user has privileges
# Test connection:
php artisan tinker
>>> DB::connection()->getPdo();
```

### Issue 4: Storage Permissions

**Fix:**

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R username:username storage bootstrap/cache
```

### Issue 5: Queue Jobs Not Running

**Fix:**

```bash
# Check cron job is set up
crontab -l

# Manually run queue
php artisan queue:work

# Check failed jobs
php artisan queue:failed
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

- Monitor error logs: `storage/logs/laravel.log`
- Check disk space: `df -h`
- Monitor database size
- Check queue jobs: `php artisan queue:failed`

### Weekly Tasks

- Review analytics data
- Check for Laravel/package updates
- Backup database
- Review user feedback

### Monthly Tasks

- Security updates: `composer update`
- Performance optimization
- Database cleanup
- Review and archive old QR codes

---

## 🔐 Security Best Practices

### 1. Environment Security

```bash
# Protect .env file
chmod 600 .env

# Add to .htaccess in root
<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

### 2. Disable Debug Mode

```env
APP_DEBUG=false
APP_ENV=production
```

### 3. HTTPS Only

```apache
# In .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 4. Regular Backups

```bash
# Database backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Files backup
tar -czf backup_$(date +%Y%m%d).tar.gz /home/username/public_html
```

---

## 🚀 Quick Deployment Checklist

- [ ] Build frontend assets (`npm run build`)
- [ ] Update `.env` with production credentials
- [ ] Upload files to cPanel (exclude `node_modules`, `.git`)
- [ ] Set document root to `public` folder
- [ ] Create MySQL database and user
- [ ] Run `composer install --no-dev`
- [ ] Run `php artisan migrate --force`
- [ ] Set storage permissions (775)
- [ ] Cache config/routes/views
- [ ] Set up cron jobs
- [ ] Test all features
- [ ] Enable HTTPS
- [ ] Set `APP_DEBUG=false`

---

## 📞 Support Resources

- **Laravel Deployment**: https://laravel.com/docs/deployment
- **cPanel Documentation**: https://docs.cpanel.net/
- **Inertia.js Deployment**: https://inertiajs.com/server-side-setup

---

**Last Updated:** 2026-01-20  
**Version:** 1.0
