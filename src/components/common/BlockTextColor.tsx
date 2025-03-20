'use client';

import { useState } from 'react';

interface ColorPaletteProps {
  context: string;
  css?: string;
  onColor: (color: string, tone?: string | number) => void;
  onClose: () => void;
}

export default function ColorPalette({ context, css, onColor, onClose }: ColorPaletteProps) {
  // Available colors
  const colors = [
    'gray', 'bluegray', 'brown', 'red', 'yellow', 'orange', 'green', 
    'lime', 'teal', 'blue', 'indigo', 'purple', 'pink'
  ];
  
  // Available tones (50, 100, 200, etc.)
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  // Extract current color and tone
  const extractColorInfo = (cssClass: string = '') => {
    if (!cssClass) return { color: '', tone: '' };
    
    // Remove prefix (text-, bg-, hover:text-, hover:bg-)
    let normalized = cssClass.replace('hover:', '').replace(context, '');
    
    // Split by dash to get color and tone
    const parts = normalized.split('-');
    
    if (parts.length === 1) {
      return { color: parts[0], tone: '' };
    } else if (parts.length === 2) {
      return { color: parts[0], tone: parts[1] };
    } else if (parts.length > 2) {
      // Handle colors with dashes in them like 'light-blue'
      return { 
        color: parts.slice(0, parts.length - 1).join('-'), 
        tone: parts[parts.length - 1] 
      };
    }
    
    return { color: '', tone: '' };
  };
  
  const { color: currentColor, tone: currentTone } = extractColorInfo(css);
  
  // Handle selecting transparent, white, or black
  const handleSpecialColor = (colorName: string) => {
    onColor(colorName);
  };
  
  // Handle selecting a color tone
  const handleColorTone = (colorName: string, tone: number) => {
    onColor(colorName, tone);
  };
  
  return (
    <div className="fixed top-0 bg-gray-700 text-white p-2 w-full z-40 cursor-pointer right-0">
      <div className="flex flex-row justify-start">
        <div>
          <div className="flex items-center mb-4">
            <span>Current</span>
            <div 
              className={`h-8 w-8 rounded-full ml-2 ${css?.replace('hover:', '').replace('text-', 'bg-')}`}
            />
          </div>
          
          <div className="flex flex-row m-auto mb-2">
            <button 
              className="border border-black text-xl font-bold rounded-full h-6 w-6 mr-2 bg-transparent text-red-500 flex items-center justify-center" 
              title="transparent" 
              onClick={() => handleSpecialColor('')}
            >
              x
            </button>
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-white" 
              title="white" 
              onClick={() => handleSpecialColor('white')}
            />
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-black" 
              title="black" 
              onClick={() => handleSpecialColor('black')}
            />
          </div>
          
          <div className="m-auto">
            {colors.map(colorName => (
              <div key={colorName} className="flex flex-row mb-2">
                {tones.map((toneValue, index) => (
                  <div
                    key={`${colorName}-${toneValue}`}
                    className={`bg-${colorName}-${toneValue} rounded-full border border-black w-5 h-5 mr-1 ${
                      currentColor === colorName && currentTone === toneValue.toString() 
                        ? 'ring-2 ring-white' 
                        : ''
                    }`}
                    title={`${colorName}-${toneValue}`}
                    onClick={() => handleColorTone(colorName, toneValue)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className="mt-1 px-2 py-1 bg-blue-500 text-white rounded"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  );
}