'use client';

import { useState, useEffect } from 'react';
import  twClasses  from '@/lib/tailwind-classes';

interface Option {
  label: string;
  value: string;
}

interface TailwindHeightProps {
  attr: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindHeight({ attr, css = '', onChange }: TailwindHeightProps) {
  const [model, setModel] = useState<string>('');
  
  // Get options from Tailwind classes
  const getOptions = (): Option[] => {
    if (!twClasses[attr]) return [];
    return twClasses[attr] as Option[];
  };
  
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setModel(newValue);
    
    // Emit value to parent
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Clean CSS class for comparison
  const cleanClass = (cl: string): string => {
    // This is a placeholder for the Vue method $clean
    // You would implement your own cleaning logic here
    return cl.trim();
  };
  
  // Initialize from props
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    const classes = css.split(' ');
    const options = getOptions();
    
    classes.forEach(cl => {
      options.forEach(opt => {
        if (cleanClass(cl) === opt.value) {
          setModel(cl);
          
          // Emit initial value
          if (onChange) {
            onChange(cl);
          }
        }
      });
    });
  }, [css, attr]);
  
  return (
    <div className="flex flex-col">
      <div>Height</div>
      <select 
        className="w-full nodark"
        value={model}
        onChange={handleChange}
      >
        <option value=""></option>
        {getOptions().map((opt, index) => (
          <option key={index} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}