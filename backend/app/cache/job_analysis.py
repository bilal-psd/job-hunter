import redis
from typing import Optional
import json
from datetime import timedelta
from app.config import get_settings

settings = get_settings()

class JobAnalysisCache:
    def __init__(self):
        redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        if settings.REDIS_PASSWORD:
            redis_url = f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
        
        self.redis = redis.Redis.from_url(redis_url)
        self.expiry_days = 7

    def get(self, url: str) -> Optional[dict]:
        """
        Retrieve job analysis from cache by URL.
        Returns None if not found.
        """
        cached_data = self.redis.get(f"job_analysis:{url}")
        if cached_data:
            return json.loads(cached_data)
        return None

    def set(self, url: str, analysis: dict) -> None:
        """
        Store job analysis in cache with expiration.
        """
        self.redis.setex(
            f"job_analysis:{url}",
            timedelta(days=self.expiry_days),
            json.dumps(analysis)
        ) 