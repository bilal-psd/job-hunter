from typing import Dict, List, Optional
from app.llm.client import get_llm_client
from app.cache.job_analysis import JobAnalysisCache
import logging

logger = logging.getLogger(__name__)

class JobAnalysisService:
    def __init__(self):
        logger.info("Initializing JobAnalysisService...")
        self.llm_client = get_llm_client()
        self.cache = JobAnalysisCache()
        logger.info("JobAnalysisService initialized successfully")

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
            logger.info(f"Starting job analysis for URL: {url}")
            logger.debug(f"Analysis parameters - focus_areas: {focus_areas}, summary_length: {summary_length}, "
                        f"experience_years: {experience_years}, required_skills: {required_skills}")

            # Check cache first
            logger.info(f"Checking cache for URL: {url}")
            cached_analysis = self.cache.get(url)
            if cached_analysis:
                logger.info(f"Cache hit for URL: {url}")
                return cached_analysis

            # If not in cache, proceed with analysis
            logger.info(f"Cache miss for URL: {url}. Proceeding with LLM analysis")
            analysis = await self.llm_client.analyze_job(
                job_description=description,
                focus_areas=focus_areas or ['skills', 'requirements', 'culture'],
                summary_length=summary_length,
                experience_years=experience_years,
                required_skills=required_skills
            )
            
            # Cache the result
            logger.info(f"Caching analysis results for URL: {url}")
            self.cache.set(url, analysis)
            logger.info(f"Analysis completed and cached for URL: {url}")
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing job for URL {url}: {str(e)}", exc_info=True)
            raise 