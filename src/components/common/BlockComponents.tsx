import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useDesktop } from '@/context/DesktopContext';
import { useNotification } from '@/context/NotificationContext';
import { Template } from '@/types/template';

const BlockComponents: React.FC = () => {
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: desktopState } = useDesktop();
  const { showNotification } = useNotification();
  
  const [blocks, setBlocks] = useState<Template[]>([]);
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Initialize components and categories
  useEffect(() => {
    if (desktopState.library && desktopState.library.templates) {
      // Get all templates
      setBlocks(desktopState.library.templates);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(desktopState.library.templates.map(template => template.category))
      ).filter(Boolean);
      
      setCategories(uniqueCategories as string[]);
    }
  }, [desktopState.library]);
  
  // Filter blocks by category
  const filteredBlocks = category 
    ? blocks.filter(block => block.category === category)
    : blocks;
  
  // Import a template
  const importTemplate = (template: Template) => {
    if (!editorState.current) {
      showNotification('You need to select a block in order to import a new one', 'error');
      return;
    }
    
    try {
      // Clone the template blocks to avoid reference issues
      const templateBlocks = JSON.parse(JSON.stringify(template.json.blocks));
      
      // Update the current element with the new blocks
      const currentElement = {
        ...editorState.current,
        blocks: [...editorState.current.blocks, templateBlocks]
      };
      
      // Update the editor state
      editorDispatch({ type: 'UPDATE_CURRENT', payload: currentElement });
      
      // Show success notification
      showNotification(`Added ${template.name} to current block`, 'success');
    } catch (error) {
      console.error('Error importing template:', error);
      showNotification('Failed to import template', 'error');
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Category selector */}
      <div className="p-2 flex items-center">
        <select 
          className="p-2 w-full border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Templates list */}
      <div className="overflow-y-auto h-full">
        {filteredBlocks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No templates found in this category.
          </div>
        ) : (
          filteredBlocks.map((block) => (
            <div 
              key={block.id || block.blocks_id} 
              className="flex flex-col border-b p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => importTemplate(block)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{block.name}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{block.category}</span>
              </div>
              
              {block.description && (
                <p className="text-sm text-gray-600 mt-1">{block.description}</p>
              )}
              
              {block.image && (
                <div className="mt-2">
                  <img 
                    src={block.image} 
                    alt={block.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              
              {block.tags && block.tags.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {block.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockComponents;