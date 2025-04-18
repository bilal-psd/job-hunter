import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, MapPin, Calendar, DollarSign, Briefcase, Brain, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Job {
  title: string;
  company: string;
  location: string;
  date_posted: string;
  link: string;
  salary?: string;
  description?: string;
  analysis?: {
    summary: string;
    key_skills: string[];
    required_experience: string;
    company_culture: string;
    estimated_salary_range: string;
  };
  isAnalyzing?: boolean;
  analysisError?: string;
}

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card key={index} className="hover:bg-accent/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer inline-block"
                >
                  {job.title}
                </a>
              </CardTitle>
            </div>
            {job.analysis?.summary && (
              <CardDescription className="mt-2">
                {job.analysis.summary}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="mr-2 h-4 w-4" />
                  {job.company}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Posted: {job.date_posted}
                </div>
                {(job.salary || (job.analysis?.estimated_salary_range && job.analysis.estimated_salary_range !== "Not specified")) && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {job.salary || job.analysis?.estimated_salary_range}
                  </div>
                )}
              </div>

              {job.isAnalyzing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing job description...</span>
                </div>
              )}

              {job.analysisError && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Analysis failed: {job.analysisError}</span>
                </div>
              )}

              {job.analysis && !job.isAnalyzing && (
                <div className="space-y-4">
                  {job.analysis.key_skills.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2 text-muted-foreground">
                        <Brain className="mr-2 h-4 w-4" />
                        <span className="font-medium">Key Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.analysis.key_skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.analysis.required_experience && (
                    <div>
                      <div className="flex items-center mb-2 text-muted-foreground">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span className="font-medium">Experience Required</span>
                      </div>
                      <p className="text-sm">{job.analysis.required_experience}</p>
                    </div>
                  )}

                  {job.analysis.company_culture && (
                    <div>
                      <div className="flex items-center mb-2 text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span className="font-medium">Company Culture</span>
                      </div>
                      <p className="text-sm">{job.analysis.company_culture}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 