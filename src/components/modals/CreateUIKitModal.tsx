// components/modals/CreateUIKitModal.tsx
'use client';

import { useState } from 'react';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { v4 as uuidv4 } from 'uuid';import Template from '@/lib/templates';
;

interface CreateUIKitModalProps {
  options?: any;
  onClose: () => void;
}

export default function CreateUIKitModal({ onClose }: CreateUIKitModalProps) {
  const [kitName, setKitName] = useState('My UI Kit');
  const [kitDescription, setKitDescription] = useState('A collection of reusable components');
  const { dispatch } = useDesktop();

  const handleCreate = () => {
    // Create a new UI Kit
    const newKit = {
      id: uuidv4(),
      name: kitName,
      description: kitDescription,
      templates: [] as Template[],
      version: '1.0.0',
      author: 'Anonymous',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    // Add to UI kits
    dispatch({ 
      type: 'ADD_UIKIT', 
      payload: newKit
    });
    
    // Set as current library
    dispatch({
      type: 'SET_LIBRARY',
      payload: newKit
    });
    
    // Close modal
    onClose();
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="kitName" className="block text-sm font-medium text-gray-700">
          UI Kit Name
        </label>
        <input
          type="text"
          id="kitName"
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          value={kitName}
          onChange={(e) => setKitName(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="kitDescription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="kitDescription"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          value={kitDescription}
          onChange={(e) => setKitDescription(e.target.value)}
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}