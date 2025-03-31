from typing import List, Optional

def get_system_prompt() -> str:
    return """You are an expert job description analyzer. Your task is to analyze job descriptions and extract key information in a structured way. Be precise and focus on factual information. Avoid speculation."""

def get_validation_prompt(job_description: str, experience_years: Optional[int], required_skills: Optional[List[str]]) -> str:
    prompt = "First, validate if this job matches the following requirements:\n\n"
    
    if experience_years is not None:
        prompt += f"- Required Years of Experience: {experience_years} years\n"
    
    if required_skills:
        prompt += f"- Required Skills: {', '.join(required_skills)}\n"
    
    prompt += f"\nJob Description:\n{job_description}\n\n"
    prompt += """Please respond in JSON format with the following structure:
{
    "valid": true/false
}"""
    
    return prompt

def get_analysis_prompt(
    job_description: str, 
    focus_areas: List[str], 
    summary_length: str,
    experience_years: Optional[int] = None,
    required_skills: Optional[List[str]] = None
) -> str:
    length_tokens = {
        "short": "100-150 words",
        "medium": "200-250 words",
        "long": "300-400 words"
    }
    
    focus_areas_str = ", ".join(focus_areas)
    target_length = length_tokens.get(summary_length, "200-250 words")

    validation_section = ""
    if experience_years is not None or required_skills:
        validation_section = "\nFirst, validate if:"
        if experience_years is not None:
            validation_section += f"\n- The job requires around {experience_years} years of experience"
        if required_skills:
            validation_section += f"\n- The job requires these skills: {', '.join(required_skills)}"
    
    return f"""Analyze the following job description and provide a structured response focusing on {focus_areas_str}.
Provide a summary of approximately {target_length}.{validation_section}

Format your response as JSON with the following structure:
{{
    "valid": true/false,
    "summary": "Concise overview of the role",
    "key_skills": ["List of required technical and soft skills"],
    "required_experience": "Experience requirements",
    "company_culture": "Cultural aspects and work environment",
    "estimated_salary_range": "Salary range if mentioned or can be reasonably inferred"
}}

Job Description:
{job_description}

Remember to:
1. First determine if the job matches the specified experience and skills requirements
2. If the job doesn't match the requirements, just return valid: false with empty/default values for other fields
3. Only provide detailed analysis if the job is valid
4. Be specific about technical requirements
5. List skills in order of importance
6. Include both technical and soft skills
7. Extract specific experience requirements
8. Note any mentions of company culture or work environment
9. Include salary information only if explicitly mentioned or very strongly implied

Provide your response in valid JSON format.""" 