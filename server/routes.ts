import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { parseResume } from "./lib/resumeParser";
import { analyzeResumeWithPerplexity } from "./lib/perplexity";

// Configure multer for memory storage (5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExt = '.' + file.originalname.split('.').pop()?.toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // POST /api/analyze - Analyze a resume
  app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
      const file = req.file;
      const jobDescription = req.body.job_description || '';

      if (!file) {
        return res.status(400).json({ 
          error: 'No resume file uploaded. Please upload a PDF, DOCX, or TXT file.' 
        });
      }

      // Parse the resume
      let resumeText: string;
      try {
        resumeText = await parseResume(file);
      } catch (error) {
        return res.status(400).json({ 
          error: error instanceof Error ? error.message : 'Failed to parse resume file.' 
        });
      }

      if (!resumeText || resumeText.length < 50) {
        return res.status(400).json({ 
          error: 'Resume file appears to be empty or too short. Please upload a valid resume.' 
        });
      }

      // Analyze with Perplexity
      try {
        const analysis = await analyzeResumeWithPerplexity(resumeText, jobDescription);
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
      console.error('Unexpected error:', error);
      return res.status(500).json({ 
        error: 'An unexpected error occurred. Please try again.' 
      });
    }
  });

  // Handle multer errors
  app.use((error: any, req: any, res: any, next: any) => {
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
