import React, { useRef, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { ChevronUp, Copy, Trash, BrushIcon, Image, Download, Upload } from 'lucide-react';
import { PiCassetteTape } from 'react-icons/pi';

interface BlockContextMenuProps {
  position?: { x: number; y: number };
  onClose: () => void;
  parentId?: string;
}

const BlockContextMenu: React.FC<BlockContextMenuProps> = ({ 
  position = { x: 0, y: 0 }, 
  onClose,
  parentId
}) => {
  const { state, dispatch } = useEditor();
  const menuRef = useRef<HTMLDivElement>(null);
  const current = state.current;
  
  // Check if the current element's id matches the parent id
  const isCurrentElement = current && current.id === parentId;
  
  // Handle moving block up
  const handleMoveUp = () => {
    editorActions.moveBlock(dispatch, 1);
    onClose();
  };
  
  // Handle customizing block
  const handleCustomize = () => {
    editorActions.customizeBlock(dispatch);
    onClose();
  };
  
  // Handle copying block
  const handleCopy = () => {
    if (current) {
      editorActions.copyBlock(dispatch, current);
    }
    onClose();
  };
  
  // Handle pasting block
  const handlePaste = () => {
    editorActions.pasteBlock(dispatch);
    onClose();
  };
  
  // Handle deleting block
  const handleDelete = () => {
    editorActions.deleteBlock(dispatch);
    onClose();
  };
  
  // Handle opening media selector
  const handleMedia = () => {
    editorActions.openMedia(dispatch);
    onClose();
  };
  
  // Handle exporting block
  const handleExport = () => {
    editorActions.exportBlock(dispatch);
    onClose();
  };
  
  // Handle importing block
  const handleImport = () => {
    editorActions.importBlock(dispatch);
    onClose();
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // If not the current element, don't show menu
  if (!isCurrentElement) {
    return null;
  }
  
  return (
    <div 
      ref={menuRef}
      className="fixed z-50 shadow bg-white rounded overflow-hidden flex flex-col w-64 cursor-pointer"
      style={{ 
        top: position.y, 
        left: position.x 
      }}
    >
      {/* Menu title */}
      <div className="p-1 bg-gray-800 text-white flex items-center justify-between">
        <span>Options</span>
        <button 
          className="cursor-pointer"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Menu items */}
      <MenuItem 
        icon={<ChevronUp size={16} />}
        text="Move Up"
        shortcut="Alt+↑"
        onClick={handleMoveUp}
      />
      
      <MenuItem 
        icon={<BrushIcon size={16} />}
        text="Customize"
        shortcut="Alt+Z"
        onClick={handleCustomize}
      />
      
      <MenuItem 
        icon={<Copy size={16} />}
        text="Copy"
        shortcut="Alt+C"
        onClick={handleCopy}
      />
      
      <MenuItem 
        icon={<PiCassetteTape size={16} />}
        text="Paste"
        shortcut="Alt+V"
        onClick={handlePaste}
      />
      
      <MenuItem 
        icon={<Trash size={16} />}
        text="Delete"
        shortcut="Alt+R"
        onClick={handleDelete}
      />
      
      <MenuItem 
        icon={<Image size={16} />}
        text="Image/Media"
        onClick={handleMedia}
      />
      
      <div className="w-full border-b my-1"></div>
      
      <MenuItem 
        icon={<Upload size={16} />}
        text="Export as Reusable"
        onClick={handleExport}
      />
      
      <MenuItem 
        icon={<Download size={16} />}
        text="Import Block"
        onClick={handleImport}
      />
    </div>
  );
};

// Helper component for menu items
interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  shortcut?: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, shortcut, onClick }) => (
  <div 
    className="p-1 hover:bg-gray-200 flex items-center"
    onClick={onClick}
  >
    {text}
    <div className="absolute right-0 flex items-center pr-1">
      {shortcut && <span className="mr-2 text-xs text-gray-500">{shortcut}</span>}
      {icon}
    </div>
  </div>
);

export default BlockContextMenu;