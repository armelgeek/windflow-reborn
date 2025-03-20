'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';
import { formatImageUrl } from '@/lib/utils';
import { Image, XCircle, ExternalLink, Search } from 'lucide-react';

interface BlockImageUrlProps {
  coords?: {
    top: number;
    left: number;
  };
  options?: any;
  onClose?: () => void;
}

export default function BlockImageUrl({ coords, options, onClose }: BlockImageUrlProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const imageURLRef = useRef<HTMLDivElement>(null);
  
  const [search, setSearch] = useState('');
  const [unsplash, setUnsplash] = useState(false);

  // Compute style if coords are provided
  const getStyle = () => {
    if (!coords) return {};
    return {
      top: `${coords.top}px`,
      left: `${coords.left}px`
    };
  };

  // Update component position when mounted
  useEffect(() => {
    if (imageURLRef.current && coords) {
      const rect = imageURLRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 300) {
        imageURLRef.current.style.left = `${rect.left - 100}px`;
      }
    }
  }, [coords]);

  // Handle Unsplash search
  const handleUnsplashSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.length > 2 && state.current) {
      const newImage = {
        ...state.current.image,
        url: `https://source.unsplash.com/featured/?${encodeURIComponent(search)}`
      };
      
      dispatch({
        type: 'UPDATE_CURRENT_IMAGE',
        payload: newImage
      });
    }
  };

  // Open media gallery
  const openMediaGallery = () => {
    modalDispatch({
      type: 'OPEN_MODAL',
      payload: {
        component: 'media',
        title: 'Media',
        width: 'w-full h-screen',
        options: options
      }
    });
  };

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state.current) {
      const newImage = {
        ...state.current.image,
        url: e.target.value
      };
      
      dispatch({
        type: 'UPDATE_CURRENT_IMAGE',
        payload: newImage
      });
    }
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    if (state.current) {
      const newImage = {
        ...state.current.image,
        url: null
      };
      
      dispatch({
        type: 'UPDATE_CURRENT_IMAGE',
        payload: newImage
      });
      
      if (onClose) {
        onClose();
      }
    }
  };

  // If no current element, return nothing
  if (!state.current) {
    return null;
  }

  return (
    <div 
      ref={imageURLRef} 
      className="flex flex-col items-start bg-white shadow-lg rounded p-2 min-w-[320px]" 
      style={getStyle()}>
      
      <div className="flex items-center p-1 justify-around w-full">
        <Image className="text-gray-500" size={20} />
        <input 
          className="ml-2 p-1 w-3/4 rounded text-lg border" 
          value={state.current.image?.url || ''}
          onChange={handleUrlChange}
          placeholder="Enter image URL"
        />
        <button 
          className="bg-indigo-500 text-white p-1 rounded ml-1 hover:bg-indigo-600" 
          onClick={onClose} 
          title="Accept image">
          <ExternalLink size={16} />
        </button>
        <button 
          className="bg-red-500 text-white p-1 rounded ml-1 hover:bg-red-600" 
          onClick={handleRemoveImage} 
          title="Remove image">
          <XCircle size={16} />
        </button>
      </div>
      
      {state.current.element === 'img' && (
        <div className="flex flex-col pb-2 w-full">
          <label className="text-sm font-medium text-gray-700 mt-2 mb-1">Caption</label>
          <input 
            className="p-1 w-full mx-1 text-sm border rounded" 
            value={state.current.image?.caption || ''}
            onChange={(e) => {
              if (state.current) {
                const newImage = {
                  ...state.current.image,
                  caption: e.target.value
                };
                
                dispatch({
                  type: 'UPDATE_CURRENT_IMAGE',
                  payload: newImage
                });
              }
            }}
            placeholder="Image caption"
          />
          
          <label className="text-sm font-medium text-gray-700 mt-2 mb-1">Alternative text</label>
          <input 
            className="p-1 w-full mx-1 text-sm border rounded" 
            value={state.current.image?.alt || ''}
            onChange={(e) => {
              if (state.current) {
                const newImage = {
                  ...state.current.image,
                  alt: e.target.value
                };
                
                dispatch({
                  type: 'UPDATE_CURRENT_IMAGE',
                  payload: newImage
                });
              }
            }}
            placeholder="Alt text for accessibility"
          />
        </div>
      )}
      
      <div className="w-full flex flex-col p-1 items-center">
        {state.current.image?.url && (
          <img 
            className="w-64 h-auto object-contain border rounded" 
            src={formatImageUrl(state.current.image)}
            alt={state.current.image.alt || "Image preview"}
          />
        )}
      </div>
      
      <div className="flex flex-row w-full p-1 justify-between bg-gray-200 mt-2 rounded">
        <button 
          className="rounded mx-2 px-2 py-1 bg-purple-500 text-white hover:bg-purple-600"
          onClick={openMediaGallery}>
          Media Gallery
        </button>
        
        <div className="flex">
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleUnsplashSearch}
            className="p-1 py-1 text-sm border rounded" 
            placeholder="Unsplash search" 
          /> 
          <button 
            className="p-1 ml-1 bg-blue-500 text-white rounded hover:bg-blue-600" 
            onClick={() => handleUnsplashSearch({ key: 'Enter' } as any)}
            title="Search Unsplash">
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}