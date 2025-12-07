# Quick Start Guide

Get ArixAI Resume Analyzer up and running in 5 minutes.

## Prerequisites

- Node.js v20+ and npm v10+
- GitHub account (for repository)
- Clerk account (free tier available)
- Perplexity API account ($5+ credits recommended)

## 5-Minute Setup

### Step 1: Clone Repository (1 min)
```bash
git clone https://github.com/yourusername/arixai-resume-analyzer.git
cd arixai-resume-analyzer
```

### Step 2: Install Dependencies (2 min)
```bash
npm install
```

### Step 3: Setup Environment Variables (1 min)
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
CLERK_SECRET_KEY=your_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
```

### Step 4: Start Development Server (1 min)
```bash
npm run dev
```

Visit `http://localhost:5000` in your browser!

---

## Getting API Keys

### Clerk (Authentication)

1. Visit https://clerk.com
2. Sign up with email
3. Create new application
4. Copy `Secret Key` and `Publishable Key` to `.env`

**Time: 2-3 minutes**

### Perplexity (Resume Analysis)

1. Visit https://www.perplexity.ai/api
2. Sign in or create account
3. Generate API key
4. Add to `.env` as `PERPLEXITY_API_KEY`

**Time: 2-3 minutes**

---

## First Use

1. Sign in with Clerk credentials
2. Upload a resume (PDF, DOCX, or TXT)
3. Optionally paste a job description
4. Click "Analyze"
5. Get instant AI feedback!

---

## Common Issues

### "Port 5000 already in use"
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### "Clerk authentication not working"
- Verify `CLERK_PUBLISHABLE_KEY` is set
- Check Clerk dashboard: Application → Settings
- Ensure `localhost:5000` is in allowed URLs

### "Perplexity API errors"
- Verify API key is correct
- Check remaining API credits in Perplexity dashboard
- Ensure `PERPLEXITY_API_KEY` in `.env`

---

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [SETUP.md](./SETUP.md) for detailed setup
- Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code organization
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

---

## Troubleshooting

### Still stuck?

1. Check [SETUP.md](./SETUP.md) troubleshooting section
2. Open an issue: [GitHub Issues](https://github.com/yourusername/arixai-resume-analyzer/issues)
3. Review console logs for error messages

---

**Done! You're ready to analyze resumes with AI! 🚀**
