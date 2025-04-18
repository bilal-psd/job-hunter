import httpx
import json
from typing import Dict, Optional, List
from app.config import get_settings
import logging
import backoff
from .prompts import get_system_prompt, get_analysis_prompt, get_validation_prompt
from .parser import ResponseParser
import google.generativeai as genai
from .interfaces import LLMClient

logger = logging.getLogger(__name__)
settings = get_settings()

class OllamaClient(LLMClient):
    def __init__(self):
        self.api_url = settings.OLLAMA_API_URL
        self.model = settings.OLLAMA_MODEL
        self.client = httpx.AsyncClient()

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate a response using Ollama."""
        try:
            response = await self.client.post(
                f"{self.api_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "system": system_prompt,
                    "temperature": temperature
                }
            )
            response.raise_for_status()
            return response.json()["response"]
        except Exception as e:
            logger.error(f"Error generating response with Ollama: {str(e)}")
            raise

    async def analyze_job(
        self,
        job_description: str,
        focus_areas: List[str],
        summary_length: str = "medium",
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> Dict:
        """Analyze a job description using Ollama."""
        try:
            # Get prompts
            system_prompt = get_system_prompt()
            analysis_prompt = get_analysis_prompt(
                job_description=job_description,
                focus_areas=focus_areas,
                summary_length=summary_length,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            # Generate response with lower temperature for more focused output
            response = await self.generate(
                prompt=analysis_prompt,
                system_prompt=system_prompt,
                temperature=0.3
            )
            
            # Parse and validate response
            parsed_response = ResponseParser.parse_json_response(response)
            validated_response = ResponseParser.validate_analysis_response(parsed_response)
            
            return validated_response
            
        except Exception as e:
            logger.error(f"Error analyzing job description: {str(e)}")
            return {
                "valid": False,
                "summary": f"Error analyzing job description: {str(e)}",
                "key_skills": [],
                "required_experience": "Error during analysis",
                "company_culture": "Error during analysis",
                "estimated_salary_range": "Error during analysis"
            }

    async def validate_job(
        self,
        job_description: str,
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> bool:
        """Quick validation of job requirements using Ollama."""
        try:
            system_prompt = get_system_prompt()
            validation_prompt = get_validation_prompt(
                job_description=job_description,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            # Generate response with very low temperature for consistent validation
            response = await self.generate(
                prompt=validation_prompt,
                system_prompt=system_prompt,
                temperature=0.1
            )
            
            # Parse the boolean response
            return ResponseParser.parse_validation_response(response)
            
        except Exception as e:
            logger.error(f"Error validating job: {str(e)}")
            return False

class GeminiClient(LLMClient):
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate a response using Gemini."""
        try:
            full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
            
            response = await self.model.generate_content_async(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature
                )
            )
            return response.text
        except Exception as e:
            logger.error(f"Error generating response with Gemini: {str(e)}")
            raise

    async def analyze_job(
        self,
        job_description: str,
        focus_areas: List[str],
        summary_length: str = "medium",
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> Dict:
        """Analyze a job description using Gemini."""
        try:
            system_prompt = get_system_prompt()
            analysis_prompt = get_analysis_prompt(
                job_description=job_description,
                focus_areas=focus_areas,
                summary_length=summary_length,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            response = await self.generate(
                prompt=analysis_prompt,
                system_prompt=system_prompt,
                temperature=0.3
            )
            
            parsed_response = ResponseParser.parse_json_response(response)
            validated_response = ResponseParser.validate_analysis_response(parsed_response)
            
            return validated_response
            
        except Exception as e:
            logger.error(f"Error analyzing job description with Gemini: {str(e)}")
            return {
                "valid": False,
                "summary": f"Error analyzing job description: {str(e)}",
                "key_skills": [],
                "required_experience": "Error during analysis",
                "company_culture": "Error during analysis",
                "estimated_salary_range": "Error during analysis"
            }

    async def validate_job(
        self,
        job_description: str,
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> bool:
        """Quick validation of job requirements using Gemini."""
        try:
            system_prompt = get_system_prompt()
            validation_prompt = get_validation_prompt(
                job_description=job_description,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            response = await self.generate(
                prompt=validation_prompt,
                system_prompt=system_prompt,
                temperature=0.1
            )
            
            return ResponseParser.parse_validation_response(response)
            
        except Exception as e:
            logger.error(f"Error validating job with Gemini: {str(e)}")
            return False

def get_llm_client() -> LLMClient:
    """Get the appropriate LLM client based on configuration."""
    if settings.LLM_PROVIDER.lower() == "ollama":
        return OllamaClient()
    elif settings.LLM_PROVIDER.lower() == "gemini":
        return GeminiClient()
    else:
        raise ValueError(f"Unsupported LLM provider: {settings.LLM_PROVIDER}") 