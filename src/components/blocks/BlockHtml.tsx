'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Editor } from '@monaco-editor/react';

interface BlockHtmlProps {
  onClose?: () => void;
}

export default function BlockHtml({ onClose }: BlockHtmlProps) {
  const { state, dispatch } = useEditor();
  const [html, setHtml] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Initialize HTML content from current element
  useEffect(() => {
    if (!state.current) return;
    
    // Get content from current element
    setHtml(state.current.content || '');
  }, [state.current]);

  // Handle editor ready state
  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setHtml(value);
    }
  };

  // Apply HTML changes to the current element
  const applyHtml = () => {
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_CONTENT',
        payload: html
      });
      
      if (onClose) {
        onClose();
      }
    }
  };

  // Editor options
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: {
      enabled: false
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-200">
        <span className="font-medium">HTML Editor</span>
        <div>
          <button
            onClick={applyHtml}
            className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!isEditorReady}
          >
            Apply
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow min-h-[400px]">
        <Editor
          height="100%"
          language="html"
          value={html}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}