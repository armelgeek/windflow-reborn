'use client';

import { useEffect, useState } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { Element } from '@/types/element';
import { motion } from 'framer-motion';
import { 
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Edit,
  Image,
  Link,
  Type,
  Settings,
  Palette,
  LayoutGrid,
  LayoutList,
  MousePointer,
  Plus,
  Code
} from 'lucide-react';

interface BlockFloatingProps {
  coords: {
    top: number;
    left: number;
    width?: number;
    height?: number;
    right?: number;
    bottom?: number;
  };
  scroll: number;
  onClose: () => void;
}

export default function BlockFloating({ coords, scroll, onClose }: BlockFloatingProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const [position, setPosition] = useState({
    top: coords.top - 32, // Position above the element
    left: coords.left,
  });

  // Adjust position if it would go off-screen
  useEffect(() => {
    // Ensure we have access to window
    if (typeof window === 'undefined') return;
    
    const floatingEl = document.getElementById('floating-menu');
    if (!floatingEl) return;
    
    const rect = floatingEl.getBoundingClientRect();
    const newPosition = { ...position };
    
    // Check if the menu would go off the right edge
    if (position.left + rect.width > window.innerWidth) {
      newPosition.left = window.innerWidth - rect.width - 16;
    }
    
    // Check if the menu would go off the left edge
    if (position.left < 0) {
      newPosition.left = 16;
    }
    
    // Update position if needed
    if (newPosition.left !== position.left) {
      setPosition(newPosition);
    }
  }, [position, coords]);

  // Update position when scroll changes
  useEffect(() => {
    setPosition({
      top: coords.top - 32 + scroll,
      left: coords.left,
    });
  }, [coords, scroll]);

  // Group the buttons by function for easier management
  const actionGroups = [
    {
      title: "Layout",
      buttons: [
        {
          icon: <ChevronUp size={16} />,
          title: "Move Up",
          action: () => {
            // Move block up (would need implementation in EditorContext)
            if (state.current) {
              // This would be handled by an action in the editor context
              console.log('Move block up:', state.current.id);
            }
          },
          filter: null,
        },
        {
          icon: <ChevronDown size={16} />,
          title: "Move Down",
          action: () => {
            // Move block down
            if (state.current) {
              console.log('Move block down:', state.current.id);
            }
          },
          filter: null,
        },
        {
          icon: <Copy size={16} />,
          title: "Duplicate",
          action: () => {
            // Duplicate block
            if (state.current) {
              // Clone the current element and add it to the parent's blocks
              console.log('Duplicate block:', state.current.id);
            }
          },
          filter: null,
        },
      ],
    },
    {
      title: "Layout Direction",
      buttons: [
        {
          icon: <LayoutGrid size={16} />,
          title: "Direction Row",
          action: () => {
            // Set flex-row
            if (state.current && state.current.css && state.current.css.container) {
              const container = state.current.css.container
                .replace('flex-col', '')
                .replace('flex-row', '')
                .trim();
              
              // Update the current element with the new container class
              editorActions.updateCurrentElement(dispatch, {
                ...state.current,
                css: {
                  ...state.current.css,
                  container: `${container} flex-row`
                }
              });
            }
          },
          filter: "flex",
        },
        {
          icon: <LayoutList size={16} />,
          title: "Direction Column",
          action: () => {
            // Set flex-col
            if (state.current && state.current.css && state.current.css.container) {
              const container = state.current.css.container
                .replace('flex-col', '')
                .replace('flex-row', '')
                .trim();
              
              // Update the current element with the new container class
              editorActions.updateCurrentElement(dispatch, {
                ...state.current,
                css: {
                  ...state.current.css,
                  container: `${container} flex-col`
                }
              });
            }
          },
          filter: "flex",
        },
      ],
    },
    {
      title: "Content",
      buttons: [
        {
          icon: <Edit size={16} />,
          title: "Edit Content",
          action: () => {
            // Open content editor modal
            modalActions.openModal(
              modalDispatch, 
              'editContent', 
              'Edit Content',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
        {
          icon: <Type size={16} />,
          title: "Typography",
          action: () => {
            // Open typography editor
            modalActions.openModal(
              modalDispatch, 
              'typography', 
              'Typography',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
        {
          icon: <Palette size={16} />,
          title: "Colors",
          action: () => {
            // Open color editor
            modalActions.openModal(
              modalDispatch, 
              'colorEditor', 
              'Colors',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
      ],
    },
    {
      title: "Media",
      buttons: [
        {
          icon: <Image size={16} />,
          title: "Image",
          action: () => {
            // Open image editor
            modalActions.openModal(
              modalDispatch, 
              'media', 
              'Media Browser',
              'w-3/4',
              { element: state.current }
            );
          },
          filter: null,
        },
        {
          icon: <Link size={16} />,
          title: "Link",
          action: () => {
            // Open link editor
            modalActions.openModal(
              modalDispatch, 
              'linkEditor', 
              'Link',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
      ],
    },
    {
      title: "Advanced",
      buttons: [
        {
          icon: <Settings size={16} />,
          title: "Settings",
          action: () => {
            // Open settings
            modalActions.openModal(
              modalDispatch, 
              'elementSettings', 
              'Element Settings',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
        {
          icon: <Code size={16} />,
          title: "CSS",
          action: () => {
            // Open CSS editor
            modalActions.openModal(
              modalDispatch, 
              'cssEditor', 
              'CSS Editor',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: null,
        },
        {
          icon: <Plus size={16} />,
          title: "Add Elements",
          action: () => {
            // Open elements sidebar
            modalActions.openModal(
              modalDispatch, 
              'addElement', 
              'Add Element',
              'w-1/2',
              { element: state.current }
            );
          },
          filter: "container",
        },
      ],
    },
    {
      title: "Danger",
      buttons: [
        {
          icon: <Trash2 size={16} />,
          title: "Delete",
          action: () => {
            // Delete element
            if (state.current) {
              // This would be handled by an action in the editor context
              if (confirm('Are you sure you want to delete this element?')) {
                // Remove element
                console.log('Delete element:', state.current.id);
                // Close floating menu after deletion
                onClose();
              }
            }
          },
          filter: null,
        },
      ],
    },
  ];

  // If no element is selected, don't show the menu
  if (!state.current) {
    return null;
  }

  return (
    <motion.div
      id="floating-menu"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 bg-gray-800 text-white rounded shadow-lg px-2 py-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center space-x-1">
        {/* Element type label */}
        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">
          {state.current.element}{state.current.tag ? `/${state.current.tag}` : ''}
        </div>
        
        {/* Action buttons */}
        {actionGroups.map((group) => (
          <div key={group.title} className="flex items-center space-x-1">
            {group.buttons
              .filter(btn => {
                if (!btn.filter) return true;
                if (state.current?.tag === btn.filter) return true;
                if (state.current?.element === btn.filter) return true;
                if (state.current?.type === btn.filter) return true;
                return false;
              })
              .map((btn, i) => (
                <button
                  key={`${group.title}_${i}`}
                  className="p-1 hover:bg-gray-700 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    btn.action();
                  }}
                  title={btn.title}
                >
                  {btn.icon}
                </button>
              ))}
            
            {/* Divider except for last group */}
            {group.title !== "Danger" && (
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
            )}
          </div>
        ))}
        
        {/* Close button */}
        <button
          className="p-1 hover:bg-gray-700 rounded ml-1"
          onClick={onClose}
          title="Close Menu"
        >
          <MousePointer size={16} />
        </button>
      </div>
    </motion.div>
  );
}