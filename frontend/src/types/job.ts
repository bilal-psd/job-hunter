export interface Job {
  title: string;
  company: string;
  location: string;
  date_posted: string;
  link: string;
  salary?: string;
  description?: string;
  analysis?: {
    valid: boolean;
    analysis: {
      summary: string;
      key_skills: string[];
      required_experience: string;
      company_culture: string;
      estimated_salary_range: string;
    };
  };
  isAnalyzing?: boolean;
  analysisError?: string;
} 