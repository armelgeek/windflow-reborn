'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { colors } from '@/lib/tailwind-classes';

interface TailwindGradientProps {
  css?: string;
  onChange?: (value: string) => void;
}

export default function TailwindGradient({ css = '', onChange }: TailwindGradientProps) {
  const { state, dispatch } = useEditor();
  const [allCss, setAllCss] = useState(css);
  const [direction, setDirection] = useState(' bg-gradient-to-bl');
  const [presets] = useState([
    ' from-white to-black ',
    ' from-blue-800 to-pink-700 ',
    ' from-orange-300 to-red-900 ',
    ' from-blue-300 to-blue-900 ',
    ' from-green-300 to-blue-900 ',
    ' from-white to-blue-300 ',
    ' from-red-200 to-red-700 ',
    ' from-lime-400 to-red-700 ',
    ' from-pink-400 to-black ',
    ' from-white to-red-700 ',
    ' from-yellow-100 to-gray-800 ',
    ' from-yellow-300 to-black ',
  ]);

  useEffect(() => {
    if (!css) return;
    
    const classes = css.split(' ');
    
    classes.forEach(cl => {
      if (cl.includes('bg-gradient-to')) {
        setDirection(cl);
      }
    });
    
    setAllCss(css);
  }, [css]);

  const setCSS = (gradientCss: string) => {
    clearGradient();
    
    if (state.editor.current) {
      const updatedCss = state.editor.current.css.css + gradientCss + direction;
      
      if (dispatch) {
        dispatch({ 
          type: 'UPDATE_CURRENT_CSS', 
          payload: updatedCss 
        });
      }
    }
  };

  const clearGradient = () => {
    if (!css) return;
    
    let newCss = allCss;
    const classes = css.split(' ');
    
    classes.forEach((cl) => {
      if (cl.includes('from-') || cl.includes('to-') || cl.includes('via-')) {
        newCss = newCss.replace(cl, '');
      }
    });
    
    if (state.editor.current && dispatch) {
      dispatch({ 
        type: 'UPDATE_CURRENT_CSS', 
        payload: newCss 
      });
    }
  };

  const randomGradient = () => {
    // Get random colors and gradients
    const color1Index = Math.floor(Math.random() * colors.length);
    const color2Index = Math.floor(Math.random() * colors.length);
    const gradient1 = Math.floor(Math.random() * (9 - 1) + 1) * 100;
    const gradient2 = Math.floor(Math.random() * (9 - 1) + 1) * 100;
    
    const gradient = ` from-${colors[color1Index]}-${gradient1} to-${colors[color2Index]}-${gradient2} `;
    
    clearGradient();
    
    if (state.editor.current && dispatch) {
      dispatch({ 
        type: 'UPDATE_CURRENT_CSS', 
        payload: state.editor.current.css.css + gradient + direction 
      });
    }
    
    // Add to presets (in a real implementation, this should update state)
    // setPresets([...presets, gradient]);
  };

  return (
    <div>
      <div>Presets</div>
      <div className="flex flex-wrap w-full justify-start cursor-pointer">
        {presets.map((gradient, index) => (
          <div 
            key={index}
            className={`h-8 w-8 mx-1 mb-1 ${gradient}${direction}`} 
            title={gradient}
            onClick={() => setCSS(gradient)}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        <button 
          className="btn px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded" 
          onClick={clearGradient}
        >
          Clear
        </button>
        <button 
          className="btn px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          onClick={randomGradient}
        >
          Random
        </button>
      </div>
    </div>
  );
}