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
  section_scores?: {
    summary: number;
    experience: number;
    skills: number;
    projects: number;
  };
  improved_summary_example: string;
}
