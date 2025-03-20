'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { Icon } from '@iconify/react';
import BlockContainerPrvw from '@/components/blocks/BlockContainer';
//import { beautifyHTML } from '@/lib/html';
import { Element } from '@/types/element';
import { findElements } from '@/lib/findElements';

interface BlockWindowPreviewProps {
  options?: {
    mode?: 'fullscreen' | 'tablet' | 'smartphone';
  };
  onClose?: () => void;
}

export default function BlockWindowPreview({ options, onClose }: BlockWindowPreviewProps) {
  const router = useRouter();
  const { state: editorState, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [doc, setDoc] = useState<Element | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'fullscreen' | 'tablet' | 'smartphone'>(
    options?.mode || 'fullscreen'
  );
  const [orientation, setOrientation] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [customZoom, setCustomZoom] = useState<number>(0.5);
  const [currentSize, setCurrentSize] = useState<string | null>(null);
  const [htmlSource, setHtmlSource] = useState<string | null>(null);
  const [srcdoc, setSrcdoc] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Load document from editor state
  useEffect(() => {
    setDoc(editorState.document);
  }, [editorState.document]);
  
  // Set preview mode in editor state
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'SET_PREVIEW', payload: true });
    }
    
    // Set initial zoom based on screen size
    if (typeof window !== 'undefined') {
      setCustomZoom(window.innerHeight < 1024 ? 0.5 : 1);
    }
    
    // Cleanup function
    return () => {
      if (dispatch) {
        dispatch({ type: 'SET_PREVIEW', payload: false });
      }
    };
  }, [dispatch]);
  
  // Handle ESC key to close preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Update current size display based on mode and orientation
  useEffect(() => {
    if (mode === 'smartphone') {
      setCurrentSize(orientation ? '800x375' : '375x800');
    } else if (mode === 'tablet') {
      const width = parseInt((orientation ? 1024 : 1366) * customZoom + '');
      const height = parseInt((orientation ? 1366 : 1024) * customZoom + '');
      setCurrentSize(`${width}x${height}`);
    }
  }, [mode, orientation, customZoom]);
  
  // Generate iframe HTML
  useEffect(() => {
    if (contentRef.current && mode !== 'fullscreen') {
      try {
        // Material Icons
        const mi = '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">\n';
        
        // Google Fonts
        const fonts = findElements(editorState.document, '$..blocks..font') || [];
        const uniqueFonts = Array.from(new Set(fonts.filter(a => a)));
        const fontsLink = uniqueFonts.length 
          ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${uniqueFonts.join('|')}">`
          : '';
        
        // Tailwind CSS
        const tw = '<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">\n';
        
        // Alpine JS
        const ajs = `<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"><\/script>`;
        
        // Preview CSS
        const previewCss = '<link href="preview.css" rel="stylesheet">';
        
        // Get HTML content
        const html = contentRef.current.outerHTML;
        
        // Clean and beautify HTML
        const beautifiedHtml = beautifyHTML(html.replace('<!---->', '').replace('[object Object]', ''));
        
        // Set full HTML document
        const fullHtml = mi + tw + '\n' + fontsLink + '\n' + previewCss + '\n' + beautifiedHtml + '\n' + ajs;
        
        setSrcdoc(fullHtml);
      } catch (err) {
        console.error('Preview mode error in creating source', err);
      }
    }
  }, [contentRef.current, mode, editorState.document]);
  
  // Set iframe content when srcdoc is ready
  useEffect(() => {
    if (previewFrameRef.current && srcdoc) {
      previewFrameRef.current.srcdoc = srcdoc;
    }
  }, [srcdoc, previewFrameRef.current]);
  
  // Open page in editor
  const openPage = () => {
    if (dispatch) {
      dispatch({ type: 'SET_PREVIEW', payload: false });
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  // View HTML source
  const viewHTML = () => {
    if (!contentRef.current) return;
    
    // Material Icons link
    const mi = '<!--Material-icons-->\n<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">\n';
    
    // Google Fonts link
    const fonts = findElements(editorState.document, '$..blocks..font') || [];
    const uniqueFonts = Array.from(new Set(fonts.filter(a => a)));
    const fontsLink = uniqueFonts.length 
      ? `<!--Google Fonts-->\n<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=${uniqueFonts.join('|')}">` 
      : '';
    
    // Get HTML content
    const html = contentRef.current.outerHTML;
    
    // Clean and beautify HTML
    const beautifiedHtml = beautifyHTML(html.replace('<!---->', '').replace('[object Object]', ''));
    
    // Set HTML source
    const source = mi + fontsLink + '\n' + beautifiedHtml;
    
    // Open HTML source dialog
    modalActions.openModal(
      modalDispatch,
      'jsEditor',
      'HTML Source',
      'w-3/4',
      { lang: 'html', content: source }
    );
  };
  
  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Build page
  const buildPage = () => {
    if (!contentRef.current) return;
    
    // Get HTML content
    const html = contentRef.current.outerHTML;
    
    // Clean and beautify HTML
    const beautifiedHtml = beautifyHTML(html.replace('<!---->', '').replace('[object Object]', ''));
    
    // Export build (would need to implement exportBuild function)
    if (typeof window !== 'undefined' && window.$exportBuild) {
      window.$exportBuild(beautifiedHtml);
    } else {
      // Alternative approach using downloadjs or similar
      const blob = new Blob([beautifiedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'page.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  // Page settings
  const pageSettings = () => {
    modalActions.openModal(
      modalDispatch,
      'blockSettings',
      'Page Settings'
    );
  };
  
  // Take screenshot
  const takeScreenshot = async () => {
    if (!contentRef.current) return;
    
    try {
      // This would need to be implemented with html2canvas or a similar library
      if (typeof window !== 'undefined' && window.$html2canvas) {
        const options = { type: "dataURL", useCORS: true, scale: 0.50 };
        const screenshot = await window.$html2canvas(contentRef.current, options);
        
        if (screenshot && editorState.page && dispatch) {
          const updatedPage = { ...editorState.page, image: screenshot };
          dispatch({ type: 'SET_PAGE', payload: updatedPage });
          
          // Save page
          if (window.$savePage) {
            await window.$savePage();
          }
          
          notificationActions.showNotification(
            notificationDispatch,
            'Screenshot saved',
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error taking screenshot',
        'error'
      );
    }
  };
  
  // Get iframe style based on mode and orientation
  const getPreviewFrameStyle = () => {
    if (mode === 'smartphone') {
      return orientation 
        ? { width: '800px', height: '375px' }
        : { width: '375px', height: '80vh' };
    } else if (mode === 'tablet') {
      return orientation 
        ? { width: `${1024 * customZoom}px`, height: `${1366 * customZoom}px` }
        : { width: `${1366 * customZoom}px`, height: `${1024 * customZoom}px` };
    }
    return {};
  };
  
  if (!doc) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No document available for preview</p>
      </div>
    );
  }
  
  return (
    <div className="w-screen" onContextMenu={handleContextMenu}>
      {/* Header Bar */}
      <div className="absolute top-0 left-0 h-10 w-full flex items-center justify-center text-gray-300 pr-8 cursor-pointer">
        <Icon 
          icon="mi:edit" 
          className="text-2xl mr-4" 
          onClick={openPage} 
          title="Edit"
        />
        <Icon 
          icon="dashicons:html" 
          className="text-2xl mr-4" 
          onClick={viewHTML} 
          title="HTML source"
        />
        <Icon 
          icon="mi:laptop" 
          className="text-2xl mr-4" 
          onClick={() => setMode('fullscreen')} 
          title="fullscreen"
        />
        <Icon 
          icon="mi:tablet" 
          className="text-2xl mr-4" 
          onClick={() => setMode('tablet')} 
          title="tablet"
        />
        <Icon 
          icon="mi:smartphone" 
          className="text-2xl mr-4" 
          onClick={() => setMode('smartphone')} 
          title="smartphone"
        />
        {mode !== 'fullscreen' && (
          <Icon 
            icon="mi:flip_camera_android" 
            className="text-2xl mr-4" 
            onClick={() => setOrientation(!orientation)} 
            title="Change orientation"
          />
        )}
        
        {mode === 'tablet' && (
          <div className="flex mx-2">
            <button 
              className="w-4 h-4 flex items-center text-xl justify-center rounded-l-lg bg-blue-400"
              onClick={() => setCustomZoom(prev => (prev > 0.1 ? prev - 0.1 : prev))}
            >
              -
            </button>
            <div className="h-4 w-10 bg-white text-black flex items-center justify-center">
              zoom
            </div>
            <button 
              className="w-4 h-4 flex items-center text-xl justify-center rounded-r-lg bg-blue-400"
              onClick={() => setCustomZoom(prev => (prev < 1.1 ? prev + 0.1 : prev))}
            >
              +
            </button>
          </div>
        )}
        
        {mode !== 'fullscreen' && currentSize && (
          <div>{currentSize}</div>
        )}
      </div>
      
      {/* Fullscreen Preview */}
      <div 
        className={`flex flex-col overflow-y-auto overflow-x-hidden absolute inset-0 mt-10 laptop-view ${
          mode === 'fullscreen' ? '' : 'hidden'
        }`}
      >
        {doc && (
          <BlockContainerPrvw
            doc={doc}
            key={doc.id}
            ref={contentRef}
            id="content"
          />
        )}
      </div>
      
      {/* Responsive Preview (Tablet/Smartphone) */}
      <div 
        className={`${mode === 'fullscreen' ? 'hidden' : ''} text-center text-gray-300`}
      >
        <iframe 
          ref={previewFrameRef}
          style={getPreviewFrameStyle()}
          id="previewFrame"
          className="m-auto border-8 overflow-x-hidden border-black rounded-xl"
        />
      </div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed z-50 shadow bg-white absolute flex flex-col w-64 cursor-pointer"
          style={{ 
            top: contextMenuPosition.y + 'px', 
            left: contextMenuPosition.x + 'px' 
          }}
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <div 
            className="p-1 text-white bg-gray-800 flex items-center" 
            onClick={() => setShowContextMenu(false)}
          >
            Options
            <div className="absolute right-0 mr-1 flex items-center">
              <Icon icon="mi:close" onClick={() => setShowContextMenu(false)} />
            </div>
          </div>
          
          <div 
            className="p-1 hover:bg-gray-200 flex items-center" 
            onClick={takeScreenshot}
          >
            Save
            <div className="absolute right-0 flex items-center pr-1">
              <Icon icon="mi:save" />
            </div>
          </div>
          
          <div 
            className="p-1 hover:bg-gray-200 flex items-center" 
            onClick={pageSettings}
          >
            Page settings
            <div className="absolute right-0 flex items-center pr-1">
              <Icon icon="mi:settings" />
            </div>
          </div>
          
          <div 
            className="p-1 hover:bg-gray-200 flex items-center" 
            onClick={viewHTML}
          >
            HTML
            <div className="absolute right-0 flex items-center pr-1">
              <Icon icon="mi:code" />
            </div>
          </div>
          
          <div 
            className="p-1 hover:bg-gray-200 flex items-center" 
            onClick={buildPage}
          >
            Build Page
            <div className="absolute right-0 flex items-center pr-1">
              <Icon icon="mi:build" />
            </div>
          </div>
        </div>
      )}
      
      {/* SVG Preview */}
      {svgString && (
        <div>
          <img src={svgString} alt="SVG Preview" />
        </div>
      )}
    </div>
  );
}