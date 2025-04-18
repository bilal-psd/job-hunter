import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, MapPin, Calendar, DollarSign, Briefcase, Brain, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Job } from '@/types/job';

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card key={index} className="bg-[#161b22] border-[#30363d] hover:border-[#58a6ff] transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-[#c9d1d9]">
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline cursor-pointer inline-block"
                >
                  {job.title}
                </a>
              </CardTitle>
            </div>
            {job.analysis?.analysis?.summary && (
              <CardDescription className="mt-2 text-[#8b949e]">
                {job.analysis.analysis.summary}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center text-[#8b949e]">
                  <Building2 className="mr-2 h-4 w-4" />
                  {job.company}
                </div>
                <div className="flex items-center text-[#8b949e]">
                  <MapPin className="mr-2 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center text-[#8b949e]">
                  <Calendar className="mr-2 h-4 w-4" />
                  Posted: {job.date_posted}
                </div>
                {(job.salary || (job.analysis?.analysis?.estimated_salary_range && job.analysis.analysis.estimated_salary_range !== "Not specified")) && (
                  <div className="flex items-center text-[#238636]">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {job.salary || job.analysis?.analysis?.estimated_salary_range}
                  </div>
                )}
              </div>

              {job.isAnalyzing && (
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing job description...</span>
                </div>
              )}

              {job.analysisError && (
                <div className="flex items-center gap-2 text-[#f85149]">
                  <AlertCircle className="h-4 w-4" />
                  <span>Analysis failed: {job.analysisError}</span>
                </div>
              )}

              {job.analysis?.analysis && !job.isAnalyzing && (
                <div className="space-y-4">
                  {job.analysis.analysis.key_skills && job.analysis.analysis.key_skills.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2 text-[#8b949e]">
                        <Brain className="mr-2 h-4 w-4" />
                        <span className="font-medium">Key Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.analysis.analysis.key_skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-[#21262d] text-[#c9d1d9] border-[#30363d]">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.analysis.analysis.required_experience && (
                    <div>
                      <div className="flex items-center mb-2 text-[#8b949e]">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span className="font-medium">Experience Required</span>
                      </div>
                      <p className="text-sm text-[#c9d1d9]">{job.analysis.analysis.required_experience}</p>
                    </div>
                  )}

                  {job.analysis.analysis.company_culture && (
                    <div>
                      <div className="flex items-center mb-2 text-[#8b949e]">
                        <Users className="mr-2 h-4 w-4" />
                        <span className="font-medium">Company Culture</span>
                      </div>
                      <p className="text-sm text-[#c9d1d9]">{job.analysis.analysis.company_culture}</p>
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