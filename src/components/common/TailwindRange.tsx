'use client';

import { useState, useEffect } from 'react';
import twClasses from '@/lib/tailwind-classes';

interface TailwindRangeProps {
  attr: string;
  title?: string;
  css?: string;
  negative?: boolean;
  required?: string;
  onChange?: (value: string) => void;
}

export default function TailwindRange({
  attr,
  title,
  css = '',
  negative = false,
  required = '',
  onChange
}: TailwindRangeProps) {
  // State for component
  const [min, setMin] = useState(-1);
  const [max, setMax] = useState<number | null>(null);
  const [le, setLe] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [values, setValues] = useState<string[]>([]);
  
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    // Get options based on attribute
    const options = twClasses[attr] || [];
    
    // Initialize for negative range if needed
    if (negative) {
      setLe(Math.floor(options.length / 2));
      setMin(-Math.floor(options.length / 2));
      setSelected(0);
    } else {
      setMin(-1);
      setLe(options.length - 1);
    }
    
    // Get current value from CSS
    if (css) {
      const classes = css.split(' ');
      classes.forEach(cl => {
        if (options.includes(cl)) {
          let selectedIndex = options.indexOf(cl);
          
          if (negative) {
            selectedIndex = options.indexOf(cl) - Math.floor(options.length / 2);
          }
          
          setSelected(selectedIndex);
          emitInput(required ? `${required} ${cl}` : cl);
        }
      });
    }
  }, [css, attr, negative, required]);
  
  // Compute the displayed value
  const getDisplayValue = () => {
    if (min < -1) {
      return selected === 0 ? '' : `[${parseInt(String(selected)) - 1}]`;
    }
    return '';
  };
  
  const emitInput = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSelected(value);
    
    // Get the options
    const options = twClasses[attr] || [];
    
    // Calculate the index
    let index = value;
    if (negative) {
      index = value + le;
    }
    
    const option = options[index];
    
    if (option) {
      emitInput(required ? `${required} ${option}` : option);
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <input 
          className="w-3/4"
          type="range"
          min={min}
          max={le}
          value={selected}
          onChange={handleChange}
        />
        <label className="capitalize">
          {title || attr} {getDisplayValue()}
        </label>
      </div>
    </div>
  );
}