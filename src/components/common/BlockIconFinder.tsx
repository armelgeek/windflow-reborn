'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Icon } from '@iconify/react';
import { searchIcons } from '@/lib/iconify';

interface BlockIconFinderProps {
  onClose?: () => void;
}

export default function BlockIconFinder({ onClose }: BlockIconFinderProps) {
  const { state, dispatch } = useEditor();
  const [search, setSearch] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const blockActionRef = useRef<HTMLDivElement>(null);

  // Emit position when component mounts
  useEffect(() => {
    if (blockActionRef.current && onClose) {
      const position = blockActionRef.current.getBoundingClientRect();
      // Here you might want to use a callback or context method
      // to notify about the position, similar to Vue's emit
    }
  }, [onClose]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle search key events
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.length > 2) {
      setIcons([]);
      setLoading(true);
      
      try {
        const results = await searchIcons(search);
        setIcons(results.icons || []);
      } catch (error) {
        console.error('Error searching icons:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Set selected icon
  const setIcon = (icon: string) => {
    if (state.current) {
      const updatedElement = {
        ...state.current,
        data: {
          ...state.current.data,
          icon
        },
        content: icon
      };
      
      dispatch({
        type: 'SET_CURRENT',
        payload: updatedElement
      });
      
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div ref={blockActionRef} className="w-full">
      <div className="flex items-center">
        <input 
          className="p-2 border w-full"
          placeholder="search icon ..."
          type="text"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      {icons && icons.length > 0 && (
        <div className="z-40 w-full h-64 overflow-y-auto bg-white shadow flex flex-row flex-wrap bg-white cursor-pointer">
          {icons.map((icon) => (
            <div 
              key={icon}
              className="w-auto h-8 m-2 text-center hover:bg-gray-200" 
              onClick={() => setIcon(icon)}
              title={icon}
            >
              <Icon icon={icon} className="text-2xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}