from typing import Dict, List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Job Hunter API"

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]  # More permissive for development

    # Default Scraping Settings
    DEFAULT_RESULTS_WANTED: int = 20
    DEFAULT_HOURS_OLD: int = 72
    DEFAULT_SITE_NAME: List[str] = ["linkedin"]

    # LLM Provider Configuration
    LLM_PROVIDER: str = "gemini"  # can be "ollama" or "gemini"
    
    # Ollama Configuration
    OLLAMA_API_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"
    
    # Gemini Configuration
    GEMINI_API_KEY: str = ""  # Will be set from environment
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"  # Default local Redis URL
    
    # Cache Configuration
    CACHE_EXPIRATION: int = 86400  # 24 hours in seconds

    class Config:
        case_sensitive = True
        env_file = ".env"

# Location to Country Mapping
LOCATION_COUNTRY_MAP: Dict[str, str] = {
    'bangalore': 'india',
    'san francisco': 'usa',
    'london': 'uk',
    'sydney': 'australia',
}

@lru_cache()
def get_settings() -> Settings:
    return Settings() 