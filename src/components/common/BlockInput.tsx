'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';

interface BlockInputProps {
  onClose?: () => void;
}

interface InputAttributes {
  name: string;
  id: string;
  placeholder: string;
  required: boolean;
}

export default function BlockInput({ onClose }: BlockInputProps) {
  const { state, dispatch } = useEditor();
  const blockActionRef = useRef<HTMLDivElement>(null);
  const [attributes, setAttributes] = useState<InputAttributes>({
    name: '',
    id: '',
    placeholder: '',
    required: false
  });
  const [inputType, setInputType] = useState('text');

  // Initialize attributes from current element
  useEffect(() => {
    if (state.current && state.current.data?.attributes) {
      const attrs = state.current.data.attributes;
      setAttributes({
        name: (attrs.name as string) || '',
        id: (attrs.id as string) || '',
        placeholder: (attrs.placeholder as string) || '',
        required: attrs.required === true
      });
      
      if (state.current.type) {
        setInputType(state.current.type);
      }
    }
  }, [state.current]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setAttributes(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setInputType(value);
    
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_TYPE',
        payload: value
      });
    }
  };

  // Update element attributes in the editor state
  useEffect(() => {
    if (state.current && state.current.data) {
      dispatch({
        type: 'UPDATE_ELEMENT_ATTRIBUTES',
        payload: {
          id: state.current.id,
          attributes
        }
      });
    }
  }, [attributes, dispatch, state.current]);

  // Position adjustment when component mounts
  useEffect(() => {
    if (blockActionRef.current && onClose) {
      const position = blockActionRef.current.getBoundingClientRect();
      // Here you might want to emit position details, similar to Vue's emit
    }
  }, [onClose]);

  return (
    <div ref={blockActionRef} className="flex flex-col p-2 pr-20">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select 
          value={inputType}
          onChange={handleSelectChange}
          className="w-full p-2 border rounded"
        >
          <option value="text">text</option>
          <option value="email">email</option>
          <option value="number">number</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input 
          type="text" 
          name="name"
          value={attributes.name}
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
          value={attributes.id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder
        </label>
        <input 
          type="text" 
          name="placeholder"
          value={attributes.placeholder}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="flex items-center mb-3">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            name="required"
            checked={attributes.required}
            onChange={handleInputChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Required</span>
        </label>
      </div>
    </div>
  );
}