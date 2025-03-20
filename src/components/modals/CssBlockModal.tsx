// components/modals/CssBlockModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { cleanCssClasses } from '@/lib/utils';

interface CssBlockModalProps {
  options?: any;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function CssBlockModal({ onClose }: CssBlockModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  
  const [elementCss, setElementCss] = useState<string>('');
  const [containerCss, setContainerCss] = useState<string>('');
  const [inlineStyle, setInlineStyle] = useState<string>('');
  const [mobilePreview, setMobilePreview] = useState<boolean>(false);
  
  // Initialize state from current element
  useEffect(() => {
    if (state.current) {
      setElementCss(state.current.css?.css || '');
      setContainerCss(state.current.css?.container || '');
      setInlineStyle(state.current.style || '');
    }
  }, [state.current]);
  
  // Handle saving CSS changes
  const handleApply = () => {
    if (!state.current) return;
    
    // Clean CSS classes (remove duplicates, empty classes)
    const cleanedElementCss = cleanCssClasses(elementCss);
    const cleanedContainerCss = cleanCssClasses(containerCss);
    
    // Update element in editor state
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...state.current,
        css: {
          css: cleanedElementCss,
          container: cleanedContainerCss
        },
        style: inlineStyle
      }
    });
    
    notificationActions.showNotification(
      notifyDispatch,
      'CSS updated successfully',
      'success'
    );
    
    onClose();
  };
  
  // Copy element CSS to clipboard
  const handleCopyElementCss = () => {
    navigator.clipboard.writeText(elementCss);
    notificationActions.showNotification(
      notifyDispatch,
      'Element CSS copied to clipboard',
      'success'
    );
  };
  
  // Copy container CSS to clipboard
  const handleCopyContainerCss = () => {
    navigator.clipboard.writeText(containerCss);
    notificationActions.showNotification(
      notifyDispatch,
      'Container CSS copied to clipboard',
      'success'
    );
  };
  
  // Copy inline styles to clipboard
  const handleCopyInlineStyle = () => {
    navigator.clipboard.writeText(inlineStyle);
    notificationActions.showNotification(
      notifyDispatch,
      'Inline styles copied to clipboard',
      'success'
    );
  };
  
  // Clear element CSS
  const handleClearElementCss = () => {
    setElementCss('');
  };
  
  // Clear container CSS
  const handleClearContainerCss = () => {
    setContainerCss('');
  };
  
  // Clear inline styles
  const handleClearInlineStyle = () => {
    setInlineStyle('');
  };
  
  if (!state.current) {
    return (
      <div className="p-4 text-center">
        <p>No element selected</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">CSS Editor</h3>
        <p className="mt-1 text-sm text-gray-600">
          Edit CSS classes and inline styles for the selected element.
        </p>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Element:</span>{' '}
          <span className="text-gray-600">{state.current.element || 'Unknown'} {state.current.tag ? `(${state.current.tag})` : ''}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              mobilePreview ? 'bg-gray-200 text-gray-700' : 'bg-purple-600 text-white'
            }`}
            onClick={() => setMobilePreview(false)}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              mobilePreview ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setMobilePreview(true)}
          >
            Mobile
          </button>
        </div>
      </div>
      
      {/**<Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-purple-900/20 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white text-purple-700 shadow'
                  : 'text-purple-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Element CSS
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white text-purple-700 shadow'
                  : 'text-purple-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Container CSS
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white text-purple-700 shadow'
                  : 'text-purple-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Inline Styles
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="element-css" className="block text-sm font-medium text-gray-700">
                  Tailwind CSS Classes
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleCopyElementCss}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleClearElementCss}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <textarea
                  id="element-css"
                  rows={8}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={elementCss}
                  onChange={(e) => setElementCss(e.target.value)}
                  placeholder="Enter Tailwind CSS classes for this element..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for Element CSS</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Use responsive prefixes (sm:, md:, lg:, xl:) for specific screen sizes</li>
                  <li>Add hover: prefix for hover states</li>
                  <li>Use focus: prefix for focus states</li>
                  <li>Separate classes with spaces</li>
                </ul>
              </div>
              
              {mobilePreview && (
                <div className="border-t pt-3 mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Mobile-First Responsive Classes
                  </div>
                  <p className="text-xs text-gray-600">
                    Base classes (without prefixes) apply to all screen sizes, including mobile.
                    Add sm:, md:, lg:, and xl: prefixes to apply styles at specific breakpoints.
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="container-css" className="block text-sm font-medium text-gray-700">
                  Container CSS Classes
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleCopyContainerCss}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleClearContainerCss}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <textarea
                  id="container-css"
                  rows={8}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={containerCss}
                  onChange={(e) => setContainerCss(e.target.value)}
                  placeholder="Enter Tailwind CSS classes for the container..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">About Container CSS</h4>
                <p className="text-xs text-gray-600">
                  Container CSS classes are applied to container elements like grid, flex, or section.
                  These classes control the layout of child elements.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 mt-2">
                  <li>Use flex-row or flex-col for flex direction</li>
                  <li>Use grid-cols-# for grid columns</li>
                  <li>Use gap-# for spacing between items</li>
                  <li>Use justify-# and items-# for alignment</li>
                </ul>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="inline-styles" className="block text-sm font-medium text-gray-700">
                  Inline Styles
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleCopyInlineStyle}
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={handleClearInlineStyle}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <textarea
                  id="inline-styles"
                  rows={8}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={inlineStyle}
                  onChange={(e) => setInlineStyle(e.target.value)}
                  placeholder="Enter inline CSS styles (property: value; format)..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Inline Styles Format</h4>
                <p className="text-xs text-gray-600">
                  Use the format: <code className="bg-gray-200 px-1 py-0.5 rounded">property: value;</code>
                </p>
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700">Example:</p>
                  <pre className="text-xs bg-gray-200 p-2 rounded mt-1">
                    color: red; font-size: 16px; margin-top: 10px;
                  </pre>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Note:</strong> Prefer Tailwind classes when possible. Use inline styles only for specific needs that can't be achieved with Tailwind.
                </p>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      */}
      <div className="mt-6 border rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
        <div className={`p-4 border rounded ${mobilePreview ? 'max-w-xs mx-auto' : 'w-full'}`}>
          <div 
            className={elementCss}
            style={{
              padding: '1rem',
              minHeight: '3rem',
              border: '1px dashed #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(inlineStyle ? Object.fromEntries(
                inlineStyle.split(';')
                  .filter(Boolean)
                  .map(style => {
                    const [key, value] = style.split(':');
                    return [key.trim(), value.trim()];
                  })
              ) : {})
            }}
          >
            <span>{state.current.element || 'Element'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}