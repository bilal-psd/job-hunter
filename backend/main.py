from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import logging
from pydantic import BaseModel
from app.config import get_settings
from app.services.job_analysis import JobAnalysisService
from app.services.job_scraping import JobScrapingService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Initialize services
job_analysis_service = JobAnalysisService()
job_scraping_service = JobScrapingService()

app = FastAPI(title=settings.PROJECT_NAME)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        analysis = await job_analysis_service.analyze_job(
            description=request.description,
            url=request.url,
            focus_areas=request.focus_areas,
            summary_length=request.summary_length,
            experience_years=request.experience_years,
            required_skills=request.required_skills
        )
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing job: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scrape")
async def scrape(params: Dict):
    """Scrape jobs based on provided parameters."""
    try:
        jobs = job_scraping_service.scrape_jobs(params)
        return jobs
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": f"{settings.PROJECT_NAME} is running",
        "llm_provider": settings.LLM_PROVIDER
    } 