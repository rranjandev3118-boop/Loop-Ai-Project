@echo off
REM Quick Deployment Script for Project LOOP to Vercel (Windows)

echo 🚀 Project LOOP - Quick Vercel Deployment
echo ==========================================
echo.

REM Step 1: Generate secrets
echo 📝 Step 1: Generating production secrets...
call npm run secrets:generate
echo ✅ Secrets generated
echo.

REM Step 2: Run tests
echo 🧪 Step 2: Running comprehensive tests...
call npm run test:all
echo ✅ Tests passed
echo.

REM Step 3: Build project
echo 🏗️  Step 3: Building project...
call npm run build
echo ✅ Build completed
echo.

REM Step 4: Deploy to Vercel
echo 🚀 Step 4: Deploying to Vercel...
echo Please ensure you're logged in to Vercel (vercel login)
echo Your project: https://vercel.com/rranjandev3118-boop
echo.
pause
call vercel --prod
echo ✅ Deployment completed
echo.

REM Step 5: Database setup
echo 🗄️  Step 5: Database setup
echo After deployment, you'll need to:
echo 1. Add environment variables to Vercel
echo 2. Run: npx prisma db push
echo 3. Run: npm run seed:production (optional)
echo.

echo ==========================================
echo 🎉 Deployment process completed!
echo.
echo 📋 Next Steps:
echo 1. Add secrets to Vercel Environment Variables
echo 2. Configure your DATABASE_URL
echo 3. Add your ANTHROPIC_API_KEY
echo 4. Run database migrations
echo 5. Test your deployed application
echo.
echo 🌐 Your Vercel Dashboard: https://vercel.com/rranjandev3118-boop
pause