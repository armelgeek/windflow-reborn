'use client';

import { useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export type RadioOption = {
  label: string;
  value: string;
};

type RadioProps = {
  options: RadioOption[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
};

export default function Radio({ 
  options, 
  defaultValue = '', 
  className = '',
  onChange
}: RadioProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    if (defaultValue) {
      const index = options.findIndex(option => option.value === defaultValue);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const getIcon = (index: number) => {
    return index === selectedIndex ? 'radio_button_checked' : 'radio_button_unchecked';
  };

  const handleSetOption = (value: string, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIndex(index);
    
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-row">
      {options.map((radio, i) => (
        <div 
          key={`radio-${i}`}
          className="flex flex-row items-center text-base m-2"
        >
          <div 
            className="flex flex-row items-center text-black bg-transparent border-0 hover:bg-transparent cursor-pointer"
            onClick={(e) => handleSetOption(radio.value, i, e)}
          >
            <MaterialIcon 
              icon={getIcon(i)} 
              className={className}
            />
            <span className={`ml-1 ${className}`}>
              {radio.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}