// components/modals/LinkBlockModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { Link, ExternalLink, Hash, Mail } from 'lucide-react';

interface LinkBlockModalProps {
  options?: any;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LinkBlockModal({ onClose }: LinkBlockModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  
  const [linkType, setLinkType] = useState<string>('url');
  const [linkValue, setLinkValue] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');
  const [linkTarget, setLinkTarget] = useState<string>('_self');
  const [linkTitle, setLinkTitle] = useState<string>('');
  const [linkRel, setLinkRel] = useState<string>('');
  
  // Initialize state from current element
  useEffect(() => {
    if (state.current) {
      if (state.current.link) {
        // Determine link type
        if (state.current.link.startsWith('http')) {
          setLinkType('url');
          setLinkValue(state.current.link);
        } else if (state.current.link.startsWith('#')) {
          setLinkType('anchor');
          setLinkValue(state.current.link.substring(1));
        } else if (state.current.link.startsWith('mailto:')) {
          setLinkType('email');
          setLinkValue(state.current.link.substring(7));
        } else if (state.current.link.startsWith('tel:')) {
          setLinkType('tel');
          setLinkValue(state.current.link.substring(4));
        } else {
          setLinkType('url');
          setLinkValue(state.current.link);
        }
      }
      
      if (state.current.content) {
        setLinkText(state.current.content);
      }
      
      // Get data attributes if they exist
      if (state.current.data && state.current.data.attributes) {
        if (state.current.data.attributes.target) {
          setLinkTarget(state.current.data.attributes.target as string);
        }
        if (state.current.data.attributes.title) {
          setLinkTitle(state.current.data.attributes.title as string);
        }
        if (state.current.data.attributes.rel) {
          setLinkRel(state.current.data.attributes.rel as string);
        }
      }
    }
  }, [state.current]);
  
  const handleApply = () => {
    if (!state.current) return;
    
    let finalLink = '';
    
    // Format link based on type
    switch (linkType) {
      case 'url':
        // Ensure URL has protocol
        if (linkValue && !linkValue.match(/^https?:\/\//)) {
          finalLink = `https://${linkValue}`;
        } else {
          finalLink = linkValue;
        }
        break;
      case 'anchor':
        finalLink = `#${linkValue}`;
        break;
      case 'email':
        finalLink = `mailto:${linkValue}`;
        break;
      case 'tel':
        finalLink = `tel:${linkValue}`;
        break;
      default:
        finalLink = linkValue;
    }
    
    // Prepare data attributes
    const attributes: Record<string, string> = {};
    if (linkTarget) attributes.target = linkTarget;
    if (linkTitle) attributes.title = linkTitle;
    if (linkRel) attributes.rel = linkRel;
    
    // Update element
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...state.current,
        link: finalLink,
        ...(linkText ? { content: linkText } : {}),
        data: {
          ...state.current.data,
          attributes: {
            ...state.current.data?.attributes,
            ...attributes
          }
        }
      }
    });
    
    notificationActions.showNotification(
      notifyDispatch,
      'Link applied successfully',
      'success'
    );
    
    onClose();
  };
  
  const handleRemoveLink = () => {
    if (!state.current) return;
    
    // Remove link and related attributes
    const updatedData = { ...state.current.data };
    if (updatedData.attributes) {
      delete updatedData.attributes.target;
      delete updatedData.attributes.title;
      delete updatedData.attributes.rel;
    }
    
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...state.current,
        link: '',
        data: updatedData
      }
    });
    
    notificationActions.showNotification(
      notifyDispatch,
      'Link removed',
      'success'
    );
    
    onClose();
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
        <h3 className="text-lg font-medium text-gray-900">Link Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure link properties for the selected element.
        </p>
      </div>
      
      {/**<Tab.Group selectedIndex={['url', 'anchor', 'email', 'tel'].indexOf(linkType)} onChange={(index) => setLinkType(['url', 'anchor', 'email', 'tel'][index])}>
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
            <div className="flex items-center justify-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>URL</span>
            </div>
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
            <div className="flex items-center justify-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Anchor</span>
            </div>
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
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
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
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Phone</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    https://
                  </span>
                  <input
                    type="text"
                    id="url-input"
                    className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="example.com"
                    value={linkValue.replace(/^https?:\/\//, '')}
                    onChange={(e) => setLinkValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <label htmlFor="anchor-input" className="block text-sm font-medium text-gray-700">
                  Anchor ID
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    #
                  </span>
                  <input
                    type="text"
                    id="anchor-input"
                    className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="section-id"
                    value={linkValue.replace(/^#/, '')}
                    onChange={(e) => setLinkValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    mailto:
                  </span>
                  <input
                    type="email"
                    id="email-input"
                    className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="example@email.com"
                    value={linkValue.replace(/^mailto:/, '')}
                    onChange={(e) => setLinkValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="space-y-4">
              <div>
                <label htmlFor="tel-input" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    tel:
                  </span>
                  <input
                    type="tel"
                    id="tel-input"
                    className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="+1234567890"
                    value={linkValue.replace(/^tel:/, '')}
                    onChange={(e) => setLinkValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      */}
      <div className="mt-6 space-y-4 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700">Advanced Settings</h4>
        
        {/* Link Text */}
        {state.current.element === 'a' && (
          <div>
            <label htmlFor="link-text" className="block text-sm font-medium text-gray-700">
              Link Text
            </label>
            <input
              type="text"
              id="link-text"
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>
        )}
        
        {/* Link Target */}
        <div>
          <label htmlFor="link-target" className="block text-sm font-medium text-gray-700">
            Open Link In
          </label>
          <select
            id="link-target"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            value={linkTarget}
            onChange={(e) => setLinkTarget(e.target.value)}
          >
            <option value="_self">Same Window</option>
            <option value="_blank">New Tab/Window</option>
            <option value="_parent">Parent Frame</option>
            <option value="_top">Full Window</option>
          </select>
        </div>
        
        {/* Link Title */}
        <div>
          <label htmlFor="link-title" className="block text-sm font-medium text-gray-700">
            Title (Tooltip)
          </label>
          <input
            type="text"
            id="link-title"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="Hover tooltip text"
          />
        </div>
        
        {/* Link Rel */}
        <div>
          <label htmlFor="link-rel" className="block text-sm font-medium text-gray-700">
            Relationship (rel)
          </label>
          <select
            id="link-rel"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            value={linkRel}
            onChange={(e) => setLinkRel(e.target.value)}
          >
            <option value="">None</option>
            <option value="nofollow">nofollow</option>
            <option value="noreferrer">noreferrer</option>
            <option value="noopener">noopener</option>
            <option value="nofollow noreferrer">nofollow noreferrer</option>
            <option value="nofollow noreferrer noopener">nofollow noreferrer noopener</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Used for SEO and security purposes
          </p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className={`rounded-md px-4 py-2 text-sm font-medium border ${state.current.link ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-gray-300 text-gray-400 cursor-not-allowed'}`}
          onClick={handleRemoveLink}
          disabled={!state.current.link}
        >
          Remove Link
        </button>
        
        <div className="space-x-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${!linkValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleApply}
            disabled={!linkValue.trim()}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}