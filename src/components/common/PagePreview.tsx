'use client';

import { useEffect, useRef } from 'react';
import BlockContainer from '@/components/blocks/BlockContainer';
import { Element } from '@/types/element';

export default function PagePreview() {
  const contentRef = useRef<HTMLDivElement>(null);
 // const { getItem } = useLocalStorage();

  // Get document from localStorage
  const getDocument = (): Element => {
    const previewData = localStorage.get('windflow-preview');
    if (previewData) {
      try {
        const parsed = JSON.parse(previewData);
        return parsed.json.blocks;
      } catch (error) {
        console.error('Error parsing preview data:', error);
        return null;
      }
    }
    return null;
  };

  // Access contentRef after render
  useEffect(() => {
    if (contentRef.current) {
      console.log('Content rendered');
    }
  }, []);

  const doc = getDocument();

  // No document to display
  if (!doc) {
    return <div className="p-4">No preview data available</div>;
  }

  return (
    <div className="w-screen -mt-10">
      <div className="flex flex-col overflow-y-auto absolute inset-0 laptop-view">
        <BlockContainer 
          doc={doc} 
          key={doc.id} 
          id="content"
          ref={contentRef}
          mode="preview"
        />
      </div>
    </div>
  );
}