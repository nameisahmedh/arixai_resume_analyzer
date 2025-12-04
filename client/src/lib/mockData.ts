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
  improved_summary_example: string;
}

export const MOCK_ANALYSIS: AnalysisResult = {
  overall_score: 78,
  skill_match_score: 85,
  matched_skills: ["Python", "Flask", "React", "JavaScript", "Git", "REST APIs", "SQL"],
  missing_skills: ["Docker", "Kubernetes", "AWS", "CI/CD Pipelines"],
  feedback_summary: "Your resume is strong in full-stack development but lacks explicit mentions of cloud infrastructure and containerization which are key for this role. The experience section is well-detailed, but could benefit from more quantifiable metrics.",
  section_feedback: {
    summary: "The professional summary is concise but generic. It mentions 'passionate developer' which is a cliché. It should instead highlight specific years of experience and key technical achievements relevant to the job.",
    experience: "Your experience at TechCorp is impressive, but you simply listed responsibilities. Try to frame them as achievements using the STAR method (Situation, Task, Action, Result). For example, instead of 'Worked on API', say 'Designed and implemented a REST API that reduced latency by 40%'.",
    skills: "Good categorization of skills. However, you missed 'Docker' and 'AWS' which were mentioned in the job description. If you have these skills, definitely add them.",
    projects: "The 'E-commerce' project is good, but the description is too short. Mention the scale of the project (e.g., number of users, transactions) and the specific technologies used to solve problems."
  },
  improved_summary_example: "Full Stack Engineer with 4+ years of experience building scalable web applications using Python (Flask) and React. Proven track record of optimizing API performance by 40% and leading the migration of legacy systems to modern microservices architecture. Proficient in SQL and agile methodologies, with a strong focus on clean, maintainable code."
};
