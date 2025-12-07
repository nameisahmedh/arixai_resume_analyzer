# Deployment Guide - Vercel

## Prerequisites

1. Vercel account (https://vercel.com)
2. GitHub repository connected to Vercel
3. All environment variables configured

## Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Search for `arixai_resume_analyzer`
5. Click "Import"

## Step 2: Configure Environment Variables

In Vercel Dashboard, go to your project → Settings → Environment Variables

Add these variables:

```
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
PERPLEXITY_API_KEY=your_perplexity_api_key
DATABASE_URL=your_neon_database_url
NODE_ENV=production
PORT=3000
```

## Step 3: Deploy

### Option 1: Automatic (Recommended)
- Push changes to GitHub main branch
- Vercel automatically deploys

### Option 2: Manual Deploy
```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy.

## Step 4: Update Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Update webhook URL to: `https://your-vercel-domain.vercel.app/api/webhooks/clerk`
3. Keep the same signing secret

## Step 5: Test Deployment

1. Visit your Vercel domain
2. Sign in with Clerk
3. Upload a resume to test the API

## Troubleshooting

### Build fails
- Check `npm run build` works locally
- Verify all environment variables are set
- Check Node.js version (should be 20+)

### Database connection fails
- Verify DATABASE_URL is correct
- Check Neon database is accessible
- Run migrations: `npm run db:push`

### API errors
- Check server logs in Vercel dashboard
- Verify PERPLEXITY_API_KEY is valid
- Check Clerk configuration

## Monitoring

View logs in Vercel Dashboard:
- Project → Deployments → Select deployment → Logs
- Real-time logs available during deployment

## Rollback

If deployment fails:
1. Go to Deployments tab
2. Click previous successful deployment
3. Click "Promote to Production"
