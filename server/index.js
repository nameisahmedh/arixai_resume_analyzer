import express from "express";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { createServer } from "http";
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Validate required environment variables
const requiredEnvVars = [
  'CLERK_SECRET_KEY',
  'VITE_CLERK_PUBLISHABLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. User data will not be persisted.');
}

if (!process.env.CLERK_WEBHOOK_SECRET) {
  console.warn('CLERK_WEBHOOK_SECRET is not set. Webhooks will not work properly.');
}

if (!process.env.PERPLEXITY_API_KEY) {
  console.warn('PERPLEXITY_API_KEY is not set. Resume analysis will use fallback responses.');
}

const app = express();
const httpServer = createServer(app);

// Trust proxy for proper IP forwarding
app.set('trust proxy', 1);

// CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173'
  ];
  
  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Raw body parser for webhooks (must be before Clerk middleware)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Clerk middleware for authentication
app.use(ClerkExpressWithAuth());

// JSON parser for other routes
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.js");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
      log(`Clerk configured: ${process.env.CLERK_SECRET_KEY ? 'Yes' : 'No'}`);
      log(`Perplexity API: ${process.env.PERPLEXITY_API_KEY ? 'Yes' : 'No (using fallback)'}`);
    },
  );
})();
