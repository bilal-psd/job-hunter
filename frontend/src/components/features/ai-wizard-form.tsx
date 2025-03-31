import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface AIWizardFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function AIWizardForm({ onSubmit, isLoading }: AIWizardFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just pass a placeholder structure
    // This will be replaced with actual LLM processing later
    onSubmit({
      prompt,
      // placeholder data until we implement the LLM
      search_term: '',
      location: '',
      results_wanted: 20,
      hours_old: 72,
      site_name: ['linkedin'],
      country_indeed: 'worldwide'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Describe Your Ideal Job
        </label>
        <Textarea
          id="prompt"
          placeholder="Example: I'm looking for remote senior React developer positions in tech startups with a focus on AI/ML, preferably in the US time zones with competitive salary..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          className="min-h-[150px]"
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Find My Ideal Job
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 