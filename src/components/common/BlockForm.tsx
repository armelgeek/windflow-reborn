'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';

interface BlockFormProps {
  onClose?: () => void;
}

export default function BlockForm({ onClose }: BlockFormProps) {
  const { state, dispatch } = useEditor();
  const [formAttributes, setFormAttributes] = useState({
    name: '',
    id: '',
    action: '',
    method: ''
  });

  // Initialize form attributes from current element
  useEffect(() => {
    if (!state.current || !state.current.data.attributes) return;
    
    const attrs = state.current.data.attributes;
    setFormAttributes({
      name: attrs.name as string || '',
      id: attrs.id as string || '',
      action: attrs.action as string || '',
      method: attrs.method as string || ''
    });
  }, [state.current]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormAttributes(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update the current element in the editor state
    if (state.current && state.current.data.attributes) {
      dispatch({
        type: 'UPDATE_ELEMENT_ATTRIBUTES',
        payload: {
          id: state.current.id,
          attributes: {
            ...state.current.data.attributes,
            [name]: value
          }
        }
      });
    }
  };

  // Early return if no current element
  if (!state.current) {
    return null;
  }

  return (
    <div className="flex flex-col p-2 pr-20">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input 
          type="text" 
          name="name"
          value={formAttributes.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID
        </label>
        <input 
          type="text" 
          name="id"
          value={formAttributes.id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action
        </label>
        <input 
          type="text" 
          name="action"
          value={formAttributes.action}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="Form submission URL"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Method
        </label>
        <input 
          type="text" 
          name="method"
          value={formAttributes.method}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder="GET, POST, etc."
        />
      </div>
    </div>
  );
}