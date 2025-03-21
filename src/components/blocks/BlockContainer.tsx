'use client';

import { useState, useEffect, useRef } from 'react';
import { Element } from '@/types/element';
import BlockElement from '@/components/blocks/BlockElement';
import IconifyIcon from '@/components/common/IconifyIcon';
import { useEditor, editorActions } from '@/context/EditorContext';
import { cleanCssClasses } from '@/lib/utils';
import BlockSlider from '@/components/blocks/BlockSlider';
import BlockIFrame from '@/components/blocks/BlockIFrame';

interface BlockContainerProps {
  doc: Element;
  mode?: 'edit' | 'preview';
  level?: number;
  onSelect?: (element: Element) => void;
  showDebugInfo?: boolean; // Ajout d'une prop pour contrôler l'affichage du debug
}

export default function BlockContainer({ 
  doc, 
  mode = 'edit', 
  level = 0,
  onSelect,
  showDebugInfo = true // Active par défaut
}: BlockContainerProps) {
  const { state: editorState, dispatch } = useEditor();
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [elementType, setElementType] = useState<string>('');
  
  // Determine the semantic tag for the container
  const semantic = doc.semantic || 'div';
  
  // Set element type info for debugging display
  useEffect(() => {
    setElementType(`${doc.element || 'div'} (${doc.type || 'unknown'})`);
  }, [doc.element, doc.type]);
  
  // Combine CSS classes
  const containerClasses = cleanCssClasses([
    Object.values(doc.css || { css: '', container: '' }).join(' '),
    isVisible ? '' : 'hidden',
    mode === 'edit' && hovered ? 'outline outline-blue-500 outline-1' : ''
  ].join(' '));
  
  // Generate inline styles
  const containerStyle: React.CSSProperties = {};
  
  // Add background image if present
  if (doc.image && doc.image.url) {
    containerStyle.backgroundImage = `url(${doc.image.url})`;
  }
  
  // Add font family if present
  if (doc.font) {
    containerStyle.fontFamily = doc.font.replace('+', ' ');
  }
  
  // Add any additional inline styles
  if (doc.style) {
    const styleObj = typeof doc.style === 'string' 
      ? doc.style.split(';')
          .filter(Boolean)
          .reduce((acc, style) => {
            const [property, value] = style.split(':');
            if (property && value) {
              // Convert kebab-case to camelCase
              const camelProperty = property.trim().replace(/-([a-z])/g, (_, letter) => 
                letter.toUpperCase()
              );
              acc[camelProperty] = value.trim();
            }
            return acc;
          }, {} as Record<string, string>)
      : doc.style;
    
    Object.assign(containerStyle, styleObj);
  }
  
  // Handle click events (for editor mode)
  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'edit') {
      e.stopPropagation();
      
      if (onSelect) {
        onSelect(doc);
      } else if (dispatch) {
        editorActions.setCurrent(dispatch, doc);
      }
    }
    
    // Execute custom click event if defined
    if (doc.events && doc.events.click) {
      // Trigger custom event
      const event = new CustomEvent(doc.events.click);
      document.dispatchEvent(event);
    }
  };
  
  // Set up display events and animations
  useEffect(() => {
    // Handle display/hide events if defined
    if (doc.events && doc.events.display) {
      setIsVisible(false);
      
      // Set up event listener for display toggle
      const handleDisplay = () => setIsVisible(!isVisible);
      document.addEventListener(doc.events.display, handleDisplay);
      
      // Clean up
      return () => {
        document.removeEventListener(doc.events.display, handleDisplay);
      };
    }
    
    // Handle GSAP animations if defined
    if (doc.gsap && doc.gsap.animation && doc.gsap.duration) {
      // This would require GSAP library integration
      // Implementation would be similar to the Vue version
    }
  }, [doc.events, doc.gsap, isVisible]);
  
  // Set up attributes and Alpine.js directives
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Remove unnecessary attributes
    containerRef.current.removeAttribute('doc');
    
    // Add custom attributes if defined
    if (doc.data && doc.data.attributes) {
      Object.entries(doc.data.attributes).forEach(([attribute, value]) => {
        containerRef.current?.setAttribute(attribute, value as string);
      });
    }
    
    // Add Alpine.js directives if defined
    if (doc.data && doc.data.alpine) {
      Object.entries(doc.data.alpine).forEach(([attr, value]) => {
        if (value) {
          containerRef.current?.setAttribute(`x-${attr}`, value as string);
        }
      });
    }
  }, [doc]);
  
  // Level check to prevent infinite recursion
  if (level > 20) {
    return <div className="p-2 text-red-500">Maximum nesting level reached</div>;
  }
  
  // Debug element type display
  const debugInfo = showDebugInfo && mode === 'edit' && (
    <div 
      className={`
        bg-gray-300 text-gray-800 px-2 py-3 text-xs opacity-50 z-10 pointer-events-none
        ${(!doc.blocks || doc.blocks.length === 0) ? 'inline-block mr-2' : 'absolute top-0 right-0'}
      `}
      title={`ID: ${doc.id}`}
    >
      {elementType}
    </div>
  );
  
  // Render the container with its children
  const Container = semantic as keyof JSX.IntrinsicElements;
  
  return (
    <Container
      ref={containerRef as React.RefObject<any>}
      id={doc.id}
      className={containerClasses}
      style={containerStyle}
      onClick={handleClick}
      onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
      onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
    >
      {/* Debug information overlay */}
      {debugInfo}
      
      {doc.blocks && doc.blocks.map(block => {
        // Skip if no block
        if (!block) return null;
        
        // If block is a link, wrap in anchor tag
        if (block.link) {
          return (
            <a href={block.link} key={block.id}>
              {renderBlock(block, mode, level, onSelect, showDebugInfo)}
            </a>
          );
        }
        
        return renderBlock(block, mode, level, onSelect, showDebugInfo);
      })}
    </Container>
  );
}

// Helper function to render different types of blocks
function renderBlock(
  block: Element, 
  mode: 'edit' | 'preview', 
  level: number, 
  onSelect?: (element: Element) => void,
  showDebugInfo?: boolean
) {
  // Based on block type, render appropriate component
  if (block.type === 'container') {
    return (
      <BlockContainer 
        key={block.id} 
        doc={block} 
        mode={mode} 
        level={level + 1}
        onSelect={onSelect}
        showDebugInfo={showDebugInfo}
      />
    );
  }
  
  if (block.type === 'slider') {
    return (
      <BlockSlider 
        key={block.id} 
        slider={block} 
        mode={mode}
        onSelect={onSelect}
      />
    );
  }
  
  if (block.tag === 'iconify') {
    return (
      <IconifyIcon 
        key={block.id} 
        block={block} 
        mode={mode === 'edit' ? 'edit' : undefined}
        onSelect={mode === 'edit' ? onSelect : undefined}
      />
    );
  }
  
  if (block.tag === 'youtube' || block.tag === 'vimeo' || block.element === 'iframe') {
    return (
      <BlockIFrame 
        key={block.id} 
        el={block} 
        mode={mode}
        onSelect={onSelect}
      />
    );
  }
  
  return (
    <BlockElement 
      key={block.id} 
      element={block}
      mode={mode}
      onSelect={onSelect}
      showDebugInfo={showDebugInfo}
    />
  );
}