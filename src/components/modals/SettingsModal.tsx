'use client';

import { useState, useEffect } from 'react';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { storage } from '@/lib/utils';

interface SettingsModalProps {
  options?: any;
  onClose: () => void;
}

interface AppSettings {
  id: string;
  autosave: boolean;
  autosaveTimeout: number;
  categories: string[];
  defaultFontFamily?: string;
  analytics?: {
    enabled: boolean;
    code?: string;
  };
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>({
    id: '0',
    autosave: false,
    autosaveTimeout: 5,
    categories: ['Lead', 'Landing page', 'Subscribe page', 'Header', 'Footer', 'Hero', 'Homepage', 'Shop', 'Feature'].sort(),
    analytics: {
      enabled: false,
      code: ''
    }
  });
  
  const [newCategory, setNewCategory] = useState('');
  const { dispatch } = useNotification();

  // Load settings on mount
  useEffect(() => {
    const savedSettings = storage.get<AppSettings>('windflow-settings', settings);
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAnalyticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics!,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    if (!settings.categories.includes(newCategory)) {
      setSettings(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory].sort()
      }));
      setNewCategory('');
    } else {
      notificationActions.showNotification(
        dispatch,
        'Category already exists',
        'warning'
      );
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleSave = () => {
    // Save settings to storage
    storage.set('windflow-settings', settings);
    
    notificationActions.showNotification(
      dispatch,
      'Settings saved successfully',
      'success'
    );
    
    onClose();
  };

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <div className="space-y-6">
        {/* Autosave Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Autosave</h3>
          <div className="mt-2 space-y-4">
            <div className="flex items-center">
              <input
                id="autosave"
                name="autosave"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={settings.autosave}
                onChange={handleChange}
              />
              <label htmlFor="autosave" className="ml-3 block text-sm font-medium text-gray-700">
                Enable Autosave
              </label>
            </div>
            
            {settings.autosave && (
              <div>
                <label htmlFor="autosaveTimeout" className="block text-sm font-medium text-gray-700">
                  Autosave Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="autosaveTimeout"
                  name="autosaveTimeout"
                  min="1"
                  max="60"
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={settings.autosaveTimeout}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Categories Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Page Categories</h3>
          <div className="mt-2">
            <div className="flex">
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="block w-full rounded-l-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                placeholder="Add new category..."
              />
              <button
                type="button"
                className="rounded-r-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.categories.map((category) => (
                <div 
                  key={category} 
                  className="inline-flex items-center rounded-full bg-purple-100 py-1 pl-3 pr-1 text-sm font-medium text-purple-700"
                >
                  {category}
                  <button
                    type="button"
                    className="ml-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600 focus:outline-none"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    <span className="sr-only">Remove {category}</span>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Analytics Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
          <div className="mt-2 space-y-4">
            <div className="flex items-center">
              <input
                id="analyticsEnabled"
                name="enabled"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={settings.analytics?.enabled}
                onChange={handleAnalyticsChange}
              />
              <label htmlFor="analyticsEnabled" className="ml-3 block text-sm font-medium text-gray-700">
                Enable Analytics
              </label>
            </div>
            
            {settings.analytics?.enabled && (
              <div>
                <label htmlFor="analyticsCode" className="block text-sm font-medium text-gray-700">
                  Analytics Code
                </label>
                <textarea
                  id="analyticsCode"
                  name="code"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  value={settings.analytics?.code || ''}
                  onChange={(e) => {
                    setSettings(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics!,
                        code: e.target.value
                      }
                    }));
                  }}
                  placeholder="Paste your analytics code here..."
                />
              </div>
            )}
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
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}