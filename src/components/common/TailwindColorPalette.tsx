'use client';

import { useRef, useEffect } from 'react';
import { colors } from '@/lib/tailwind-classes';
import { X } from 'lucide-react';

interface TailwindColorPaletteProps {
  context: string;
  selectedColor: string;
  onSelectColor: (color: string, tone?: string | number) => void;
  onClose: () => void;
}

export default function TailwindColorPalette({
  context,
  selectedColor,
  onSelectColor,
  onClose
}: TailwindColorPaletteProps) {
  const paletteRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={paletteRef}
      className="fixed top-0 bg-gray-700 text-white p-2 w-full z-40 cursor-pointer right-0"
    >
      <div className="flex flex-row justify-start">
        <div>
          <div className="flex items-center mb-4">
            <span>Current</span>
            <div 
              className={`h-8 w-8 rounded-full ml-2 ${selectedColor.replace(context, 'bg-')}`}
            />
          </div>
          
          <div className="flex flex-row m-auto mb-2">
            <button 
              className="border border-black text-xl font-bold rounded-full h-6 w-6 mr-2 bg-transparent text-red-500 flex items-center justify-center" 
              title="transparent" 
              onClick={() => onSelectColor('', '')}
            >
              <X size={12} />
            </button>
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-white" 
              title="white" 
              onClick={() => onSelectColor('white', '')}
            />
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-black" 
              title="black" 
              onClick={() => onSelectColor('black', '')}
            />
          </div>
          
          <div className="m-auto">
            {colors.map(colorName => (
              <div key={colorName} className="flex flex-row mb-2">
                {[...Array(10)].map((_, i) => {
                  const tone = i === 0 ? 50 : i * 100;
                  return (
                    <div
                      key={`${colorName}-${tone}`}
                      className={`bg-${colorName}-${tone} rounded-full border border-black w-5 h-5 mr-1`}
                      title={`${colorName}-${tone}`}
                      onClick={() => onSelectColor(colorName, tone)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className="mt-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  );
}