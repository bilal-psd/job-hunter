import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIWizardFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function AIWizardForm({ onSubmit, isLoading }: AIWizardFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match('application/pdf') && !file.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        toast.error('Please upload a PDF or DOCX file');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload a resume');
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('resume', resumeFile);

      // Send the file to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/analyze-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      
      // Pass the extracted information to the parent component
      onSubmit({
        ...data,
        results_wanted: 20,
        hours_old: 72,
        site_name: ['linkedin'],
        country_indeed: 'worldwide'
      });
    } catch (error) {
      toast.error('Failed to analyze resume. Please try again.');
      console.error('Error analyzing resume:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.match('application/pdf') && !file.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        toast.error('Please upload a PDF or DOCX file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div 
        className="border-2 border-dashed border-[#30363d] rounded-lg p-8 text-center cursor-pointer hover:border-[#58a6ff] transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
        />
        
        {resumeFile ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-12 w-12 text-[#58a6ff]" />
            <p className="text-[#c9d1d9]">{resumeFile.name}</p>
            <p className="text-sm text-[#8b949e]">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-[#58a6ff]" />
            <p className="text-[#c9d1d9]">Upload your resume</p>
            <p className="text-sm text-[#8b949e]">PDF or DOCX, max 5MB</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          disabled={isLoading || isUploading || !resumeFile}
          className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2 rounded-md transition-colors"
        >
          {isLoading || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Find Jobs Matching My Resume
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 