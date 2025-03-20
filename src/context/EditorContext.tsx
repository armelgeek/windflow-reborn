'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import {EditorSettings, EditorState} from "@/types/editor";
import {Template} from "@/types/template";
import { cleanCssClasses } from '@/lib/utils';

const initialEditorState: EditorState = {
    current: null,
    document: null,
    page: null,
    customizeTab: null,
    preview: false,
    contextMenu: {
      visible: false,
      position: { x: 0, y: 0 }
    },
    notification: {
      message: '',
      type: 'info',
      visible: false
    },
    settings: {
      autosave: false,
      autosaveTimeout: 5,
      categories: [
        'Lead',
        'Landing page',
        'Subscribe page',
        'Header',
        'Footer',
        'Hero',
        'Homepage',
        'Shop',
        'Feature'
      ].sort()
    },
    component: null
};


export type EditorAction =
  | { type: 'SET_CURRENT'; payload: Element | null }
  | { type: 'UPDATE_CURRENT'; payload: Element }
  | { type: 'UPDATE_CURRENT_ANIMATION'; payload: Element }
  | { type: 'SET_DOCUMENT'; payload: Element }
  | { type: 'SET_PAGE'; payload: Template }
  | { type: 'SET_CUSTOMIZE_TAB'; payload: any }
  | { type: 'SET_PREVIEW'; payload: boolean }
  | { type: 'SET_SETTINGS'; payload: any }
  | { type: 'SET_COMPONENT'; payload: any }
  | { type: 'SELECTED_MEDIA'; payload: string }
  | { type: 'DELETE_BLOCK' }
  | { type: 'DUPLICATE_BLOCK' }
  | { type: 'MOVE_BLOCK'; payload: number }
  | { type: 'COPY_BLOCK'; payload: Element }
  | { type: 'PASTE_BLOCK' }
  | { type: 'IMPORT_BLOCK' }
  | { type: 'EXPORT_BLOCK' }
  | { type: 'CUSTOMIZE_BLOCK' }
  | { type: 'CSS_BLOCK' }
  | { type: 'ANIMATION_BLOCK' }
  | { type: 'ADD_BLOCK' }
  | { type: 'LINK_BLOCK' }
  | { type: 'COPY_BLOCK_CSS' }
  | { type: 'PASTE_BLOCK_CSS' }
  | { type: 'SET_FLEX_ROW' }
  | { type: 'SET_FLEX_COL' }
  | { type: 'OPEN_MEDIA' }
  | { type: 'CONTEXT_MENU_BLOCK'; payload: { x: number; y: number } }
  | { type: 'EDITOR_MESSAGE'; payload: { message: string; type?: string } }
  | { type: 'FLOATING_ELEMENT'; payload: string }
  | { type: 'REGISTER_LISTENER'; payload: { event: string; handler: (...args: any[]) => void } }
  | { type: 'REMOVE_LISTENER'; payload: { event: string } }
  | { type: 'CLEAR_LISTENERS'; payload: { event?: string } }
  | { type: 'TRIGGER_EVENT'; payload: { event: string; data?: any }; callback?: () => void }
  | { type: 'SIDEBAR'; payload: string }
  | { type: 'GET_STATE'; callback: (state: EditorState) => void };





// Types for the editor state
export interface EditorState {
    current: Element | null;
    document: Element | null;
    page: Template | null;
    customizeTab: any;
    preview: boolean;
    contextMenu: {
      visible: boolean;
      position: { x: number; y: number };
    };
    notification: {
      message: string;
      type: string;
      visible: boolean;
    };
    settings: {
      autosave: boolean;
      autosaveTimeout: number;
      categories: string[];
    };
    component: any;
  }
  

const EditorContext = createContext<{
    state: EditorState;
    dispatch: Dispatch<EditorAction>;
}>({
    state: initialEditorState,
    dispatch: () => null,
});

export function EditorProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(editorReducer, initialEditorState);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};

