'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { classes } from '@/lib/tailwind-classes';

interface TailwindCheckboxProps {
  attr: string;
  title?: string;
  prefix?: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindCheckbox({ 
  attr, 
  title,
  prefix = '',
  css = '',
  onChange
}: TailwindCheckboxProps) {
  const { state } = useEditor();
  const [selected, setSelected] = useState(false);
  
  // Get options for this attribute
  const options = classes[attr as keyof typeof classes] || [];
  
  // Check if checkbox is selected based on CSS
  useEffect(() => {
    if (!css || css.length === 0 || !options.length) return;
    
    const classesArray = css.split(' ');
    
    classesArray.forEach(cl => {
      if (options.indexOf(cl) > -1) {
        setSelected(true);
      }
    });
    
  }, [css, options]);
  
  // Toggle selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = e.target.checked;
    setSelected(newSelected);
    
    if (onChange && options.length > 0) {
      onChange(newSelected ? (prefix ? prefix + options[0] : options[0]) : '');
    }
  };
  
  return (
    <div className="flex flex-col mr-2">
      <label className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={selected}
          onChange={handleChange}
          className=""/>
      </label>
    </div>
  )
}