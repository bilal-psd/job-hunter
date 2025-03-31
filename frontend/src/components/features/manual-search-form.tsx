import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SkillInput } from '@/components/ui/skill-input';

interface ManualSearchFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function ManualSearchForm({ onSubmit, isLoading }: ManualSearchFormProps) {
  const [formData, setFormData] = useState({
    search_term: '',
    location: '',
    results_wanted: 20,
    hours_old: 72,
    site_name: ['linkedin'],
    country_indeed: 'worldwide',
    experience_years: '',
    required_skills: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      required_skills: skills
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="search_term" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Search Term
          </label>
          <Input
            type="text"
            id="search_term"
            name="search_term"
            required
            value={formData.search_term}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Location
          </label>
          <Input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="experience_years" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Years of Experience
          </label>
          <Input
            type="number"
            id="experience_years"
            name="experience_years"
            min="0"
            step="1"
            value={formData.experience_years}
            onChange={handleInputChange}
            placeholder="e.g., 5"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="results_wanted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Number of Results
          </label>
          <Input
            type="number"
            id="results_wanted"
            name="results_wanted"
            min="1"
            value={formData.results_wanted}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="hours_old" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Hours Old
          </label>
          <Input
            type="number"
            id="hours_old"
            name="hours_old"
            min="1"
            value={formData.hours_old}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Required Skills
          </label>
          <SkillInput
            skills={formData.required_skills}
            onChange={handleSkillsChange}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Jobs
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 