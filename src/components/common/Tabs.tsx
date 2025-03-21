'use client';

import { useState, useEffect } from 'react';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { 
  RiCloseLine, 
  RiMenu2Line, 
  RiAddLine, 
  RiLayoutGridLine, 
  RiSaveLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface TabsProps {
  className?: string;
}

export default function Tabs({ className = '' }: TabsProps) {
  const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  const router = useRouter();
  
  // State for tabs that don't fit in the viewport
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [tabsContainerWidth, setTabsContainerWidth] = useState(0);
  const [tabsWidth, setTabsWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTab, setDragTab] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState(0);
  
  // A value of false indicates we're not in preview mode
  const isPreview = false;
  
  // Calculate if we need scroll buttons
  useEffect(() => {
    const calculateWidth = () => {
      const container = document.getElementById('tabs-container');
      const tabs = document.getElementById('tabs-scroller');
      
      if (container && tabs) {
        setTabsContainerWidth(container.offsetWidth);
        setTabsWidth(tabs.scrollWidth);
        setShowScrollButtons(tabs.scrollWidth > container.offsetWidth);
      }
    };
    
    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    
    return () => {
      window.removeEventListener('resize', calculateWidth);
    };
  }, [desktopState.tabs]);
  
  // Scroll to active tab when it changes
  useEffect(() => {
    if (desktopState.currentTab !== -1) {
      const tabElement = document.getElementById(`tab-${desktopState.currentTab}`);
      const container = document.getElementById('tabs-scroller');
      
      if (tabElement && container) {
        const tabLeft = tabElement.offsetLeft;
        const tabWidth = tabElement.offsetWidth;
        const containerWidth = container.parentElement?.offsetWidth || 0;
        
        // Scroll to make the tab visible
        if (tabLeft < scrollPosition) {
          // Tab is to the left of visible area
          setScrollPosition(tabLeft);
        } else if (tabLeft + tabWidth > scrollPosition + containerWidth) {
          // Tab is to the right of visible area
          setScrollPosition(tabLeft + tabWidth - containerWidth);
        }
      }
    }
  }, [desktopState.currentTab]);
  
  const handleHomeClick = () => {
    desktopActions.setCurrentTab(desktopDispatch, -1);
    router.push('/');
  };
  
  const openTab = (index: number) => {
    desktopActions.setCurrentTab(desktopDispatch, index);
    
    const tab = desktopState.tabs[index];
    if (tab.type === 'editor') {
      editorActions.setPage(editorDispatch, tab.object);
      editorActions.setDocument(editorDispatch, tab.object.json.blocks);
      
      // Show notification
      notificationActions.showNotification(
        notificationDispatch,
        `Opened "${tab.label}"`,
        'info'
      );
    }
    
    if (tab.type === 'component') {
      desktopActions.setComponent(desktopDispatch, tab.object);
    }
  };
  
  const removeTab = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Show confirmation if tab has unsaved changes
    // (This would require tracking unsaved changes state)
    // For now, we'll just remove the tab
    
    const tabLabel = desktopState.tabs[index].label;
    desktopActions.removeTab(desktopDispatch, index);
    
    // Show notification
    notificationActions.showNotification(
      notificationDispatch,
      `Closed "${tabLabel}"`,
      'info'
    );
  };
  
  const getActiveTabClass = (index: number) => {
    return index === desktopState.currentTab
      ? 'bg-white text-gray-700 border-b-0'
      : 'bg-purple-800 text-white hover:bg-purple-700';
  };
  
  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - 100);
    setScrollPosition(newPosition);
  };
  
  const scrollRight = () => {
    const newPosition = Math.min(tabsWidth - tabsContainerWidth, scrollPosition + 100);
    setScrollPosition(newPosition);
  };
  
  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDragTab(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragTab !== null && dragTab !== index) {
      setDragPosition(index);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragTab !== null && dragPosition !== dragTab) {
      // Reorder the tabs
      const newTabs = [...desktopState.tabs];
      const [draggedTab] = newTabs.splice(dragTab, 1);
      newTabs.splice(dragPosition, 0, draggedTab);
      
      // Update the currentTab index
      let newCurrentTab = desktopState.currentTab;
      if (desktopState.currentTab === dragTab) {
        newCurrentTab = dragPosition;
      } else if (
        (dragTab < desktopState.currentTab && dragPosition >= desktopState.currentTab) ||
        (dragTab > desktopState.currentTab && dragPosition <= desktopState.currentTab)
      ) {
        newCurrentTab = desktopState.currentTab + (dragTab < dragPosition ? -1 : 1);
      }
      
      // Update state
      desktopActions.setTabs(desktopDispatch, newTabs);
      desktopActions.setCurrentTab(desktopDispatch, newCurrentTab);
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragTab(null);
    setDragPosition(0);
  };
  
  const handleCreateNewTab = () => {
    // This would open a dialog to create a new document/component
    notificationActions.showNotification(
      notificationDispatch,
      'Creating new document...',
      'info'
    );
    
    // For now, simulate adding a new tab
    const newTab = {
      label: `New Tab ${desktopState.tabs.length + 1}`,
      type: 'editor',
      object: {
        name: `New Tab ${desktopState.tabs.length + 1}`,
        json: { blocks: {} }
      }
    };
    
    desktopActions.addTab(desktopDispatch, newTab);
    desktopActions.setCurrentTab(desktopDispatch, desktopState.tabs.length);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDragTab(null);
  };
  
  if (!desktopState.tabs || isPreview) return null;
  
  return (
    <div 
      className={`fixed top-0 left-0 h-8 items-center bg-purple-900 w-screen z-30 flex flex-row ${className}`}
    >
      <div className="flex items-center h-8 bg-purple-950 px-1 border-r border-purple-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="h-7 w-7 rounded flex items-center justify-center text-white hover:bg-purple-800"
          onClick={handleHomeClick}
          title="Dashboard"
        >
          <RiMenu2Line size={18} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="ml-1 h-7 w-7 rounded flex items-center justify-center text-white hover:bg-purple-800"
          onClick={handleCreateNewTab}
          title="New Document"
        >
          <RiAddLine size={18} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="ml-1 h-7 w-7 rounded flex items-center justify-center text-white hover:bg-purple-800"
          onClick={() => {
            // This would save the current document
            notificationActions.showNotification(
              notificationDispatch,
              'Document saved successfully',
              'success'
            );
          }}
          title="Save Current Document"
        >
          <RiSaveLine size={18} />
        </motion.button>
      </div>
      
      {/* Tabs container with scroll buttons */}
      <div className="relative flex-grow flex items-center overflow-hidden" id="tabs-container">
        {showScrollButtons && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute left-0 z-10 h-7 w-7 rounded bg-purple-900 flex items-center justify-center text-white hover:bg-purple-800 shadow-md ${scrollPosition === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
            title="Scroll Left"
          >
            <RiArrowLeftSLine size={18} />
          </motion.button>
        )}
        
        <div
          id="tabs-scroller"
          className="flex items-center ml-2 mr-2 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <AnimatePresence>
            {desktopState.tabs.map((tab, index) => (
              <motion.div
                key={`tab-${index}`}
                id={`tab-${index}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`relative border-t border-l border-r border-purple-600 rounded-t transition-all px-3 flex items-center cursor-pointer h-7 min-w-32 max-w-40 mx-0.5 ${getActiveTabClass(index)}`}
                title={tab.label}
                onClick={() => openTab(index)}
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  zIndex: isDragging && dragTab === index ? 50 : index === desktopState.currentTab ? 40 : 30
                }}
              >
                {tab.type === 'editor' ? (
                  <RiLayoutGridLine className="mr-1.5 flex-shrink-0" size={14} />
                ) : (
                  <div className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                )}
                
                <span className="truncate text-sm">
                  {tab.label}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-1 rounded-full hover:bg-gray-200 hover:bg-opacity-20 p-0.5"
                  onClick={(e) => removeTab(index, e)}
                  title={`Close ${tab.label}`}
                >
                  <RiCloseLine size={14} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {showScrollButtons && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute right-0 z-10 h-7 w-7 rounded bg-purple-900 flex items-center justify-center text-white hover:bg-purple-800 shadow-md ${scrollPosition >= tabsWidth - tabsContainerWidth ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            onClick={scrollRight}
            disabled={scrollPosition >= tabsWidth - tabsContainerWidth}
            title="Scroll Right"
          >
            <RiArrowRightSLine size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}