'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import Palette from './Palette';

interface TailwindBgGradientProps {
  attr: string;
  title?: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindBgGradient({ 
  attr, 
  title,
  css = '',
  onChange
}: TailwindBgGradientProps) {
  const { state } = useEditor();
  const [showPalette, setShowPalette] = useState(false);
  const [color, setColor] = useState({
    front: '',
    over: ''
  });
  
  // Determine context (from-, via-, to-)
  const context = `${attr}-`;
  
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      if (cl.indexOf(attr) === 0) {
        setColor(prev => ({ 
          ...prev, 
          front: cl.replace(attr, 'bg')
        }));
      }
    });
    
  }, [css, attr]);
  
  const handleColorSelect = (colorName: string, tone?: string | number) => {
    let c = context;
    
    if (colorName) {
      if (tone) {
        c += `${colorName}-${tone}`;
      } else {
        c += colorName;
      }
      
      setColor(prev => ({ ...prev, front: c }));
    } else {
      setColor(prev => ({ ...prev, front: '' }));
    }
    
    if (onChange) {
      onChange(`${c} `);
    }
    
    setShowPalette(false);
  };
  
  return (
    <div className="flex flex-col">
      <div className="mr-2">
        <span className="capitalize">{title || attr}</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.front.replace(context, 'bg-')}`}
          onClick={() => setShowPalette(!showPalette)}
        />
      </div>
      
      {showPalette && (
        <Palette 
          context={context}
          css={color.front}
          onSelect={handleColorSelect}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
}