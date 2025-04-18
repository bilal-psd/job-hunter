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