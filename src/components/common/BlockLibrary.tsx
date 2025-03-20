'use client';

import { useState, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Template from '@/lib/templates';

interface BlockLibraryProps {
  onClose?: () => void;
}

export default function BlockLibrary({ onClose }: BlockLibraryProps) {
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  const [templates, setTemplates] = useState<Record<string, { icon: string, template: string }>>({});
  
  // Initialize templates from the template service
  useEffect(() => {
    // This would come from your templates service
    //setTemplates(templatesIcon);
  }, []);
  
  // Apply a template to the current element
  const applyTemplate = (templateName: string) => {
    if (!editorState.current) {
      notificationActions.showNotification(
        notificationDispatch,
        'Please select a block first',
        'error'
      );
      return;
    }
    
    try {
      // Create a new template instance
      const template = new Template().build(templateName)
      if (!template) {
        notificationActions.showNotification(
          notificationDispatch,
          'Template not found',
          'error'
        );
        return;
      }
      
      // Add template blocks to the current element
      if (template.blocks && template.blocks.length > 0) {
        const updatedCurrent = { ...editorState.current };
        updatedCurrent.blocks = [...updatedCurrent.blocks, ...template.blocks];
        
        // Update the editor state
        editorActions.setCurrent(editorDispatch, updatedCurrent);
        
        notificationActions.showNotification(
          notificationDispatch,
          `Applied ${templateName} template`,
          'success'
        );
        
        // Close the modal if callback provided
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error applying template:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error applying template',
        'error'
      );
    }
  };
  
  return (
    <div className="relative min-h-screen top-0 mt-8 overflow-y-auto w-full">
      <div className="flex flex-wrap items-center justify-center cursor-pointer">
        {Object.keys(templates).map((templateName) => (
          <motion.div
            key={templateName}
            className="bg-gray-100 m-1 hover:bg-gray-300 flex flex-col items-center h-16 w-16 ml-01 text-xs justify-center text-center text-gray-500 rounded hover:text-indigo-500 shadow"
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => applyTemplate(templates[templateName].template)}
            title={templateName}
          >
            {templates[templateName].icon.startsWith('mi:') ? (
              <span className="material-icons text-3xl">
                {templates[templateName].icon.replace('mi:', '')}
              </span>
            ) : (
              <Icon 
                icon={templates[templateName].icon} 
                className="text-3xl" 
              />
            )}
            <span className="text-xs" style={{ fontSize: '.5rem' }}>
              {templateName}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}