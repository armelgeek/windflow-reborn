'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';

interface BlockHeadingProps {
  onClose?: () => void;
  coords?: {
    top: number;
    left: number;
  };
}

export default function BlockHeading({ onClose, coords }: BlockHeadingProps) {
  const { state, dispatch } = useEditor();
  const [headingLevel, setHeadingLevel] = useState<number>(1);
  const blockActionRef = useRef<HTMLDivElement>(null);

  // Initialize heading level from current element
  useEffect(() => {
    if (state.current && state.current.level) {
      setHeadingLevel(state.current.level);
    }
  }, [state.current]);

  // Emit position change when component mounts
  useEffect(() => {
    if (blockActionRef.current && onClose) {
      const position = blockActionRef.current.getBoundingClientRect();
      // In React we could use a callback to emit this, but we're simulating the Vue behavior
      // You might want to replace this with a proper callback or context method
    }
  }, [onClose]);

  // Handle level change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(e.target.value, 10);
    setHeadingLevel(level);
    
    if (state.current) {
      // Update current element's heading level
      dispatch({
        type: 'UPDATE_CURRENT_LEVEL',
        payload: level
      });
    }
  };

  return (
    <div ref={blockActionRef} className="w-40">
      <div className="p-1 bg-gray-200 w-full flex justify-between items-center">
        <span>Heading</span>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            ×
          </button>
        )}
      </div>
      <select 
        className="p-1 m-1 w-5/6" 
        value={headingLevel}
        onChange={handleLevelChange}
      >
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <option key={n} value={n}>
            H{n}
          </option>
        ))}
      </select>
    </div>
  );
}