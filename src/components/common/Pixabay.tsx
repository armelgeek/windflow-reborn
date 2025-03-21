'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';
import Radio from '@/components/common/Radio';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface PixabayHit {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  downloads: number;
  favorites: number;
  tags: string;
  imageWidth: number;
  imageHeight: number;
  imageURL?: string;
  name?: string;
  picture_id?: string;
  videos?: {
    tiny: {
      url: string;
    }
  }
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

interface PixabayProps {
  onClose?: () => void;
  onUploaded?: () => void;
}

export default function Pixabay({ onClose, onUploaded }: PixabayProps) {
  const { dispatch: notificationDispatch } = useNotification();
  
  const [apikey, setApikey] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [images, setImages] = useState<PixabayResponse | null>(null);
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState<PixabayHit | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [type, setType] = useState('all');
  const [pixabayUser, setPixabayUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const options = [
    { label: 'All', value: 'all' },
    { label: 'Photo', value: 'photo' },
    { label: 'Illustration', value: 'illustration' },
    { label: 'Vector', value: 'vector' },
    { label: 'Video', value: 'video' },
  ];

  // Get filename from preview URL
  const filename = preview?.previewURL 
    ? preview.previewURL.split('/')[preview.previewURL.split('/').length - 1] 
    : 'video';

  // Handle search input
  useEffect(() => {
    if (search && search.length > 2) {
      if (page === 0) {
        setPage(1);
      }
      pixabayQry(search);
    }
  }, [search]);

  // Handle preview changes
  useEffect(() => {
    if (preview) {
      localStorage.setItem('windflow-image-preview', JSON.stringify(preview));
      
      // In the Vue version this was emitting a dialogBus event
      // In our React version we'd use our context API
      // This is a placeholder for that functionality
      window.dispatchEvent(new CustomEvent('imagePreview'));
    }
  }, [preview]);

  // Handle type changes
  useEffect(() => {
    if (type) {
      setPage(1);
      pixabayQry(search);
    }
  }, [type]);

  // Handle pixabayUser changes
  useEffect(() => {
    if (pixabayUser) {
      pixabayQry();
    }
  }, [pixabayUser]);

  // Set API key on mount
  useEffect(() => {
    // In production, this would come from an environment variable
    setApikey(process.env.NEXT_PUBLIC_PIXABAY_APIKEY);
  }, []);

  // Set option type
  const setOption = (option: string) => {
    setType(option);
  };

  // Query Pixabay API
  const pixabayQry = async (searchTerm = search) => {
    if (!apikey || !searchTerm) return;
    
    setLoading(true);
    
    try {
      // Build query parameters
      const usr = pixabayUser ? `&user=${pixabayUser}` : '';
      const imgType = type !== 'video' ? `&image_type=${type}` : '';
      const url = type === 'video' ? 'videos' : '';
      
      // Make API request
      const response = await fetch(
        `https://pixabay.com/api/${url}?key=${apikey}&q=${searchTerm}${usr}${imgType}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Pixabay');
      }
      
      const data = await response.json();
      
      if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Request error:', error);
      
      notificationDispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'Request error',
          type: 'error'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Download image
  const downloadImage = () => {
    if (!preview?.name) {
      if (preview) {
        preview.name = 'windflow-' + Math.random().toString(36).substring(2, 9);
      }
    } else {
      uploadImage();
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!preview?.largeImageURL) return;
    
    setLoading(true);
    
    try {
      // This would need to be adjusted to use your API service
      // For now, this is a placeholder implementation
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: preview.name,
          url: preview.largeImageURL
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload media');
      }
      
      setLoading(false);
      setPreview(null);
      
      notificationDispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'Media uploaded!',
          type: 'success'
        }
      });
      
      if (onUploaded) {
        onUploaded();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      
      notificationDispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          message: 'Failed to upload media',
          type: 'error'
        }
      });
    }
  };

  // If no API key, don't render anything
  if (!apikey) return null;

  return (
    <div className="px-8 w-full">
      <div className="flex flex-row items-center w-full mb-4 p-2 relative">
        <Image 
          src="https://pixabay.com/static/img/logo.png" 
          alt="Pixabay Logo"
          width={128}
          height={40}
          className="rounded bg-white p-2 w-32 opacity-50 mr-2"
        />
        
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search" 
          className="dark mr-2 p-2 border rounded"
        />
        
        <Radio 
          options={options} 
          onOption={setOption}
          className="text-gray-600"
          selected={type}
        />
        
        {!preview && (
          <>
            {images && page > 1 && (
              <Icon
                icon="mdi:chevron-left"
                className="text-5xl rounded-full ml-6 center-vertical left-0 cursor-pointer"
                onClick={() => {
                  setPage(page - 1);
                  pixabayQry(search);
                }}
              />
            )}
            
            {images && (
              <Icon
                icon="mdi:chevron-right"
                className="text-5xl rounded-full mr-1 center-vertical right-0 cursor-pointer"
                onClick={() => {
                  setPage(page + 1);
                  pixabayQry(search);
                }}
              />
            )}
            
            <Icon
              icon="mdi:close"
              className="absolute right-0 mr-4 text-3xl cursor-pointer"
              onClick={onClose}
            />
          </>
        )}
      </div>
      
      {images && (
        <div className="flex flex-row flex-wrap items-center justify-center mx-auto">
          {images.hits.map((image, i) => (
            <section key={image.id}>
              <div 
                className="flex flex-col mb-2 mx-1"
                title="click to preview"
                data-tooltip={
                  image.downloads > 1000 
                  ? `Downloads: ${parseInt((image.downloads / 1000).toString())}K` 
                  : `Downloads ${image.downloads}`
                }
              >
                {type !== 'video' ? (
                  <img 
                    src={image.previewURL} 
                    alt={image.tags}
                    className="cursor-pointer object-cover w-48 h-32" 
                    onClick={() => {
                      setPreview(image);
                      setIndex(i);
                    }}
                  />
                ) : (
                  <img 
                    src={`https://i.vimeocdn.com/video/${image.picture_id}_295x166.jpg`} 
                    alt={image.tags}
                    className="cursor-pointer object-cover w-48 h-32" 
                    onClick={() => {
                      setPreview(image);
                      setIndex(i);
                    }}
                  />
                )}
                
                <div className="text-xs text-gray-400 flex flex-row items-center">
                  <Icon icon="mdi:file-download" className="mr-1" />
                  {image.downloads > 1000 
                    ? `${parseInt((image.downloads / 1000).toString())}K` 
                    : image.downloads
                  }
                  
                  <Icon icon="mdi:favorite" className="ml-4 mr-1" />
                  {image.favorites}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
      
      {preview && (
        <div className="modal z-40 w-3/4 p-4 bg-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Icon 
            icon="mdi:close" 
            className="absolute right-0 top-0 m-1 text-white text-2xl cursor-pointer" 
            onClick={() => setPreview(null)}
          />
          
          <div className="flex">
            <div className="w-5/6">
              <img src={preview.webformatURL} alt={preview.tags} className="max-w-full" />
            </div>
            
            <div className="w-1/6 flex flex-col text-gray-400 pl-4">
              <div>Width: {preview.imageWidth}</div>
              <div>Height: {preview.imageHeight}</div>
              <div className="mt-2">
                URL: 
                <input 
                  type="text" 
                  value={preview.imageURL || preview.webformatURL}
                  className="w-full mt-1 p-1 text-xs bg-gray-800 text-white border border-gray-600 rounded"
                  readOnly
                />
              </div>
              
              <button 
                onClick={downloadImage}
                className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                {loading ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Icon icon="mdi:loading" className="animate-spin text-4xl text-white" />
        </div>
      )}
    </div>
  );
}