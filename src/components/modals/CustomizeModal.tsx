// components/modals/CustomizeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { Tab } from '@headlessui/react';
import TailwindColor from '@/components/blocks/Editor/controls/TailwindColor';
import classes from '@/lib/tailwind-classes';
import twgroups from '@/lib/tw-groups';
import { TailwindGroup } from '@/lib/tw-groups';
import { cleanCssClasses } from '@/lib/utils';

interface CustomizeModalProps {
  options?: any;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Dynamic control component loader
const ControlComponent = ({ name, attr, title, css, icon, group, negative }: {
  name: string;
  attr: string;
  title?: string;
  css?: string;
  icon?: string;
  group?: boolean;
  negative?: boolean;
}) => {
  // Based on name, render appropriate control
  switch (name) {
    case 'Color':
    case 'TailwindColor':
      return <TailwindColor attr={attr} />;
    // Other controls would be imported and used similarly
    default:
      return <div>Control {name} not implemented</div>;
  }
};

export default function CustomizeModal({ onClose }: CustomizeModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  const [categories, setCategories] = useState<TailwindGroup[]>([]);
  const [currentCss, setCurrentCss] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (state.current) {
      // Get the relevant Tailwind groups based on element type
      const elementType = state.current.type || 'element';
      const filteredGroups = twgroups.filter(group => 
        !group.filter || group.filter.includes(elementType)
      );
      
      setCategories(filteredGroups);
      
      // Get current CSS
      setCurrentCss(state.current.css?.css || '');
      
      // Set default selected category
      if (filteredGroups.length > 0) {
        setSelectedCategory(filteredGroups[0].label);
      }
    }
  }, [state.current]);

  const handleCssChange = (css: string) => {
    if (!state.current) return;
    
    // Clean CSS classes (remove duplicates, empty classes)
    const cleanedCss = cleanCssClasses(css);
    
    // Update local state
    setCurrentCss(cleanedCss);
    
    // Update element in editor state
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...state.current,
        css: {
          ...(state.current.css || {}),
          css: cleanedCss
        }
      }
    });
  };

  const handleApply = () => {
    notificationActions.showNotification(
      notifyDispatch,
      'Styles applied successfully',
      'success'
    );
    onClose();
  };

  if (!state.current) {
    return (
      <div className="p-4 text-center">
        <p>No element selected to customize</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Element Type
        </label>
        <div className="text-sm border rounded-md bg-gray-50 p-2">
          {state.current.element || 'Unknown'} {state.current.tag ? `(${state.current.tag})` : ''}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSS Classes
        </label>
        <textarea
          className="w-full min-h-[80px] rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          value={currentCss}
          onChange={(e) => handleCssChange(e.target.value)}
          placeholder="Add Tailwind CSS classes..."
        />
      </div>
      
      {/**<Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-purple-900/20 p-1 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <Tab
              key={category.label}
              className={({ selected }) =>
                classNames(
                  'whitespace-nowrap py-2.5 px-3 text-sm font-medium leading-5 rounded-lg',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
              onClick={() => setSelectedCategory(category.label)}
            >
              {category.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {categories.map((category) => (
            <Tab.Panel
              key={category.label}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none'
              )}
            >
              <div className="space-y-4">
                {category.components.map((component, index) => (
                  <div key={index} className={classNames('pb-2', component.css || '')}>
                    {component.title && (
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        {component.title}
                      </h3>
                    )}
                    <ControlComponent
                      name={component.name}
                      attr={component.attr}
                      title={component.title}
                      css={component.css}
                      icon={component.icon}
                      group={component.group}
                      negative={component.negative}
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      **/}
      
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