# JobHunter

A modern job search and analysis platform that helps you find and evaluate job opportunities using AI-powered analysis.

## Features

- 🔍 Job search across multiple platforms (LinkedIn, Indeed)
- 🤖 AI-powered job description analysis
- 📊 Key skills and requirements extraction
- 💰 Salary range estimation
- 🏢 Company culture insights
- ⚡ Fast and responsive UI
- 🔄 Real-time job updates

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- FastAPI
- Python 3.11+
- Redis (for caching)
- LLM Integration (Ollama/Gemini)

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Redis server
- Ollama (for local LLM) or Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobhunter.git
cd jobhunter
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create environment files:

Backend (.env):
```env
PROJECT_NAME=JobHunter
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
REDIS_HOST=localhost
REDIS_PORT=6379
```

Frontend (.env):
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
NEXT_PUBLIC_SUMMARIZATION_API_URL=${NEXT_PUBLIC_BACKEND_API_URL}
```

### Running the Application

1. Start the backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Visit http://localhost:3000 in your browser

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for the interactive API documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Jobspy](https://github.com/OmkarPathak/jobspy) for job scraping functionality
- [Ollama](https://ollama.ai/) for local LLM capabilities
- [Google Gemini](https://ai.google.dev/) for cloud LLM capabilities

## Recent Changes and Current State

### Resume Upload and Analysis Implementation
- Added resume upload functionality to AI Job Wizard
- Implemented PDF and DOCX file processing using PyMuPDF
- Created resume analysis service with LLM integration
- Added file type validation and size limits (5MB)
- Implemented drag-and-drop support for file uploads
- Added error handling for file processing and analysis

### Caching Strategy Updates
- Modified the caching strategy to separate job analysis data from validation
- The `valid` field is no longer cached and is checked dynamically
- Analysis data is cached separately to improve performance
- Added a buffer factor of 3x in job scraping to account for invalid jobs

### Type System Updates
- Created a shared Job type definition in `frontend/src/types/job.ts`
- Updated frontend components to use the shared type:
  - `page.tsx`
  - `job-list.tsx`
  - `summarization.ts`
- Fixed type compatibility issues between frontend and backend

### Current Structure
1. Job Analysis Flow:
   - User requests N jobs
   - System scrapes 3N jobs to account for invalidations
   - Each job is analyzed for:
     - Validity
     - Summary
     - Key skills
     - Required experience
     - Company culture
     - Estimated salary range
   - Invalid jobs are filtered out
   - Results are displayed to user

2. Resume Analysis Flow:
   - User uploads resume through AI Job Wizard
   - System extracts text from PDF/DOCX
   - LLM analyzes resume to extract:
     - Job title/role
     - Location preferences
     - Experience years
     - Key skills
   - Extracted information is used for job search

3. Caching Implementation:
   - Analysis data is cached separately from validation
   - Cache structure:
     ```typescript
     {
       valid: boolean,  // Not cached, checked dynamically
       analysis: {
         summary: string,
         key_skills: string[],
         required_experience: string,
         company_culture: string,
         estimated_salary_range: string
       }
     }
     ```

4. Frontend Components:
   - `JobList`: Displays job cards with analysis results
   - `ManualSearchForm`: Basic job search interface
   - `AIWizardForm`: Resume upload and analysis interface

### Next Steps
1. Monitor the effectiveness of the 3x buffer factor
2. Consider implementing progressive loading for job analysis
3. Add error handling for edge cases in job validation
4. Implement retry mechanism for failed job analyses 

### Upcoming Features
1. Pagination
   - Implement server-side pagination for job results
   - Add infinite scroll or page-based navigation
   - Cache paginated results for better performance
   - Maintain search state across page navigation

2. Resume Optimization
   - ATS-friendly resume analysis
   - Keyword optimization suggestions
   - Format and structure recommendations
   - Industry-specific best practices

3. Resume Tailoring
   - AI-powered resume customization for specific job descriptions
   - Keyword matching and optimization
   - Skills and experience highlighting
   - Format adjustments for better ATS compatibility 