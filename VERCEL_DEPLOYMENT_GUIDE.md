# Vercel Deployment Guide

## Configuration Settings for Vercel

### Framework Preset
- **Framework**: Create React App

### Build & Development Settings
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `cd frontend && npm install`
- **Development Command**: `cd frontend && npm start`

### Root Directory
- **Root Directory**: `./` (leave empty or use root)

### Environment Variables
Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To get these values:**
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `REACT_APP_SUPABASE_URL`
   - **anon public** key → Use for `REACT_APP_SUPABASE_ANON_KEY`

## Benefits of GitHub Integration

✅ **Automatic Deployments**: Every push to supabase-migration branch auto-deploys
✅ **Preview Deployments**: Every PR gets a preview URL
✅ **Git History**: Easy rollbacks and version tracking
✅ **Faster**: No local upload time
✅ **Team Collaboration**: Others can deploy from same repo

## Supabase CORS Settings

Make sure your Supabase project allows your Vercel domain:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL (e.g., https://your-app.vercel.app) to:
   - Site URL
   - Additional URLs

## Deployment Steps

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import from GitHub: RiverRatCoder/vaccine-lookup-app
4. Select branch: supabase-migration
5. Configure settings above
6. Deploy!
