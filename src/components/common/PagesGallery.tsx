'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@/context/EditorContext';
import { useDesktop } from '@/context/DesktopContext';
import { useModal } from '@/context/ModalContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Template } from '@/types/template';

type PagesGalleryProps = {
  dbMode?: boolean;
};

export default function PagesGallery({ dbMode = true }: PagesGalleryProps) {
  const router = useRouter();
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
  const { dispatch: modalDispatch } = useModal();
  
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState(false);
  const [kit, setKit] = useState<any>(false);
  const [galleryID, setGalleryID] = useState<string>('');

  // Get categories from settings
  const categories = editorState.settings?.categories?.sort() || [];

  // Effect for category change
  useEffect(() => {
    if (dbMode) {
      desktopDispatch({ type: 'SET_GALLERY_FILTER', payload: category });
      setSkip(0);
      getPages(category.toLowerCase(), limit, skip);
    }
  }, [category, dbMode]);

  // Effect for skip change
  useEffect(() => {
    if (dbMode) {
      getPages(category.toLowerCase(), limit, skip);
    }
  }, [skip, dbMode]);

  // Effect for desktop library change
  useEffect(() => {
    if (desktopState.library) {
      setGalleryID(generateRandomId());
      importUIKit();
    }
  }, [desktopState.library]);

  // Get image info for display
  const getImageInfo = (image: any) => {
    if (!image) return '';
    
    try {
      const img = new Image();
      img.src = image;
      
      const ratio = img.naturalWidth / img.naturalHeight;
      return ratio < 1
        ? 'object-cover object-top h-60'
        : ratio > 2
        ? 'h-20 object-contain'
        : 'h-80 object-contain';
    } catch (error) {
      return 'h-60 object-cover';
    }
  };

  // Format image URL
  const imagePage = (page: Template) => {
    if (page.image) {
      return page.image;
    }
    return '/images/no-image.png';
  };

  // Open page in editor
  const openPage = (page: Template) => {
    if (!router.pathname?.includes('mode')) {
      editorDispatch({ type: 'SET_PAGE', payload: page });
      editorDispatch({ type: 'SET_DOCUMENT', payload: page.json.blocks });
    } else {
      if (!editorState.current) {
        // Show notification
        return;
      }
      const importedBlock = page.json.blocks;
      editorState.current.blocks.push(importedBlock);
    }
    
    desktopDispatch({
      type: 'ADD_TAB',
      payload: {
        label: page.name,
        object: page,
        type: 'editor'
      }
    });
    
    // Close dialog
    modalDispatch({ type: 'CLOSE_MODAL' });
  };

  // Preview page
  const previewPage = (page: Template) => {
    editorDispatch({ type: 'SET_PAGE', payload: page });
    editorDispatch({ type: 'SET_DOCUMENT', payload: page.json.blocks });
    
    // Save to localStorage for preview
    localStorage.setItem('whoobe-preview', JSON.stringify(page));
    
    // Open preview dialog
    modalDispatch({
      type: 'OPEN_MODAL',
      payload: {
        component: 'pagePreview',
        title: 'Preview',
        width: 'w-full h-screen',
        options: { mode: 'fullscreen' }
      }
    });
  };

  // Fetch pages from database
  const getPages = async (category = '', limit = 10, skip = 0) => {
    try {
      const response = await fetch(`/api/pages?category=${category}&limit=${limit}&skip=${skip}`);
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  // Search pages
  const searchPages = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (search) {
        // Search API
        fetch(`/api/pages/search?q=${search}`)
          .then(res => res.json())
          .then(data => {
            setPages(data);
            setTotal(data.length);
            setFilter(true);
          });
      } else {
        setSkip(0);
        setFilter(false);
        getPages();
      }
      setKit(false);
    }
  };

  // Import UI Kit
  const importUIKit = () => {
    const kit = desktopState.library;
    if (kit && kit.templates) {
      setPages([...kit.templates]);
      setTotal(kit.templates.length);
      setFilter(false);
      setKit(desktopState.library);
    }
  };

  // Import Database
  const importDB = () => {
    const confirm = window.confirm('Importing will be overwrite the current database. Continue?');
    if (confirm) {
      modalDispatch({
        type: 'OPEN_MODAL',
        payload: {
          component: 'importDatabase',
          title: 'Import Database'
        }
      });
    }
  };
    const generateRandomID = () => {
        return Math.random().toString(36).substring(2, 9);
    };

  // Initialize component
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/pages/count');
        const count = await response.json();
        setTotal(count);
      } catch (error) {
        console.error('Error fetching count:', error);
      }
    };

    fetchCount();

    if (desktopState.galleryFilter) {
      setCategory(desktopState.galleryFilter);
    }

    if (dbMode) {
      getPages(category, limit, skip);
    } else {
      if (desktopState.library && desktopState.library.templates?.length) {
        setPages(desktopState.library.templates);
      } else {
        modalDispatch({
          type: 'OPEN_MODAL',
          payload: {
            component: 'createUIKit',
            title: 'Create UI Kit'
          }
        });
      }
    }

    setGalleryID(generateRandomId());
  }, [dbMode]);

  // Is this a UI Kit
  const isUIKit = () => {
    if (desktopState.library) {
      setKit(desktopState.library);
    }
    return desktopState.tabs[desktopState.currentTab]?.label === 'UI Kit';
  };

  return (
    <div className="absolute inset-0 mt-20 pb-24 min-h-screen flex flex-row flex-wrap px-6 items-center justify-center cursor-pointer overflow-y-auto max-h-screen z-highest transition-all duration-500">
      {pages?.map((page, index) => (
        <div 
          key={`${galleryID}-${index}-${skip}`} 
          className="relative shadow mx-6 my-4 rounded border-t-8 border-gray-500" 
          title={page.name}
        >
          <div className="flex flex-col items-center justify-center w-80 h-80" title={page.name}>
            {page.image && (
              <img 
                src={imagePage(page)} 
                className={`w-full ${getImageInfo(page.image)}`}
                alt={page.name}
              />
            )}
          </div>
          
          <div className="w-full absolute bottom-0 p-1 bg-gray-200 text-black mt-1">
            {page.name}
          </div>
          
          <div className="absolute inset-0 opacity-0 bg-white hover:bg-opacity-50 hover:opacity-100 flex flex-row items-center justify-around">
            <button 
              className="btn btn-purple hover:bg-purple-300 rounded border-0 w-24"
              onClick={() => openPage(page)}
            >
              Edit
            </button>
            
            <button 
              className="btn btn-purple hover:bg-purple-300 rounded border-0 w-24"
              onClick={() => previewPage(page)}
            >
              Preview
            </button>
          </div>
        </div>
      ))}
      
      <ChevronLeft 
        className="fixed mt-8 top-1/2 left-0 text-6xl cursor-pointer"
        onClick={() => skip > 0 ? setSkip(skip - limit) : null}
      />
      
      <ChevronRight 
        className="fixed mt-8 top-1/2 right-0 text-6xl cursor-pointer"
        onClick={() => (skip + limit) < total ? setSkip(skip + limit) : null}
      />
    </div>
  );
}