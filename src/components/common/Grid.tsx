'use client';

import React, { useState } from 'react';
import { useEditor, editorActions } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { createGridElement } from '@/lib/elements';

type ColSpans = {
  [key: string]: number[][];
};

export default function GridHelper() {
  const [cols, setCols] = useState<number>(3);
  const { dispatch: editorDispatch } = useEditor();
  const { dispatch: notificationDispatch } = useNotification();
  
  // Column spans configuration
  const colSpans: ColSpans = {
    "1": [[1]],
    "2": [[1, 1]],
    "3": [[1, 1, 1], [1, 2], [2, 1]],
    "4": [[1, 1, 1, 1], [2, 2], [1, 3], [1, 1, 2], [1, 2, 1], [2, 1, 1], [3, 1]],
    "5": [[1, 1, 1, 1, 1], [1, 1, 1, 2], [1, 1, 3], [1, 4], [1, 1, 2, 1], [1, 2, 1, 1], [1, 3, 1], [2, 1, 1, 1], [3, 1, 1], [3, 2], [4, 1]],
    "6": [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 2], [1, 1, 1, 3], [1, 1, 4], [1, 5], [1, 1, 1, 2, 1], [1, 1, 2, 1, 1], [1, 1, 3, 1], [1, 2, 1, 1, 1], [1, 3, 1, 1], [1, 4, 1], [2, 1, 1, 1, 1], [3, 1, 1, 1], [4, 1, 1], [5, 1]]
  };

  // Handle the creation of a grid with the selected layout
  const createGrid = (colspan: number, layout: number[]) => {
    // Create a new grid element
    const grid = createGridElement(cols);
    
    // Add blocks to the grid based on the selected layout
    for (let n = 0; n < layout.length; n++) {
      const flexbox = createFlexboxElement({
        direction: 'row',
        colspan: layout[n]
      });
      
      // Add an icon to indicate it's a block
      flexbox.icon = 'highlight_alt';
      
      // Add the flexbox to the grid
      grid.blocks.push(flexbox);
    }
    
    // Add the grid to the current editor element
    editorDispatch({
      type: 'ADD_BLOCK',
      payload: grid
    });
    
    // Show a notification
    notificationActions.showNotification(
      notificationDispatch,
      `Grid with ${cols} columns created`,
      'success'
    );
    
    // Close the helper dialog (if needed)
    // This would be handled by the parent component
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <span className="mr-2">Columns</span> 
        <select 
          value={cols} 
          onChange={(e) => setCols(parseInt(e.target.value))}
          className="h-8 w-16 border rounded"
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      
      <div className={`grid grid-cols-${cols} gap-4`}>
        {/* Render the available layout options for the selected number of columns */}
        {colSpans[cols.toString()].map((layout, layoutIndex) => (
          <React.Fragment key={layoutIndex}>
            {layout.map((colspan, colspanIndex) => (
              <div 
                key={`${layoutIndex}-${colspanIndex}`}
                className={`
                  flex m-1 border border-dashed border-gray-500 bg-blue-gray-100 
                  items-center justify-center cursor-pointer col-span-${colspan}
                  h-12
                `}
                onClick={() => createGrid(colspan, layout)}
                title={layout.toString()}
              >
                {colspan}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Helper function to create a flexbox element
function createFlexboxElement(options: { direction: 'row' | 'col'; colspan: number }) {
  // This is a simplified version. In a real implementation, this would use the actual Element class
  return {
    element: 'div',
    tag: 'flex',
    type: 'container',
    id: `windflow-${Math.random().toString(36).substring(2, 9)}`,
    css: {
      css: options.colspan > 1 ? `col-span-${options.colspan}` : '',
      container: `flex flex-${options.direction}`
    },
    icon: 'dashboard',
    blocks: []
  };
}

// Helper function to create a grid element
function createGridElement(cols: number) {
  // This is a simplified version. In a real implementation, this would use the actual Element class
  return {
    element: 'div',
    tag: 'grid',
    type: 'container',
    id: `windflow-${Math.random().toString(36).substring(2, 9)}`,
    css: {
      css: '',
      container: `grid grid-cols-${cols} gap-4`
    },
    icon: 'grid_view',
    blocks: []
  };
}