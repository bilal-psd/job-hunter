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
        logger.info("Initializing JobScrapingService...")
        self.settings = settings
        self.INVALID_JOB_BUFFER_FACTOR = 3  # Scrape 3 times more jobs to account for invalid ones
        logger.info("JobScrapingService initialized successfully")

    def clean_job_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean the DataFrame by handling NaN values."""
        logger.debug("Starting job data cleaning...")
        # Replace NaN values with None (which will become null in JSON)
        df = df.replace({np.nan: None})
        
        # Convert float values to strings to avoid precision issues
        for col in df.select_dtypes(include=['float64']).columns:
            df[col] = df[col].apply(lambda x: str(x) if x is not None else None)
        
        logger.debug(f"Data cleaning completed. DataFrame shape: {df.shape}")
        return df

    def get_country_from_location(self, location: str) -> str:
        """Determine the country based on the location."""
        country = settings.LOCATION_COUNTRY_MAP.get(location.lower(), 'worldwide')
        logger.debug(f"Location '{location}' mapped to country: {country}")
        return country

    def scrape_jobs(self, params: Dict) -> List[Dict]:
        """Scrape jobs based on provided parameters."""
        try:
            logger.info("Starting job scraping process")
            logger.debug(f"Input parameters: {params}")
            
            # Extract parameters with defaults
            search_term = params.get('search_term', '')
            location = params.get('location', '')
            results_wanted = int(params.get('results_wanted', self.settings.DEFAULT_RESULTS_WANTED))
            hours_old = int(params.get('hours_old', self.settings.DEFAULT_HOURS_OLD))
            site_name = params.get('site_name', self.settings.DEFAULT_SITE_NAME)
            
            # Calculate actual number of jobs to scrape with buffer
            actual_results_wanted = int(results_wanted * self.INVALID_JOB_BUFFER_FACTOR)
            logger.info(f"Scraping {actual_results_wanted} jobs to account for potential invalidations (requested: {results_wanted})")
            
            # Determine country based on location
            country_indeed = params.get('country_indeed') or self.get_country_from_location(location)
            logger.info(f"Using country '{country_indeed}' for Indeed scraping")
            
            # Scrape jobs
            logger.info("Initiating job scraping...")
            jobs_df = scrape_jobs(
                site_name=site_name,
                search_term=search_term,
                location=location,
                results_wanted=actual_results_wanted,
                hours_old=hours_old,
                country_indeed=country_indeed,
                linkedin_fetch_description=True
            )
            
            logger.info(f"Scraping completed. Found {len(jobs_df)} jobs")
            
            # Clean and format the data
            logger.info("Cleaning and formatting job data...")
            jobs_df = self.clean_job_data(jobs_df)
            
            # Limit to requested number of jobs
            if len(jobs_df) > results_wanted:
                jobs_df = jobs_df.head(results_wanted)
                logger.info(f"Limited results to requested {results_wanted} jobs")
            
            logger.info("Job scraping process completed successfully")
            return jobs_df.to_dict('records')
            
        except Exception as e:
            logger.error(f"Error during job scraping: {str(e)}", exc_info=True)
            raise 