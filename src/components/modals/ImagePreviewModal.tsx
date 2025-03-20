// components/modals/ImagePreviewModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { formatImageUrl, imageUtils } from '@/lib/utils';
import { ElementImage } from '@/types/element';
import { ZoomIn, ZoomOut, Download, Info, ExternalLink, Maximize, Minimize } from 'lucide-react';
import { storage } from '@/lib/utils';

interface ImagePreviewModalProps {
  options?: any;
  onClose: () => void;
}

export default function ImagePreviewModal({ onClose }: ImagePreviewModalProps) {
  const [image, setImage] = useState<ElementImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  // Load image from local storage on mount
  useEffect(() => {
    const storedImage = storage.get<ElementImage>('windflow-image-preview', null);
    if (storedImage) {
      setImage(storedImage);
      
      // Get image dimensions
      if (storedImage.url) {
        setLoading(true);
        imageUtils.getDimensions(storedImage.url)
          .then(dims => {
            setDimensions(dims);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  // Handle download
  const handleDownload = () => {
    if (!image || !image.url) return;
    
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle external link
  const handleOpenExternal = () => {
    if (!image || !image.url) return;
    window.open(image.url, '_blank');
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Format file size for display
  const formatFileSize = (size?: string) => {
    if (!size) return 'Unknown';
    
    const sizeInBytes = parseInt(size);
    if (isNaN(sizeInBytes)) return 'Unknown';
    
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  if (!image) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No image to preview</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <div className="text-sm font-medium truncate">
          {image.name || image.alt || 'Image Preview'}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-full hover:bg-gray-200"
            disabled={zoom <= 0.5}
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <div className="px-2 flex items-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-full hover:bg-gray-200"
            disabled={zoom >= 3}
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1 rounded-full hover:bg-gray-200 ${showInfo ? 'bg-gray-200' : ''}`}
            title="Image Information"
          >
            <Info className="h-5 w-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded-full hover:bg-gray-200"
            title="Download Image"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-1 rounded-full hover:bg-gray-200"
            title="Open in New Tab"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded-full hover:bg-gray-200"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Image container */}
        <div 
          className={`flex-1 overflow-auto bg-gray-800 flex items-center justify-center ${
            isFullscreen ? 'h-full' : 'h-96'
          }`}
        >
          {loading ? (
            <div className="text-white">Loading image...</div>
          ) : (
            <img
              src={formatImageUrl(image)}
              alt={image.alt || 'Image preview'}
              className="max-h-full"
              style={{ 
                transform: `scale(${zoom})`, 
                maxWidth: `${100 / zoom}%`,
                transition: 'transform 0.2s ease-in-out'
              }}
            />
          )}
        </div>
        
        {/* Info panel */}
        {showInfo && (
          <div className="w-64 border-l bg-white p-4 overflow-y-auto">
            <h3 className="font-medium mb-4">Image Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500">Name</label>
                <div className="text-sm">{image.name || 'Unnamed'}</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500">Dimensions</label>
                <div className="text-sm">
                  {dimensions.width || image.width || '?'} × {dimensions.height || image.height || '?'} px
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500">Size</label>
                <div className="text-sm">{formatFileSize(image.size)}</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500">Alt Text</label>
                <div className="text-sm">{image.alt || 'None'}</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500">Caption</label>
                <div className="text-sm">{image.caption || 'None'}</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-500">URL</label>
                <div className="text-sm truncate">{image.url}</div>
              </div>
            </div>
            
            {/* Edit fields */}
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Edit Image Info</h4>
              
              <div>
                <label htmlFor="alt" className="block text-xs text-gray-500">Alt Text</label>
                <input
                  type="text"
                  id="alt"
                  className="mt-1 block w-full rounded-md border border-gray-300 py-1 px-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={image.alt || ''}
                  onChange={(e) => setImage(prev => prev ? { ...prev, alt: e.target.value } : prev)}
                />
              </div>
              
              <div>
                <label htmlFor="caption" className="block text-xs text-gray-500">Caption</label>
                <input
                  type="text"
                  id="caption"
                  className="mt-1 block w-full rounded-md border border-gray-300 py-1 px-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={image.caption || ''}
                  onChange={(e) => setImage(prev => prev ? { ...prev, caption: e.target.value } : prev)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!isFullscreen && (
        <div className="flex justify-end p-4 border-t">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}