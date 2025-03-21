// components/modals/ImportPageModal.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { v4 as uuidv4 } from 'uuid';
import { UploadCloud, File } from 'lucide-react';
import { randomId } from '@/lib/utils';

interface ImportPageModalProps {
  options?: any;
  onClose: () => void;
}

export default function ImportPageModal({ onClose }: ImportPageModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: desktopDispatch } = useDesktop();
  const { dispatch: notifyDispatch } = useNotification();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/json') {
        setFile(droppedFile);
      } else {
        notificationActions.showNotification(
          notifyDispatch,
          'Only JSON files are allowed',
          'error'
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      notificationActions.showNotification(
        notifyDispatch,
        'Please select a file to import',
        'error'
      );
      return;
    }

    // If we're already editing a page, show confirmation dialog
    if (state.document && !confirmOverwrite) {
      setConfirmOverwrite(true);
      return;
    }

    try {
      setIsValidating(true);
      
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          if (!event.target || !event.target.result) return;
          
          const pageData = JSON.parse(event.target.result as string);
          
          // Validate the page structure
          if (!pageData.name || !pageData.json || !pageData.json.blocks) {
            throw new Error('Invalid page format');
          }
          
          // Ensure page has an ID
          if (!pageData.id) {
            pageData.id = randomId();
          }
          
          // First set the document
          dispatch({
            type: 'SET_DOCUMENT',
            payload: pageData.json.blocks
          });
          
          // Then set the page data
          dispatch({
            type: 'SET_PAGE',
            payload: pageData
          });
          
          // Add to desktop tabs
          desktopDispatch({
            type: 'ADD_TAB',
            payload: {
              label: pageData.name,
              object: pageData,
              type: 'editor'
            }
          });
          
          notificationActions.showNotification(
            notifyDispatch,
            `Page "${pageData.name}" imported successfully`,
            'success'
          );
          
          // Navigate to the editor
          router.push('/editor');
          
          setIsValidating(false);
          onClose();
        } catch (error) {
          setIsValidating(false);
          notificationActions.showNotification(
            notifyDispatch,
            'Error parsing imported file: Invalid format',
            'error'
          );
        }
      };
      
      fileReader.readAsText(file);
    } catch (error) {
      setIsValidating(false);
      notificationActions.showNotification(
        notifyDispatch,
        'Error importing file',
        'error'
      );
    }
  };

  // Handle cancel overwrite
  const handleCancelOverwrite = () => {
    setConfirmOverwrite(false);
  };

  return (
    <div className="p-4">
      {confirmOverwrite ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Overwrite Warning</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You are about to overwrite your current document. This action cannot be undone.
                    Are you sure you want to continue?
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={handleCancelOverwrite}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleImport}
            >
              Overwrite
            </button>
          </div>
        </div>
      ) : (
        <>
          <div 
            className={`border-2 border-dashed p-8 text-center rounded-md mb-4 
              ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}
              ${file ? 'bg-green-50 border-green-300' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mb-2"></div>
                <p className="text-purple-600">Validating file...</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center">
                <File className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-green-600 font-medium">File selected:</p>
                <p>{file.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg mb-2">
                  Drag and drop your page JSON file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Import a page from a Whoobe export
                </p>
                <button
                  type="button"
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          
          <div className="border rounded-md p-4 bg-blue-50 mb-6">
            <h3 className="text-blue-700 font-medium mb-2">Import Information</h3>
            <p className="text-sm text-blue-600">
              Importing a page will open it in a new tab. You can import pages created with Whoobe or compatible JSON files.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                ${file ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}
              onClick={handleImport}
              disabled={!file || isValidating}
            >
              {isValidating ? 'Processing...' : 'Import'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}