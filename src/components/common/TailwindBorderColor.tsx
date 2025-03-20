'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { colors } from '@/lib/tailwind-classes';
import Palette from './Palette';

interface TailwindBorderColorProps {
  attr?: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindBorderColor({ 
  attr = 'bordercolor', 
  css = '',
  onChange
}: TailwindBorderColorProps) {
  const { state } = useEditor();
  const [showPalette, setShowPalette] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [color, setColor] = useState<{
    color: string;
    hover: string;
  }>({
    color: '',
    hover: ''
  });
  
  // Context is always "border-" for this component
  const context = 'border-';
  
  // Update colors from CSS
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      colors.forEach(colorName => {
        if (cl.indexOf(colorName) > -1) {
          if (cl.indexOf('hover:') > -1) {
            setColor(prev => ({ ...prev, hover: cl }));
          } else {
            setColor(prev => ({ ...prev, color: cl }));
          }
        }
      });
    });
    
  }, [css]);
  
  // Set color when selected from palette
  const handleColorSelect = (colorName: string, tone?: string | number) => {
    let c = context;
    
    if (colorName) {
      if (tone) {
        c += `${colorName}-${tone}`;
      } else {
        c += colorName;
      }
      
      if (!isOver) {
        setColor(prev => ({ ...prev, color: c }));
      } else {
        setColor(prev => ({ ...prev, hover: `hover:${c}` }));
      }
    } else {
      if (!isOver) {
        setColor(prev => ({ ...prev, color: '' }));
      } else {
        setColor(prev => ({ ...prev, hover: '' }));
      }
    }
    
    // If we have an onChange, call it with the combined colors
    if (onChange) {
      onChange(`${color.color} ${color.hover}`.trim());
    }
    
    // Close palette
    setShowPalette(false);
  };
  
  return (
    <div className="flex flex-row">
      <div className="mr-2">
        <span>Color</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.color.replace('border', 'bg').replace('hover:', '')}`}
          onClick={() => {
            setShowPalette(!showPalette);
            setIsOver(false);
          }}
        />
      </div>
      
      <div>
        <span>Over</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.hover.replace('hover:border', 'bg').replace('hover:', '')}`}
          onClick={() => {
            setShowPalette(!showPalette);
            setIsOver(true);
          }}
        />
      </div>
      
      {showPalette && (
        <Palette 
          context={context}
          css={isOver ? color.hover : color.color}
          onSelect={handleColorSelect}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
}