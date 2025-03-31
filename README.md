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