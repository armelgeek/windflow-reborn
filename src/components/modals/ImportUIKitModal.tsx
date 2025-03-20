// components/modals/ImportUIKitModal.tsx
'use client';

import { useState, useRef } from 'react';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';

interface ImportUIKitModalProps {
  options?: any;
  onClose: () => void;
}

export default function ImportUIKitModal({ onClose }: ImportUIKitModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dispatch: desktopDispatch } = useDesktop();
  const { dispatch: notifyDispatch } = useNotification();

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

    try {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          if (!event.target || !event.target.result) return;
          
          const uiKit = JSON.parse(event.target.result as string);
          
          // Validate UI Kit structure
          if (!uiKit.name || !Array.isArray(uiKit.templates)) {
            throw new Error('Invalid UI Kit format');
          }
          
          // Add to UI Kits
          desktopDispatch({ 
            type: 'ADD_UIKIT', 
            payload: uiKit 
          });
          
          // Set as current library
          desktopDispatch({
            type: 'SET_LIBRARY',
            payload: uiKit
          });
          
          notificationActions.showNotification(
            notifyDispatch,
            `Successfully imported UI Kit: ${uiKit.name}`,
            'success'
          );
          
          onClose();
        } catch (error) {
          notificationActions.showNotification(
            notifyDispatch,
            'Error parsing UI Kit file',
            'error'
          );
        }
      };
      
      fileReader.readAsText(file);
    } catch (error) {
      notificationActions.showNotification(
        notifyDispatch,
        'Error importing UI Kit',
        'error'
      );
    }
  };

  return (
    <div className="p-4">
      <div 
        className={`border-2 border-dashed p-8 text-center rounded-md mb-4 
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}
          ${file ? 'bg-green-50 border-green-300' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? (
          <div>
            <p className="text-green-600 font-medium">File selected:</p>
            <p>{file.name}</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-2">Drag and drop your UI Kit JSON file here</p>
            <p className="text-gray-400 text-sm">or</p>
            <button
              type="button"
              className="mt-2 rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
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
          className={`rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
            ${file ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}
          onClick={handleImport}
          disabled={!file}
        >
          Import
        </button>
      </div>
    </div>
  );
}