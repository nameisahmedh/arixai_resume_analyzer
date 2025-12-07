/**
 * Analyzes a resume using Perplexity AI's sonar model
 * 
 * Sends resume text to Perplexity API for comprehensive ATS (Applicant Tracking System) analysis.
 * If a job description is provided, analysis is tailored to match job requirements.
 * Returns detailed scoring, keyword matching, and actionable feedback.
 * 
 * @async
 * @param {string} resumeText - Extracted text content from resume file
 * @param {string} [jobDescription] - Optional job description for targeted analysis
 * @returns {Promise<Object>} Analysis results with structure:
 *   - overallScore: 0-100 ATS compatibility score
 *   - strengths: Array of identified resume strengths
 *   - improvements: Array of recommended improvements
 *   - keywordMatch: Object with matched/missing keywords and score
 *   - sections: Array of section-by-section analysis
 *   - recommendations: Prioritized actionable recommendations
 * 
 * @throws {Error} If PERPLEXITY_API_KEY not set or API request fails
 * 
 * @example
 * const results = await analyzeResumeWithPerplexity(resumeText, jobDescription);
 * console.log(`ATS Score: ${results.overallScore}`);
 */
export async function analyzeResumeWithPerplexity(
  resumeText,
  jobDescription
) {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY environment variable is not set. Please add it in the Secrets tab.');
  }

  // 👈 POINTER: Log analysis start with model and parameters
  console.log('[Perplexity] Starting analysis', {
    model: 'sonar',
    hasJobDescription: !!jobDescription,
    resumeLength: resumeText.length
  });

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY a valid JSON object - no additional text, no markdown, no explanations
2. The JSON must exactly match the schema below
3. Provide detailed, actionable, and SPECIFIC feedback based on the actual resume content
4. Use data-driven analysis with real examples from the resume, not generic templates
5. Be thorough and professional in your assessment

Required JSON schema:
{
  "overallScore": <number 0-100>,
  "strengths": [<array of 3-5 specific strengths with examples from the resume>],
  "improvements": [<array of 3-5 actionable improvements>],
  "keywordMatch": {
    "matched": [<array of skills/keywords found in both resume and job description>],
    "missing": [<array of important skills from job description missing in resume>],
    "score": <number 0-100 representing keyword match percentage>
  },
  "sections": [
    {"name": "Contact Information", "score": <0-100>, "feedback": "<specific feedback>"},
    {"name": "Summary/Objective", "score": <0-100>, "feedback": "<specific feedback>"},
    {"name": "Work Experience", "score": <0-100>, "feedback": "<specific feedback>"},
    {"name": "Education", "score": <0-100>, "feedback": "<specific feedback>"},
    {"name": "Skills", "score": <0-100>, "feedback": "<specific feedback>"}
  ],
  "recommendations": [<array of 3-5 prioritized, actionable recommendations>]
}`;

  const userPrompt = jobDescription
    ? `Analyze this resume against the following job description and provide a comprehensive ATS analysis.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide:
- Overall ATS compatibility score
- Specific strengths (with examples from the resume)
- Areas for improvement
- Detailed keyword analysis (matched vs missing skills)
- Section-by-section scoring and feedback
- Prioritized recommendations for improvement`
    : `Analyze this resume for general ATS compatibility and professional quality.

RESUME:
${resumeText}

Since no job description was provided, focus on:
- General resume quality and ATS-friendliness
- Common best practices and industry standards
- Suggest commonly valuable skills in the candidate's industry
- Provide actionable recommendations for improvement`;

  try {
    const requestBody = {
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    };

    console.log('[Perplexity] Sending request to API...');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[Perplexity] API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Perplexity] API error:', errorText);
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('[Perplexity] Response received, length:', content?.length || 0);
    console.log('[Perplexity] First 500 chars:', content?.substring(0, 500));

    if (!content) {
      throw new Error('No content returned from Perplexity API');
    }

    // Parse the JSON response
    let analysisResult;

    // sonar-reasoning-pro wraps responses in <think> tags, strip them more aggressively
    let cleanContent = content;

    // Try multiple patterns to strip think tags
    if (content.includes('<think>')) {
      // Remove all <think>...</think> blocks (non-greedy)
      cleanContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      console.log('[Perplexity] Stripped <think> tags (non-greedy)');
    }

    // If still has <think>, try greedy removal
    if (cleanContent.includes('<think>')) {
      cleanContent = cleanContent.replace(/<think>[\s\S]*<\/think>/gi, '').trim();
      console.log('[Perplexity] Stripped <think> tags (greedy)');
    }

    // Remove any remaining opening/closing tags
    cleanContent = cleanContent.replace(/<\/?think>/gi, '').trim();

    // Strip markdown code blocks (```json ... ``` or ``` ... ```)
    if (cleanContent.includes('```')) {
      cleanContent = cleanContent.replace(/```(?:json)?\s*\n?/g, '').replace(/```\s*$/g, '').trim();
      console.log('[Perplexity] Stripped markdown code blocks');
    }

    console.log('[Perplexity] Cleaned content length:', cleanContent.length);
    console.log('[Perplexity] First 100 chars:', cleanContent.substring(0, 100));

    try {
      // First try direct parsing (should work with json_object mode)
      analysisResult = JSON.parse(cleanContent);
      console.log('[Perplexity] JSON parsed successfully');
      return analysisResult;
    } catch (parseError) {
      console.warn('[Perplexity] Direct JSON parse failed, attempting extraction...');

      // Extract JSON from potential wrapper text
      const firstBrace = cleanContent.indexOf('{');
      const lastBrace = cleanContent.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonString = cleanContent.substring(firstBrace, lastBrace + 1);
        try {
          analysisResult = JSON.parse(jsonString);
          console.log('[Perplexity] JSON extracted and parsed successfully');
          return analysisResult;
        } catch (extractError) {
          console.error('[Perplexity] JSON extraction failed:', extractError);
          console.error('[Perplexity] Attempted to parse:', jsonString.substring(0, 500));
        }
      }

      // If all parsing fails, throw detailed error
      console.error('[Perplexity] All parsing attempts failed');
      console.error('[Perplexity] Full content:', cleanContent);
      throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('[Perplexity] Error in analyzeResumeWithPerplexity:', error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during analysis');
  }
}
