'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModal, modalActions } from '@/context/ModalContext';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { createEmptyTemplate, createDefaultTemplate } from '@/lib/blocks';

interface StartEmptyModalProps {
  options?: any;
  onClose: () => void;
}

export default function StartEmptyModal({ onClose }: StartEmptyModalProps) {
  const [templateName, setTemplateName] = useState('New Template');
  const [templateType, setTemplateType] = useState('empty');
  const router = useRouter();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: desktopDispatch } = useDesktop();

  const handleCreate = () => {
    // Create the appropriate template
    const template = templateType === 'empty' 
      ? createEmptyTemplate() 
      : createDefaultTemplate();
    
    // Update template name
    template.name = templateName;
    
    // Add to desktop tabs
    desktopActions.addTab(desktopDispatch, {
      label: template.name,
      object: template,
      type: 'editor'
    });
    
    // Close modal
    onClose();
    
    // Navigate to editor
    router.push('/editor');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
          Template Name
        </label>
        <input
          type="text"
          id="templateName"
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Template Type
        </label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="empty"
              name="templateType"
              type="radio"
              className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={templateType === 'empty'}
              onChange={() => setTemplateType('empty')}
            />
            <label htmlFor="empty" className="ml-3 block text-sm font-medium text-gray-700">
              Empty Template
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default"
              name="templateType"
              type="radio"
              className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={templateType === 'default'}
              onChange={() => setTemplateType('default')}
            />
            <label htmlFor="default" className="ml-3 block text-sm font-medium text-gray-700">
              Default Template (Header, Content, Footer)
            </label>
          </div>
        </div>
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