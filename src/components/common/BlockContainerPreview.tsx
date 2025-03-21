'use client';

import { useState, useEffect, useRef } from 'react';
import { Element } from '@/types/element';
import IconifyIcon from '@/components/common/IconifyIcon';
import { cleanCssClasses } from '@/lib/utils';
import BlockSlider from '../blocks/BlockSlider';
import BlockIFrame from '../blocks/BlockIFrame';
import BlockElement from './BlockElement';

interface BlockContainerPreviewProps {
  doc: Element;
}

export default function BlockContainerPreview({ doc }: BlockContainerPreviewProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [elementType, setElementType] = useState<string>('');

  // Determine the semantic tag for the container
  const semantic = doc.semantic || 'div';
  
  // Combine CSS classes
  const containerClasses = cleanCssClasses([
    Object.values(doc.css || { css: '', container: '' }).join(' '),
    isVisible ? '' : 'hidden'
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
  
  // Handle click event
  const handleClick = () => {
    if (doc.events && doc.events.click) {
     
    }
  };
  
  // Set up display events and animations
  useEffect(() => {
    // Determine the element type for debugging display
    setElementType(`${doc.element} (${doc.type})`);
    
    // Handle display/hide events if defined
    if (doc.events && doc.events.display) {
      setIsVisible(false);
      
      // Set up event listener for display toggle
      const handleDisplay = () => setIsVisible(!isVisible);
     
    }
    
    // Handle hide events if defined
    if (doc.events && doc.events.hide) {
      const handleHide = () => setIsVisible(!isVisible);
    
    }
    
    // Handle GSAP animations if defined
    if (doc.gsap && doc.gsap.animation && doc.gsap.duration && isVisible) {
      // This would require GSAP library integration
      // In the Vue version, this calls $animation
    }
  }, [doc.events, doc.gsap, isVisible]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    containerRef.current.removeAttribute('doc');
    
    if (doc.data && doc.data.attributes) {
      Object.entries(doc.data.attributes).forEach(([attribute, value]) => {
        containerRef.current?.setAttribute(attribute, value as string);
      });
    }
    
    if (doc.data && doc.data.alpine) {
      Object.entries(doc.data.alpine).forEach(([attr, value]) => {
        if (value) {
          containerRef.current?.setAttribute(`x-${attr}`, value as string);
        }
      });
    }
  }, [doc]);
  
  const debugInfo = (
    <div className="absolute top-0 right-0 bg-gray-800 text-white px-2 py-1 text-xs rounded opacity-50 pointer-events-none">
      {elementType}
    </div>
  );
  
  const Container = semantic as keyof JSX.IntrinsicElements;
  
  return (
    <Container
      ref={containerRef as React.RefObject<any>}
      id={doc.anchor || doc.id}
      className={containerClasses}
      style={containerStyle}
      onClick={handleClick}
    >
      {/* Show element type for debugging */}
      {elementType && debugInfo}
      
      {doc.blocks && doc.blocks.map(block => {
        // Skip if no block
        if (!block) return null;
        
        // If block is a link, wrap in anchor tag
        if (block.link) {
          return (
            <a href={block.link} key={block.id}>
              {renderBlock(block)}
            </a>
          );
        }
        
        return renderBlock(block);
      })}
    </Container>
  );
  
  // Helper function to render different types of blocks
  function renderBlock(block: Element) {
    // Container block
    if (block.type === 'container') {
      return <BlockContainerPreview key={block.id} doc={block} />;
    }
    
    // Slider block
    if (block.type === 'slider') {
      return <BlockSlider key={block.id} slider={block} />;
    }
    
    // IFrame block (YouTube, Vimeo)
    if (block.tag === 'youtube' || block.tag === 'vimeo') {
      return <BlockIFrame key={block.id} el={block} />;
    }
    
    // Iconify block
    if (block.tag === 'iconify') {
      return <IconifyIcon key={block.id} block={block} mode="render" />;
    }
    
    return <BlockElement key={block.id} element={block} />;
  }
}