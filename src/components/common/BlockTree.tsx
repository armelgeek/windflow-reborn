'use client';

import { Icon } from '@iconify/react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { Element } from '@/types/element';

interface BlockTreeProps {
  current?: Element;
  level?: number;
}

export default function BlockTree({ current, level = 0 }: BlockTreeProps) {
  const { state: editorState, dispatch } = useEditor();
  
  // Use the provided current element or get it from the context
  const element = current || editorState.current;
  
  // If no element is available, show nothing
  if (!element) {
    return null;
  }
  
  // Set the current element in the editor context
  const handleElementClick = () => {
    if (dispatch) {
      editorActions.setCurrent(dispatch, element);
    }
  };
  
  // Calculate indentation based on nesting level
  const indentStyle = {
    paddingLeft: `${level * 12}px`
  };
  
  return (
    <div className="flex flex-col cursor-pointer w-full">
      {/* Current element */}
      <div 
        className="flex flex-row w-full pb-1 items-center capitalize" 
        style={indentStyle}
        onClick={handleElementClick}
      >
        {/* Element icon */}
        {element.icon && (
          element.icon.startsWith('mi:') ? (
            <span className="material-icons mr-1">
              {element.icon.replace('mi:', '')}
            </span>
          ) : (
            <Icon icon={element.icon} className="mr-1" />
          )
        )}
        
        {/* Element name */}
        <span className={editorState.current?.id === element.id ? 'font-bold text-purple-600' : ''}>
          {element.semantic || element.element}
          {element.id && <span className="text-xs text-gray-500 ml-1">#{element.id.substring(0, 6)}</span>}
        </span>
      </div>
      
      {/* Child elements */}
      {element.blocks && element.blocks.length > 0 && (
        <div className="flex flex-col">
          {element.blocks.map((block, index) => (
            <div key={block.id || `block-${index}`} className="w-full">
              {block.blocks ? (
                // Recursive rendering for container elements
                <BlockTree current={block} level={level + 1} />
              ) : (
                // Simple element entry
                <div 
                  className="flex flex-row w-full pb-1 items-center capitalize" 
                  style={{
                    paddingLeft: `${(level + 1) * 12}px`
                  }}
                  onClick={() => {
                    if (dispatch) {
                      editorActions.setCurrent(dispatch, block);
                    }
                  }}
                >
                  {/* Element icon */}
                  {block.icon && (
                    block.icon.startsWith('mi:') ? (
                      <span className="material-icons mr-1">
                        {block.icon.replace('mi:', '')}
                      </span>
                    ) : (
                      <Icon icon={block.icon} className="mr-1" />
                    )
                  )}
                  
                  {/* Element name */}
                  <span className={editorState.current?.id === block.id ? 'font-bold text-purple-600' : ''}>
                    {block.semantic || block.element}
                    {block.id && <span className="text-xs text-gray-500 ml-1">#{block.id.substring(0, 6)}</span>}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}