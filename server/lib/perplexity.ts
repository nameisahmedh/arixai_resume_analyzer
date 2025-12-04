export interface AnalysisResult {
  overall_score: number;
  skill_match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  feedback_summary: string;
  section_feedback: {
    summary: string;
    experience: string;
    skills: string;
    projects: string;
  };
  section_scores: {
    summary: number;
    experience: number;
    skills: number;
    projects: number;
  };
  improved_summary_example: string;
}

export async function analyzeResumeWithPerplexity(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  
  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY environment variable is not set. Please add it in the Secrets tab.');
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach. Your task is to analyze a resume against a job description and provide detailed, actionable feedback.

CRITICAL: You must respond ONLY with valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Return raw JSON only.

The JSON structure must be:
{
  "overall_score": <number 0-100>,
  "skill_match_score": <number 0-100>,
  "matched_skills": [<array of skills found in both resume and job description>],
  "missing_skills": [<array of skills mentioned in job description but missing from resume>],
  "feedback_summary": "<2-3 sentence overall assessment>",
  "section_feedback": {
    "summary": "<feedback on professional summary/objective>",
    "experience": "<feedback on work experience section>",
    "skills": "<feedback on skills section>",
    "projects": "<feedback on projects section>"
  },
  "section_scores": {
    "summary": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "projects": <number 0-100>
  },
  "improved_summary_example": "<rewritten professional summary optimized for this role>"
}`;

  const userPrompt = jobDescription 
    ? `Analyze this resume against the following job description:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide a comprehensive ATS analysis with matched/missing skills, section-by-section feedback, and an improved summary.`
    : `Analyze this resume and provide general feedback on ATS compatibility:

RESUME:
${resumeText}

Since no job description was provided, focus on general resume quality, ATS-friendliness, and common best practices. For missing_skills, suggest commonly valuable skills in the candidate's field.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from Perplexity API');
    }

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
    }

    // Validate the structure
    if (!analysisResult.overall_score || !analysisResult.matched_skills) {
      throw new Error('Invalid response structure from AI');
    }

    return analysisResult;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during analysis');
  }
}
