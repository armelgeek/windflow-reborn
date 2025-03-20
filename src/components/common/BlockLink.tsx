'use client';

import { useState, useEffect } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { Icon } from '@iconify/react';

interface BlockLinkProps {
  onClose?: () => void;
}

export default function BlockLink({ onClose }: BlockLinkProps) {
  const { state: editorState, dispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  
  const [linkType, setLinkType] = useState<string>('external');
  const [url, setUrl] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [anchor, setAnchor] = useState<string>('');
  const [target, setTarget] = useState<string>('_self');
  const [title, setTitle] = useState<string>('');
  const [download, setDownload] = useState<boolean>(false);
  
  useEffect(() => {
    if (editorState.current) {
      // Initialize form values from the current element
      if (editorState.current.link) {
        const link = editorState.current.link;
        
        // Determine link type
        if (link.startsWith('mailto:')) {
          setLinkType('email');
          const emailParts = link.replace('mailto:', '').split('?subject=');
          setEmail(emailParts[0] || '');
          setEmailSubject(emailParts[1] || '');
        } else if (link.startsWith('tel:')) {
          setLinkType('phone');
          setTel(link.replace('tel:', ''));
        } else if (link.startsWith('#')) {
          setLinkType('anchor');
          setAnchor(link.substring(1));
        } else {
          setLinkType('external');
          setUrl(link);
        }
      }
      
      // Get target attribute
      if (editorState.current.data?.attributes?.target) {
        setTarget(editorState.current.data.attributes.target as string);
      }
      
      // Get title attribute
      if (editorState.current.data?.attributes?.title) {
        setTitle(editorState.current.data.attributes.title as string);
      }
      
      // Get download attribute
      if (editorState.current.data?.attributes?.download !== undefined) {
        setDownload(true);
      }
    }
  }, [editorState.current]);
  
  const applyLink = () => {
    if (!editorState.current) {
      notificationActions.showNotification(
        notificationDispatch,
        'No element selected',
        'error'
      );
      return;
    }
    
    try {
      const element = { ...editorState.current };
      
      // Set link based on type
      switch (linkType) {
        case 'external':
          element.link = url;
          break;
        case 'email':
          element.link = `mailto:${email}${emailSubject ? `?subject=${emailSubject}` : ''}`;
          break;
        case 'phone':
          element.link = `tel:${tel}`;
          break;
        case 'anchor':
          element.link = `#${anchor}`;
          break;
        default:
          element.link = url;
      }
      
      // Initialize attributes object if it doesn't exist
      if (!element.data) {
        element.data = {};
      }
      
      if (!element.data.attributes) {
        element.data.attributes = {};
      }
      
      // Set attributes
      if (title) {
        element.data.attributes.title = title;
      }
      
      if (target !== '_self') {
        element.data.attributes.target = target;
      } else {
        delete element.data.attributes.target;
      }
      
      if (download) {
        element.data.attributes.download = '';
      } else {
        delete element.data.attributes.download;
      }
      
      // Update element in editor state
      editorActions.setCurrent(dispatch, element);
      
      notificationActions.showNotification(
        notificationDispatch,
        'Link updated successfully',
        'success'
      );
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error applying link:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error applying link',
        'error'
      );
    }
  };
  
  const removeLink = () => {
    if (!editorState.current) return;
    
    try {
      const element = { ...editorState.current };
      
      // Remove link
      element.link = '';
      
      // Remove related attributes
      if (element.data?.attributes) {
        delete element.data.attributes.target;
        delete element.data.attributes.title;
        delete element.data.attributes.download;
      }
      
      // Update element in editor state
      editorActions.setCurrent(dispatch, element);
      
      notificationActions.showNotification(
        notificationDispatch,
        'Link removed',
        'success'
      );
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error removing link:', error);
      notificationActions.showNotification(
        notificationDispatch,
        'Error removing link',
        'error'
      );
    }
  };
  
  return (
    <div className="w-full p-4">
      <div className="mb-4 flex items-center">
        <Icon icon="mdi:link-variant" className="mr-2 text-xl" />
        <h2 className="text-lg font-semibold">Link Settings</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-4 flex border-b">
        <button 
          className={`px-4 py-2 ${linkType === 'external' ? 'border-b-2 border-purple-500 -mb-px font-medium' : 'text-gray-500'}`}
          onClick={() => setLinkType('external')}
        >
          URL
        </button>
        <button 
          className={`px-4 py-2 ${linkType === 'email' ? 'border-b-2 border-purple-500 -mb-px font-medium' : 'text-gray-500'}`}
          onClick={() => setLinkType('email')}
        >
          Email
        </button>
        <button 
          className={`px-4 py-2 ${linkType === 'phone' ? 'border-b-2 border-purple-500 -mb-px font-medium' : 'text-gray-500'}`}
          onClick={() => setLinkType('phone')}
        >
          Phone
        </button>
        <button 
          className={`px-4 py-2 ${linkType === 'anchor' ? 'border-b-2 border-purple-500 -mb-px font-medium' : 'text-gray-500'}`}
          onClick={() => setLinkType('anchor')}
        >
          Anchor
        </button>
      </div>
      
      {/* External URL Tab */}
      {linkType === 'external' && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">URL</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}
      
      {/* Email Tab */}
      {linkType === 'email' && (
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Subject (optional)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* Phone Tab */}
      {linkType === 'phone' && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Phone Number</label>
          <input 
            type="tel" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="+1234567890"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </div>
      )}
      
      {/* Anchor Tab */}
      {linkType === 'anchor' && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Anchor ID (without #)</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="section-1"
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <Icon icon="mdi:information-outline" className="mr-1" />
            Links to an element with the ID on the page
          </p>
        </div>
      )}
      
      {/* Common Settings */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Link Target</label>
        <select 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="_self">Same window (_self)</option>
          <option value="_blank">New window (_blank)</option>
          <option value="_parent">Parent frame (_parent)</option>
          <option value="_top">Full window (_top)</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Link Title (tooltip)</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Link description"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="mb-6 flex items-center">
        <input 
          type="checkbox" 
          id="download"
          className="w-4 h-4 mr-2"
          checked={download}
          onChange={(e) => setDownload(e.target.checked)}
        />
        <label htmlFor="download" className="text-sm">Download (for file links)</label>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={removeLink}
          disabled={!editorState.current?.link}
        >
          Remove Link
        </button>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={applyLink}
          >
            Apply Link
          </button>
        </div>
      </div>
    </div>
  );
}