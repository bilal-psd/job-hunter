from typing import Dict, List
from jobspy import scrape_jobs
import pandas as pd
import numpy as np
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

class JobScrapingService:
    def __init__(self):
        self.settings = settings

    def clean_job_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the DataFrame by handling NaN values."""
        # Replace NaN values with None (which will become null in JSON)
        df = df.replace({np.nan: None})
        
        # Convert float values to strings to avoid precision issues
        for col in df.select_dtypes(include=['float64']).columns:
            df[col] = df[col].apply(lambda x: str(x) if x is not None else None)
        
        return df

    def get_country_from_location(self, location: str) -> str:
        """Determine the country based on the location."""
        return settings.LOCATION_COUNTRY_MAP.get(location.lower(), 'worldwide')

    def scrape_jobs(self, params: Dict) -> List[Dict]:
        """Scrape jobs based on provided parameters."""
        try:
            # Extract parameters with defaults
            search_term = params.get('search_term', '')
            location = params.get('location', '')
            results_wanted = int(params.get('results_wanted', self.settings.DEFAULT_RESULTS_WANTED))
            hours_old = int(params.get('hours_old', self.settings.DEFAULT_HOURS_OLD))
            site_name = params.get('site_name', self.settings.DEFAULT_SITE_NAME)
            
            # Determine country based on location
            country_indeed = params.get('country_indeed') or self.get_country_from_location(location)
            
            # Scrape jobs
            jobs_df = scrape_jobs(
                site_name=site_name,
                search_term=search_term,
                location=location,
                results_wanted=results_wanted,
                hours_old=hours_old,
                country_indeed=country_indeed,
                linkedin_fetch_description=True
            )
            
            # Clean and format the data
            jobs_df = self.clean_job_data(jobs_df)
            return jobs_df.to_dict('records')
            
        except Exception as e:
            logger.error(f"Error during scraping: {str(e)}", exc_info=True)
            raise 