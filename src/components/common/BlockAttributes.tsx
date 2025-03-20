import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Element } from '@/types/element';

const BlockAttributes: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [currentAttribute, setCurrentAttribute] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');

  // Get the current element from editor state
  const element = state.current;

  // Update attributes list when element changes
  useEffect(() => {
    if (element && element.data.attributes) {
      setAttributes(Object.keys(element.data.attributes));
    } else {
      setAttributes([]);
    }
  }, [element]);

  // Handle adding a new attribute
  const handleAddAttribute = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && element && newAttributeName) {
      // Create a new copy of the element to update
      const updatedElement: Element = { ...element };
      
      // Initialize attributes object if it doesn't exist
      if (!updatedElement.data.hasOwnProperty('attributes')) {
        updatedElement.data = {
          ...updatedElement.data,
          attributes: {}
        };
      }
      
      // Add new attribute
      updatedElement.data.attributes = {
        ...updatedElement.data.attributes,
        [newAttributeName]: newAttributeValue
      };
      
      // Update attributes list
      const newAttributes = [...attributes, newAttributeName];
      setAttributes(newAttributes);
      
      // Update element in store
      dispatch({ type: 'UPDATE_CURRENT', payload: updatedElement });
      
      // Clear input fields
      setNewAttributeName('');
      setNewAttributeValue('');
    }
  };

  // Handle deleting an attribute
  const handleDeleteAttribute = (attributeName: string, index: number) => {
    if (element && element.data.attributes) {
      // Create a new copy of the element to update
      const updatedElement: Element = { ...element };
      
      // Remove the attribute
      const newAttributes = { ...updatedElement.data.attributes };
      delete newAttributes[attributeName];
      updatedElement.data.attributes = newAttributes;
      
      // Update attributes list
      const newAttributesList = [...attributes];
      newAttributesList.splice(index, 1);
      setAttributes(newAttributesList);
      
      // Clear current attribute if it's the one being deleted
      if (currentAttribute === attributeName) {
        setCurrentAttribute(null);
      }
      
      // Update element in store
      dispatch({ type: 'UPDATE_CURRENT', payload: updatedElement });
    }
  };

  // If no element is selected, don't render anything
  if (!element) {
    return null;
  }

  return (
    <div className="p-2 flex flex-col">
      {/* Display existing attributes */}
      {element.data.attributes && Object.keys(element.data.attributes).length > 0 && (
        <div className="mb-4">
          <select 
            className="w-full p-2 border rounded mb-2" 
            value={currentAttribute || ''} 
            onChange={(e) => setCurrentAttribute(e.target.value)}
          >
            <option value="">Select attribute</option>
            {attributes.map((attr) => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
          
          {currentAttribute && (
            <div className="text-gray-600 text-sm">
              Currently selected: {currentAttribute}
            </div>
          )}
          
          {attributes.map((attrib, i) => (
            <div key={attrib} className="w-5/6 flex items-center mb-1">
              <span className="chip bg-purple-400 mr-2 px-2 py-1 rounded">
                {attrib}
              </span> 
              {element.data.attributes && element.data.attributes[attrib] !== undefined && 
                String(element.data.attributes[attrib])}
              
              <button 
                className="absolute text-gray-400 text-xl mr-2 right-0" 
                onClick={() => handleDeleteAttribute(attrib, i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new attribute */}
      <div className="mt-2">
        <label className="block mb-1 font-medium">Attribute</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded mb-2" 
          value={newAttributeName}
          onChange={(e) => setNewAttributeName(e.target.value)}
        />
        
        <label className="block mb-1 font-medium">Value</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded"
          value={newAttributeValue} 
          onChange={(e) => setNewAttributeValue(e.target.value)}
          onKeyDown={handleAddAttribute}
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-300 absolute bottom-0 mb-20">
        <b>To add an attribute add a name a value (optional) and click Enter</b>.
        <br /><br />
        You can add attributes to any element. Do not duplicate attributes in order to prevent unexpected behaviors.
      </p>
    </div>
  );
};

export default BlockAttributes;