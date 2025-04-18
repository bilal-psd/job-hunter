from abc import ABC, abstractmethod
from typing import Dict, List, Optional

class LLMClient(ABC):
    @abstractmethod
    async def analyze_job(
        self,
        job_description: str,
        focus_areas: List[str],
        summary_length: str = "medium",
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> Dict:
        """Perform full job analysis."""
        pass

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Generate a response using the LLM."""
        pass

    @abstractmethod
    async def validate_job(
        self,
        job_description: str,
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> bool:
        """Quick validation of job requirements."""
        pass 