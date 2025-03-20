'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { v4 as uuidv4 } from 'uuid';
import { useNotification } from '@/context/NotificationContext';
import { Element } from '@/types/element';
import BlockContainer from '../blocks/BlockContainer';

interface BlockEditorProps {
  scroll?: number;
}

export default function BlockEditor({ scroll = 0 }: BlockEditorProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [showCopyId, setShowCopyId] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<DOMRect | null>(null);
  const [styleTop, setStyleTop] = useState<number>(0);
  const [styleLeft, setStyleLeft] = useState<number>(0);
  const [document, setDocument] = useState<Element | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  
  // Initialize document from state
  useEffect(() => {
    if (state.document) {
      setDocument(state.document);
    }
  }, [state.document]);
  
  // Watch for scroll changes
  useEffect(() => {
    if (editorRef.current && scroll > 0) {
      editorRef.current.scrollTop = scroll;
    }
  }, [scroll]);
  
  // Register key event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Copy element ID with Ctrl+I
      if (e.ctrlKey && e.key === 'i' && state.current) {
        navigator.clipboard.writeText(state.current.id);
        setShowCopyId(true);
        
        // Hide notification after 2 seconds
        setTimeout(() => {
          setShowCopyId(false);
        }, 2000);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.current]);
  
  // Update element highlight when current element changes
  useEffect(() => {
    if (state.current && state.current.id) {
      updateHighlight();
    }
  }, [state.current]);
  
  // Focus current element when changed
  useEffect(() => {
    if (state.current && state.current.id) {
      const el = document.getElementById(state.current.id);
      if (el) {
        updateElementCoords(el);
      }
    }
  }, [state.current?.id]);
  
  // Handle global click to clear selection
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && e.target instanceof Node) {
        // Only clear selection if clicking outside the editor
        if (!containerRef.current.contains(e.target)) {
          clearCurrent();
        }
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Clear current selection
  const clearCurrent = () => {
    dispatch({ type: 'SET_CURRENT', payload: null });
    
    if (highlightRef.current) {
      highlightRef.current.style.opacity = '0';
    }
  };
  
  // Get coordinates of an element
  const updateElementCoords = (element: HTMLElement) => {
    if (!element) return;
    
    const coords = element.getBoundingClientRect();
    setCurrentCoords(coords);
    
    if (containerRef.current) {
      const containerCoords = containerRef.current.getBoundingClientRect();
      
      setStyleTop(coords.top - containerCoords.top);
      setStyleLeft(coords.left - containerCoords.left);
      
      // Update coords in current element
      if (state.current) {
        const updatedCurrent = {
          ...state.current,
          coords
        };
        
        dispatch({ type: 'SET_CURRENT', payload: updatedCurrent });
      }
    }
  };
  
  // Update highlight position
  const updateHighlight = () => {
    if (!state.current || !state.current.id) return;
    
    const el = document.getElementById(state.current.id);
    if (!el || !highlightRef.current) return;
    
    updateElementCoords(el);
    
    // Update highlight styles
    if (highlightRef.current) {
      highlightRef.current.style.opacity = '1';
      highlightRef.current.style.top = `${styleTop}px`;
      highlightRef.current.style.left = `${styleLeft}px`;
      highlightRef.current.style.width = `${currentCoords?.width || 0}px`;
      highlightRef.current.style.height = `${currentCoords?.height || 0}px`;
    }
  };
  
  // Handle element selection
  const handleSelectElement = (element: Element) => {
    dispatch({ type: 'SET_CURRENT', payload: element });
  };
  
  // Render placeholder when no document is available
  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl mb-4">No document loaded</h1>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => modalDispatch({ 
              type: 'OPEN_MODAL',
              payload: { 
                component: 'startEmpty',
                title: 'Create New Document'
              }
            })}
          >
            Create a new document
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full editor-main bg-gray-100 min-h-screen overflow-y-auto overflow-x-hidden"
    >
      <div ref={editorRef} className="w-full overflow-y-auto">
        {/* Element Highlight */}
        <div 
          ref={highlightRef}
          className="absolute border-2 border-purple-500 pointer-events-none z-40 transition-all duration-200 opacity-0"
          style={{ 
            boxShadow: '0 0 0 2000px rgba(0, 0, 0, 0.1)',
            clipPath: 'inset(0px -2000px -2000px 0px)'
          }}
        />
        
        {/* ID Copied Notification */}
        {showCopyId && (
          <div className="fixed top-0 right-0 bg-green-500 text-white p-2 z-50">
            Element ID copied to clipboard!
          </div>
        )}
        
        {/* Main Editor Content */}
        <BlockContainer
          doc={document} 
          mode="edit"
          onSelect={handleSelectElement}
        />
      </div>
    </div>
  );
}