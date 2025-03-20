'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { fontfamilies } from '@/lib/tailwind-classes';

interface TailwindTextFontProps {
  attr: string;
  css?: string;
  value?: string;
  onChange: (value: string) => void;
}

export default function TailwindTextFont({
  attr,
  css = '',
  value = '',
  onChange
}: TailwindTextFontProps) {
  const { state, dispatch } = useEditor();
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  
  // Update component when props change
  useEffect(() => {
    // Extract font from element style if available
    if (state.current?.font) {
      setSelectedFont(state.current.font);
    }
  }, [state.current]);

  // Handle font selection
  const selectFont = (font: string) => {
    setSelectedFont(font);
    setShowDropdown(false);
    
    // Update the element's font
    if (state.current) {
      const newCurrent = {
        ...state.current,
        font: font
      };
      
      dispatch({
        type: 'SET_CURRENT',
        payload: newCurrent
      });
    }
    
    // Call the onChange callback
    onChange(font);
  };

  // Toggle the dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Load Google Fonts
  useEffect(() => {
    // Only load if we have fonts
    if (fontfamilies && fontfamilies.length > 0) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${fontfamilies.map(font => font.replace(' ', '+')).join('|')}&display=swap`;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm">Font Family</label>
      
      <div className="relative">
        {/* Selected Font Display */}
        <div 
          className="p-2 border rounded w-full flex justify-between items-center cursor-pointer bg-white"
          onClick={toggleDropdown}
        >
          <span 
            style={{ 
              fontFamily: selectedFont.replace('+', ' ') || 'inherit' 
            }}
          >
            {selectedFont || "Select a font"}
          </span>
          <span className="material-icons">
            {showDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </div>
        
        {/* Font Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-1 max-h-64 overflow-y-auto bg-white border rounded shadow-lg z-10">
            <div 
              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => selectFont('')}
            >
              Default Font
            </div>
            
            {fontfamilies.map((font, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                style={{ fontFamily: font.replace('+', ' ') }}
                onClick={() => selectFont(font)}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Preview with selected font */}
      {selectedFont && (
        <div className="mt-2 p-2 border rounded bg-white">
          <div className="text-sm text-gray-500 mb-1">Preview:</div>
          <div 
            className="p-2"
            style={{ fontFamily: selectedFont.replace('+', ' ') }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      )}
    </div>
  );
}