// Helper action creators for editor context
export const editorActions = {
  setCurrent: (dispatch: Dispatch<EditorAction>, element: Element | null) => {
    dispatch({ type: 'SET_CURRENT', payload: element });
  },
  
  updateCurrent: (dispatch: Dispatch<EditorAction>, element: Element) => {
    dispatch({ type: 'UPDATE_CURRENT', payload: element });
  },
  
  updateCurrentAnimation: (dispatch: Dispatch<EditorAction>, element: Element) => {
    dispatch({ type: 'UPDATE_CURRENT_ANIMATION', payload: element });
  },
  
  setDocument: (dispatch: Dispatch<EditorAction>, element: Element) => {
    dispatch({ type: 'SET_DOCUMENT', payload: element });
  },
  
  setPage: (dispatch: Dispatch<EditorAction>, page: Template) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  },
  
  setCustomizeTab: (dispatch: Dispatch<EditorAction>, tab: any) => {
    dispatch({ type: 'SET_CUSTOMIZE_TAB', payload: tab });
  },
  
  setPreview: (dispatch: Dispatch<EditorAction>, preview: boolean) => {
    dispatch({ type: 'SET_PREVIEW', payload: preview });
  },
  
  setSettings: (dispatch: Dispatch<EditorAction>, settings: any) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  },
  
  setComponent: (dispatch: Dispatch<EditorAction>, component: any) => {
    dispatch({ type: 'SET_COMPONENT', payload: component });
  },
  
  selectedMedia: (dispatch: Dispatch<EditorAction>, url: string) => {
    dispatch({ type: 'SELECTED_MEDIA', payload: url });
  },
  
  // Block editing actions
  deleteBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'DELETE_BLOCK' });
  },
  
  duplicateBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'DUPLICATE_BLOCK' });
  },
  
  moveBlock: (dispatch: Dispatch<EditorAction>, direction: number) => {
    dispatch({ type: 'MOVE_BLOCK', payload: direction });
  },
  
  copyBlock: (dispatch: Dispatch<EditorAction>, block: Element) => {
    dispatch({ type: 'COPY_BLOCK', payload: block });
    
    // Also store in localStorage for persistence
    localStorage.setItem('windflow-clipboard', JSON.stringify(block));
  },
  
  pasteBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'PASTE_BLOCK' });
  },
  
  importBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'IMPORT_BLOCK' });
  },
  
  exportBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'EXPORT_BLOCK' });
  },
  
  customizeBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'CUSTOMIZE_BLOCK' });
  },
  
  cssBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'CSS_BLOCK' });
  },
  
  animationBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'ANIMATION_BLOCK' });
  },
  
  addBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'ADD_BLOCK' });
  },
  
  linkBlock: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'LINK_BLOCK' });
  },
  
  copyBlockCss: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'COPY_BLOCK_CSS' });
  },
  
  pasteBlockCss: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'PASTE_BLOCK_CSS' });
  },
  
  setFlexRow: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'SET_FLEX_ROW' });
  },
  
  setFlexCol: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'SET_FLEX_COL' });
  },
  
  openMedia: (dispatch: Dispatch<EditorAction>) => {
    dispatch({ type: 'OPEN_MEDIA' });
  },
  
  contextMenuBlock: (dispatch: Dispatch<EditorAction>, position: { x: number; y: number }) => {
    dispatch({ type: 'CONTEXT_MENU_BLOCK', payload: position });
  },
  
  editorMessage: (dispatch: Dispatch<EditorAction>, message: string, type: string = 'info') => {
    dispatch({ 
      type: 'EDITOR_MESSAGE', 
      payload: { message, type } 
    });
  },
  
  floatingElement: (dispatch: Dispatch<EditorAction>, id: string) => {
    dispatch({ type: 'FLOATING_ELEMENT', payload: id });
  }
};



// Helper function to create a copy of an element with new ID
function cloneElementWithNewId(element: Element): Element {
  // Deep clone the element
  const clonedElement = JSON.parse(JSON.stringify(element)) as Element;
  
  // Generate random ID
  const generateId = () => 'windflow-' + Math.random().toString(36).substring(2, 9);
  
  // Recursively update IDs
  const traverseAndUpdateIds = (el: Element) => {
    el.id = generateId();
    
    if (el.blocks && el.blocks.length > 0) {
      el.blocks.forEach(traverseAndUpdateIds);
    }
    
    return el;
  };
  
  return traverseAndUpdateIds(clonedElement);
}

