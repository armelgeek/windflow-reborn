'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Icon } from '@iconify/react';

interface TailwindButtonProps {
  attr: string;
  classe?: string;
  icon?: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindButton({ 
  attr, 
  classe = '',
  icon = '',
  css = '',
  onChange
}: TailwindButtonProps) {
  const { state } = useEditor();
  const [selected, setSelected] = useState(false);
  
  // Check if button is selected based on CSS
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      if (attr === cl) {
        setSelected(true);
      }
    });
    
  }, [css, attr]);
  
  // Toggle selection
  const handleClick = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    
    if (onChange) {
      onChange(newSelected ? attr : '');
    }
  };
  
  // Calculate active class
  const activeClass = selected 
    ? `${classe} border-white bg-indigo-500 text-white` 
    : `${classe} border-transparent text-gray-600`;
  
  return (
    <Icon 
      icon={icon}
      className={`rounded shadow h-8 w-8 flex items-center justify-center border mt-2 mr-1 hover:bg-indigo-300 ${activeClass}`}
      onClick={handleClick}
    />
  );
}