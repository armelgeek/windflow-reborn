'use client';

import { useState } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification } from '@/context/NotificationContext';
import { createElement } from '@/lib/elements';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { useModal, modalActions } from '@/context/ModalContext';
import BlockLibrary from './BlockLibrary';

export default function BlockElements() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const { state, dispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  const { dispatch: modalDispatch } = useModal();

  // Toggle group visibility
  const toggleGroup = (label: string) => {
    setActiveGroup(activeGroup === label ? null : label);
  };

  // Create a new element
  const createElement = (element: { name: string; icon: string }) => {
    if (!state.current) return;

    // Create the element using the elements library
    const newElement = createElement(element.name);
    
    // Set the icon
    newElement.icon = element.icon;
    
    // Add the element to the current block
    state.current.blocks.push(newElement);
    
    // Set the new element as the current element
    editorActions.setCurrent(dispatch, newElement);
    
    // Show helper dialog if available
    if (newElement.helper) {
      modalActions.openModal(
        modalDispatch,
        'editorHelper',
        element.name.toUpperCase(),
        newElement.dialog || 'md:w-1/3',
        { content: newElement.helper }
      );
    }
    
    // Show notification
    notificationDispatch({
      type: 'SHOW_NOTIFICATION',
      payload: {
        message: `Created ${element.name}`,
        type: 'success'
      }
    });
  };

  // If elements data is not available, return early
  if (!state.elements) {
    return <div className="p-4 text-gray-500">Loading elements...</div>;
  }

  return (
    <div className="relative">
      {/* Element Groups */}
      {state.elements.map((group) => (
        <div key={group.label}>
          {/* Group Header */}
          <div
            className={`capitalize flex items-center cursor-pointer hover:bg-gray-500 hover:text-white p-2 text-gray-700 text-base ${
              activeGroup === group.label ? 'bg-bluegray-300 text-gray-200' : ''
            }`}
            onClick={() => toggleGroup(group.label)}
          >
            {group.label}
            <span className="absolute right-0 m-1">
              {activeGroup === group.label ? (
                <RiArrowUpSLine className="text-xl" />
              ) : (
                <RiArrowDownSLine className="text-xl" />
              )}
            </span>
          </div>

          {/* Group Elements */}
          {activeGroup === group.label && (
            <div className="flex flex-row flex-wrap justify-center cursor-pointer p-2">
              {group.elements.map((element) => (
                <div
                  key={element.name}
                  className="bg-white m-1 hover:bg-gray-100 flex flex-col items-center h-16 w-16 ml-01 text-xs justify-center text-center text-gray-500 rounded hover:text-purple-600 shadow"
                  onClick={() => createElement(element)}
                >
                  <span className="material-icons text-3xl">{element.icon}</span>
                  {element.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Snippets Section */}
      <div
        className={`capitalize cursor-pointer items-center flex p-2 text-gray-700 text-base ${
          activeGroup === 'snippets' ? 'bg-bluegray-300 text-gray-200' : ''
        }`}
        onClick={() => toggleGroup('snippets')}
      >
        Snippets
        <span className="absolute right-0 m-1">
          {activeGroup === 'snippets' ? (
            <RiArrowUpSLine className="text-xl" />
          ) : (
            <RiArrowDownSLine className="text-xl" />
          )}
        </span>
      </div>

      {/* Snippets Content */}
      {activeGroup === 'snippets' && (
        <div className="relative w-full cursor-pointer">
          <BlockLibrary />
        </div>
      )}
    </div>
  );
}