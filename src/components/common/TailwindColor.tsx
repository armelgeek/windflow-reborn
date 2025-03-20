'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { cleanCssClasses } from '@/lib/utils';
import { colors } from '@/lib/tailwind-classes';
import Palette from '@/components/common/Palette';

interface TailwindColorProps {
  attr?: string;
  css?: string;
  onChange?: (value: string) => void;
  front?: string;
  hover?: string;
}

export default function TailwindColor({ 
  attr = 'textcolor', 
  css = '',
  onChange,
  front,
  hover
}: TailwindColorProps) {
  const { state } = useEditor();
  const [showPalette, setShowPalette] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [color, setColor] = useState<{
    front: string;
    over: string;
  }>({
    front: front || '',
    over: hover || ''
  });
  
  const context = attr === 'bgcolor' ? 'bg-' : 'text-';
  
  useEffect(() => {
    if (!css || css.length === 0) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      colors.forEach(colorName => {
        if (cl.indexOf(colorName) > -1) {
          if (cl.indexOf('hover:') > -1) {
            setColor(prev => ({ ...prev, over: cl }));
          } else {
            setColor(prev => ({ ...prev, front: cl }));
          }
        }
      });
    });
    
    // Set front and hover if provided
    if (front) setColor(prev => ({ ...prev, front }));
    if (hover) setColor(prev => ({ ...prev, over: hover }));
    
  }, [css, front, hover]);
  
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
        setColor(prev => ({ ...prev, front: c }));
      } else {
        setColor(prev => ({ ...prev, over: `hover:${c}` }));
      }
    } else {
      if (!isOver) {
        setColor(prev => ({ ...prev, front: '' }));
      } else {
        setColor(prev => ({ ...prev, over: '' }));
      }
    }
    
    // If we have an onChange, call it with the combined colors
    if (onChange) {
      const updatedColor = !isOver 
        ? { ...color, front: c }
        : { ...color, over: `hover:${c}` };
        
      onChange(`${updatedColor.front} ${updatedColor.over}`.trim());
    }
    
    // Close palette
    setShowPalette(false);
  };
  
  return (
    <div className="flex flex-row">
      <div className="mr-2">
        <span>Color</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.front.replace('text', 'bg')}`}
          onClick={() => {
            setShowPalette(!showPalette);
            setIsOver(false);
          }}
        />
      </div>
      
      <div>
        <span>Over</span>
        <div 
          className={`mb-1 w-8 h-8 border-2 rounded-full ${color.over.replace('hover:text', 'bg').replace('hover:', '')}`}
          onClick={() => {
            setShowPalette(!showPalette);
            setIsOver(true);
          }}
        />
      </div>
      
      {showPalette && (
        <Palette 
          context={context}
          css={isOver ? color.over : color.front}
          onSelect={handleColorSelect}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
}