import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useDesktop } from '@/context/DesktopContext';
import { useModal } from '@/context/ModalContext';
import { useNotification } from '@/context/NotificationContext';
import { captureElementScreenshot } from '@/lib/screenshot';

const AddToUIKit: React.FC = () => {
  const { state: editorState } = useEditor();
  const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
  const { dispatch: modalDispatch } = useModal();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  
  // Handle when there's no library available
  if (!desktopState.library) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">No UI Kit selected or created.</p>
        <button 
          className="btn bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => modalDispatch({
            type: 'OPEN_MODAL',
            payload: {
              component: 'createUIKit',
              title: 'Create UI Kit'
            }
          })}
        >
          Create UI Kit
        </button>
      </div>
    );
  }
  
  // Add current template to UI Kit
  const addToUIKit = () => {
    const library = {...desktopState.library};
    
    // Remove any existing template with the same ID
    if (library.templates) {
      const existingIndex = library.templates.findIndex(
        template => template.blocks_id === editorState.page.blocks_id
      );
      
      if (existingIndex !== -1) {
        library.templates.splice(existingIndex, 1);
      }
    } else {
      library.templates = [];
    }
    
    // Add the current template to the library
    library.templates.push(editorState.page);
    
    // Update the library in the store
    desktopDispatch({
      type: 'SET_LIBRARY',
      payload: library
    });
    
    // Save to localStorage
    localStorage.setItem('windflow-ui-kit', JSON.stringify(library));
    
    // Close the dialog
    modalDispatch({
      type: 'CLOSE_MODAL'
    });
    
    // Show notification
    showNotification(`Saved to ${library.name}`, 'success');
  };
  
  // Take screenshot and save template with it
  const printPage = async () => {
    setLoading(true);
    
    try {
      // Reset current selection
      // editorDispatch({ type: 'SET_CURRENT', payload: null });
      
      // Get editor element for screenshot
      const el = document.querySelector('#BlockEditor');
      if (!el) throw new Error('Editor element not found');
      
      // Capture screenshot
      const screenshot = await captureElementScreenshot(el, {
        scale: 0.5
      });
      
      // Update page with screenshot
      if (editorState.page) {
        const updatedPage = {
          ...editorState.page,
          image: screenshot
        };
        
        // editorDispatch({ type: 'SET_PAGE', payload: updatedPage });
        
        // Call the addToUIKit function
        addToUIKit();
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      showNotification('Failed to capture template preview', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block mb-2 font-medium">UI Kit</label>
        <select 
          className="mr-2 rounded ring-1 ring-purple-500 bg-gray-200 py-2 w-full"
          value={desktopState.library ? desktopState.library.name : ''}
          onChange={(e) => {
            const selectedKit = desktopState.uikits.find(kit => kit.name === e.target.value);
            if (selectedKit) {
              desktopDispatch({
                type: 'SET_LIBRARY',
                payload: selectedKit
              });
            }
          }}
        >
          {desktopState.uikits.map((uikit, index) => (
            <option key={index} value={uikit.name}>
              {uikit.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="font-bold text-lg mb-4">
        {desktopState.library.name}
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Save as</label>
        <div className="flex">
          <input 
            type="text" 
            className="flex-grow p-2 border rounded"
            value={editorState.page ? editorState.page.name : ''}
            onChange={(e) => {
              if (editorState.page) {
                // Update page name in editor state
                // editorDispatch({
                //   type: 'SET_PAGE',
                //   payload: { ...editorState.page, name: e.target.value }
                // });
              }
            }}
          />
          <button 
            className="btn btn-blue ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={printPage}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default AddToUIKit;