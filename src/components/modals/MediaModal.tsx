// components/modals/MediaModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { formatImageUrl } from '@/lib/utils';
import { ElementImage } from '@/types/element';
import { Upload, Image, Search, Link } from 'lucide-react';

interface MediaModalProps {
  options?: any;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function MediaModal({ onClose }: MediaModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<ElementImage[]>([]);
  const [pixabayImages, setPixabayImages] = useState<ElementImage[]>([]);
  const [imageURL, setImageURL] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Media gallery categories
  const categories = [
    { name: 'Upload', icon: <Upload className="h-5 w-5" /> },
    { name: 'Media Library', icon: <Image className="h-5 w-5" /> },
    { name: 'Pixabay', icon: <Search className="h-5 w-5" /> },
    { name: 'URL', icon: <Link className="h-5 w-5" /> },
  ];
  
  // Load uploaded files on mount
  useEffect(() => {
    // In a real app, you'd fetch from your media library API
    // For now, we'll simulate with some demo images
    setUploadedFiles([
      {
        url: '/api/placeholder/400/300',
        alt: 'Demo Image 1',
        caption: 'Demo Caption 1',
        width: 400,
        height: 300,
        name: 'demo1.jpg',
        size: '45000'
      },
      {
        url: '/api/placeholder/500/300',
        alt: 'Demo Image 2',
        caption: 'Demo Caption 2',
        width: 500,
        height: 300,
        name: 'demo2.jpg',
        size: '52000'
      },
      {
        url: '/api/placeholder/300/400',
        alt: 'Demo Image 3',
        caption: 'Demo Caption 3',
        width: 300,
        height: 400,
        name: 'demo3.jpg',
        size: '38000'
      },
    ]);
  }, []);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      notificationActions.showNotification(
        notifyDispatch,
        'Please select an image file',
        'error'
      );
      return;
    }
    
    // Simulate file upload with progress
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Create a new file URL
          const imageUrl = URL.createObjectURL(selectedFile);
          
          // Create image element to get dimensions
          const img = new Image();
          img.onload = () => {
            // Add to uploaded files
            const newFile: ElementImage = {
              url: imageUrl,
              alt: selectedFile.name,
              caption: selectedFile.name,
              width: img.naturalWidth,
              height: img.naturalHeight,
              name: selectedFile.name,
              size: selectedFile.size.toString(),
            };
            
            setUploadedFiles(prev => [newFile, ...prev]);
            
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            // Switch to Media Library tab
            setActiveTab(1);
            
            notificationActions.showNotification(
              notifyDispatch,
              'Image uploaded successfully',
              'success'
            );
          };
          img.src = imageUrl;
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Handle search in Pixabay
  const handlePixabaySearch = () => {
    if (!searchQuery.trim()) {
      notificationActions.showNotification(
        notifyDispatch,
        'Please enter a search query',
        'warning'
      );
      return;
    }
    
    // In a real app, you'd call the Pixabay API here
    // For now, simulate with placeholder images
    setPixabayImages([
      {
        url: `/api/placeholder/400/300?text=${encodeURIComponent(searchQuery)}`,
        alt: `${searchQuery} image 1`,
        caption: `${searchQuery} image 1`,
        width: 400,
        height: 300,
      },
      {
        url: `/api/placeholder/500/300?text=${encodeURIComponent(searchQuery)}`,
        alt: `${searchQuery} image 2`,
        caption: `${searchQuery} image 2`,
        width: 500,
        height: 300,
      },
      {
        url: `/api/placeholder/300/400?text=${encodeURIComponent(searchQuery)}`,
        alt: `${searchQuery} image 3`,
        caption: `${searchQuery} image 3`,
        width: 300,
        height: 400,
      },
    ]);
  };
  
