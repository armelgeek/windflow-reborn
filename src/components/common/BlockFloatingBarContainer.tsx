'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { useEditorBus } from '@/context/EditorBusContext';
import { 
  ChevronUp, 
  Copy, 
  Type, 
  PaintBucket, 
  Image, 
  Brush, 
  Link, 
  Trash2, 
  ChevronDown 
} from 'lucide-react';

interface BlockFloatingBarContainerProps {
  coords: {
    top: number;
    left: number;
  };
}

export default function BlockFloatingBarContainer({ coords }: BlockFloatingBarContainerProps) {
  const { state } = useEditor();
  const { publish } = useEditorBus();

  // If no current element selected, return nothing
  if (!state.current) {
    return null;
  }

  // Style for positioning the toolbar
  const style = {
    top: `${coords.top}px`,
    left: `${coords.left}px`
  };

  // Handle event emissions
  const handleEvent = (event: string, payload?: any) => {
    publish(event, payload);
  };

  return (
    <div 
      className="fixed z-10 top-0 left-0 h-6 flex items-center justify-center bg-white text-black shadow text-xs pr-2" 
      style={style}>
      <small className="ml-2">{state.current.tag}</small>
      
      {state.current.tag !== 'document' && (
        <button 
          className="floating-icon text-xl" 
          onClick={() => handleEvent('moveBlock', 1)}
          title="Move block up">
          <ChevronUp size={18} />
        </button>
      )}
      
      {state.current.tag !== 'document' && (
        <button 
          className="floating-icon text-xl"
          onClick={() => handleEvent('duplicateBlock')}
          title="Duplicate block">
          <Copy size={18} />
        </button>
      )}
      
      <button 
        className="floating-icon"
        onClick={() => handleEvent('BlockTextColor')}
        title="Text color">
        <Type size={18} />
      </button>
      
      <button 
        className="floating-icon"
        onClick={() => handleEvent('formatBgColor')}
        title="Background color">
        <PaintBucket size={18} />
      </button>
      
      <button 
        className="floating-icon"
        onClick={() => handleEvent('imageURL')}
        title="Image">
        <Image size={18} />
      </button>
      
      <button 
        className="floating-icon"
        onClick={() => handleEvent('customizeBlock')}
        title="Style">
        <Brush size={18} />
      </button>
      
      <button 
        className="floating-icon"
        onClick={() => handleEvent('linkBlock')}
        title="Link">
        <Link size={18} />
      </button>
      
      {state.current.tag !== 'document' && (
        <button 
          className="floating-icon"
          onClick={() => handleEvent('deleteBlock')}
          title="Delete">
          <Trash2 size={18} />
        </button>
      )}
      
      <button 
        className="floating-icon"
        onClick={(e) => handleEvent('contextMenuBlock', e)}
        title="More options">
        <ChevronDown size={18} />
      </button>
    </div>
  );
}