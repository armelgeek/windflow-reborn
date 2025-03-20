'use client';

import React, { useRef, useEffect, useState } from 'react';
import { X, MoveVertical } from 'lucide-react';
import { useEditorComponentsContext } from '@/context/EditorComponentsContext';

interface BlockFloatingActionProps {
  title: string;
  component: string;
  coords: {
    top: number;
    left: number;
  };
  scroll: number;
  options?: any;
  onClose: () => void;
}

export default function BlockFloatingAction({ 
  title, 
  component, 
  coords, 
  scroll, 
  options, 
  onClose 
}: BlockFloatingActionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialClickPosition, setInitialClickPosition] = useState({ x: 0, y: 0 });
  const [initialElementPosition, setInitialElementPosition] = useState({ x: 0, y: 0 });
  const { components } = useEditorComponentsContext();

  // Get the actual component to render
  const ComponentToRender = components[component];

  // Get CSS class based on component existence
  const getClassName = () => {
    return component ? '' : 'hidden';
  };

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setInitialClickPosition({ x: e.clientX, y: e.clientY });
      setInitialElementPosition({ x: rect.left, y: rect.top });
    }
  };

  // Handle drag movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    
    const dx = e.clientX - initialClickPosition.x;
    const dy = e.clientY - initialClickPosition.y;
    
    setPosition({
      x: initialElementPosition.x + dx, 
      y: initialElementPosition.y + dy
    });
  };

  // End dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Effect to set up drag movement handlers
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, initialClickPosition, initialElementPosition]);

  // Style for positioning the dialog
  const style = {
    position: 'absolute' as const,
    top: `${position.y || coords.top}px`,
    left: `${position.x || coords.left}px`
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col shadow z-modal bg-white modal ${getClassName()}`}
      style={style}>
      <div 
        ref={headerRef}
        className="cursor-move z-modal flex bg-purple-800 h-8 text-white p-1"
        onMouseDown={handleMouseDown}>
        {title}
        <div className="flex h-8 items-center justify-center absolute top-0 right-0 z-modal">
          <MoveVertical className="mr-1" size={18} />
          <button 
            className="m-1 mr-2 cursor-pointer" 
            onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div>
        {ComponentToRender && (
          <ComponentToRender
            coords={coords}
            scroll={scroll}
            options={options}
          />
        )}
      </div>
    </div>
  );
}