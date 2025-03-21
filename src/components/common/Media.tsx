import React, { useState, useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { useEditor } from '@/context/EditorContext';
import MaterialIcon from './MaterialIcon';
import Modal from './Modal';
import { formatImageUrl } from '@/lib/utils';

interface MediaProps {
  options?: string;
}

interface ImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

interface ImageData {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  size: number;
  formats?: Record<string, ImageFormat>;
}

interface MediaResponse {
  data: ImageData[];
  total: number;
}

const Media: React.FC<MediaProps> = ({ options }) => {
  const [limit, setLimit] = useState(24);
  const [skip, setSkip] = useState(0);
  const [images, setImages] = useState<MediaResponse | null>(null);
  const [preview, setPreview] = useState<ImageData | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { dispatch: notifyDispatch } = useNotification();
  const { dispatch: editorDispatch } = useEditor();

  // Equivalent of $imageURL Vue function
  const getImageUrl = (image: ImageData) => {
    return formatImageUrl(image.url);
  };

  // Load media data
  const loadMedia = async () => {
    setLoading(true);
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/media?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error('Failed to load media');
      }
      const data: MediaResponse = await response.json();
      setImages(data);
    } catch (error) {
      notifyDispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'Error loading media',
          type: 'error'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Update height based on width and aspect ratio
  const handleSetHeight = () => {
    setHeight(Math.round(width / ratio));
  };

  // Select media and pass to editor
  const handleSelectMedia = () => {
    if (currentImage) {
      // Dispatch event to editor context
      editorDispatch({
        type: 'SELECTED_MEDIA',
        payload: currentImage
      });
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (skip > 0) {
      setSkip(skip - limit);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (images && (skip + limit) < images.total) {
      setSkip(skip + limit);
    }
  };

  // Load media when component mounts or skip changes
  useEffect(() => {
    loadMedia();
  }, [skip]);

  // Update dimensions when preview changes
  useEffect(() => {
    if (preview) {
      setWidth(preview.width);
      setHeight(preview.height);
      setRatio(preview.width / preview.height);
    }
  }, [preview]);

  if (!images) return null;

  return (
    <div className="z-40">
      {/* Header with management options */}
      <div className="h-10 w-full p-2 flex flex-row items-center px-16">
        {options === 'manage' && (
          <div>
            <button className="btn">Upload</button>
            <button className="btn btn-red">Pixabay</button>
          </div>
        )}
      </div>

      {/* Image grid */}
      <div className="flex flex-row flex-wrap px-4 items-center justify-center">
        {images.data.map(image => (
          <div 
            key={image.id} 
            className="m-2" 
            title={image.url}
            onClick={() => {
              setPreview(image);
              setCurrentImage(image.url);
            }}
          >
            <img 
              src={getImageUrl(image)} 
              className="h-32 w-48 object-cover shadow-lg"
              alt={image.name || 'Media image'}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute left-0 top-0 w-16 h-screen flex flex-col items-center justify-center">
        <MaterialIcon 
          icon="chevron_left" 
          className="text-6xl cursor-pointer" 
          onClick={handlePrevPage}
        />
      </div>
      <div className="absolute right-0 top-0 w-16 h-screen flex flex-col items-center justify-center">
        <MaterialIcon 
          icon="chevron_right" 
          className="text-6xl cursor-pointer" 
          onClick={handleNextPage}
        />
      </div>

      {/* Preview modal */}
      {preview && (
        <Modal
          isOpen={!!preview}
          onClose={() => setPreview(null)}
          title={preview.name}
          className="bg-white shadow w-3/4 h-auto"
        >
          <div className="relative flex flex-row">
            <div className="w-3/4">
              <img 
                src={getImageUrl(preview)} 
                className="w-full h-auto object-contain" 
                style={{ maxHeight: '600px' }}
                alt={preview.name}
              />
            </div>
            <div className="p-2 flex flex-col">
              <label>{preview.name}</label>
              <label>Dimension</label>
              <label>
                {preview.width} x {preview.height} - {(preview.size / 1000).toFixed(2)} KB
              </label>
              
              {preview.formats && (
                <select 
                  className="p-2" 
                  value={currentImage || ''}
                  onChange={(e) => setCurrentImage(e.target.value)}
                >
                  {Object.keys(preview.formats).map(size => (
                    <option key={size} value={preview.formats[size].url}>
                      {preview.formats[size].width} x {preview.formats[size].height} - {Math.round(preview.formats[size].size / 1000)}KB
                    </option>
                  ))}
                </select>
              )}
              
              <div className="flex flex-row items-center">
                <input 
                  type="number" 
                  className="p-2" 
                  min="1" 
                  max="5000" 
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  onBlur={handleSetHeight}
                /> x 
                <input 
                  type="number" 
                  className="p-2" 
                  min="1" 
                  max="5000" 
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                />
              </div>
              
              <button 
                className="lg bg-indigo-500 rounded mt-2 px-4 py-2 text-white"
                onClick={handleSelectMedia}
              >
                Select
              </button>

              {options === 'manage' && (
                <button className="lg bg-red-500 rounded mt-2 mr-2 px-4 py-2 text-white">
                  Delete
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Loading indicator */}
      {loading && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Loading...</div>}
    </div>
  );
};

export default Media;