'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@/context/EditorContext';
import { Element } from '@/types/element';
import BlockContainer from '../blocks/BlockContainer';



export default function BlockPreview({}: any) {
  const router = useRouter();
  const { state: editorState, dispatch } = useEditor();

  // Adjust viewport for preview mode
  useEffect(() => {
    // Set viewport meta tag for mobile preview
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute("content", "width=368,initial-scale=1.0");
    }
    
    // Dispatch preview mode
    if (dispatch) {
      dispatch({ type: 'SET_PREVIEW', payload: true });
    }
    
    // Add overflow style to body
    document.body.style.overflowY = 'auto';
    
    // Cleanup function
    return () => {
      // Reset viewport when component unmounts
      if (viewport) {
        viewport.setAttribute("content", "width=device-width,initial-scale=1.0");
      }
      
      // Reset overflow style
      document.body.style.overflowY = '';
      
      // Exit preview mode
      if (dispatch) {
        dispatch({ type: 'SET_PREVIEW', payload: false });
      }
    };
  }, [dispatch]);
  
  // Get document from local storage
  const doc = localStorage.get('windflow-preview') || editorState.document;
  
  if (!doc) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">No preview data available</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-hidden">
      <div className="overflow-y-auto flex flex-col">
        <BlockContainer 
          doc={doc}
          mode="preview"
          id="content"
        />
      </div>
    </div>
  );
}