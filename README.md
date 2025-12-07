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
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **PostgreSQL** (for database)

Required API Keys:
- **Clerk Authentication** - [Get your key](https://clerk.com)
- **Perplexity API** - [Get your key](https://www.perplexity.ai)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nameisahmedh/arixai_resume_analyzer.git
cd arixai_resume_analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PERPLEXITY_API_KEY=your_perplexity_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/arixai
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
PORT=5000
NODE_ENV=development
```

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
```

## Project Structure

```
arixai-resume-analyzer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # React hooks
│   │   ├── lib/           # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── server/               # Express backend
│   ├── index.js         # Server entry point
│   ├── routes.js        # API routes
│   ├── db.js            # Database connection
│   ├── webhooks.js      # Clerk webhooks
│   └── lib/
│       ├── perplexity.js
│       └── resumeParser.js
│
├── shared/              # Shared code
│   └── schema.js        # Data schemas
│
├── migrations/          # Database migrations
├── .env                 # Environment variables
├── package.json
├── Procfile             # Railway deployment
├── README.md
└── LICENSE
```

## Technologies

### Frontend
- React 19, Vite 7, Tailwind CSS, Framer Motion, Wouter

### Backend
- Node.js 20, Express 4, Drizzle ORM, PostgreSQL, Clerk, Perplexity API

## Deployment

### Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select `nameisahmedh/arixai_resume_analyzer`
4. Add environment variables:
   ```
   PERPLEXITY_API_KEY=your_key
   DATABASE_URL=your_database_url
   VITE_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_key
   CLERK_WEBHOOK_SECRET=your_key
   PORT=3000
   NODE_ENV=production
   ```
5. Click **"Deploy"**

### Build for Production

```bash
npm run build
npm start
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@arixai.com
- 🐛 Report bugs: [GitHub Issues](https://github.com/nameisahmedh/arixai_resume_analyzer/issues)

## Credits

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- AI powered by [Perplexity](https://www.perplexity.ai)
- Auth by [Clerk](https://clerk.com)

---

**Made with ❤️ by the ArixAI Team**
