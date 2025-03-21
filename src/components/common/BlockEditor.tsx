'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import BlockContainer from '@/components/blocks/BlockContainer';
import { Element } from '@/types/element';
import { cleanCssClasses } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useModal, modalActions } from '@/context/ModalContext';
import BlockFloating from './BlockFloating';

interface BlockEditorProps {
  scroll?: number;
}

export default function BlockEditor({ scroll = 0 }: BlockEditorProps) {
  const router = useRouter();
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  const mainEditorRef = useRef<HTMLDivElement>(null);

  // Editor state
  const [internalScroll, setInternalScroll] = useState(scroll);
  const [viewBlocks, setViewBlocks] = useState(false);
  const [display, setDisplay] = useState(true);
  const [editorOffsetX] = useState(16);
  const [editorOffsetY] = useState(88);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0
  });
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll events
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setInternalScroll(e.currentTarget.scrollTop);
  };

  // Select a block and show floating menu
  const handleSelectBlock = (element: Element) => {
    if (!element) return;

    // Clean CSS classes
    if (element.css && element.css.css) {
      element.css.css = cleanCssClasses(element.css.css);
    }

    // Set as current element in editor state
    editorActions.setCurrent(editorDispatch, element);

    // Get coordinates of the selected element
    setTimeout(() => {
      const el = document.getElementById(element.id);
      if (el) {
        const elementRect = el.getBoundingClientRect();
        setCoords({
          top: elementRect.top,
          left: elementRect.left,
          width: elementRect.width,
          height: elementRect.height,
          right: elementRect.right,
          bottom: elementRect.bottom
        });
        setShowFloatingMenu(true);
      }
    }, 0);
  };

  // Create an empty component
  const createEmptyComponent = () => {
    // Dispatch action to create empty component
    notificationActions.showNotification(
      notificationDispatch,
      'Creating new document...',
      'info'
    );
    
    // This would typically use a context action
    modalActions.openModal(
      modalDispatch,
      'startEmpty',
      'New Template',
      'w-1/2',
      {}
    );
  };

  // Save the current page
  const savePage = () => {
    if (!editorState.page) return;
    
    notificationActions.showNotification(
      notificationDispatch,
      'Saving document...',
      'info'
    );
    
    // Call API or dispatch action to save page
    // This would be implemented in a context action
    console.log('Saving page:', editorState.page.name);
    
    notificationActions.showNotification(
      notificationDispatch,
      'Document saved successfully',
      'success'
    );
  };

  // Close floating menu
  const handleCloseFloatingMenu = () => {
    setShowFloatingMenu(false);
  };

  // Initialize editor
  useEffect(() => {
    if (!editorState.document) {
      const lastDocument = localStorage.getItem('whoobe-preview');
      if (lastDocument) {
        try {
          editorActions.setDocument(editorDispatch, JSON.parse(lastDocument));
        } catch (error) {
          console.error('Error loading last document:', error);
        }
      }
    }
    
    // Set up autosave if enabled
    if (editorState.page && editorState.settings?.autosave) {
      const autosaveTimer = setInterval(() => {
        savePage();
      }, (editorState.settings.autosaveTimeout || 5) * 60 * 1000);
      
      setTimer(autosaveTimer);
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [editorState.document, editorState.page, editorState.settings]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.code) {
          case 'KeyS': // Alt+S to save
            e.preventDefault();
            savePage();
            break;
          case 'KeyN': // Alt+N for preview
            e.preventDefault();
            // Trigger preview mode
            const previewData = editorState.document;
            if (previewData) {
              localStorage.setItem('whoobe-preview', JSON.stringify(previewData));
              window.open('/preview', '_blank');
            }
            break;
          // Add more shortcuts as needed
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorState.document]);

  // Update coordinates when scroll changes
  useEffect(() => {
    if (!editorState.current || !showFloatingMenu) return;
    
    const el = document.getElementById(editorState.current.id);
    if (el) {
      const elementRect = el.getBoundingClientRect();
      setCoords({
        top: elementRect.top,
        left: elementRect.left,
        width: elementRect.width,
        height: elementRect.height,
        right: elementRect.right,
        bottom: elementRect.bottom
      });
    }
  }, [internalScroll, editorState.current, showFloatingMenu]);

  // Redirect if no page is loaded
  if (!editorState.page) {
    router.push('/');
    return null;
  }

  return (
    <div 
      ref={mainEditorRef}
      id="blockEditor"
      className="bg-gray-100 min-h-screen text-black overflow-auto pb-20"
      onScroll={handleScroll}
    >
      {/* Header bar */}
      <div className="h-8 mt-8 p-1 bg-white text-gray-800 w-full fixed flex flex-row items-center left-0 top-0 z-50 shadow">
        {editorState.page && (
          <span className="ml-2 px-2 py-1 rounded text-gray-100 bg-purple-800">
            {editorState.page.name}
          </span>
        )}
        
        <span className="px-2 py-1 rounded bg-gray-100 text-black ml-1">
          {editorState.page?.category || 'No Category'}
        </span>

        <div className="flex-grow"></div>
        
        {/* Action buttons */}
        <button 
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={savePage}
          title="Save document (Alt+S)"
        >
          Save
        </button>
        
        <button 
          className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            // Preview mode
            const previewData = editorState.document;
            if (previewData) {
              localStorage.setItem('whoobe-preview', JSON.stringify(previewData));
              window.open('/preview', '_blank');
            }
          }}
          title="Preview (Alt+N)"
        >
          Preview
        </button>
        
        <button 
          className="ml-2 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 mr-4"
          onClick={() => {
            // Open settings
            modalActions.openModal(
              modalDispatch,
              'settingsPage',
              'Page Settings',
              'w-1/2',
              {}
            );
          }}
          title="Settings"
        >
          Settings
        </button>
      </div>

      {/* Main editor content */}
      <div className="p-4 mt-24 pb-24">
        {editorState.document ? (
          <BlockContainer
            doc={editorState.document}
            mode="edit"
            onSelect={handleSelectBlock}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl mb-4">No document loaded</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={createEmptyComponent}
            >
              Create New Document
            </button>
          </div>
        )}
      </div>

      {/* Floating menu */}
      {showFloatingMenu && editorState.current && (
        <BlockFloating
          coords={coords}
          scroll={internalScroll}
          onClose={handleCloseFloatingMenu}
        />
      )}

      {/* Debug view */}
      {viewBlocks && editorState.current && (
        <pre className="fixed bottom-0 right-0 bg-white text-black p-2 z-50 max-h-64 overflow-auto">
          {JSON.stringify(editorState.current, null, 2)}
        </pre>
      )}
    </div>
  );
}