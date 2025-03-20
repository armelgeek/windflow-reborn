import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { classes } from '@/lib/tailwind-classes';

const BlockCss: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [semantics, setSemantics] = useState<string[]>([]);
  
  // Get the current element from editor state
  const current = state.current;
  
  // Initialize semantics options when component mounts
  useEffect(() => {
    setSemantics(classes.semantics);
  }, []);
  
  // If no element is selected, don't render anything
  if (!current) {
    return null;
  }
  
  // Handle CSS change
  const handleCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...current,
        css: {
          ...current.css,
          css: e.target.value
        }
      }
    });
  };
  
  // Handle container CSS change
  const handleContainerCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...current,
        css: {
          ...current.css,
          container: e.target.value
        }
      }
    });
  };
  
  // Handle style change
  const handleStyleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...current,
        style: e.target.value
      }
    });
  };
  
  // Handle semantic change
  const handleSemanticChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...current,
        semantic: e.target.value
      }
    });
  };
  
  return (
    <div className="flex flex-col w-full h-full items-start p-2 bg-bluegray-200">
      <label className="font-bold my-1">CSS</label>
      <textarea 
        value={current.css.css || ''} 
        onChange={handleCssChange}
        className="text-sm font-mono w-full h-1/3 bg-white shadow p-1" 
      />
      
      <label className="font-bold my-1">Container CSS</label>
      <textarea 
        value={current.css.container || ''} 
        onChange={handleContainerCssChange}
        className="text-sm font-mono w-full h-20 bg-white shadow p-1" 
      />
      
      <label className="font-bold my-1">Style</label>
      <textarea 
        value={current.style || ''} 
        onChange={handleStyleChange}
        className="text-sm font-mono w-full h-1/6 bg-white shadow p-1" 
      />
      
      <label className="font-bold my-1">Semantic</label>
      <select 
        value={current.semantic || ''} 
        onChange={handleSemanticChange}
        className="w-full mr-4"
      >
        <option value=""></option>
        {semantics.map((semantic) => (
          <option key={semantic} value={semantic}>
            {semantic}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BlockCss;