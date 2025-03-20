import React, { useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';

interface BlockEditContentProps {
  onPositionUpdate?: (height: number) => void;
}

const BlockEditContent: React.FC<BlockEditContentProps> = ({ onPositionUpdate }) => {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const contentEditorRef = useRef<HTMLDivElement>(null);
  
  // Get current element
  const current = state.current;
  
  // Report element height to parent when mounted
  useEffect(() => {
    if (contentEditorRef.current && onPositionUpdate) {
      const coords = contentEditorRef.current.getBoundingClientRect();
      onPositionUpdate(coords.height);
    }
    
    // For paragraph elements, open the rich text editor
    if (current && current.element === 'p') {
      modalDispatch({
        type: 'OPEN_MODAL',
        payload: { 
          component: 'TipTapEditor',
          title: 'Editor'
        }
      });
    }
  }, []);
  
  // Update content handler
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!current) return;
    
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...current,
        content: e.target.value
      }
    });
  };
  
  // If no current element, don't render
  if (!current) {
    return null;
  }
  
  return (
    <div 
      id="contentEditor" 
      ref={contentEditorRef} 
      className="flex flex-col items-start w-64"
    >
      {/* Video specific content */}
      {(current.tag === 'youtube' || current.tag === 'vimeo') && (
        <div>
          <label>Video ID</label>
          <input 
            className="m-1 p-1 w-full border rounded"
            type="text" 
            value={current.content || ''}
            onChange={(e) => handleContentChange(e as any)}
            placeholder="video ID only"
          />
        </div>
      )}
      
      {/* Other element content */}
      {current.element !== 'p' && 
       current.element !== 'img' && 
       current.tag !== 'youtube' && 
       current.tag !== 'vimeo' && (
        <textarea 
          className="p-1 h-40 w-full text-base border rounded"
          value={current.content || ''}
          onChange={handleContentChange}
        />
      )}
    </div>
  );
};

export default BlockEditContent;