// Find parent element that contains the specified child
function findParentOfElement(root: Element, childId: string): { parent: Element; index: number } | null {
  if (!root || !root.blocks) return null;
  
  for (let i = 0; i < root.blocks.length; i++) {
    if (root.blocks[i].id === childId) {
      return { parent: root, index: i };
    }
    
    const result = findParentOfElement(root.blocks[i], childId);
    if (result) return result;
  }
  
  return null;
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload
      };
      
    case 'UPDATE_CURRENT':
      if (!state.current) return state;
      return {
        ...state,
        current: action.payload
      };
      
    case 'UPDATE_CURRENT_ANIMATION':
      if (!state.current) return state;
      return {
        ...state,
        current: {
          ...state.current,
          gsap: action.payload.gsap
        }
      };
      
    case 'SET_DOCUMENT':
      return {
        ...state,
        document: action.payload
      };
      
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload
      };
      
    case 'SET_CUSTOMIZE_TAB':
      return {
        ...state,
        customizeTab: action.payload
      };
      
    case 'SET_PREVIEW':
      return {
        ...state,
        preview: action.payload
      };
      
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
      
    case 'SET_COMPONENT':
      return {
        ...state,
        component: action.payload
      };
      
    case 'SELECTED_MEDIA':
      if (!state.current) return state;
      
      return {
        ...state,
        current: {
          ...state.current,
          image: {
            ...state.current.image,
            url: action.payload
          }
        }
      };
      
    case 'DELETE_BLOCK':
      if (!state.current || !state.document) return state;
      
      // Find the parent element containing the current element
      const parentInfo = findParentOfElement(state.document, state.current.id);
      if (!parentInfo) return state;
      
      // Create a new copy of the document
      const updatedDoc = JSON.parse(JSON.stringify(state.document)) as Element;
      
      // Find the parent in the new document
      const newParentInfo = findParentOfElement(updatedDoc, state.current.id);
      if (!newParentInfo) return state;
      
      // Remove the element
      newParentInfo.parent.blocks.splice(newParentInfo.index, 1);
      
      return {
        ...state,
        document: updatedDoc,
        current: null, // Clear the current selection after deletion
        notification: {
          message: 'Block removed',
          type: 'info',
          visible: true
        }
      };
      
    case 'DUPLICATE_BLOCK':
      if (!state.current || !state.document) return state;
      
      // Find the parent element containing the current element
      const parentForDupe = findParentOfElement(state.document, state.current.id);
      if (!parentForDupe) return state;
      
      // Clone the current element with new ID
      const duplicated = cloneElementWithNewId(state.current);
      
      // Create a new copy of the document
      const docWithDupe = JSON.parse(JSON.stringify(state.document)) as Element;
      
      // Find the parent in the new document
      const newParentForDupe = findParentOfElement(docWithDupe, state.current.id);
      if (!newParentForDupe) return state;
      
      // Insert the duplicated element after the original
      newParentForDupe.parent.blocks.splice(newParentForDupe.index + 1, 0, duplicated);
      
      return {
        ...state,
        document: docWithDupe,
        notification: {
          message: 'Block duplicated',
          type: 'info',
          visible: true
        }
      };
      
    case 'MOVE_BLOCK':
      if (!state.current || !state.document) return state;
      
      // Find the parent element containing the current element
      const parentForMove = findParentOfElement(state.document, state.current.id);
      if (!parentForMove) return state;
      
      // If we're at the first element and trying to move up, do nothing
      if (parentForMove.index === 0 && action.payload === 1) return state;
      
      // Create a new copy of the document
      const docWithMove = JSON.parse(JSON.stringify(state.document)) as Element;
      
      // Find the parent in the new document
      const newParentForMove = findParentOfElement(docWithMove, state.current.id);
      if (!newParentForMove) return state;
      
      // Move the element
      const element = newParentForMove.parent.blocks[newParentForMove.index];
      newParentForMove.parent.blocks.splice(newParentForMove.index, 1);
      newParentForMove.parent.blocks.splice(newParentForMove.index - action.payload, 0, element);
      
      return {
        ...state,
        document: docWithMove
      };
      
    case 'COPY_BLOCK':
      // Store in localStorage for persistence (already done in action creator)
      return {
        ...state,
        notification: {
          message: 'Block copied',
          type: 'info',
          visible: true
        }
      };
      
    case 'PASTE_BLOCK':
      if (!state.current) return state;
      
      // Get the block from local storage
      const clipboardBlock = localStorage.getItem('windflow-clipboard');
      if (!clipboardBlock) return state;
      
      try {
        // Parse and clone the block
        const block = JSON.parse(clipboardBlock) as Element;
        const newBlock = cloneElementWithNewId(block);
        
        // Create a new copy of the current element
        const updatedCurrent = JSON.parse(JSON.stringify(state.current)) as Element;
        
        // Add the block to the current element's blocks
        if (!updatedCurrent.blocks) {
          updatedCurrent.blocks = [];
        }
        updatedCurrent.blocks.push(newBlock);
        
        // Update document
        const updatedDocWithPaste = state.document 
          ? JSON.parse(JSON.stringify(state.document)) as Element
          : null;
          
        if (updatedDocWithPaste) {
          const elementInDoc = findElementById(updatedDocWithPaste, state.current.id);
          if (elementInDoc && elementInDoc.blocks) {
            elementInDoc.blocks.push(newBlock);
          }
        }
        
        return {
          ...state,
          current: updatedCurrent,
          document: updatedDocWithPaste || state.document,
          notification: {
            message: 'Block pasted',
            type: 'info',
            visible: true
          }
        };
      } catch (error) {
        console.error('Error pasting block:', error);
        return {
          ...state,
          notification: {
            message: 'Error pasting block',
            type: 'error',
            visible: true
          }
        };
      }
      
    case 'CUSTOMIZE_BLOCK':
      return {
        ...state,
        notification: {
          message: 'Customize block',
          type: 'info',
          visible: true
        }
      };
      
    case 'CSS_BLOCK':
      return {
        ...state,
        notification: {
          message: 'Edit CSS',
          type: 'info',
          visible: true
        }
      };
      
    case 'ANIMATION_BLOCK':
      return {
        ...state,
        notification: {
          message: 'Edit animation',
          type: 'info',
          visible: true
        }
      };
      
    case 'ADD_BLOCK':
      return {
        ...state,
        notification: {
          message: 'Add block',
          type: 'info',
          visible: true
        }
      };
      
    case 'COPY_BLOCK_CSS':
      if (!state.current) return state;
      
      // Store CSS in localStorage
      const css = {
        css: state.current.css,
        style: state.current.style
      };
      localStorage.setItem('windflow-block-css', JSON.stringify(css));
      
      return {
        ...state,
        notification: {
          message: 'CSS copied',
          type: 'info',
          visible: true
        }
      };
      
    case 'PASTE_BLOCK_CSS':
      if (!state.current) return state;
      
      // Get CSS from localStorage
      const storedCss = localStorage.getItem('windflow-block-css');
      if (!storedCss) return state;
      
      try {
        const cssData = JSON.parse(storedCss);
        
        // Create a new copy of the current element
        const updatedWithCss = {
          ...state.current,
          css: cssData.css,
          style: cssData.style
        };
        
        return {
          ...state,
          current: updatedWithCss,
          notification: {
            message: 'CSS pasted',
            type: 'info',
            visible: true
          }
        };
      } catch (error) {
        console.error('Error pasting CSS:', error);
        return state;
      }
      
    case 'SET_FLEX_ROW':
      if (!state.current) return state;
      
      // Create a new copy of the current element
      const updatedWithRow = {
        ...state.current
      };
      
      // Update container CSS
      let containerCss = updatedWithRow.css.container
        .replace('flex-col', '')
        .replace('flex-row', '');
      
      // Add flex-row
      containerCss = cleanCssClasses(containerCss + ' flex-row');
      updatedWithRow.css.container = containerCss;
      
      return {
        ...state,
        current: updatedWithRow
      };
      
    case 'SET_FLEX_COL':
      if (!state.current) return state;
      
      // Create a new copy of the current element
      const updatedWithCol = {
        ...state.current
      };
      
      // Update container CSS
      let containerCssCol = updatedWithCol.css.container
        .replace('flex-col', '')
        .replace('flex-row', '');
      
      // Add flex-col
      containerCssCol = cleanCssClasses(containerCssCol + ' flex-col');
      updatedWithCol.css.container = containerCssCol;
      
      return {
        ...state,
        current: updatedWithCol
      };
      
    case 'CONTEXT_MENU_BLOCK':
      return {
        ...state,
        contextMenu: {
          visible: true,
          position: action.payload
        }
      };
      
    case 'EDITOR_MESSAGE':
      return {
        ...state,
        notification: {
          message: action.payload.message,
          type: action.payload.type || 'info',
          visible: true
        }
      };
      case 'REGISTER_LISTENER':
        case 'REMOVE_LISTENER':
        case 'CLEAR_LISTENERS':
        case 'TRIGGER_EVENT':
        case 'SIDEBAR':
        case 'GET_STATE':
          return state;
    case 'FLOATING_ELEMENT':
      // This action only triggers UI updates handled by components
      return state;
      
    default:
      return state;
  }
}