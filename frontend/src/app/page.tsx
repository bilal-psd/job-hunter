'use client';

import { useState } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ManualSearchForm } from '@/components/features/manual-search-form';
import { AIWizardForm } from '@/components/features/ai-wizard-form';
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
    <main className="min-h-screen bg-[#0d1117] py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#c9d1d9]">Job Hunter</h1>
          <p className="mt-2 text-[#8b949e]">Find your next job opportunity with AI assistance</p>
        </div>

        <Card className="mb-8 bg-[#161b22] border-[#30363d]">
          <CardContent className="pt-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#21262d] border border-[#30363d]">
                <TabsTrigger value="manual" className="data-[state=active]:bg-[#30363d] data-[state=active]:text-[#c9d1d9]">Manual Search</TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-[#30363d] data-[state=active]:text-[#c9d1d9]">AI Job Wizard</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-6">
                <ManualSearchForm onSubmit={handleSearch} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="ai" className="mt-6">
                <AIWizardForm onSubmit={handleSearch} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {jobs.length > 0 && <JobList jobs={jobs} />}
      </div>
    </main>
  );
}
