'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useModal, modalActions } from '@/context/ModalContext';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import jp from 'jsonpath';

// Dynamically import components
const BlockEditor = dynamic(() => import('./BlockEditor'));
const EditorFooter = dynamic(() => import('./EditorFooter'));
const EditorSidebar = dynamic(() => import('./EditorSidebar'));
const EditorSidebarTabs = dynamic(() => import('./EditorSidebarTabs'));

export default function Editor() {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  
  const [display, setDisplay] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [sidebar, setSidebar] = useState(false);
  const [sidebarName, setSidebarName] = useState('');
  
  const blockEditorRef = useRef<HTMLDivElement>(null);
  
  // Set up event listeners on mount
  useEffect(() => {
    // Event listeners equivalent to Vue event bus
    const handlePreview = () => {
      setDisplay(false);
    };
    
    const handleCloseDialog = () => {
      setDisplay(true);
    };
    
    const handleSidebar = (sidebarType: string) => {
      if (!sidebar) {
        setSidebar(true);
        setSidebarName(sidebarType);
        return;
      }
      
      if (sidebarType !== sidebarName) {
        setSidebar(true);
        setSidebarName(sidebarType);
      } else {
        setSidebar(false);
        setSidebarName('');
      }
    };
    
    const handleDuplicateBlock = () => {
      if (!state.current) return;
      
      const component = state.document;
      const parent = jp.parent(component, `$..blocks[?(@.id=="${state.current.id}")]`);
      let i;
      
      if (parent) {
        parent.forEach((p, index) => {
          if (p.id === state.current.id) {
            i = index;
          }
        });
        
        const el = JSON.parse(JSON.stringify(state.current));
        // Clone and generate new IDs for the duplicated block
        const obj = cloneElement(el);
        parent.splice(i + 1, 0, obj);
        
        // Clear current selection
        dispatch({ type: 'SET_CURRENT', payload: null });
        
        // Show notification
        dispatch({ 
          type: 'SHOW_NOTIFICATION', 
          payload: { message: 'Block duplicated', type: 'success' } 
        });
      }
    };
    
    const handleDeleteBlock = () => {
      if (state.current && state.current.id) {
        removeNode(state.current.id);
        dispatch({ 
          type: 'SHOW_NOTIFICATION', 
          payload: { message: 'Block removed', type: 'success' } 
        });
      }
    };
    
    const handleMoveBlock = (up: boolean) => {
      if (!state.current) return;
      
      const component = state.document;
      const parent = jp.parent(component, `$..blocks[?(@.id=="${state.current.id}")]`);
      
      if (parent.length === 1) return;
      
      let i;
      parent.forEach((p, index) => {
        if (p.id === state.current.id) {
          i = index;
        }
      });
      
      if (i > 0) {
        const obj = Object.assign({}, state.current);
        parent.splice(i, 1);
        parent.splice(i - 1, 0, obj);
      }
      
      dispatch({ type: 'SET_CURRENT', payload: null });
    };
    
    const handleCopyBlock = (block?: any) => {
      window.localStorage.setItem(
        'windflow-clipboard', 
        JSON.stringify(block || state.current)
      );
      
      dispatch({ 
        type: 'SHOW_NOTIFICATION', 
        payload: { message: 'Block copied', type: 'success' } 
      });
    };
    
    const handlePasteBlock = (type?: string) => {
      if (state.current) {
        const block = JSON.parse(window.localStorage.getItem('windflow-clipboard') || '{}');
        const pasteBlock = cloneElement(block);
        
        if (type === 'document') {
          dispatch({ type: 'SET_DOCUMENT', payload: pasteBlock });
        } else {
          // Make sure current element has blocks array
          if (state.current.blocks) {
            const updatedCurrent = {
              ...state.current,
              blocks: [...state.current.blocks, pasteBlock]
            };
            
            dispatch({ type: 'SET_CURRENT', payload: updatedCurrent });
            
            // Update document with the new block
            const updatedDocument = findAndUpdateElement(
              state.document, 
              state.current.id, 
              updatedCurrent
            );
            
            dispatch({ type: 'SET_DOCUMENT', payload: updatedDocument });
          }
        }
        
        dispatch({ type: 'SET_CURRENT', payload: null });
      }
    };
    
    const handlePreviewAction = (mode?: string) => {
      dispatch({ type: 'SET_PREVIEW', payload: true });
      window.localStorage.setItem('windflow-preview', JSON.stringify(state.document));
      window.localStorage.setItem('windflow-page', JSON.stringify(state.page));
      
      modalActions.openModal(
        modalDispatch,
        'blockPreview',
        'Preview',
        'w-full h-full',
        { mode }
      );
    };
    
    const handleImportPage = (mode = 'page') => {
      if (mode === 'page') {
        const confirm = window.confirm('Importing will overwrite the current document. Continue?');
        if (confirm) {
          modalActions.openModal(
            modalDispatch,
            'importPage',
            'Import Page',
            'w-1/2'
          );
        }
      }
    };
    
    const handleImportBlock = () => {
      modalActions.openModal(
        modalDispatch,
        'importBlock',
        'Import Block',
        'w-1/2'
      );
    };
    
    const handleExportDocument = () => {
     // editorActions.exportDocument(dispatch);
    };
    
    // Register event listeners
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'preview', handler: handlePreview } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'closeDialog', handler: handleCloseDialog } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'sidebar', handler: handleSidebar } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'duplicateBlock', handler: handleDuplicateBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'deleteBlock', handler: handleDeleteBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'moveBlock', handler: handleMoveBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'copyBlock', handler: handleCopyBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'pasteBlock', handler: handlePasteBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'preview', handler: handlePreviewAction } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'importPage', handler: handleImportPage } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'importBlock', handler: handleImportBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'exportDocument', handler: handleExportDocument } });
    
    // Set up scroll handler
    const handleScroll = (e: Event) => {
      if (blockEditorRef.current) {
        setScrollTop(blockEditorRef.current.scrollTop);
      }
    };
    
    if (blockEditorRef.current) {
      blockEditorRef.current.addEventListener('scroll', handleScroll);
    }
    
    // Cleanup
    return () => {
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'preview' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'closeDialog' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'sidebar' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'duplicateBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'deleteBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'moveBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'copyBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'pasteBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'importPage' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'importBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'exportDocument' } });
      
      if (blockEditorRef.current) {
        blockEditorRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [state.current, state.document, dispatch, modalDispatch, sidebar, sidebarName]);
  
  // Function to recursively clone an element and assign new IDs
  const cloneElement = (obj: any) => {
    const traverse = (o: any) => {
      for (let i in o) {
        if (o[i] !== null && typeof o[i] === "object") {
          traverse(o[i]);
        } else {
          if (i === 'id') {
            o[i] = `windflow-${Math.random().toString(36).substring(2, 5)}`;
          }
        }
      }
      return o;
    };
    
    return traverse(JSON.parse(JSON.stringify(obj)));
  };
  
  // Function to remove a node by ID
  const removeNode = (id: string) => {
    const findAndRemoveNode = (currentNode: any) => {
      if (id === currentNode.id) {
        return currentNode;
      } else {
        let node = null;
        for (let index in currentNode.blocks) {
          node = currentNode.blocks[index];
          
          if (node.id === id) {
            currentNode.blocks.splice(index, 1);
            node.parent = currentNode;
            dispatch({ type: 'SET_CURRENT', payload: currentNode });
            return node;
          }
          
          findAndRemoveNode(node);
        }
        return node;
      }
    };
    
    findAndRemoveNode(state.document);
    dispatch({ type: 'SET_CURRENT', payload: null });
  };
  
  // Function to find and update an element by ID
  const findAndUpdateElement = (rootElement: any, id: string, updatedElement: any) => {
    if (rootElement.id === id) {
      return { ...rootElement, ...updatedElement };
    }
    
    if (rootElement.blocks && Array.isArray(rootElement.blocks)) {
      const updatedBlocks = rootElement.blocks.map((block: any) => {
        if (block.id === id) {
          return { ...block, ...updatedElement };
        }
        return findAndUpdateElement(block, id, updatedElement);
      });
      
      return { ...rootElement, blocks: updatedBlocks };
    }
    
    return rootElement;
  };
  
  // Get CSS class for the main container based on sidebar state
  const getContainerClass = () => {
    return sidebar ? 'w-4/5' : '';
  };
  
  if (!display) return null;
  
  return (
    <div className="overflow-hidden max-h-screen h-screen mt-0 inset-0 editor-main-container" style={{ maxHeight: '100vh', margin: 0 }}>
      <div className="editor-container min-h-screen top-0 right-0 left-0 bottom-0 flex flex-row">
        <div className="w-full overflow-y-hidden overflow-x-hidden">
          <div className="w-full grid grid-cols-12 relative">
            <div className={`col-span-12 relative md:col-span-12 lg:col-span-12 mr-10 min-h-screen pb-20 ${getContainerClass()}`}>
              <div className="flex flex-col absolute inset-0 mb-10" ref={blockEditorRef}>
                <BlockEditor scroll={scrollTop} />
              </div>
            </div>
            
            {/* Sidebar */}
            {sidebar && (
              <div className="min-h-screen fixed z-modal right-0 top-0 mt-8 bg-white w-1/5 border-l pr-10">
                <EditorSidebar 
                  tab={sidebarName} 
                  onClose={() => {
                    setSidebar(false);
                    setSidebarName('');
                  }} 
                />
              </div>
            )}
            
            {/* Sidebar Tabs */}
            <div className="fixed bg-white z-modal mt-8 w-10 right-0 top-0 h-screen flex flex-col items-center justify-start text-center shadow">
              <div className="chip bg-black text-white my-1 text-xs px-1 rounded">Tools</div>
              <EditorSidebarTabs tab={sidebarName} />
            </div>
            
            {/* Footer */}
            <EditorFooter tab={sidebarName} />
          </div>
        </div>
      </div>
    </div>
  );
}