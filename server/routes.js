import express from "express";
import multer from "multer";
import { parseResume } from "./lib/resumeParser.js";
import { analyzeResumeWithPerplexity } from "./lib/perplexity.js";
import { registerWebhooks } from "./webhooks.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
// 👈 POINTER: Database imports
import { db } from "./db.js";
import { users } from "../shared/schema.js";
import { eq, sql } from "drizzle-orm";

/**
 * Configure multer for file uploads
 * - Storage: Memory (files processed immediately)
 * - Size limit: 5MB
 * - Allowed types: PDF, DOCX, DOC, TXT
 */
// 👈 POINTER: Multer configuration for file uploads
// Stores files in memory (processed immediately, not saved to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 👈 POINTER: 5MB file size limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExt = '.' + file.originalname.split('.').pop()?.toLowerCase();

    // 👈 POINTER: Validate file type before processing
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      console.log(`[Multer] Rejected file type: ${fileExt}`);
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  },
});

/**
 * Register all API routes
 * 
 * Sets up the following endpoints:
 * - POST /api/analyze - Analyze resume with AI
 * - GET /api/user - Get user data
 * - GET /api/health - Health check
 * 
 * @param {Object} httpServer - HTTP server instance
 * @param {Object} app - Express application instance
 */
export async function registerRoutes(
  httpServer,
  app
) {

  // Register Clerk webhooks (must be before other routes)
  registerWebhooks(app);

  /**
   * POST /api/analyze
   * Analyzes a resume using Perplexity AI
   * 
   * Requires:
   * - Authentication via Clerk
   * - File upload (resume file)
   * - Optional: job_description in request body
   * 
   * Returns: Analysis results with ATS score, feedback, and recommendations
   */
  app.post('/api/analyze', ClerkExpressRequireAuth(), upload.single('resume'), async (req, res) => {
    try {
      const file = req.file;
      const jobDescription = req.body.job_description || '';
      const { userId: clerkId } = req.auth;

      console.log(`[API] Analyze request - User: ${clerkId}, File: ${file?.originalname || 'none'}`);

      if (!file) {
        console.log('[API] No file received in request');
        return res.status(400).json({
          error: 'No resume file uploaded. Please upload a PDF, DOCX, or TXT file.'
        });
      }
      console.log(`[API] Received file: ${file.originalname}, size: ${file.size} for user: ${clerkId}`);

      // 👈 POINTER: Sync user to database (non-critical)
      try {
        await db.insert(users).values({
          clerkId,
          username: `user_${clerkId}`,
        }).onConflictDoNothing();
      } catch (dbError) {
        console.warn('⚠️  Database sync skipped:', dbError.message);
      }

      // 👈 POINTER: Parse resume text from file
      // Supports PDF, DOCX, DOC, and TXT formats
      let resumeText;
      try {
        resumeText = await parseResume(file);
      } catch (error) {
        return res.status(400).json({
          error: error instanceof Error ? error.message : 'Failed to parse resume file.'
        });
      }

      // 👈 POINTER: Validate resume content length
      if (!resumeText || resumeText.length < 50) {
        console.log(`[API] Resume text too short: ${resumeText?.length || 0} chars`);
        return res.status(400).json({
          error: 'Resume file appears to be empty or too short. Please upload a valid resume.'
        });
      }

      // 👈 POINTER: Main AI analysis via Perplexity API
      // Returns structured analysis with scores, strengths, improvements, recommendations
      try {
        const analysis = await analyzeResumeWithPerplexity(resumeText, jobDescription);
        console.log(`[API] Analysis completed for user: ${clerkId}`);

        // Increment analysis count (non-critical)
        try {
          await db.update(users)
            .set({
              analysisCount: sql`${users.analysisCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(users.clerkId, clerkId));
        } catch (dbError) {
          console.warn('⚠️  Failed to increment count:', dbError.message);
        }

        return res.json(analysis);
      } catch (error) {
        console.error('Perplexity API error:', error);

        if (error instanceof Error && error.message.includes('PERPLEXITY_API_KEY')) {
          return res.status(500).json({
            error: 'Perplexity API key is not configured. Please add PERPLEXITY_API_KEY to your environment secrets.'
          });
        }

        return res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to analyze resume. Please try again.'
        });
      }
    } catch (error) {
      console.error('Unexpected error in analyze route:', error);
      return res.status(500).json({
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  // GET /api/user - Get current user info
  app.get('/api/user', ClerkExpressRequireAuth(), async (req, res) => {
    try {
      const { userId: clerkId } = req.auth;

      try {
        const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
        const userData = user[0] || { clerkId, username: `user_${clerkId}`, analysisCount: 0, isPremium: false };
        
        res.json({
          user: userData,
          analysisCount: userData.analysisCount || 0,
          isPremium: userData.isPremium || false,
          remaining: (userData.isPremium ? 999 : Math.max(0, 5 - (userData.analysisCount || 0)))
        });
      } catch (dbError) {
        console.warn('⚠️  Database query failed:', dbError.message);
        res.json({
          user: { clerkId, username: `user_${clerkId}` },
          analysisCount: 0,
          isPremium: false,
          remaining: 5
        });
      }
    } catch (error) {
      console.error('Error in user endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Handle multer errors
  app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large. Maximum file size is 5MB.'
        });
      }
      return res.status(400).json({
        error: `Upload error: ${error.message}`
      });
    }
    next(error);
  });

  return httpServer;
}
