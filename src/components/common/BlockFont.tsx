'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import classes from '@/lib/tailwind-classes';

interface BlockFontProps {
  onClose?: () => void;
}

export default function BlockFont({ onClose }: BlockFontProps) {
  const { state, dispatch } = useEditor();
  const [fontSelected, setFontSelected] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [entryCss, setEntryCss] = useState<string[]>([]);
  const [oldFontSize, setOldFontSize] = useState('');

  // Parse CSS classes when component mounts
  useEffect(() => {
    if (!state.current) return;
    
    // Get CSS classes from current element
    const currentCss = state.current.css.css;
    if (!currentCss || !currentCss.length) return;
    
    // Split CSS classes
    const classList = currentCss.split(' ').filter(Boolean);
    
    // Create array of clean CSS classes
    setEntryCss(classList);
    
    // Find existing font size class
    classList.forEach(cl => {
      if (sizes.includes(cl)) {
        setOldFontSize(cl.replace('text-', ''));
      }
    });
    
    // Set current font
    setFontSelected(state.current.font || '');
  }, [state.current]);

  // Update font size when changed
  useEffect(() => {
    if (!fontSize) return;
    
    // Create new CSS classes array
    const newCss = [...entryCss, fontSize];
    
    // Update current element's CSS
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_CSS',
        payload: newCss.join(' ')
      });
      
      // Reset old font size
      setOldFontSize('');
    }
  }, [fontSize, entryCss, dispatch]);

  // Update font family when changed
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontSelected(font);
    
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_FONT',
        payload: font
      });
    }
  };

  // Get available fonts
  const fonts = classes.fontfamily || [];
  
  // Get available sizes
  const sizes = classes.textSize || [];

  // Early return if no current element
  if (!state.current) {
    return null;
  }

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="p-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Family
        </label>
        <select 
          value={fontSelected} 
          onChange={handleFontChange}
          className="w-full p-2 border rounded">
          <option value=""></option>
          <option value="Arial">sans-serif</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font.replace('+', ' ')}
            </option>
          ))}
        </select>
        
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
          Size {oldFontSize && `(Current: ${oldFontSize})`}
        </label>
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full p-2 border rounded">
          <option value=""></option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size.replace('text-', '')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}