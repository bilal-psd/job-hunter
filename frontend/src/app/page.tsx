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
    if (!job.description || !job.link) return job;

    try {
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
      
      // Update job with analysis results
      setJobs(prev => prev.map((j, i) => 
        i === index ? { ...j, analysis, isAnalyzing: false } : j
      ));

      return { ...job, analysis };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze job description';
      
      // Update job with error state
      setJobs(prev => prev.map((j, i) => 
        i === index ? { ...j, isAnalyzing: false, analysisError: errorMessage } : j
      ));

      return { ...job, analysisError: errorMessage };
    }
  };

  const handleSearch = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/scrape`, data);
      const baseJobs: Job[] = response.data.map((job: any) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        date_posted: job.date_posted,
        link: job.job_url || job.link || job.url,
        salary: job.salary,
        description: job.description
      }));

      // Set initial jobs without analysis
      setJobs(baseJobs);
      
      // Start analysis for each job with a description
      const analyzedJobs = await Promise.all(
        baseJobs.map((job, index) => analyzeJob(job, index, data))
      );

      // Filter out invalid jobs and update state
      const validJobs = analyzedJobs.filter(job => job.analysis?.valid !== false);
      setJobs(validJobs);

      toast.success('Jobs fetched and analyzed successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch jobs';
      toast.error(errorMessage);
      console.error('Error details:', error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Job Hunter</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Search</TabsTrigger>
                <TabsTrigger value="ai">AI Job Wizard</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <ManualSearchForm onSubmit={handleSearch} isLoading={isLoading} />
              </TabsContent>
              <TabsContent value="ai">
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
