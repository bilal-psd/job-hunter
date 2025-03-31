import { useState, KeyboardEvent } from 'react';
import { Input } from './input';
import { Badge } from './badge';
import { X } from 'lucide-react';

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillInput({ skills, onChange }: SkillInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        onChange([...skills, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeSkill(skill)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
} 