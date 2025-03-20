'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { Icon } from '@iconify/react';

interface BlockSettingsProps {
  onClose?: () => void;
}

export default function BlockSettings({ onClose }: BlockSettingsProps) {
  const { state: editorState, dispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [newTag, setNewTag] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load available categories when component mounts
  useEffect(() => {
    if (editorState.settings?.categories) {
      setCategories(editorState.settings.categories.sort());
    }
  }, [editorState.settings]);
  
  // Handle tag addition on enter key
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!editorState.page) return;
      
      // Create a copy of the current page
      const updatedPage = { ...editorState.page };
      
      // Initialize tags array if it doesn't exist
      if (!updatedPage.tags) {
        updatedPage.tags = [];
      }
      
      // Add the new tag
      updatedPage.tags.push(newTag.trim());
      
      // Remove duplicates
      updatedPage.tags = Array.from(new Set(updatedPage.tags));
      
      // Update the page in state
      if (dispatch) {
        dispatch({ type: 'SET_PAGE', payload: updatedPage });
      }
      
      // Clear the input
      setNewTag('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (indexToRemove: number) => {
    if (!editorState.page || !editorState.page.tags) return;
    
    // Create a copy of the current page
    const updatedPage = { ...editorState.page };
    
    // Remove the tag at the specified index
    updatedPage.tags = updatedPage.tags.filter((_, index) => index !== indexToRemove);
    
    // Update the page in state
    if (dispatch) {
      dispatch({ type: 'SET_PAGE', payload: updatedPage });
    }
  };
  
  // Save the page
  const savePage = async () => {
    try {
      // Call save page action (this would be your savePage function from your app)
      if (typeof window !== 'undefined' && window.$savePage) {
        await window.$savePage();
      } else {
        // Alternative approach if window.$savePage is not available
        if (editorState.page && dispatch) {
          // You would need to implement this action in your context
          dispatch({ type: 'SAVE_PAGE', payload: editorState.page });
        }
      }
      
      notificationActions.showNotification(
        notificationDispatch,
        'Page saved successfully',
        'success'
      );
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving page:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error saving page',
        'error'
      );
    }
  };
  
  // If no page is loaded, show a message
  if (!editorState.page) {
    return (
      <div className="p-4 text-center">
        <p>No page loaded</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col p-4 bg-white w-full h-full">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="text" 
          value={editorState.page.name || ''}
          onChange={(e) => {
            if (editorState.page && dispatch) {
              dispatch({ 
                type: 'SET_PAGE', 
                payload: { 
                  ...editorState.page, 
                  name: e.target.value 
                } 
              });
            }
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea 
          className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={editorState.page.description || ''}
          onChange={(e) => {
            if (editorState.page && dispatch) {
              dispatch({ 
                type: 'SET_PAGE', 
                payload: { 
                  ...editorState.page, 
                  description: e.target.value 
                } 
              });
            }
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Category</label>
        <select 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={editorState.page.category || ''}
          onChange={(e) => {
            if (editorState.page && dispatch) {
              dispatch({ 
                type: 'SET_PAGE', 
                payload: { 
                  ...editorState.page, 
                  category: e.target.value 
                } 
              });
            }
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Tags (used as keywords for SEO)</label>
        <div className="flex flex-row flex-wrap my-1">
          {editorState.page.tags?.map((tag, index) => (
            <span 
              key={`tag-${index}`}
              className="bg-purple-300 px-2 py-1 rounded-lg m-1 cursor-pointer flex items-center"
              onClick={() => handleRemoveTag(index)}
            >
              {tag}
              <Icon icon="mdi:close" className="ml-1 text-sm" />
            </span>
          ))}
        </div>
        <input 
          type="text" 
          className="w-full p-2 bg-white border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type a new tag and press Enter"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Google Analytics (optional)</label>
        <input 
          type="text" 
          className="w-full p-2 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your Google Analytics"
          value={editorState.page.analytics || ''}
          onChange={(e) => {
            if (editorState.page && dispatch) {
              dispatch({ 
                type: 'SET_PAGE', 
                payload: { 
                  ...editorState.page, 
                  analytics: e.target.value 
                } 
              });
            }
          }}
        />
      </div>
      
      <button 
        className="btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4 mx-auto"
        onClick={savePage}
      >
        SAVE
      </button>
    </div>
  );
}