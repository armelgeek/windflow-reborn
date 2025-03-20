'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface TailwindPositionProps {
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindPosition({ css = '', onChange }: TailwindPositionProps) {
  // State variables
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const [pixels, setPixels] = useState<number[]>([1, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256]);
  const [xcss, setXcss] = useState<string>('');
  const [ycss, setYcss] = useState<string>('');
  const [axisScope, setAxisScope] = useState<{x: string, y: string}>({ x: 'l', y: 't' });
  const [translates, setTranslates] = useState<string[]>(['translate-x', 'translate-y']);
  const [scope, setScope] = useState<string>('');

  // Initial setup
  useEffect(() => {
    if (!css) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      translates.forEach(tr => {
        if (cl.indexOf(tr) > -1) {
          let value = cl.split('-')[cl.split('-').length - 1];
          let negative = cl.indexOf('-x-') > -1 || cl.indexOf('-y-') > -1 ? -1 : 1;
          
          if (cl.indexOf('-x-') > -1) {
            if (value) {
              setPosX(pixels.indexOf(parseInt(value) * 4) * negative);
            } else {
              setPosX(0);
            }
          } else {
            if (value) {
              setPosY(pixels.indexOf(parseInt(value) * 4) * negative);
            } else {
              setPosY(0);
            }
          }
        }
      });
    });
  }, [css]);

  // Update CSS when X position changes
  useEffect(() => {
    if (posX === 0) {
      emitInput('');
      return;
    }
    
    let p = -posX;
    let axis;
    
    posX < 0 ? p = -posX : p = posX;
    posX < 0 ? axis = '-translate-x-' : axis = 'translate-x-';
    
    const newXcss = parseInt(String(p)) ? `${axis}${pixels[p] / 4}` : '';
    setXcss(newXcss);
    
    emitInput(` transform ${newXcss} ${ycss} `);
  }, [posX]);

  // Update CSS when Y position changes
  useEffect(() => {
    if (posY === 0) {
      emitInput('');
      return;
    }
    
    let p = -posY;
    let axis;
    
    posY < 0 ? p = -posY : p = posY;
    posY < 0 ? axis = ' -translate-y-' : axis = ' translate-y-';
    
    const newYcss = parseInt(String(p)) ? `${axis}${pixels[p] / 4}` : '';
    setYcss(newYcss);
    
    emitInput(` transform ${xcss} ${newYcss} `);
  }, [posY]);

  // Emit input to parent
  const emitInput = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  // Handle decrements and increments
  const decrementY = () => {
    if (posY > -pixels.length + 1) {
      setPosY(posY - 1);
    }
  };

  const incrementY = () => {
    if (posY < pixels.length - 1) {
      setPosY(posY + 1);
    }
  };

  return (
    <div className="mt-2">
      <div>Translate</div>
      <div className="flex flex-row text-center w-full items-center justify-center">
        <ChevronLeft 
          className="cursor-pointer"
          onClick={() => setPosX(posX > -pixels.length + 1 ? posX - 1 : posX)}
        />
        <input 
          type="range" 
          min={-pixels.length + 1} 
          max={pixels.length - 1} 
          value={posX}
          onChange={(e) => setPosX(parseInt(e.target.value))}
          className="mx-2"
        />
        <ChevronRight 
          className="cursor-pointer"
          onClick={() => setPosX(posX < pixels.length - 1 ? posX + 1 : posX)}
        />
      </div>
      <div className="w-full text-center">{posX}</div>
      <div className="flex flex-row text-center w-full items-center justify-center">
        <ChevronUp 
          className="cursor-pointer" 
          onClick={decrementY}
        />
        <input 
          type="range" 
          min={-pixels.length + 1} 
          max={pixels.length - 1} 
          value={posY}
          onChange={(e) => setPosY(parseInt(e.target.value))}
          className="mx-2"
        />
        <ChevronDown 
          className="cursor-pointer" 
          onClick={incrementY}
        />
      </div>
      <div className="w-full text-center">{posY}</div>
    </div>
  );
}