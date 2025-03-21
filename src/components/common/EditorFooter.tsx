'use client';

import { useState, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  Copy,
  Trash2,
  HelpCircle,
  ExternalLink,
  FileDown,
  FileUp,
  Package,
  PlusCircle,
  Info,
  Clock,
  ChevronUp,
  Eye
} from 'lucide-react';

interface EditorFooterProps {
  tab?: string;
}

export default function EditorFooter({ tab }: EditorFooterProps) {
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [hasCustomLibrary, setHasCustomLibrary] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  
  // Check if there's a custom library on mount
  useEffect(() => {
    if (desktopState.library) {
      setHasCustomLibrary(true);
    }
  }, [desktopState.library]);
  
  // Handle saving page
  const savePage = async () => {
    setLoading(true);
    
    try {
      // This would call your actual save function
      // For now, just show a notification
      notificationActions.showNotification(
        notificationDispatch,
        'Page saved successfully',
        'success'
      );
    } catch (error) {
      console.error('Error saving page:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error saving page',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Save as
  const saveAs = () => {
    modalActions.openModal(
      modalDispatch,
      'saveAs',
      'Save As New Template'
    );
  };
  
  // Get element type display
  const getElementTypeDisplay = () => {
    if (!editorState.current) return '';
    
    const { element, tag, semantic } = editorState.current;
    
    if (semantic && element && tag && semantic !== element && tag !== element) {
      return `${semantic} / ${element} / ${tag}`;
    }
    
    if (semantic && semantic !== element) {
      return `${semantic} / ${element}`;
    }
    
    if (tag && tag !== element) {
      return `${element} / ${tag}`;
    }
    
    return element;
  };
  
  // Button group component
  const ButtonGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex items-center">
      {title && (
        <span className="text-xs text-gray-500 mr-1.5 hidden sm:inline-block">{title}</span>
      )}
      <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 p-0.5">
        {children}
      </div>
    </div>
  );
  
  // Footer button component
  const FooterButton = ({ 
    icon, 
    title, 
    onClick, 
    highlight = false,
    disabled = false
  }: { 
    icon: React.ReactNode, 
    title: string, 
    onClick: () => void,
    highlight?: boolean,
    disabled?: boolean
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-1.5 py-1 rounded-md flex items-center justify-center transition-colors ${
        highlight 
          ? 'text-purple-600 hover:bg-purple-50' 
          : 'text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {icon}
    </motion.button>
  );
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-md transition-all"
      animate={{ height: expanded ? 'auto' : '40px' }}
    >
      {/* Expand toggle button */}
      <button
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-700"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronUp
          size={14}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div className="h-10 px-2 flex items-center justify-between overflow-x-auto hide-scrollbar">
        {/* Left section */}
        <div className="flex items-center space-x-2">
          <ButtonGroup title="File">
            <FooterButton
              icon={<Save size={16} />}
              title="Save template (Ctrl+S)"
              onClick={savePage}
              highlight={true}
            />
            <FooterButton
              icon={<Copy size={16} />}
              title="Save as new template"
              onClick={saveAs}
            />
            <FooterButton
              icon={<FileDown size={16} />}
              title="Import template"
              onClick={() => modalActions.openModal(modalDispatch, 'importTemplate', 'Import Template')}
            />
            <FooterButton
              icon={<FileUp size={16} />}
              title="Export template"
              onClick={() => modalActions.openModal(modalDispatch, 'exportTemplate', 'Export Template')}
            />
            <FooterButton
              icon={<Trash2 size={16} />}
              title="Delete template"
              onClick={() => modalActions.openModal(
                modalDispatch, 
                'confirmAction', 
                'Delete Template',
                undefined,
                { 
                  message: 'Are you sure you want to delete this template?',
                  action: 'deletePage'
                }
              )}
            />
          </ButtonGroup>
          
          <div className="h-8 border-r border-gray-200 mx-1"></div>
          
          <ButtonGroup title="Kit">
            <FooterButton
              icon={<Package size={16} />}
              title="Manage UI kits"
              onClick={() => modalActions.openModal(modalDispatch, 'manageKits', 'Manage UI Kits')}
            />
            <FooterButton
              icon={<PlusCircle size={16} />}
              title="Add to UI kit"
              onClick={() => modalActions.openModal(modalDispatch, 'addToUIKit', 'Add to UI Kit')}
              disabled={!hasCustomLibrary}
            />
          </ButtonGroup>
          
          {desktopState.library && desktopState.library.name && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
              {desktopState.library.name}
            </span>
          )}
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {editorState.current && (
            <div className="hidden md:flex items-center text-xs text-gray-600 border-r border-gray-200 pr-2 space-x-1">
              <Info size={14} className="text-blue-500" />
              <span className="font-medium">{getElementTypeDisplay()}</span>
              <span className="text-gray-400">#{editorState.current.id.substring(0, 8)}</span>
            </div>
          )}
          
          <ButtonGroup title="">
            <FooterButton
              icon={<Settings size={16} />}
              title="Editor settings"
              onClick={() => modalActions.openModal(modalDispatch, 'settings', 'Settings')}
            />
            <FooterButton
              icon={<HelpCircle size={16} />}
              title="Documentation"
              onClick={() => modalActions.openModal(modalDispatch, 'help', 'Documentation')}
            />
          </ButtonGroup>
          
          <ButtonGroup title="">
            <FooterButton
              icon={<Clock size={16} className={editorState.settings?.autosave ? 'text-green-500' : 'text-gray-400'} />}
              title={`Autosave: ${editorState.settings?.autosave ? 'ON' : 'OFF'}`}
              onClick={() => modalActions.openModal(modalDispatch, 'settings', 'Settings')}
            />
            <FooterButton
              icon={<Eye size={16} />}
              title="Preview template"
              onClick={() => {
                const previewData = editorState.document;
                if (previewData) {
                  localStorage.setItem('whoobe-preview', JSON.stringify(previewData));
                  window.open('/preview', '_blank');
                  
                  notificationActions.showNotification(
                    notificationDispatch,
                    'Preview opened in new tab',
                    'info'
                  );
                }
              }}
              highlight={true}
            />
          </ButtonGroup>
        </div>
      </div>
      
      {/* Expanded section */}
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current element details */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center">
                <Info size={14} className="mr-1" /> Current Element
              </h4>
              {editorState.current ? (
                <div className="bg-gray-50 p-2 rounded border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-mono">{getElementTypeDisplay()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono">{editorState.current.id}</span>
                  </div>
                  {editorState.current.coords && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-mono">
                          {parseInt(editorState.current.coords.width.toString())} x {parseInt(editorState.current.coords.height.toString())}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Position:</span>
                        <span className="font-mono">
                          X: {parseInt(editorState.current.coords.x.toString())} Y: {parseInt(editorState.current.coords.y.toString())}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 italic">No element selected</div>
              )}
            </div>
            
            {/* Page information */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center">
                <Package size={14} className="mr-1" /> Template Information
              </h4>
              {editorState.page ? (
                <div className="bg-gray-50 p-2 rounded border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{editorState.page.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span>{editorState.page.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-xs">{editorState.page.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last Save:</span>
                    <span>{editorState.page.lastSaved ? new Date(editorState.page.lastSaved).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No template loaded</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Notification message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-10 right-4 bg-blue-500 text-white px-3 py-1.5 rounded-t-md shadow-lg flex items-center"
        >
          <Info size={16} className="mr-2" />
          <span>{message}</span>
        </motion.div>
      )}
    </motion.div>
  );
}