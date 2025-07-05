from typing import List, Optional

def get_system_prompt() -> str:
    return """You are a job analysis assistant. Your task is to analyze job descriptions and provide structured information about the job requirements, skills, and company culture. Be precise and factual in your analysis."""

def get_validation_prompt(
    job_description: str,
    experience_years: Optional[int] = None,
    required_skills: Optional[List[str]] = None
) -> str:
    prompt = f"""Quickly validate if the following job description matches the specified requirements.

Job Description:
{job_description}

"""
    
    if experience_years is not None:
        prompt += f"Required Experience: {experience_years} years\n"
    if required_skills:
        prompt += f"Required Skills: {', '.join(required_skills)}\n"
    
    prompt += """
Respond with a simple boolean value (true/false) indicating whether the job matches the requirements.
Focus on the key requirements and skills, ignoring minor mismatches.
"""
    return prompt

def get_analysis_prompt(
    job_description: str,
    focus_areas: List[str],
    summary_length: str = "medium",
    experience_years: Optional[int] = None,
    required_skills: Optional[List[str]] = None
) -> str:
    prompt = f"""Analyze the following job description and provide a structured response in JSON format.

Job Description:
{job_description}

Focus Areas: {', '.join(focus_areas)}
Summary Length: {summary_length}
Make sure estimated salary range is very concise and to the point, should not exceed 10 words. 
"""
    
    if experience_years is not None:
        prompt += f"Experience Years: {experience_years}\n"
    if required_skills:
        prompt += f"Required Skills: {', '.join(required_skills)}\n"
    
    prompt += """
Provide a JSON response with the following structure:
{
    "valid": boolean,
    "summary": string,
    "key_skills": string[],
    "required_experience": string,
    "company_culture": string,
    "estimated_salary_range": string
}
"""
    return prompt

def get_resume_analysis_prompt(resume_text: str) -> str:
    prompt = f"""Analyze the following resume and extract relevant information for job searching.
Return the information in a JSON format that can be used to search for matching jobs.

Resume:
{resume_text}

Extract the following information:
1. Job title or role that best matches the candidate's experience and skills
2. Preferred location (if mentioned)
3. Years of relevant experience
4. Key skills and technologies

Return the information in this JSON format:
{{
    "search_term": "string (job title/role)",
    "location": "string (preferred location)",
    "experience_years": number,
    "required_skills": ["string", "string", ...]
}}

Make sure to:
- Use the most recent and relevant job title/role
- Include only the most important and relevant skills
- If location is not specified, leave it as an empty string
- Calculate experience years based on the most relevant experience
"""
    return prompt 