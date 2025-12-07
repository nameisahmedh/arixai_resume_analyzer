# Setup Instructions

Complete guide to set up ArixAI Resume Analyzer for development or production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [API Configuration](#api-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: v20.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v10.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **PostgreSQL**: v12+ (optional, for database features)

### Verify Installation
```bash
node --version     # Should be v20+
npm --version      # Should be v10+
```

## Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/arixai-resume-analyzer.git
cd arixai-resume-analyzer
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
# Copy example to .env
cp .env.example .env

# Or create manually
touch .env
```

### Step 4: Configure Environment Variables
See [Environment Variables](#environment-variables) section below.

### Step 5: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5000` in your browser.

## Environment Variables

### Required Variables

Create `.env` file with these variables:

```env
# ===== CLERK AUTHENTICATION (Required) =====
# Sign up at https://clerk.com
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# ===== PERPLEXITY API (Required) =====
# Sign up at https://www.perplexity.ai
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxx

# ===== DATABASE (Optional) =====
# For PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/arixai

# ===== SERVER CONFIG =====
NODE_ENV=development
PORT=5000
```

### Optional Variables

```env
# For production
NODE_ENV=production

# Custom port
PORT=3000

# Database connection with SSL
DATABASE_URL=postgresql://user:password@host:5432/arixai?sslmode=require
```

## API Configuration

### Clerk Setup (5 minutes)

1. **Create Clerk Account**
   - Visit [clerk.com](https://clerk.com)
   - Sign up with email or Google

2. **Create Application**
   - Click "Create Application"
   - Choose your preferred authentication method
   - Name it "ArixAI Resume Analyzer"

3. **Get API Keys**
   - Go to "API Keys" section
   - Copy `Secret Key` → `CLERK_SECRET_KEY`
   - Copy `Publishable Key` → `VITE_CLERK_PUBLISHABLE_KEY`

4. **Setup Webhook (Important!)**
   - Go to "Webhooks" section
   - Create new endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Enable: User events (user.created, user.updated, user.deleted)
   - Copy webhook secret → `CLERK_WEBHOOK_SECRET`

5. **Configure Redirect URLs**
   - Development: `http://localhost:5000`
   - Production: `https://yourdomain.com`

### Perplexity API Setup (5 minutes)

1. **Get API Key**
   - Visit [Perplexity API Console](https://www.perplexity.ai/api)
   - Create or log in to account
   - Generate new API key
   - Copy to `PERPLEXITY_API_KEY`

2. **Check API Credits**
   - Dashboard shows remaining API balance
   - Monitor usage to avoid surprises

3. **Choose Model**
   - Default: `sonar` (fast, cost-effective)
   - Alternative: `sonar-reasoning-pro` (more detailed, uses more tokens)

## Database Setup (Optional)

### Install PostgreSQL

**macOS (Homebrew)**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and follow setup wizard
- Note username/password

**Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE arixai;
\q
```

### Configure Connection

Update `.env`:
```env
# macOS/Linux
DATABASE_URL=postgresql://postgres:password@localhost:5432/arixai

# Windows
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/arixai
```

### Push Schema

```bash
npm run db:push
```

This creates all necessary tables automatically.

## Running the Application

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Source maps available
- Debug mode active
- Visit: `http://localhost:5000`

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder.

### Production Mode
```bash
npm start
```
- Requires built files (run `npm run build` first)
- No hot reload
- Optimized performance

### Available Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production server
npm run db:push          # Push database schema
```

## Troubleshooting

### Common Issues

#### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

#### "Cannot find module '@shared/schema'"
- Ensure all files are created (see project structure)
- Run: `npm install`
- Restart dev server

#### "Clerk authentication not working"
- Verify `CLERK_SECRET_KEY` and `VITE_CLERK_PUBLISHABLE_KEY`
- Check Clerk dashboard for correct application
- Ensure localhost:5000 in allowed URLs
- Clear browser cookies and try again

#### "Perplexity API errors"
- Check API key is valid in Perplexity dashboard
- Verify remaining API credits
- Ensure `PERPLEXITY_API_KEY` in `.env`
- Check API rate limits (wait before retrying)

#### "Database connection failed"
```bash
# Test PostgreSQL connection
psql "postgresql://user:password@localhost:5432/arixai"

# If failed, verify:
# 1. PostgreSQL is running
# 2. Database exists (CREATE DATABASE arixai;)
# 3. Credentials in .env are correct
# 4. Port 5432 is not blocked
```

#### "Cannot upload resume"
- File must be < 5MB
- Format must be PDF, DOCX, DOC, or TXT
- Check browser console for error details

### Getting Help

1. Check console for error messages
2. Review logs in terminal
3. Visit [Issues](https://github.com/yourusername/arixai-resume-analyzer/issues)
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Next Steps

- Review [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- Check [README.md](./README.md) for full documentation
- Explore project structure in `PROJECT_STRUCTURE.md`

---

Need help? Open an issue or contact support!
