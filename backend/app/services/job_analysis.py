from typing import Dict, List, Optional
from app.llm.client import get_llm_client
from app.cache.job_analysis import JobAnalysisCache
import logging

logger = logging.getLogger(__name__)

class JobAnalysisService:
    def __init__(self):
        self.llm_client = get_llm_client()
        self.cache = JobAnalysisCache()

    async def analyze_job(
        self,
        description: str,
        url: str,
        focus_areas: Optional[List[str]] = None,
        summary_length: str = "medium",
        experience_years: Optional[int] = None,
        required_skills: Optional[List[str]] = None
    ) -> Dict:
        """
        Analyze a job description and extract relevant information.
        First checks cache, then uses LLM if not cached.
        """
        try:
            # Check cache first
            cached_analysis = self.cache.get(url)
            if cached_analysis:
                logger.info(f"Cache hit for URL: {url}")
                return cached_analysis

            # If not in cache, proceed with analysis
            logger.info(f"Cache miss for URL: {url}")
            analysis = await self.llm_client.analyze_job(
                job_description=description,
                focus_areas=focus_areas or ['skills', 'requirements', 'culture'],
                summary_length=summary_length,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            # Cache the result
            self.cache.set(url, analysis)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing job: {str(e)}")
            raise 