'use client';

import { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { JobList } from '@/components/features/job-list';
import { analyzeJobDescription } from '@/lib/summarization';
import { logger } from '@/lib/logger';

interface Job {
  title: string;
  company: string;
  location: string;
  date_posted: string;
  link: string;
  salary?: string;
  description?: string;
  analysis?: {
    valid: boolean;
    summary: string;
    key_skills: string[];
    required_experience: string;
    company_culture: string;
    estimated_salary_range: string;
  };
  isAnalyzing?: boolean;
  analysisError?: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    location: '',
    yearsOfExperience: '',
    requiredSkills: [] as string[],
  });

  const analyzeJob = async (job: Job, index: number, formData: any) => {
    const context = `JobAnalysis[${job.link}]`;
    
    if (!job.description || !job.link) {
      logger.warn('Skipping job analysis - missing description or link', { context });
      return job;
    }

    try {
      logger.info(`Starting analysis for job: ${job.title} at ${job.company}`, { context });
      
      // Update job status to analyzing
      setJobs(prev => prev.map((j, i) => 
        i === index ? { ...j, isAnalyzing: true, analysisError: undefined } : j
      ));

      const analysis = await analyzeJobDescription(
        job.description, 
        job.link,
        {
          focus_areas: ['skills', 'requirements', 'culture'],
          summary_length: 'medium',
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
          required_skills: formData.required_skills
        }
      );
      
      logger.info(`Analysis completed for job: ${job.title}`, { context });
      
      // Update job with analysis results
      setJobs(prev => prev.map((j, i) => 
        i === index ? { ...j, analysis, isAnalyzing: false } : j
      ));

      return { ...job, analysis };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze job description';
      logger.error(`Error analyzing job: ${errorMessage}`, { 
        context,
        error: error instanceof Error ? error.stack : undefined
      });
      
      // Update job with error state
      setJobs(prev => prev.map((j, i) => 
        i === index ? { ...j, isAnalyzing: false, analysisError: errorMessage } : j
      ));

      return { ...job, analysisError: errorMessage };
    }
  };

  const handleSearch = async (data: any) => {
    const context = 'JobSearch';
    logger.info('Starting job search', { context });
    logger.debug(`Search parameters: ${JSON.stringify(data)}`, { context });
    
    setIsLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/scrape`;
      logger.info(`Making request to: ${endpoint}`, { context });
      
      const response = await axios.post(endpoint, data);
      logger.info(`Received response with status: ${response.status}`, { context });
      
      const baseJobs: Job[] = response.data.map((job: any) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        date_posted: job.date_posted,
        link: job.job_url || job.link || job.url,
        salary: job.salary,
        description: job.description
      }));

      logger.info(`Found ${baseJobs.length} jobs`, { context });

      // Set initial jobs without analysis
      setJobs(baseJobs);
      
      // Start analysis for each job with a description
      logger.info('Starting job analysis for all jobs', { context });
      const analyzedJobs = await Promise.all(
        baseJobs.map((job, index) => analyzeJob(job, index, data))
      );

      // Filter out invalid jobs and update state
      const validJobs = analyzedJobs.filter(job => job.analysis?.valid !== false);
      logger.info(`Analysis completed. ${validJobs.length} valid jobs found`, { context });
      
      setJobs(validJobs);

      toast.success('Jobs fetched and analyzed successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch jobs';
      logger.error(`Error during job search: ${errorMessage}`, { 
        context,
        error: error instanceof Error ? error.stack : undefined
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      logger.info('Job search completed', { context });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Search</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Term
                </label>
                <Input
                  id="searchTerm"
                  placeholder="e.g. Software Engineer"
                  value={searchParams.searchTerm}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="e.g. 5"
                  value={searchParams.yearsOfExperience}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <Input
                  id="skills"
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      setSearchParams(prev => ({
                        ...prev,
                        requiredSkills: [...prev.requiredSkills, e.currentTarget.value]
                      }));
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchParams.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-blue-400 hover:text-blue-600"
                        onClick={() => setSearchParams(prev => ({
                          ...prev,
                          requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
                        }))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleSearch(searchParams)}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Found <span className="font-medium">{jobs.length}</span> results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Toaster />
        {jobs.length > 0 ? (
          <JobList jobs={jobs} />
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <p>Enter your search criteria and click Search Jobs to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
