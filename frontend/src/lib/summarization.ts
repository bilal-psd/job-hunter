import { logger } from './logger';

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

// Use the main backend URL for summarization
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001';

export async function analyzeJobDescription(
    description: string,
    url: string,
    options: Partial<Omit<JobAnalysisRequest, 'description' | 'url'>> = {}
): Promise<JobAnalysisResponse> {
    const requestId = Math.random().toString(36).substring(7);
    const context = `JobAnalysis[${requestId}]`;
    
    try {
        logger.info(`Starting job analysis for URL: ${url}`, { context });
        logger.debug(`Analysis options: ${JSON.stringify(options)}`, { context });

        const endpoint = `${BACKEND_API_URL}/api/v1/summarize`;
        logger.info(`Making request to: ${endpoint}`, { context });

        const response = await fetch(endpoint, {
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

        logger.info(`Received response with status: ${response.status}`, { context });

        if (!response.ok) {
            const error = await response.json();
            logger.error(`API error: ${error.detail || 'Unknown error'}`, { context });
            throw new Error(error.detail || 'Failed to analyze job description');
        }

        const data = await response.json();
        logger.info('Job analysis completed successfully', { context });
        logger.debug(`Analysis result: ${JSON.stringify(data)}`, { context });

        return data;
    } catch (error) {
        logger.error(`Error analyzing job description: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            context,
            error: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
} 