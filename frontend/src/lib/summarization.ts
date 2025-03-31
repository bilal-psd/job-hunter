interface JobAnalysisRequest {
    description: string;
    url: string;
    focus_areas?: string[];
    summary_length?: 'short' | 'medium' | 'long';
    experience_years?: number;
    required_skills?: string[];
}

interface JobAnalysisResponse {
    valid: boolean;
    summary: string;
    key_skills: string[];
    required_experience: string;
    company_culture: string;
    estimated_salary_range: string;
}

const SUMMARIZATION_API_URL = process.env.NEXT_PUBLIC_SUMMARIZATION_API_URL || 'http://localhost:8001';

export async function analyzeJobDescription(
    description: string,
    url: string,
    options: Partial<Omit<JobAnalysisRequest, 'description' | 'url'>> = {}
): Promise<JobAnalysisResponse> {
    try {
        const response = await fetch(`${SUMMARIZATION_API_URL}/api/v1/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description,
                url,
                focus_areas: options.focus_areas || ['skills', 'requirements', 'culture'],
                summary_length: options.summary_length || 'medium',
                experience_years: options.experience_years,
                required_skills: options.required_skills
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to analyze job description');
        }

        return response.json();
    } catch (error) {
        console.error('Error analyzing job description:', error);
        throw error;
    }
} 