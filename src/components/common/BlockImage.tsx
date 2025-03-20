'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';
import { ElementImage } from '@/types/element';
import { ImageUp, Edit, Trash, Image } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils';

interface BlockImageProps {
  onClose?: () => void;
}

export default function BlockImage({ onClose }: BlockImageProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const blockActionRef = useRef<HTMLDivElement>(null);
  const [imageInfo, setImageInfo] = useState<ElementImage>({
    url: '',
    alt: '',
    caption: ''
  });
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Initialize image info from current element
  useEffect(() => {
    if (state.current && state.current.image) {
      setImageInfo({
        url: state.current.image.url || '',
        alt: state.current.image.alt || '',
        caption: state.current.image.caption || ''
      });
    }
  }, [state.current]);

  // Open media gallery
  const openMediaGallery = () => {
    modalDispatch({
      type: 'OPEN_MODAL',
      payload: {
        component: 'mediaGallery',
        title: 'Media Gallery',
        width: 'w-full',
        options: {}
      }
    });
    
    if (onClose) {
      onClose();
    }
  };

  // Toggle URL input visibility
  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };

  // Handle image URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInfo({
      ...imageInfo,
      url: e.target.value
    });
  };

  // Handle alt text change
  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInfo({
      ...imageInfo,
      alt: e.target.value
    });
  };

  // Handle caption change
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInfo({
      ...imageInfo,
      caption: e.target.value
    });
  };

  // Apply image changes
  const applyImageChanges = () => {
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_IMAGE',
        payload: imageInfo
      });
      
      if (onClose) {
        onClose();
      }
    }
  };

  // Remove image
  const removeImage = () => {
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_IMAGE',
        payload: { url: '', alt: '', caption: '' }
      });
      
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div ref={blockActionRef} className="w-full p-4">
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Image Settings</h3>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleUrlInput}
              className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              title="Edit URL"
            >
              <Edit size={16} />
            </button>
            
            <button
              onClick={openMediaGallery}
              className="p-1 rounded bg-purple-500 text-white hover:bg-purple-600"
              title="Media Gallery"
            >
              <ImageUp size={16} />
            </button>
            
            <button
              onClick={removeImage}
              className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
              title="Remove Image"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
        
        {showUrlInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={imageInfo.url}
              onChange={handleUrlChange}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={imageInfo.alt}
            onChange={handleAltChange}
            className="w-full p-2 border rounded"
            placeholder="Image description for accessibility"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption
          </label>
          <input
            type="text"
            value={imageInfo.caption}
            onChange={handleCaptionChange}
            className="w-full p-2 border rounded"
            placeholder="Image caption (optional)"
          />
        </div>
        
        {imageInfo.url && (
          <div className="mb-4 flex justify-center">
            <img
              src={formatImageUrl(imageInfo)}
              alt={imageInfo.alt || "Preview"}
              className="max-w-full max-h-64 object-contain"
            />
          </div>
        )}
        
        {!imageInfo.url && (
          <div className="mb-4 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded">
            <Image size={48} className="text-gray-400 mb-2" />
            <p className="text-gray-500">No image selected</p>
            <button
              onClick={openMediaGallery}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Select Image
            </button>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={applyImageChanges}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}