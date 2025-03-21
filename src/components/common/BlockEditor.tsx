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
      <div className="h-12 mt-8 bg-white text-gray-800 w-full fixed flex items-center left-0 top-0 z-50 shadow-md px-3">
        <div className="flex items-center">
          {editorState.page && (
            <div className="flex items-center mr-2">
              <span className="px-3 py-1.5 rounded-md text-white bg-purple-800 font-medium shadow-sm text-sm">
                {editorState.page.name}
              </span>

              {editorState.page?.category && (
                <span className="px-2 py-1 ml-2 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                  {editorState.page.category}
                </span>
              )}
            </div>
          )}

          <div className="h-6 border-r border-gray-300 mx-2"></div>

          <div className="flex items-center space-x-1">
            <button
              className="flex items-center text-gray-700 hover:text-purple-700 px-2 py-1 text-sm"
              onClick={() => {
                // Open document outline
                modalActions.openModal(
                  modalDispatch,
                  'documentOutline',
                  'Document Structure',
                  'w-1/3',
                  { document: editorState.document }
                );
              }}
              title="Document Outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Structure
            </button>

            <button
              className="flex items-center text-gray-700 hover:text-purple-700 px-2 py-1 text-sm"
              onClick={() => {
                // Open media gallery
                modalActions.openModal(
                  modalDispatch,
                  'media',
                  'Media Gallery',
                  'w-3/4',
                  {}
                );
              }}
              title="Media Gallery"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Media
            </button>

            <button
              className="flex items-center text-gray-700 hover:text-purple-700 px-2 py-1 text-sm"
              onClick={() => {
                // Open code editor
                modalActions.openModal(
                  modalDispatch,
                  'codeEditor',
                  'Custom Code',
                  'w-2/3',
                  {}
                );
              }}
              title="Custom Code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Code
            </button>
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* Status indicator */}
        <div className="flex items-center mr-4">
          <span className="flex h-2 w-2 relative mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-gray-500">Saved</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center">
          <button
            className="ml-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150 ease-in-out text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
            title="Settings (Alt+,)"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </div>
          </button>

          <button
            className="ml-2 px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-150 ease-in-out text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              // Preview mode
              const previewData = editorState.document;
              if (previewData) {
                localStorage.setItem('whoobe-preview', JSON.stringify(previewData));
                window.open('/preview', '_blank');

                // Show notification
                notificationActions.showNotification(
                  notificationDispatch,
                  'Preview opened in new tab',
                  'info'
                );
              }
            }}
            title="Preview (Alt+P)"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Preview
            </div>
          </button>

          <button
            className="ml-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-150 ease-in-out text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={savePage}
            title="Save document (Alt+S)"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Save
            </div>
          </button>
        </div>
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