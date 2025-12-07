# ArixAI Resume Analyzer

A modern AI-powered resume analysis platform that provides comprehensive ATS (Applicant Tracking System) scoring, keyword matching, and actionable feedback to help job seekers optimize their resumes.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)
![React](https://img.shields.io/badge/React-v19+-blue.svg)

## ✨ Features

- **AI-Powered Resume Analysis** - Uses Perplexity AI to analyze resumes against job descriptions
- **ATS Compatibility Scoring** - Get detailed ATS scores with section-by-section feedback
- **Keyword Matching** - Identifies matched and missing keywords from job descriptions
- **Real-time Analysis** - Quick resume analysis powered by advanced AI models
- **User Authentication** - Secure authentication with Clerk
- **Dark/Light Theme** - Beautiful UI with theme support
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL** (optional, for database features)

Required API Keys:
- **Clerk Authentication** - [Get your key](https://clerk.com)
- **Perplexity API** - [Get your key](https://www.perplexity.ai)
- **PostgreSQL Database** - (optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/arixai-resume-analyzer.git
cd arixai-resume-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Perplexity API
PERPLEXITY_API_KEY=your_perplexity_api_key

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/arixai

# Clerk Webhooks
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### Analyzing a Resume

1. **Sign In** - Create or login to your Clerk account
2. **Upload Resume** - Choose a PDF, DOCX, or TXT file (max 5MB)
3. **Add Job Description** - (Optional) Paste a job description for targeted analysis
4. **Get Results** - Receive detailed ATS score, feedback, and recommendations

### Command Line

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm start                # Run production server

# Database
npm run db:push          # Push schema to database

# Check
npm run check            # Type checking (if using TypeScript)
```

## Project Structure

```
arixai-resume-analyzer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # UI component library
│   │   │   ├── Layout.jsx
│   │   │   ├── AuthForm.jsx
│   │   │   └── ...
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Results.jsx
│   │   │   └── not-found.jsx
│   │   ├── hooks/        # React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   └── public/           # Static assets
│
├── server/               # Express backend
│   ├── index.js         # Server entry point
│   ├── routes.js        # API routes
│   ├── db.js            # Database connection
│   ├── webhooks.js      # Clerk webhooks
│   ├── storage.js       # Database operations
│   ├── static.js        # Static file serving
│   ├── vite.js          # Vite middleware
│   └── lib/
│       ├── perplexity.js      # Perplexity AI integration
│       └── resumeParser.js    # Resume parsing logic
│
├── shared/              # Shared code
│   └── schema.js        # Data schemas & types
│
├── script/
│   └── build.js         # Build script
│
├── migrations/          # Database migrations
├── .env                 # Environment variables (create your own)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── drizzle.config.js    # Database configuration
├── README.md            # This file
├── SETUP.md             # Setup instructions
├── CONTRIBUTING.md      # Contributing guidelines
└── LICENSE              # MIT License
```

## Technologies

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Wouter** - Client-side routing
- **Lucide React** - Icons

### Backend
- **Node.js 20** - Runtime
- **Express 4** - Web framework
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Clerk** - Authentication
- **Perplexity API** - AI analysis
- **Multer** - File uploads

### DevTools
- **ESBuild** - Build tool
- **PostCSS** - CSS processor

## API Endpoints

### Resume Analysis
```http
POST /api/analyze
Content-Type: multipart/form-data

Body:
  - resume: File (PDF, DOCX, TXT)
  - job_description: String (optional)

Response:
{
  "overallScore": 85,
  "strengths": [...],
  "improvements": [...],
  "keywordMatch": {...},
  "sections": [...],
  "recommendations": [...]
}
```

### User Info
```http
GET /api/user
Authorization: Bearer <token>

Response:
{
  "user": {...},
  "analysisCount": 5,
  "isPremium": false,
  "remaining": 0
}
```

### Health Check
```http
GET /api/health

Response:
{ "status": "ok", "timestamp": "2025-12-07T12:00:00Z" }
```

## Configuration

### Clerk Setup
1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy `Secret Key` and `Publishable Key` to `.env`
4. Configure webhook in Clerk dashboard pointing to `/api/webhooks/clerk`

### Perplexity API Setup
1. Visit [perplexity.ai](https://www.perplexity.ai)
2. Generate API key from your account
3. Add to `.env` as `PERPLEXITY_API_KEY`

### Database Setup (Optional)
```bash
# Create PostgreSQL database
createdb arixai

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/arixai

# Push schema
npm run db:push
```

## Deployment

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

### Environment Variables for Production
Set these in your production environment:
```env
NODE_ENV=production
PORT=5000
CLERK_SECRET_KEY=xxx
VITE_CLERK_PUBLISHABLE_KEY=xxx
PERPLEXITY_API_KEY=xxx
DATABASE_URL=postgresql://...
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Troubleshooting

### Server not starting
- Check if port 5000 is already in use: `lsof -i :5000` (macOS/Linux) or `netstat -ano | findstr :5000` (Windows)
- Kill process: `kill -9 <PID>` or use Task Manager on Windows

### Resume upload fails
- File size must be less than 5MB
- Supported formats: PDF, DOCX, DOC, TXT
- Check browser console for detailed error messages

### API rate limit errors
- Perplexity API has rate limits
- Wait before retrying or upgrade API plan
- Check remaining API quota in Perplexity dashboard

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@arixai.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/arixai-resume-analyzer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/arixai-resume-analyzer/discussions)

## Roadmap

- [ ] Premium subscription tier
- [ ] Batch resume analysis
- [ ] Custom feedback templates
- [ ] Resume scoring history
- [ ] Interview preparation
- [ ] LinkedIn integration
- [ ] API for third-party developers

## Credits

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- AI powered by [Perplexity](https://www.perplexity.ai)
- Auth by [Clerk](https://clerk.com)

---

**Made with ❤️ by the ArixAI Team**
