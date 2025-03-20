'use client';

import { useState, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';

interface BlockSelectProps {
  onClose?: () => void;
}

export default function BlockSelect({ onClose }: BlockSelectProps) {
  const { state: editorState, dispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [options, setOptions] = useState<string>('');
  
  // Initialize component with current element data
  useEffect(() => {
    if (editorState.current && editorState.current.data?.options) {
      // Join options into a string with line breaks
      setOptions(editorState.current.data.options.join('\n'));
    }
  }, [editorState.current]);
  
  // Apply options to the select element
  const applyOptions = () => {
    if (!editorState.current) {
      notificationActions.showNotification(
        notificationDispatch,
        'No element selected',
        'error'
      );
      return;
    }
    
    try {
      // Split options by line break and filter out empty lines
      const optionsList = options
        .split('\n')
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0);
      
      // Create a copy of the current element
      const element = { ...editorState.current };
      
      // Ensure data and options exist
      if (!element.data) {
        element.data = {};
      }
      
      // Update options
      element.data.options = optionsList;
      
      // Apply to the editor state
      editorActions.setCurrent(dispatch, element);
      
      notificationActions.showNotification(
        notificationDispatch,
        'Select options updated successfully',
        'success'
      );
      
      // Close the dialog if callback provided
      if (onClose) {
        onClose();
      }
      
      // Update the actual DOM element if it exists
      // This is a client-side effect
      setTimeout(() => {
        if (typeof document !== 'undefined' && element.id) {
          const selectElement = document.getElementById(element.id);
          
          if (selectElement && selectElement.tagName === 'SELECT') {
            // Remove existing options
            while (selectElement.options.length > 0) {
              selectElement.remove(0);
            }
            
            // Add new options
            optionsList.forEach(optionText => {
              const option = document.createElement('option');
              option.value = optionText;
              option.text = optionText;
              selectElement.add(option);
            });
          }
        }
      }, 0);
      
    } catch (error) {
      console.error('Error applying select options:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error updating select options',
        'error'
      );
    }
  };
  
  return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={editorState.current?.data?.attributes?.name || ''}
          onChange={(e) => {
            if (editorState.current && dispatch) {
              const updatedElement = { ...editorState.current };
              if (!updatedElement.data) updatedElement.data = {};
              if (!updatedElement.data.attributes) updatedElement.data.attributes = {};
              updatedElement.data.attributes.name = e.target.value;
              editorActions.setCurrent(dispatch, updatedElement);
            }
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">ID</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={editorState.current?.data?.attributes?.id || ''}
          onChange={(e) => {
            if (editorState.current && dispatch) {
              const updatedElement = { ...editorState.current };
              if (!updatedElement.data) updatedElement.data = {};
              if (!updatedElement.data.attributes) updatedElement.data.attributes = {};
              updatedElement.data.attributes.id = e.target.value;
              editorActions.setCurrent(dispatch, updatedElement);
            }
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Options</label>
        <textarea 
          className="w-full h-48 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          placeholder="Enter one option per line"
        />
        <small className="text-gray-500">Set an option on a single line</small>
      </div>
      
      <button 
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={applyOptions}
      >
        Apply
      </button>
    </div>
  );
}