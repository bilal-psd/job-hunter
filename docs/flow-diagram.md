```mermaid
graph TD
    %% User Interface Components
    UI[User Interface]
    ManualSearch[Manual Search Form]
    AIWizard[AI Job Wizard]
    ResumeUpload[Resume Upload]
    JobList[Job List Display]

    %% Backend Services
    ResumeAnalysis[Resume Analysis Service]
    JobScraping[Job Scraping Service]
    JobAnalysis[Job Analysis Service]
    Cache[Redis Cache]

    %% LLM Operations
    LLM[LLM Service]
    ResumeLLM[Resume Analysis]
    JobLLM[Job Analysis]
    ValidationLLM[Job Validation]

    %% Data Flow
    subgraph Frontend
        UI --> ManualSearch
        UI --> AIWizard
        AIWizard --> ResumeUpload
        ManualSearch --> JobList
        AIWizard --> JobList
    end

    subgraph Backend
        %% Resume Analysis Flow
        ResumeUpload -->|Upload PDF/DOCX| ResumeAnalysis
        ResumeAnalysis -->|Extract Text| ResumeAnalysis
        ResumeAnalysis -->|Analyze Content| ResumeLLM
        ResumeLLM -->|Return Parameters| ResumeAnalysis
        ResumeAnalysis -->|Search Parameters| JobScraping

        %% Manual Search Flow
        ManualSearch -->|Search Parameters| JobScraping

        %% Job Scraping Flow
        JobScraping -->|Fetch Jobs| JobScraping
        JobScraping -->|Job Data| JobList

        %% Job Analysis Flow
        JobList -->|Job Description| JobAnalysis
        JobAnalysis -->|Check Cache| Cache
        Cache -->|Cache Hit| JobAnalysis
        Cache -->|Cache Miss| JobLLM
        JobLLM -->|Analysis Results| JobAnalysis
        JobAnalysis -->|Update Cache| Cache
        JobAnalysis -->|Analysis Results| JobList
    end

    subgraph "LLM Operations"
        LLM --> ResumeLLM
        LLM --> JobLLM
        LLM --> ValidationLLM
        
        %% LLM Operation Details
        ResumeLLM -->|Extract| ResumeLLM
        ResumeLLM -->|Job Title| ResumeLLM
        ResumeLLM -->|Location| ResumeLLM
        ResumeLLM -->|Experience| ResumeLLM
        ResumeLLM -->|Skills| ResumeLLM

        JobLLM -->|Summary| JobLLM
        JobLLM -->|Key Skills| JobLLM
        JobLLM -->|Experience| JobLLM
        JobLLM -->|Culture| JobLLM
        JobLLM -->|Salary| JobLLM

        ValidationLLM -->|Requirements| ValidationLLM
        ValidationLLM -->|Skills Match| ValidationLLM
        ValidationLLM -->|Experience Match| ValidationLLM
    end

    %% Styling
    classDef frontend fill:#f9f,stroke:#333,stroke-width:2px
    classDef backend fill:#bbf,stroke:#333,stroke-width:2px
    classDef service fill:#bfb,stroke:#333,stroke-width:2px
    classDef data fill:#fbb,stroke:#333,stroke-width:2px
    classDef llm fill:#ffd,stroke:#333,stroke-width:2px

    class UI,ManualSearch,AIWizard,ResumeUpload,JobList frontend
    class ResumeAnalysis,JobScraping,JobAnalysis backend
    class ResumeAnalysis,JobScraping,JobAnalysis service
    class Cache data
    class LLM,ResumeLLM,JobLLM,ValidationLLM llm
```

## Flow Descriptions

### Resume Analysis Flow
1. User uploads resume through AI Job Wizard
2. Resume Analysis Service extracts text from PDF/DOCX
3. LLM analyzes resume content to extract:
   - Job title/role
   - Location preferences
   - Experience years
   - Key skills
4. Extracted parameters are used for job search

### Manual Search Flow
1. User enters search parameters manually
2. Parameters are sent directly to Job Scraping Service
3. Results are displayed in Job List

### Job Scraping Flow
1. Job Scraping Service fetches jobs from multiple platforms
2. Results are filtered and cleaned
3. Jobs are sent to frontend for display

### Job Analysis Flow
1. Each job description is sent for analysis
2. Cache is checked first
3. If cache miss:
   - LLM analyzes job description
   - Results are cached
4. Analysis results update job cards in real-time

### LLM Operations
1. **Resume Analysis**
   - Extract job title/role
   - Identify location preferences
   - Calculate experience years
   - Extract key skills

2. **Job Analysis**
   - Generate job summary
   - Extract key skills
   - Determine required experience
   - Analyze company culture
   - Estimate salary range

3. **Job Validation**
   - Check requirements match
   - Verify skills compatibility
   - Validate experience level

### Caching Strategy
- Job analysis results are cached separately from validation
- Cache expiration: 7 days
- Cache structure includes:
  - Summary
  - Key skills
  - Required experience
  - Company culture
  - Estimated salary range 