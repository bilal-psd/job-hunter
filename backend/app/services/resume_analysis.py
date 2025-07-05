from typing import Dict
import logging
from app.llm.client import get_llm_client
from app.llm.prompts import get_resume_analysis_prompt
import fitz  # PyMuPDF
import docx
import io
import json

logger = logging.getLogger(__name__)

class ResumeAnalysisService:
    def __init__(self):
        logger.info("Initializing ResumeAnalysisService...")
        self.llm_client = get_llm_client()
        logger.info("ResumeAnalysisService initialized successfully")

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file using PyMuPDF."""
        try:
            pdf_file = io.BytesIO(file_content)
            doc = fitz.open(stream=pdf_file, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            docx_file = io.BytesIO(file_content)
            doc = docx.Document(docx_file)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {str(e)}")
            raise

    async def analyze_resume(self, file_content: bytes, file_type: str) -> Dict:
        """Analyze resume and extract job search parameters."""
        try:
            logger.info("Starting resume analysis")
            
            # Extract text based on file type
            if file_type == "application/pdf":
                text = self.extract_text_from_pdf(file_content)
            elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                text = self.extract_text_from_docx(file_content)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")

            # Get the analysis prompt
            prompt = get_resume_analysis_prompt(text)
            
            # Generate response with lower temperature for more focused output
            response = await self.llm_client.generate(
                prompt=prompt,
                temperature=0.3
            )
            
            # Parse the response
            parsed_response = self.parse_resume_analysis(response)
            
            logger.info("Resume analysis completed successfully")
            return parsed_response
            
        except Exception as e:
            logger.error(f"Error analyzing resume: {str(e)}")
            raise

    def parse_resume_analysis(self, response: str) -> Dict:
        """Parse the LLM response into job search parameters."""
        try:
            # The response should be a JSON string with the following structure:
            # {
            #     "search_term": string,
            #     "location": string,
            #     "experience_years": number,
            #     "required_skills": string[]
            # }
            
            # Find the JSON object in the response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = response[start:end]
                parsed = json.loads(json_str)
                
                # Ensure all required fields are present
                return {
                    "search_term": parsed.get("search_term", ""),
                    "location": parsed.get("location", ""),
                    "experience_years": parsed.get("experience_years", 0),
                    "required_skills": parsed.get("required_skills", [])
                }
            else:
                raise ValueError("No JSON object found in response")
                
        except Exception as e:
            logger.error(f"Error parsing resume analysis response: {str(e)}")
            raise 