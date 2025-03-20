'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification } from '@/context/NotificationContext';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import sidebar components
const BlockElements = dynamic(() => import('./BlockElements'));
const BlockCustomize = dynamic(() => import('./BlockTailwind'));
const BlockCss = dynamic(() => import('./BlockCss'));
const BlockAttributes = dynamic(() => import('./BlockAttributes'));
const BlockLibrary = dynamic(() => import('./BlockLibrary'));
const BlockComponents = dynamic(() => import('./BlockComponents'));
const BlockAnimation = dynamic(() => import('./BlockAnimation'));
const BlockTree = dynamic(() => import('./BlockTree'));

interface EditorSidebarProps {
  tab: string;
  onClose: () => void;
}

export default function EditorSidebar({ tab, onClose }: EditorSidebarProps) {
  const { state, dispatch } = useEditor();
  const [component, setComponent] = useState<string>('elements');
  
  // Update component state when tab prop changes
  useEffect(() => {
    if (tab) {
      setComponent(tab);
    }
  }, [tab]);
  
  // Register event handler for when the sidebar is mounted
  useEffect(() => {
    // Notify editor that sidebar is active
    dispatch({ type: 'SET_SIDEBAR_ACTIVE', payload: true });
    
    // Cleanup function to notify editor that sidebar is closed
    return () => {
      dispatch({ type: 'SET_SIDEBAR_ACTIVE', payload: false });
    };
  }, [dispatch]);
  
  // Render appropriate component based on active tab
  const renderSidebarContent = () => {
    if (!state.current) {
      return (
        <div className="flex h-full w-full items-center justify-center text-xl">
          <ChevronRight className="h-6 w-6" /> Select a block 
        </div>
      );
    }
    
    switch (component) {
      case 'elements':
        return <BlockElements />;
      case 'customize':
        return <BlockCustomize css={state.current.css.css} cid={state.current.id} key={state.current.id} />;
      case 'css':
        return <BlockCss />;
      case 'attributes':
        return <BlockAttributes />;
      case 'snippets':
        return <BlockLibrary />;
      case 'library':
        return <BlockComponents />;
      case 'animation':
        return <BlockAnimation />;
      case 'tree':
        return <BlockTree />;
      default:
        return <BlockElements />;
    }
  };

  return (
    <div className="relative w-full bg-white z-highest h-screen overflow-hidden border-r border-white">
      {/* Header */}
      <div 
        className="p-1 shadow-lg bg-gray-600 text-white capitalize flex flex-row items-center text-base cursor-pointer"
        onClick={onClose}
      >
        <span>{tab}</span>
        <ChevronRight className="absolute right-0 text-white text-xl" />
      </div>
      
      {/* Content */}
      <div className="w-full h-full overflow-y-auto">
        {renderSidebarContent()}
      </div>
    </div>
  );
}