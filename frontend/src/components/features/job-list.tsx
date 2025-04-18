import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Briefcase } from "lucide-react";

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

interface JobListProps {
  jobs: Job[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {job.title}
                    </a>
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.date_posted}
                    </span>
                    {job.salary && (
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {job.isAnalyzing ? (
                <div className="mt-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : job.analysis ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-600">{job.analysis.summary}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Required Skills</h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {job.analysis.key_skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Experience Required</h4>
                      <p className="text-sm text-gray-600">{job.analysis.required_experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Company Culture</h4>
                      <p className="text-sm text-gray-600">{job.analysis.company_culture}</p>
                    </div>
                    
                    {job.analysis.estimated_salary_range && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Estimated Salary Range</h4>
                        <p className="text-sm text-gray-600">{job.analysis.estimated_salary_range}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : job.analysisError ? (
                <div className="mt-4">
                  <p className="text-sm text-red-600">Error analyzing job: {job.analysisError}</p>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 