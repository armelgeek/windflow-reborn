'use client';

import { useState, useEffect } from 'react';
import twClasses  from '@/lib/tailwind-classes';

interface Option {
  label?: string;
  value: string;
}

interface TailwindOptionsProps {
  attr: string;
  title?: string;
  css?: string;
  required?: string;
  onChange?: (value: string) => void;
}

export default function TailwindOptions({ 
  attr, 
  title, 
  css = '', 
  required = '',
  onChange 
}: TailwindOptionsProps) {
  const [selected, setSelected] = useState<string>('');
  
  // Get options from Tailwind classes
  const getOptions = (): Option[] | string[] => {
    if (!twClasses[attr]) return [];
    return twClasses[attr] as (Option[] | string[]);
  };
  
  // Format option label
  const formatOptionLabel = (opt: string | Option): string => {
    if (typeof opt !== 'object' || !opt.hasOwnProperty('label')) {
      const strArr = (opt as string).split('-');
      strArr.shift();
      
      const label = strArr
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      if ((opt as string).charAt(0) === '-') {
        return '-' + (opt as string).split('-')[(opt as string).split('-').length - 1];
      }
      
      return label;
    } else {
      return (opt as Option).label || '';
    }
  };
  
  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelected(newValue);
    
    // Emit value to parent
    if (onChange) {
      onChange(required ? `${required} ${newValue}` : newValue);
    }
  };
  
  // Initialize from props
  useEffect(() => {
    if (!css) return;
    
    const classes = css.split(' ');
    const options = getOptions();
    let optionsValues: string[] = [];
    
    // Extract values from options
    if (options.length > 0) {
      if (typeof options[0] === 'object' && (options[0] as Option).hasOwnProperty('label')) {
        optionsValues = (options as Option[]).map(opt => opt.value);
      } else {
        optionsValues = options as string[];
      }
    }
    
    // Find selected option
    classes.forEach(cl => {
      if (optionsValues.indexOf(cl) > -1) {
        setSelected(cl);
        
        // Emit initial value
        if (onChange) {
          onChange(required ? `${required} ${cl}` : cl);
        }
      }
    });
  }, [css, attr, required]);
  
  // Render options based on type
  const renderOptions = () => {
    const options = getOptions();
    
    // If no options, return empty
    if (!options || options.length === 0) {
      return <option value="">No options</option>;
    }
    
    return [
      <option key="empty" value=""></option>,
      ...options.map((opt, index) => {
        const value = typeof opt === 'object' ? (opt as Option).value : opt as string;
        return (
          <option key={index} value={value}>
            {formatOptionLabel(opt)}
          </option>
        );
      })
    ];
  };
  
  return (
    <div className="flex flex-col clear-both">
      <span className="capitalize">{title || attr}</span>
      <select 
        className="w-full bg-white text-black p-1"
        value={selected}
        onChange={handleChange}
      >
        {renderOptions()}
      </select>
    </div>
  );
}