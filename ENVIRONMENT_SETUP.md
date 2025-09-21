# Environment Setup Guide

## Overview
This project now uses environment variables for Supabase configuration instead of hardcoded credentials, improving security and flexibility.

## Frontend Setup

1. **Create Environment File**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configure Frontend Variables**
   Edit `frontend/.env` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Backend Setup

1. **Create Environment File**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Configure Backend Variables**
   Edit `backend/.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key
   ```

## Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use for `SUPABASE_URL` / `REACT_APP_SUPABASE_URL`
   - **anon public** key → Use for `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `SUPABASE_SERVICE_KEY` (backend only)

## Security Notes

- ✅ Environment files (`.env`) are already excluded from version control
- ✅ Never commit actual credentials to the repository
- ✅ Use example files (`.env.example`) to document required variables
- ✅ Frontend uses anon key (safe for public exposure)
- ✅ Backend uses service role key (must be kept private)

## Running Scripts

After setting up environment variables, you can run:

- Frontend: `npm start` (from frontend directory)
- Backend import: `node import-to-supabase.js` (from backend directory)
- Backend populate: `node ../populate-supabase.js` (from project root)
