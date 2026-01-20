#!/bin/bash

# QRCode Platform - Deployment Script for cPanel
# This script automates the deployment process

echo "🚀 QRCode Platform Deployment"
echo "=============================="
echo ""

# Configuration
PROJECT_DIR="/home/username/public_html"  # Change 'username' to your cPanel username
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project directory
cd $PROJECT_DIR || exit

echo -e "${YELLOW}📥 Step 1: Pulling latest code from Git...${NC}"
git pull origin $BRANCH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed! Please check your repository.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Code updated${NC}"
echo ""

echo -e "${YELLOW}📦 Step 2: Installing Composer dependencies...${NC}"
composer install --optimize-autoloader --no-dev

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Composer install failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🗄️ Step 3: Running database migrations...${NC}"
php artisan migrate --force

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migration failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Migrations complete${NC}"
echo ""

echo -e "${YELLOW}🧹 Step 4: Clearing caches...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo -e "${GREEN}✅ Caches cleared${NC}"
echo ""

echo -e "${YELLOW}💾 Step 5: Caching configuration...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo -e "${GREEN}✅ Configuration cached${NC}"
echo ""

echo -e "${YELLOW}🔒 Step 6: Setting permissions...${NC}"
chmod -R 775 storage bootstrap/cache

echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "🌐 Visit your site to verify: https://yourdomain.com"
echo ""
