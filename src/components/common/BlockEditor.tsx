'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import BlockContainer from '@/components/blocks/BlockContainer';
import { Element } from '@/types/element';
import { cleanCssClasses } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import BlockFloating from './BlockFloating';
import IconifyIcon from './IconifyIcon';
import BlockFloatingAction from './BlockFloatingAction';

export default function BlockEditor() {
  const router = useRouter();
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const mainEditorRef = useRef<HTMLDivElement>(null);

  // State equivalent to Vue data properties
  const [scroll, setScroll] = useState(0);
  const [viewBlocks, setViewBlocks] = useState(false);
  const [display, setDisplay] = useState(true);
  const [editorOffsetX] = useState(16);
  const [editorOffsetY] = useState(88);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    offsetX: 0,
    offsetY: 0
  });
  const [containerCoords, setContainerCoords] = useState({
    top: 0,
    left: 0,
    height: 0
  });
  const [component, setComponent] = useState<any>(null);
  const [actionComponent, setActionComponent] = useState<any>(null);
  const [actionTitle, setActionTitle] = useState('');
  const [options, setOptions] = useState<any>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll events
  useEffect(() => {
    if (!editorState.current || !mainEditorRef.current) return;

    try {
      if (editorState.current && editorState.current.id) {
        const el = document.getElementById(editorState.current.id);
        if (el) {
          const elementCoords = el.getBoundingClientRect();
          setContainerCoords(prev => ({
            ...prev,
            top: elementCoords.top - scroll
          }));
        }
      }
    } catch (err) {
      console.error('Error updating coordinates:', err);
    }
  }, [scroll, editorState.current]);

  // Watch for changes to current element
  useEffect(() => {
    if (editorState.current) {
      setActionComponent(null);
      setContainerCoords(prev => ({
        ...prev,
        top: prev.top - scroll
      }));
    }
  }, [editorState.current?.id]);

  // Set up autosave if enabled
  useEffect(() => {
    if (!editorState.page) return;

    // Get settings from context or localStorage
    const settings = editorState.settings || { autosave: false, autosaveTimeout: 5 };
    
    if (settings.autosave && editorState.page.id !== '0') {
      const autosaveTimer = setInterval(() => {
        // Call savePage function
        savePage();
      }, parseInt(settings.autosaveTimeout) * 1000 * 60);
      
      setTimer(autosaveTimer);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [editorState.page]);

  // Initialize document if needed
  useEffect(() => {
    if (!editorState.document) {
      const lastDocument = localStorage.getItem('whoobe-preview');
      if (lastDocument) {
        try {
          editorActions.setDocument(editorDispatch, JSON.parse(lastDocument));
        } catch (error) {
          console.error('Error loading last document:', error);
        }
      } else {
        // Create a new component
        createEmptyComponent();
      }
    }
  }, [editorState.document]);

  // Event listeners
  useEffect(() => {
    // Set up scroll event listener
    if (mainEditorRef.current) {
      mainEditorRef.current.addEventListener('scroll', handleScroll);
      mainEditorRef.current.style.overflowY = 'auto';
    }

    // Set up custom event listeners (equivalent to Vue's eventBus)
    const handleFloatingElement = (id: string) => {
      setComponent(BlockFloating);
      const coords = getCoords(id);
      if (coords) {
        setContainerCoords({
          top: coords.top + 8,
          left: coords.left,
          height: 0
        });
      }
    };

    const handleEditorAction = (action: any) => {
      setActionTitle(action.title);
      setActionComponent(() => action.component);
      const floatingCoords = getCoords('floating');
      if (floatingCoords) {
        setCoords({
          top: floatingCoords.top + scroll,
          left: floatingCoords.left,
          offsetX: 0,
          offsetY: 0
        });
      }
      setOptions(action.options);
    };

    const handleSelectedMedia = (media: any) => {
      if (editorState.current) {
        if (editorState.current.image && 'url' in editorState.current.image) {
          editorState.current.image.url = media;
        } else {
          editorState.current.image = media;
        }
        setActionComponent(null);
      }
    };

    const handleSetFlexRow = () => {
      if (editorState.current) {
        let container = editorState.current.css.container
          .replace('flex-col', '')
          .replace('flex-row', '');
        
        if (!container.includes('flex-row')) {
          editorState.current.css.container = cleanCssClasses(container + ' flex-row');
        }
      }
    };

    const handleSetFlexCol = () => {
      if (editorState.current) {
        let container = editorState.current.css.container
          .replace('flex-col', '')
          .replace('flex-row', '');
        
        if (!container.includes('flex-col')) {
          editorState.current.css.container = cleanCssClasses(container + ' flex-col');
        }
      }
    };

    // Register event listeners
   document.addEventListener('floatingElement', (e: any) => handleFloatingElement(e.detail));
    document.addEventListener('editorAction', (e: any) => handleEditorAction(e.detail));
    document.addEventListener('selectedMedia', (e: any) => handleSelectedMedia(e.detail));
    document.addEventListener('setFlexRow', () => handleSetFlexRow());
    document.addEventListener('setFlexCol', () => handleSetFlexCol());

    // Initial setup
    if (!editorState.page) {
      router.push('/');
    } else {
      setCurrent(editorState.document);
      setActionComponent(null);
      // Equivalent to $editorBus('floatingElement', editorState.document.id)
     // handleFloatingElement(editorState.document?.id);
      
      if (!editorState.page.id && editorState.document && editorState.document.blocks.length === 0) {
        // Open snippets dialog
        modalDispatch({
          type: 'OPEN_MODAL',
          payload: { component: 'snippets', title: 'Snippets' }
        });
      }
    }

    // Cleanup
    return () => {
      if (mainEditorRef.current) {
        mainEditorRef.current.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('floatingElement', (e: any) => handleFloatingElement(e.detail));
      document.removeEventListener('editorAction', (e: any) => handleEditorAction(e.detail));
      document.removeEventListener('selectedMedia', (e: any) => handleSelectedMedia(e.detail));
      document.removeEventListener('setFlexRow', () => handleSetFlexRow());
      document.removeEventListener('setFlexCol', () => handleSetFlexCol());
    };
  }, [editorState.document, editorState.page, editorState.current, scroll]);

  // Methods
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    setScroll(target.scrollTop);
  };

  const createEmptyComponent = () => {
    // Equivalent to Vue's createDocument method
    // This would normally use the helper functions like in actions.ts
    const event = new CustomEvent('createComponent');
    document.dispatchEvent(event);
  };

  const setCurrent = (element: Element) => {
    if (!element) return;
    
    // Clean CSS classes
    if (element.css && element.css.css) {
      element.css.css = cleanCssClasses(element.css.css);
    }
    
    // Update current element in state
    editorActions.setCurrent(editorDispatch, element);
  };

  const getCoords = (id: string) => {
    const el = document.querySelector('#' + id);
    try {
      return el ? el.getBoundingClientRect() : null;
    } catch (err) {
      console.error('Error getting coordinates:', err);
      return null;
    }
  };

  const savePage = () => {
    // This would be implemented in a utility function or context action
    console.log('Auto-saving page...');
    // Call API or dispatch action to save page
  };

  // Helper for conditional CSS classes
  const editElementContent = () => {
    return component ? 'opacity-100' : 'opacity-0';
  };

  // If the essential data is not loaded, don't render
  if (!display || !editorState.page || !editorState.document) {
    return null;
  }

  return (
    <div 
      ref={mainEditorRef} 
      id="mainEditor" 
      className={`bg-gray-100 min-h-screen text-black ${!display ? 'hidden' : ''}`}
    >
      {/* Header bar */}
      <div className="h-8 mt-8 p-1 bg-white text-gray-800 w-full fixed flex flex-row items-center left-0 top-0 z-50 shadow cursor-pointer">
        {editorState.page && (
          <span className="ml-2 px-2 py-1 rounded text-gray-100 bg-purple-800">
            {editorState.page.name}
          </span>
        )}
        <span className="px-2 py-1 rounded bg-gray-100 text-black ml-1">
          {editorState.page?.category}
        </span>
        
        <button 
          className="text-gray-400 ml-4 text-2xl hover:text-purple-600"
          onClick={() => {
            // Open settings dialog
            modalDispatch({
              type: 'OPEN_MODAL',
              payload: { component: 'settingsPage', title: 'Template Settings' }
            });
          }}
          title="Template settings"
        >
          <IconifyIcon icon="carbon:settings" />
        </button>
        
        <button 
          className="text-xl ml-4 cursor-pointer"
          onClick={() => {
            // Open JavaScript editor dialog
            modalDispatch({
              type: 'OPEN_MODAL',
              payload: { component: 'JSEditor', title: 'JavaScript Editor', options: { type: 'javascript' } }
            });
          }}
          title="Add Javascript"
        >
          <IconifyIcon icon="akar-icons:javascript-fill" />
        </button>
        
        <button 
          className="text-gray-400 ml-4 text-2xl hover:text-purple-600"
          onClick={() => {
            // Open shortcuts dialog
            modalDispatch({
              type: 'OPEN_MODAL',
              payload: { component: 'shortcuts', title: 'Keyboard Shortcuts' }
            });
          }}
          title="Shortcuts"
        >
          <IconifyIcon icon="gg:shortcut" />
        </button>
        
        <button 
          className="ml-4 text-2xl"
          onClick={() => {
            // Open help dialog
            modalDispatch({
              type: 'OPEN_MODAL',
              payload: { component: 'help', title: 'Documentation', options: { section: 'Editor' } }
            });
          }}
          title="Documentation"
        >
          <IconifyIcon icon="grommet-icons:help-option" />
        </button>
        
        <button 
          className="text-gray-400 ml-4 text-2xl hover:text-purple-600"
          onClick={() => {
            // Trigger preview mode
            const event = new CustomEvent('preview', { detail: 'fullscreen' });
            document.dispatchEvent(event);
          }}
          title="Preview"
        >
          <IconifyIcon icon="codicon:open-preview" />
        </button>
        
        <span className="absolute right-0 mr-12">
          X:{parseInt(String(containerCoords.left)) - editorOffsetX} Y:{parseInt(String(containerCoords.top + scroll - editorOffsetY))}
        </span>
      </div>
      
      {/* Main editor area */}
      <div className="p-4 mt-24 pb-20" id="BlockEditor">
        {editorState.document && (
          <BlockContainer 
            doc={editorState.document} 
            mode="edit"
            onSelect={setCurrent}
          />
        )}
      </div>
      
      {/* Floating action panel */}
      {editorState.current && actionComponent && (
        <BlockFloatingAction 
          className="z-50 bg-white shadow"
          coords={coords}
          scroll={scroll}
          title={actionTitle}
          component={actionComponent}
          options={options}
          onClose={() => setActionComponent(null)}
        />
      )}
      
      {/* Floating element panel */}
      {component && (
        <div
          className={`absolute left-0 z-50 ${editElementContent()}`}
          id="floating"
          style={{
            top: `${containerCoords.top}px`,
            left: `${containerCoords.left}px`
          }}
        >
          {React.createElement(component, {
            scroll,
            coords: containerCoords,
            onClose: () => {
              setComponent(null);
              setActionComponent(null);
            }
          })}
        </div>
      )}
      
      {/* Debug view */}
      {editorState.current && viewBlocks && (
        <pre>
          {editorState.current.tag}
          {JSON.stringify(editorState.current, null, 2)}
        </pre>
      )}
    </div>
  );
}