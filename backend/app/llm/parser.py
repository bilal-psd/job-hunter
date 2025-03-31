import json
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ResponseParser:
    @staticmethod
    def parse_json_response(response: str) -> Dict:
        """
        Parse the JSON response from the LLM.
        Handles potential JSON formatting issues in the response.
        """
        try:
            # Try to parse the response directly
            return json.loads(response)
        except json.JSONDecodeError:
            logger.warning("Failed to parse response directly, attempting cleanup")
            try:
                # Find the first { and last } to extract JSON
                start = response.find('{')
                end = response.rfind('}') + 1
                if start >= 0 and end > start:
                    cleaned_json = response[start:end]
                    return json.loads(cleaned_json)
                else:
                    raise ValueError("No JSON object found in response")
            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Failed to parse cleaned response: {e}")
                # Return a structured error response
                return {
                    "valid": False,
                    "summary": "Failed to parse model response",
                    "key_skills": [],
                    "required_experience": None,
                    "company_culture": None,
                    "estimated_salary_range": None
                }

    @staticmethod
    def validate_analysis_response(parsed_response: Dict) -> Dict:
        """
        Validate and clean up the parsed response.
        Ensures all expected fields are present with appropriate types.
        """
        validated = {
            "valid": bool(parsed_response.get("valid", False)),
            "summary": str(parsed_response.get("summary", "")),
            "key_skills": parsed_response.get("key_skills", []),
            "required_experience": parsed_response.get("required_experience"),
            "company_culture": parsed_response.get("company_culture"),
            "estimated_salary_range": parsed_response.get("estimated_salary_range")
        }
        
        # Ensure key_skills is a list
        if not isinstance(validated["key_skills"], list):
            validated["key_skills"] = []
        
        # Convert any None values to appropriate empty values
        for key in ["required_experience", "company_culture", "estimated_salary_range"]:
            if validated[key] is None:
                validated[key] = "Not specified"
        
        return validated 