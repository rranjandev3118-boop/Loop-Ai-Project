#!/bin/bash
# Quick Deployment Script for Project LOOP to Vercel

set -e

echo "🚀 Project LOOP - Quick Vercel Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Generate secrets
echo "📝 Step 1: Generating production secrets..."
npm run secrets:generate
echo -e "${GREEN}✅ Secrets generated${NC}"
echo ""

# Step 2: Run tests
echo "🧪 Step 2: Running comprehensive tests..."
npm run test:all
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Step 3: Build project
echo "🏗️  Step 3: Building project..."
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Step 4: Deploy to Vercel
echo "🚀 Step 4: Deploying to Vercel..."
echo "Please ensure you're logged in to Vercel (vercel login)"
echo "Your project: https://vercel.com/rranjandev3118-boop"
echo ""
read -p "Press Enter to continue with deployment..."
vercel --prod
echo -e "${GREEN}✅ Deployment completed${NC}"
echo ""

# Step 5: Database setup
echo "🗄️  Step 5: Database setup"
echo "After deployment, you'll need to:"
echo "1. Add environment variables to Vercel"
echo "2. Run: npx prisma db push"
echo "3. Run: npm run seed:production (optional)"
echo ""

echo "=========================================="
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Add secrets to Vercel Environment Variables"
echo "2. Configure your DATABASE_URL"
echo "3. Add your ANTHROPIC_API_KEY"
echo "4. Run database migrations"
echo "5. Test your deployed application"
echo ""
echo "🌐 Your Vercel Dashboard: https://vercel.com/rranjandev3118-boop"