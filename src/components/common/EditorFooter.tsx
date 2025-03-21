'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import html2canvas from 'html2canvas';
import {
  Settings,
  Save,
  SaveAll,
  Trash,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { FaFileDownload, FaFileExport } from 'react-icons/fa';
import { MdFileUpload, MdHighlightAlt, MdWidgets } from 'react-icons/md';

interface EditorFooterProps {
  tab?: string;
}

export default function EditorFooter({ tab }: EditorFooterProps) {
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  const [loading, setLoading] = useState(false);
  
  const [message, setMessage] = useState<string>('');
  const [hasCustomLibrary, setHasCustomLibrary] = useState<boolean>(false);
  
  // Check if there's a custom library on mount
  useEffect(() => {
    if (desktopState.library) {
      setHasCustomLibrary(true);
    }
  }, [desktopState.library]);
  
  // Setup message listener
  /**useEffect(() => {
    // This replaced the Vue event bus
    const handleEditorMessage = (msg: string, type: string = 'info') => {
      setMessage(msg);
      
      // Auto-hide message after 4 seconds
      const timeout = setTimeout(() => {
        setMessage('');
      }, 4000);
      
      return () => clearTimeout(timeout);
    };
    
    // Register message listener
    editorActions.registerListener(
      editorDispatch,
      'editorMessage',
      handleEditorMessage
    );
    
    // Cleanup
    return () => {
      editorActions.removeListener(editorDispatch, 'editorMessage');
    };
  }, [editorDispatch]);
  **/
  // Save page
  const savePage = async () => {
   /** setLoading(true);
    
    // Set current element to null
    editorActions.setCurrent(editorDispatch, null);
    
    // Get element to screenshot
    const el = document.querySelector('#BlockEditor');
    
    if (el) {
      const options = { 
        type: "dataURL", 
        useCORS: true, 
        scale: 0.50 
      };
      
      try {
        // Create screenshot
        const screenshot = await html2canvas(el, options);
        
        // Update page with screenshot
        editorActions.updatePage(editorDispatch, {
          ...editorState.page,
          image: screenshot.toDataURL()
        });
        
        // Save page
        editorActions.savePage(editorDispatch);
        
        // Show notification
        notificationActions.showNotification(
          notificationDispatch,
          'Page saved successfully',
          'success'
        );
      } catch (error) {
        console.error('Error saving page:', error);
        
        // Show error notification
        notificationActions.showNotification(
          notificationDispatch,
          'Error saving page',
          'error'
        );
      }
    }
    **/
    setLoading(false);
  };
  
  // Save page as a copy
  const saveAs = () => {
    // Create a copy of the page with a new name and ID
  /**  editorActions.updatePage(editorDispatch, {
      ...editorState.page,
      name: editorState.page.name + ' COPY',
      id: 0
    });
    
    // Open page settings dialog
    modalActions.openModal(
      modalDispatch,
      'settingsPage',
      'Page Settings'
    );
     */
  };
  
  return (
    <div className="w-screen bg-white shadow z-modal h-10 flex items-center fixed bottom-0 px-2 cursor-pointer border-t">
      <div className="border-r h-10 mx-1"></div>
      
      {/* Settings */}
      <button 
        className="icon-button" 
        onClick={() => modalActions.openModal(modalDispatch, 'settingsPage', 'Settings')}
        title="Settings"
      >
        <Settings size={20} />
      </button>
      
      {/* Save */}
      <button 
        className="icon-button" 
        onClick={savePage}
        title="Save template"
      >
        <Save size={20} />
      </button>
      
      {/* Save As */}
      <button 
        className="icon-button" 
        onClick={saveAs}
        title="Save as"
      >
        <SaveAll size={20} />
      </button>
      
      {/* Import */}
      <button 
        className="icon-button" 
        //onClick={() => editorActions.triggerEvent(editorDispatch, 'importPage', 'page')}
        title="Import template"
      >
        <FaFileDownload size={20} />
      </button>
      
      {/* Export */}
      <button 
        className="icon-button" 
        //onClick={() => editorActions.exportDocument(editorDispatch)}
        title="Export template"
      >
        <MdFileUpload size={20} />
      </button>
      
      <div className="border-r h-10 mx-1"></div>
      
      {/* Add to UI Kit */}
      <button 
        className="icon-button" 
        onClick={() => modalActions.openModal(modalDispatch, 'addToUIKit', 'Add to UI Kit')}
        title="Add to current kit"
      >
        <span className="text-gray-300 mr-1">+</span>
        <MdWidgets size={20} className={hasCustomLibrary ? 'animate-pulse' : ''} />
      </button>
      
      {/* Show current UI Kit name */}
      {desktopState.library && desktopState.library.name && (
        <span className="chip ring-2 ring-purple-500 mr-2 px-2 py-1 rounded text-sm">
          {desktopState.library.name}
        </span>
      )}
      
      {/* Export UI Kit */}
      {hasCustomLibrary && (
        <button 
          className="icon-button" 
         // onClick={() => desktopActions.exportCustomLibrary(desktopDispatch)}
          title="Save UI Kit"
        >
          <FaFileExport size={20} />
        </button>
      )}
      
      <div className="border-r h-10 mx-1"></div>
      
      {/* Delete template */}
      <button 
        className="icon-button" 
        //onClick={() => editorActions.deletePage(editorDispatch)}
        title="Delete template"
      >
        <Trash size={20} />
      </button>
      
      <div className="border-r h-10 mx-1 border-white"></div>
      
      {/* Documentation */}
      <button 
        className="icon-button" 
        onClick={() => modalActions.openModal(modalDispatch, 'help', 'Documentation')}
        title="Documentation"
      >
        <HelpCircle size={20} />
      </button>
      
      <div className="border-r h-10 mx-1"></div>
      
      {/* Current element info */}
      <MdHighlightAlt size={20} />
      
      <div className="px-2">
        {editorState.current && (
          <>
            {editorState.component && (
              <span 
                className="font-bold cursor-pointer" 
                title="Block settings" 
                onClick={() => modalActions.openModal(modalDispatch, 'settingsComponent', 'Component Settings')}
              >
                {editorState.component.name}
              </span>
            )}
            
            <span className="chip bg-gray-200 p-1 mx-1">
              {editorState.current.semantic} {editorState.current.element}
            </span>
            
            #{editorState.current.id}
            
            {editorState.current.coords && (
              <span>
                [ w:{parseInt(editorState.current.coords.width.toString())} x 
                h:{parseInt(editorState.current.coords.height.toString())} ] - 
                x:{parseInt(editorState.current.coords.x.toString())} - 
                y:{parseInt(editorState.current.coords.y.toString())}
              </span>
            )}
          </>
        )}
      </div>
      
      <div className="border-r h-10 mx-1"></div>
      
      {/* Autosave indicator and notification */}
      <div className="font-light flex absolute right-0 items-center mr-10">
        <span 
          className="mr-2 border rounded pl-1 cursor-pointer" 
          onClick={() => modalActions.openModal(modalDispatch, 'settings', 'Settings')}
        >
          Autosave 
          {editorState.settings?.autosave && (
            <span className="chip bg-green-400 py-1 uppercase" title={`${editorState.settings.autosaveTimeout}`}>
              on
            </span>
          )}
          {!editorState.settings?.autosave && (
            <span className="chip bg-red-500 py-1 uppercase">
              off
            </span>
          )}
        </span>
        
        {message && (
          <div className="bg-blue-400 h-10 text-white px-2 flex justify-center items-center animate-pulse">
            <span className="material-icons mr-1">notifications</span>
            <span>{message}</span>
          </div>
        )}
        
        <button 
          className="text-xs flex font-light items-center h-10 btn btn-purple ml-2 rounded px-2 py-1"
          //onClick={() => editorActions.triggerEvent(editorDispatch, 'preview', 'fullscreen')}
          title="Full preview"
        >
          <ExternalLink size={20} className="mr-2" />
          Preview
        </button>
      </div>
    </div>
  );
}