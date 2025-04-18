from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import logging
from pydantic import BaseModel
from app.config import get_settings
from app.services.job_analysis import JobAnalysisService
from app.services.job_scraping import JobScrapingService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()
logger.info(f"Starting {settings.PROJECT_NAME} with settings: {settings}")

# Initialize services
logger.info("Initializing services...")
job_analysis_service = JobAnalysisService()
job_scraping_service = JobScrapingService()
logger.info("Services initialized successfully")

app = FastAPI(title=settings.PROJECT_NAME)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info(f"CORS configured with allowed origins: {settings.BACKEND_CORS_ORIGINS}")

class JobAnalysisRequest(BaseModel):
    description: str
    url: str
    focus_areas: Optional[List[str]] = None
    summary_length: Optional[str] = "medium"
    experience_years: Optional[int] = None
    required_skills: Optional[List[str]] = None

class JobAnalysisResponse(BaseModel):
    valid: bool
    summary: str
    key_skills: List[str]
    required_experience: str
    company_culture: str
    estimated_salary_range: str

@app.post("/api/v1/summarize")
async def analyze_job(request: JobAnalysisRequest):
    logger.info(f"Received job analysis request for URL: {request.url}")
    logger.debug(f"Request details: {request.dict()}")
    
    try:
        logger.info("Starting job analysis...")
        analysis = await job_analysis_service.analyze_job(
            description=request.description,
            url=request.url,
            focus_areas=request.focus_areas,
            summary_length=request.summary_length,
            experience_years=request.experience_years,
            required_skills=request.required_skills
        )
        logger.info(f"Job analysis completed successfully for URL: {request.url}")
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing job: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scrape")
async def scrape(params: Dict):
    """Scrape jobs based on provided parameters."""
    logger.info("Received job scraping request")
    logger.debug(f"Scraping parameters: {params}")
    
    try:
        logger.info("Starting job scraping...")
        jobs = job_scraping_service.scrape_jobs(params)
        logger.info(f"Job scraping completed successfully. Found {len(jobs)} jobs")
        return jobs
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Health check endpoint."""
    logger.info("Health check endpoint accessed")
    return {
        "message": f"{settings.PROJECT_NAME} is running",
        "llm_provider": settings.LLM_PROVIDER
    } 