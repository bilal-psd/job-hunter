import redis
from typing import Optional
import json
from datetime import timedelta
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

class JobAnalysisCache:
    def __init__(self):
        logger.info("Initializing JobAnalysisCache...")
        logger.debug(f"Connecting to Redis at {settings.REDIS_URL}")
        self.redis = redis.Redis.from_url(settings.REDIS_URL)
        self.expiry_days = 7
        logger.info("JobAnalysisCache initialized successfully")

    def get_analysis(self, url: str) -> Optional[dict]:
        """
        Retrieve job analysis from cache by URL.
        Returns None if not found.
        """
        cache_key = f"job_analysis:{url}"
        logger.debug(f"Attempting to retrieve cache entry for key: {cache_key}")
        
        try:
            cached_data = self.redis.get(cache_key)
            if cached_data:
                logger.debug(f"Cache hit for key: {cache_key}")
                return json.loads(cached_data)
            logger.debug(f"Cache miss for key: {cache_key}")
            return None
        except Exception as e:
            logger.error(f"Error retrieving from cache for key {cache_key}: {str(e)}", exc_info=True)
            return None

    def set_analysis(self, url: str, analysis: dict) -> None:
        """
        Store job analysis in cache with expiration.
        Only stores the analysis part, not the validity.
        """
        cache_key = f"job_analysis:{url}"
        logger.debug(f"Storing cache entry for key: {cache_key}")
        
        try:
            self.redis.setex(
                cache_key,
                timedelta(days=self.expiry_days),
                json.dumps(analysis)
            )
            logger.debug(f"Successfully cached analysis for key: {cache_key} with {self.expiry_days} days expiration")
        except Exception as e:
            logger.error(f"Error storing in cache for key {cache_key}: {str(e)}", exc_info=True)
            raise 