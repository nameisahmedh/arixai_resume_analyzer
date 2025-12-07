# ArixAI Resume Analyzer - Setup Guide

## Database Setup

### Option 1: Using Drizzle Kit (Recommended)

```bash
# Push schema to database
npm run db:push
```

### Option 2: Manual SQL Setup

If you're using Neon or another PostgreSQL provider, run this SQL in your database console:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  analysis_count INTEGER DEFAULT 0 NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE NOT NULL,
  premium_since TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
```

## Environment Variables

Create a `.env` file with:

```env
# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Perplexity API
PERPLEXITY_API_KEY=your_perplexity_api_key

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=5000
NODE_ENV=development
```

## Running the Application

```bash
# Install dependencies
npm install

# Setup database (if not done manually)
npm run db:push

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`