  // Handle URL submission
  const handleURLSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageURL.trim()) {
      notificationActions.showNotification(
        notifyDispatch,
        'Please enter an image URL',
        'warning'
      );
      return;
    }
    
    // Validate URL format
    if (!imageURL.match(/^(http|https):\/\/[^ "]+$/)) {
      notificationActions.showNotification(
        notifyDispatch,
        'Please enter a valid URL',
        'error'
      );
      return;
    }
    
    // Create image element to test URL and get dimensions
    const img = new Image();
    img.onload = () => {
      // Set the image in the editor
      if (state.current && state.current.image) {
        dispatch({
          type: 'UPDATE_CURRENT',
          payload: {
            ...state.current,
            image: {
              url: imageURL,
              alt: '',
              caption: '',
              width: img.naturalWidth,
              height: img.naturalHeight,
            }
          }
        });
        
        notificationActions.showNotification(
          notifyDispatch,
          'Image added successfully',
          'success'
        );
        
        onClose();
      }
    };
    img.onerror = () => {
      notificationActions.showNotification(
        notifyDispatch,
        'Could not load image from URL',
        'error'
      );
    };
    img.src = imageURL;
  };
  
  // Select image from any source
  const handleSelectImage = (image: ElementImage) => {
    if (state.current) {
      // For elements with image property
      if ('image' in state.current) {
        dispatch({
          type: 'UPDATE_CURRENT',
          payload: {
            ...state.current,
            image
          }
        });
      }
      // For elements with src property (like iframes)
      else if ('src' in state.current) {
        dispatch({
          type: 'UPDATE_CURRENT',
          payload: {
            ...state.current,
            src: image.url
          }
        });
      }
      
      notificationActions.showNotification(
        notifyDispatch,
        'Image added successfully',
        'success'
      );
      
      onClose();
    }
  };

  return (
    <div className="p-4 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="w-full flex-grow flex flex-col">
        {/**<Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex rounded-xl bg-gray-100 p-1 mb-4">
            {categories.map((category, index) => (
              <Tab
                key={category.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                    selected
                      ? 'bg-white text-purple-700 shadow'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="flex-grow overflow-y-auto">
            <Tab.Panel className="rounded-xl bg-white p-3 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div 
                  className={`border-2 border-dashed rounded-md p-8 w-full max-w-lg text-center ${
                    uploading ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                  }`}
                >
                  {uploading ? (
                    <div className="space-y-4">
                      <p className="text-purple-500">Uploading...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500">{uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg mb-2">Drag and drop your image here</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports: JPG, PNG, GIF, SVG (max 5MB)
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
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel className="rounded-xl bg-white p-3 h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Media Library</h3>
                  <p className="text-sm text-gray-500">{uploadedFiles.length} items</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectImage(file)}
                    >
                      <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={formatImageUrl(file)}
                          alt={file.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium truncate">{file.name || 'Image'}</p>
                        <p className="text-xs text-gray-500">
                          {file.width && file.height ? `${file.width}×${file.height}` : ''}
                          {file.size ? ` • ${Math.round(parseInt(file.size) / 1024)}KB` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {uploadedFiles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No images found in your library</p>
                    <button
                      type="button"
                      className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                      onClick={() => setActiveTab(0)}
                    >
                      Upload an Image
                    </button>
                  </div>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white p-3 h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Pixabay Images</h3>
                  <p className="text-sm text-gray-500">Royalty-free images</p>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-grow rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePixabaySearch()}
                  />
                  <button
                    type="button"
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                    onClick={handlePixabaySearch}
                  >
                    Search
                  </button>
                </div>
                
                {pixabayImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pixabayImages.map((image, index) => (
                      <div
                        key={index}
                        className="border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleSelectImage(image)}
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={formatImageUrl(image)}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{image.caption || 'Pixabay Image'}</p>
                          <p className="text-xs text-gray-500">
                            {image.width && image.height ? `${image.width}×${image.height}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchQuery.trim() ? 'No results found. Try a different search term.' : 'Search for images to display results'}
                    </p>
                  </div>
                )}
              </div>
            </Tab.Panel>
            
            <Tab.Panel className="rounded-xl bg-white p-3 h-full">
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Image URL</h3>
                </div>
                
                <form onSubmit={handleURLSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Enter image URL
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a direct link to an image file (JPG, PNG, GIF, SVG)
                    </p>
                  </div>
                  
                  {imageURL && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        <img
                          src={imageURL}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/300?text=Error';
                            e.currentTarget.alt = 'Error loading image';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                    >
                      Add Image
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        **/}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}