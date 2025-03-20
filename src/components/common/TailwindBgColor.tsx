'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { colors } from '@/lib/tailwind-classes';
import Palette from './Palette';

interface TailwindBgColorProps {
  attr?: string;
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindBgColor({ 
  attr = 'bgcolor', 
  css = '',
  onChange
}: TailwindBgColorProps) {
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
  
  // Determine context (bg-)
  const context = `${attr}-`; // e.g., "bg-"
  
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
    
    if (onChange) {
      const updatedColor = !isOver 
        ? { ...color, color: c }
        : { ...color, hover: `hover:${c}` };
        
      onChange(`${updatedColor.color} ${updatedColor.hover}`.trim());
    }
    
    setShowPalette(false);
  };
  
  return (
    <div className="flex flex-row">
      <div className="mr-2">
        <span>Color</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.color.replace('text', 'bg').replace('hover:', '')}`}
          onClick={() => {
            setShowPalette(!showPalette);
            setIsOver(false);
          }}
        />
      </div>
      
      <div>
        <span>Over</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.hover.replace('hover:text', 'bg').replace('hover:', '')}`}
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