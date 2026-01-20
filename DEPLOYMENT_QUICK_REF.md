# 🚀 Quick Deployment Reference

## First-Time Deployment

### 1. Prepare Locally

```bash
npm run build
composer install --optimize-autoloader --no-dev
```

### 2. Upload to cPanel

- Via Git: `git clone https://github.com/yourusername/qrcode-platform.git`
- Via FTP: Upload all files except `node_modules`, `.git`

### 3. Configure cPanel

- Set Document Root: `public_html/public`
- Create MySQL database
- Update `.env` with database credentials

### 4. Install & Setup (via SSH)

```bash
cd public_html
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
```

### 5. Set Up Cron Job

```bash
* * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1
```

---

## Continuous Development Workflow

### Local Development

```bash
# 1. Make changes locally
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat: Add my feature"
git push origin feature/my-feature

# 2. Merge to main
git checkout main
git merge feature/my-feature
git push origin main
```

### Deploy to Production

**Option A: Automated (Recommended)**

```bash
ssh username@yourdomain.com 'cd public_html && ./deploy.sh'
```

**Option B: Manual**

```bash
ssh username@yourdomain.com
cd public_html
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
```

---

## Frontend Changes (React/Inertia)

### When you update React components:

```bash
# 1. Build locally
npm run build

# 2. Commit built assets
git add public/build
git commit -m "build: Update frontend"
git push origin main

# 3. Deploy
ssh username@yourdomain.com 'cd public_html && git pull origin main'
```

---

## Common Commands

### Clear All Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Rebuild Caches

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database

```bash
# Run migrations
php artisan migrate --force

# Rollback last migration
php artisan migrate:rollback --step=1

# Fresh migration (DANGER: Drops all tables)
php artisan migrate:fresh --force
```

### Permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R username:username storage bootstrap/cache
```

---

## Troubleshooting

### 500 Error

```bash
# Check logs
tail -f storage/logs/laravel.log

# Common fixes
php artisan config:clear
chmod -R 775 storage
```

### CSS/JS Not Loading

```bash
# Check .env
APP_URL=https://yourdomain.com

# Rebuild
npm run build
php artisan config:clear
```

### Database Connection Error

```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## Quick Checklist

**Before Deployment:**

- [ ] Build assets: `npm run build`
- [ ] Test locally
- [ ] Commit and push to Git
- [ ] Backup production database

**During Deployment:**

- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Clear caches
- [ ] Set permissions

**After Deployment:**

- [ ] Test login/registration
- [ ] Create test QR code
- [ ] Check analytics
- [ ] Monitor error logs

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
