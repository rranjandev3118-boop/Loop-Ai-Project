# Vercel Deployment Guide for Project LOOP

## Your Vercel Project
**Project URL**: https://vercel.com/rranjandev3118-boop

## Step 1: Connect Local Project to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your existing project
cd "D:\zidio assessment\Loop-Ai-Project-main"
vercel link
```

When prompted, select your existing project: `rranjandev3118-boop`

## Step 2: Configure Environment Variables in Vercel

Go to your Vercel project dashboard:
1. Navigate to https://vercel.com/rranjandev3118-boop
2. Go to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables

| Variable | Value | How to Generate |
|----------|-------|----------------|
| `DATABASE_URL` | Your PostgreSQL connection string | From your database provider |
| `NEXTAUTH_SECRET` | 32+ character random string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | From Anthropic dashboard |
| `CRON_SECRET` | 32+ character random string | `openssl rand -base64 32` |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SMTP_HOST` | SMTP server hostname | Supplied by your email provider |
| `SMTP_PORT` | SMTP server port | `587` (or `465` for implicit TLS) |
| `SMTP_SECURE` | Whether to use implicit TLS | `false` (or `true` with port `465`) |
| `SMTP_USER` | SMTP username | Optional if your server does not require authentication |
| `SMTP_PASS` | SMTP password | Optional if your server does not require authentication |
| `SMTP_FROM` | Optional sender email address | Defaults to `SMTP_USER` |
| `NODE_ENV` | `production` | Environment mode |

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET  
openssl rand -base64 32
```

## Step 3: Database Setup

### PostgreSQL with pgvector

Your database needs the pgvector extension:

```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require&connection_limit=10
```

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option B: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. In Vercel dashboard, connect your Git repository
3. Vercel will automatically deploy on push

## Step 5: Run Database Migrations

After deployment, you need to set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to production database
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

## Step 6: Seed Production Data (Optional)

```bash
# Run production seed script
npm run seed:production
```

⚠️ **Important**: After seeding, immediately:
1. Login with `admin@loop.demo` / `ChangeMe123!`
2. Change the admin password
3. Update admin email to your email
4. Remove sample data if needed

## Step 7: Post-Deployment Verification

### Test Health Endpoint

```bash
# Test health check
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": {
    "database": true
  }
}
```

### Run Smoke Tests

```bash
# Set production URL and run tests
NEXTAUTH_URL=https://your-app.vercel.app npm run test:smoke
```

### Test Authentication

1. Navigate to `https://your-app.vercel.app/login`
2. Test login with seeded admin credentials
3. Verify dashboard loads correctly
4. Test key functionality

## Step 8: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

## Troubleshooting

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Connection Issues

```bash
# Test connection locally
npx prisma db execute --stdin

# Check DATABASE_URL format
# Ensure sslmode=require is included
# Verify pgvector extension is enabled
```

### Environment Variable Issues

1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure all required variables are set for **Production** environment
3. Redeploy after adding variables: `vercel --prod`

### Cron Job Issues

```bash
# Test cron endpoint manually
curl -X POST https://your-app.vercel.app/api/jobs/process \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring

### Vercel Dashboard

- **Deployments**: View deployment history and logs
- **Analytics**: Monitor performance and usage
- **Logs**: View server logs and errors
- **Settings**: Configure environment variables and domains

### Health Monitoring

Monitor the health endpoint regularly:
```
https://your-app.vercel.app/api/health
```

## Security Checklist

- [ ] Changed default admin password
- [ ] Updated admin email
- [ ] Removed sample data
- [ ] Configured custom domain with HTTPS
- [ ] Enabled Vercel Analytics
- [ ] Set up error tracking (optional)
- [ ] Reviewed audit logs
- [ ] Tested multi-tenant isolation

## Performance Optimization

### Database Connection Pooling

Ensure your `DATABASE_URL` includes:
```
?connection_limit=10&pool_timeout=20
```

### Vercel Edge Functions

Consider using Edge Functions for:
- Static API responses
- Authentication checks
- Simple redirects

## Backup Strategy

### Database Backups

Configure automated backups in your PostgreSQL provider.

### Manual Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Project Documentation**: `docs/DEPLOYMENT.md`
- **Testing Guide**: `docs/TESTING.md`
- **Vercel Dashboard**: https://vercel.com/rranjandev3118-boop

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
vercel --prod

# Database
npx prisma db push
npx prisma generate

# Tests
npm run test:all
npm run deploy:check
```

### Important URLs

- **Vercel Dashboard**: https://vercel.com/rranjandev3118-boop
- **Health Check**: `https://your-app.vercel.app/api/health`
- **Application**: `https://your-app.vercel.app`

## Next Steps

1. ✅ Connect local project to Vercel
2. ✅ Configure environment variables
3. ✅ Set up database with pgvector
4. ✅ Deploy to Vercel
5. ✅ Run migrations
6. ✅ Seed initial data
7. ✅ Change default credentials
8. ✅ Configure custom domain
9. ✅ Set up monitoring
10. ✅ Test all functionality

Your Project LOOP is ready for production deployment to your Vercel project!