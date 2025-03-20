'use client';

import React, { FC } from 'react';
import { colors } from '@/lib/tailwind-classes';
import { Icon } from '@iconify/react';

interface PaletteProps {
  context?: string;
  css?: string;
  onSelect: (color: string, tone?: string | number) => void;
  onClose: () => void;
  field?: {
    image?: {
      url: string;
    }
  };
  onMedia?: () => void;
  onRemoveImage?: () => void;
}

const Palette: FC<PaletteProps> = ({ 
  context = 'text-', 
  css = '', 
  onSelect, 
  onClose,
  field,
  onMedia,
  onRemoveImage
}) => {
  const getColor = (n: number, color: string): string => {
    return n === 1 
      ? `bg-${color}-50` 
      : `bg-${color}-${(n-1)*100}`;
  };
  
  return (
    <div className="fixed top-0 bg-gray-700 text-white p-2 w-full z-40 cursor-pointer right-0">
      <div className="flex flex-row justify-start">
        <div>
          <div className="flex items-center mb-4">
            <span>Current</span>
            <div 
              className={`h-8 w-8 rounded-full ml-2 ${
                context && css ? css.replace('text-', 'bg-').replace('hover:', '') : ''
              }`}
            />
          </div>
          
          <div className="flex flex-row m-auto mb-2">
            <Icon 
              icon="material-symbols:clear"
              className="border border-black text-xl font-bold rounded-full h-6 w-6 mr-2 bg-transparent text-red-500 flex items-center justify-center" 
              title="transparent" 
              onClick={() => onSelect('', '')}
            />
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-white" 
              title="white" 
              onClick={() => onSelect('white', '')}
            />
            <div 
              className="border border-black rounded-full w-6 h-6 mr-2 bg-black" 
              title="black" 
              onClick={() => onSelect('black', '')}
            />
          </div>
      
          <div className="m-auto">
            {colors.map((color) => (
              <div key={`color_${color}`} className="flex flex-row mb-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`${color}_${i}`}
                    title={`${color}-${i === 0 ? 50 : (i) * 100}`}
                    className={`${getColor(i+1, color)} rounded-full border border-black w-5 h-5 mr-1`}
                    onClick={() => onSelect(color, i === 0 ? 50 : i * 100)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {field && (
          <div>
            <span>Image</span>
            {!field.image ? (
              <Icon 
                icon="material-symbols:add" 
                className="text-white text-sm border rounded-full"
                onClick={onMedia}
              />
            ) : (
              <>
                <img 
                  src={field.image.url} 
                  alt="Selected image" 
                  onClick={onMedia}
                />
                <span 
                  className="text-xs cursor-pointer" 
                  onClick={onRemoveImage}
                >
                  Remove
                </span>
              </>
            )}
          </div>
        )}
      </div>
      
      <button 
        className="mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  );
};

export default Palette;