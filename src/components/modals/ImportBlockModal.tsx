// components/modals/ImportBlockModal.tsx
'use client';

import { useState, useRef } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { v4 as uuidv4 } from 'uuid';
import { UploadCloud, File } from 'lucide-react';
import { randomId } from '@/lib/utils';

interface ImportBlockModalProps {
  options?: {
    target?: 'document' | 'block';
  };
  onClose: () => void;
}

export default function ImportBlockModal({ options = {}, onClose }: ImportBlockModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const target = options.target || 'block';

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

  const processBlock = (block: any): any => {
    // Recursively assign new IDs to ensure uniqueness
    const processNode = (node: any): any => {
      if (!node) return node;
      
      // Assign new ID
      const newNode = { ...node, id: randomId() };
      
      // Process child blocks if they exist
      if (Array.isArray(newNode.blocks)) {
        newNode.blocks = newNode.blocks.map(processNode);
      }
      
      return newNode;
    };
    
    return processNode(block);
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
      setIsValidating(true);
      
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          if (!event.target || !event.target.result) return;
          
          const blockData = JSON.parse(event.target.result as string);
          
          // Validate the block structure
          if (target === 'document' && (!blockData.name || !blockData.json || !blockData.json.blocks)) {
            throw new Error('Invalid document format');
          } else if (target === 'block' && (!blockData.id || !blockData.element)) {
            throw new Error('Invalid block format');
          }
          
          // Different handling for document vs block
          if (target === 'document') {
            // Import as a document (entire page)
            dispatch({
              type: 'SET_PAGE',
              payload: {
                ...blockData,
                id: blockData.id || randomId() 
              }
            });
            
            dispatch({
              type: 'SET_DOCUMENT',
              payload: blockData.json.blocks
            });
            
            notificationActions.showNotification(
              notifyDispatch,
              `Document "${blockData.name}" imported successfully`,
              'success'
            );
          } else {
            // Import as a block into the current selection
            if (!state.current) {
              notificationActions.showNotification(
                notifyDispatch,
                'No block selected to add to',
                'error'
              );
              setIsValidating(false);
              return;
            }
            
            // Process block to ensure unique IDs
            const processedBlock = processBlock(blockData);
            
            // Add to current block
            if (state.current.blocks) {
              dispatch({
                type: 'UPDATE_CURRENT',
                payload: {
                  ...state.current,
                  blocks: [...state.current.blocks, processedBlock]
                }
              });
              
              notificationActions.showNotification(
                notifyDispatch,
                'Block imported successfully',
                'success'
              );
            } else {
              notificationActions.showNotification(
                notifyDispatch,
                'Current selection cannot contain blocks',
                'error'
              );
            }
          }
          
          setIsValidating(false);
          onClose();
        } catch (error) {
          setIsValidating(false);
          notificationActions.showNotification(
            notifyDispatch,
            'Error parsing imported file',
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
              Drag and drop your {target === 'document' ? 'document' : 'block'} JSON file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Import a {target === 'document' ? 'document' : 'block'} from a Whoobe export
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
          {target === 'document' 
            ? 'This will replace your current document with the imported one.'
            : 'This will add the imported block to your currently selected element.'}
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
    </div>
  );
}