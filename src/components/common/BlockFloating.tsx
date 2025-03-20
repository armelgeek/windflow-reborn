'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useEditorBus } from '@/context/EditorBusContext';
import { useEventBus } from '@/context/EventContext';
import { Element } from '@/types/element';
import {
  ChevronRight,
  MoveUp,
  Layers,
  LayoutGrid,
  LayoutList,
  FilePlus,
  Edit,
  Image,
  Link,
  Trash2,
  Star,
  Settings,
  Type,
  Palette,
  Download,
  Upload
} from 'lucide-react';

interface BlockFloatingProps {
  coords: {
    top: number;
    left: number;
    right?: number;
    bottom?: number;
    width?: number;
  };
  scroll: number;
  onClose: () => void;
}

export default function BlockFloating({ coords, scroll, onClose }: BlockFloatingProps) {
  const { state } = useEditor();
  const { publish: editorPublish } = useEditorBus();
  const { publish: eventPublish } = useEventBus();
  const [position, setPosition] = useState({
    top: coords.top + scroll,
    left: coords.left,
    right: coords.right || 0,
    bottom: coords.bottom || 0,
    width: coords.width || 0,
    offsetX: 0
  });
  const [currentIcon, setCurrentIcon] = useState('');
  const [inner, setInner] = useState(window.innerWidth);

  // Array of action icons
  const icons = [
    { icon: <Edit />, title: 'Edit content', action: 'BlockEditContent', filter: null },
    { icon: <Star />, title: 'Icon', action: 'BlockIconFinder', filter: 'IconifyIcon' },
    { icon: <Settings />, title: 'Attributes', action: 'BlockInput', filter: 'input' },
    { icon: <Settings />, title: 'Attributes', action: 'BlockSelect', filter: 'select' },
    { icon: <Settings />, title: 'Slider settings', action: 'BlockSliderControls', filter: 'slider' },
    { icon: <Settings />, title: 'Attributes', action: 'BlockInput', filter: 'textarea' },
    { icon: <Type />, title: 'Font', action: 'BlockFont' },
    { icon: <Type />, title: 'Heading', action: 'BlockHeading', filter: 'h' },
    { icon: <Palette />, title: 'Text Color', action: 'BlockTextColor', options: { context: 'textcolor' }, filter: null },
    { icon: <Palette />, title: 'Fill Color', action: 'BlockTextColor', options: { context: 'bgcolor' }, filter: null },
    { icon: <Image />, title: 'Image', action: 'BlockImageUrl', filter: null },
    { icon: <Link />, title: 'Link', action: 'BlockLink', filter: null },
    { icon: <Download />, title: 'Import block', action: 'BlockImport', filter: 'container' },
    { icon: <Upload />, title: 'Export block', action: 'BlockExport', filter: 'container' }
  ];

  // Check if icon should be shown for current element
  const isIconEnabled = (icon: { filter: string | null }) => {
    if (!state.current) return false;
    
    if (icon.filter === null) return true;
    
    return icon.filter.includes(state.current.element) || 
           icon.filter.includes(state.current.tag) || 
           icon.filter.includes(state.current.element);
  };

  // Get element coordinates
  const getCoords = () => {
    if (!state.current) return;
    
    try {
      const el = document.getElementById(state.current.id);
      if (!el) return;
      
      let coords = el.getBoundingClientRect();
      
      if (coords.left < 0) {
        coords = { ...coords, left: position.left };
      }
      
      if (state.current.type === 'slider') {
        coords = { ...coords, top: coords.top - 60 };
      }
      
      setPosition({
        top: coords.top - 32 + scroll,
        left: coords.left,
        right: coords.right,
        bottom: coords.bottom,
        width: coords.width,
        offsetX: 0
      });
    } catch (err) {
      console.error("Error getting coordinates:", err);
    }
  };

  // Style for positioning the toolbar
  const coordinate = {
    top: `${state.current?.type !== 'slider' ? 
          position.top + scroll : 
          position.top + scroll - 12}px`,
    left: `${position.left}px`
  };

  // Handle click on icons
  const handleIconClick = (icon: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIcon(icon.icon);
    editorPublish('editorAction', icon, e);
  };

  // Handle flex direction actions
  const handleSetFlexRow = () => {
    editorPublish('setFlexRow');
  };

  const handleSetFlexCol = () => {
    editorPublish('setFlexCol');
  };

  // Effect for updating coordinates on sidebar state change
  useEffect(() => {
    const handleSidebar = () => {
      getCoords();
    };
    
    editorPublish('subscribeToEvent', 'isSidebar', handleSidebar);
    editorPublish('subscribeToEvent', 'closeSidebar', handleSidebar);
    
    return () => {
      editorPublish('unsubscribeFromEvent', 'isSidebar', handleSidebar);
      editorPublish('unsubscribeFromEvent', 'closeSidebar', handleSidebar);
    };
  }, []);

  // Effect for initial setup
  useEffect(() => {
    getCoords();
    
    const floatingBar = document.querySelector('[data-floating-bar]');
    if (floatingBar) {
      const barWidth = floatingBar.getBoundingClientRect().width;
      if ((position.left + barWidth + 50) > window.innerWidth) {
        setPosition(prev => ({
          ...prev,
          left: window.innerWidth - barWidth - 50
        }));
      }
    }
  }, []);

  // If no current element selected, return nothing
  if (!state.current || !coords) {
    return null;
  }

  return (
    <div 
      ref={ref => {
        if (ref) ref.setAttribute('data-floating-bar', 'true');
      }}
      className="h-8 flex items-center absolute z-highest justify-center bg-white text-black shadow text-xs px-2 cursor-pointer -mt-10"
      style={coordinate}>
      <small 
        className="chip bg-blue-400 capitalize" 
        onClick={onClose}>
        {state.current.element} {state.current.tag}
      </small>
      
      <div className="flex items-center">
        <button 
          className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
          onClick={() => editorPublish('moveBlock', 1)} 
          title="Move up">
          <MoveUp size={16} />
        </button>
        
        {state.current.type === 'container' && (
          <button 
            className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
            onClick={() => eventPublish('sidebar', 'elements')} 
            title="Add element">
            <Layers size={16} />
          </button>
        )}
        
        {state.current.tag === 'flex' && (
          <>
            <button 
              className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
              onClick={handleSetFlexRow} 
              title="Direction row">
              <LayoutGrid size={16} />
            </button>
            <button 
              className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
              onClick={handleSetFlexCol} 
              title="Direction column">
              <LayoutList size={16} />
            </button>
          </>
        )}
        
        {state.current.semantic === 'form' && (
          <button 
            className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
            onClick={() => editorPublish('editorAction', {
              title: 'Form settings', 
              action: 'BlockForm'
            })} 
            title="Form settings">
            <FilePlus size={16} />
          </button>
        )}
        
        {icons.map((icon, i) => (
          isIconEnabled(icon) && (
            <button 
              key={`icon_${i}`}
              className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
              onClick={(e) => handleIconClick(icon, e)} 
              title={icon.title}>
              {icon.icon}
            </button>
          )
        ))}
        
        <button 
          className="floating-icon text-gray-400 hover:text-purple-600 text-xl" 
          onClick={() => editorPublish('deleteBlock')}
          title="Delete element">
          <Trash2 size={16} />
        </button>
        
        {state.current.gsap.animation && (
          <small 
            className="chip bg-lime-400" 
            onClick={() => eventPublish('sidebar', 'animation')}>
            {state.current.gsap.animation}
          </small>
        )}
      </div>
    </div>
  );
}