'use client';

import { useEffect, useRef, useState } from 'react';
import { Element } from '@/types/element';
import { formatImageUrl } from '@/lib/utils';
import { cleanCssClasses } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';

interface BlockElementProps {
  element: Element;
  mode?: 'edit' | 'preview';
  onSelect?: (element: Element) => void;
  showDebugInfo?: boolean;
}

export default function BlockElement({ 
  element, 
  mode = 'edit', 
  onSelect,
  showDebugInfo = true // Active par défaut
}: BlockElementProps) {
  const { dispatch } = useEditor();
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [elementType, setElementType] = useState<string>('');

  // Set element type for debugging display
  useEffect(() => {
    setElementType(`${element.element || 'unknown'} (${element.type || 'element'})`);
  }, [element.element, element.type]);

  // Determine the component type
  const getComponent = (): string => {
    if (element.semantic) return element.semantic;
    
    if (element.hasOwnProperty('level')) {
      return `h${element.level}`;
    }
    
    return element.element;
  };
  
  // Combine CSS classes
  const getClasses = (): string => {
    const classes = cleanCssClasses([
      element.css?.css || '',
      isVisible ? '' : 'hidden',
      mode === 'edit' && hovered ? 'outline outline-dashed outline-1 outline-purple-500' : ''
    ].join(' '));
    
    return classes;
  };
  
  // Generate inline styles
  const getStyle = (): React.CSSProperties => {
    let styles: React.CSSProperties = {};
    
    // Add background image if present
    if (element.image && element.element !== 'img' && element.image.url) {
      styles.backgroundImage = `url(${formatImageUrl(element.image)})`;
    }
    
    // Add font family if present
    if (element.font) {
      styles.fontFamily = element.font.replace('+', ' ');
    }
    
    // Add any additional inline styles
    if (element.style) {
      const styleObj = typeof element.style === 'string'
        ? element.style.split(';')
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
        : element.style;
      
      Object.assign(styles, styleObj);
    }
    
    return styles;
  };

  // Handle click events (for editor mode)
  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'edit') {
      e.stopPropagation();
      
      if (onSelect) {
        onSelect(element);
      }
    }
    
    // Execute custom click event if defined
    if (element.events && element.events.click) {
      // Trigger custom event
      const event = new CustomEvent(element.events.click);
      document.dispatchEvent(event);
    }
  };

  // Set up display events and animations
  useEffect(() => {
    // Handle display/hide events if defined
    if (element.events && element.events.display) {
      setIsVisible(false);
      
      // Set up event listener for display toggle
      const handleDisplay = () => setIsVisible(!isVisible);
      document.addEventListener(element.events.display, handleDisplay);
      
      // Clean up
      return () => {
        document.removeEventListener(element.events.display, handleDisplay);
      };
    }
    
    // Handle GSAP animations if needed
    if (element.gsap && element.gsap.animation && element.gsap.duration) {
      // This would require GSAP library integration
    }
  }, [element.events, element.gsap, isVisible]);
  
  // Set up attributes and Alpine.js directives
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Remove unnecessary attributes
    elementRef.current.removeAttribute('element');
    if (element.element !== 'img') elementRef.current.removeAttribute('src');
    if (element.element !== 'img') elementRef.current.removeAttribute('alt');
    if (element.element !== 'img' && !element.link) elementRef.current.removeAttribute('title');
    if (element.element !== 'input') elementRef.current.removeAttribute('type');
    
    // Add custom attributes if defined
    if (element.data && element.data.attributes) {
      Object.entries(element.data.attributes).forEach(([attribute, value]) => {
        elementRef.current?.setAttribute(attribute, value as string);
      });
    }
    
    // Add Alpine.js directives if defined
    if (element.data && element.data.alpine) {
      Object.entries(element.data.alpine).forEach(([attr, value]) => {
        if (value) {
          elementRef.current?.setAttribute(`x-${attr}`, value as string);
        }
      });
    }
  }, [element]);
  const isEmpty = !element.content && !element.value && element.element !== 'img';

  // Debug element type display
  const debugInfo = showDebugInfo && mode === 'edit' && (
    <span 
      className={`
        bg-gray-800 text-white px-2 py-1 text-xs rounded opacity-50 z-10 pointer-events-none
        ${isEmpty ? 'inline-block mr-2' : 'absolute top-0 right-0'}
      `}
      title={`ID: ${element.id}`}
    >
      {elementType}
    </span>
  );
  
  // Render different elements based on element type
  const Component = getComponent() as keyof JSX.IntrinsicElements;
  
  // Handle image element
  if (element.element === 'img') {
    return (
        <div className={isEmpty ? '' : 'relative'}>
        {isEmpty && debugInfo}
        <img
          ref={elementRef as React.RefObject<HTMLImageElement>}
          id={element.id}
          className={getClasses()}
          style={getStyle()}
          src={formatImageUrl(element.image)}
          alt={element.image?.alt || element.element}
          title={element.image?.caption || element.element}
          onClick={handleClick}
          onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
          onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
        />
      </div>
    );
  }
  
  // Handle input element
  if (element.element === 'input') {
    return (
        <div className={isEmpty ? '' : 'relative'}>
        {isEmpty && debugInfo}
        <input
          ref={elementRef as React.RefObject<HTMLInputElement>}
          id={element.id}
          className={getClasses()}
          style={getStyle()}
          type={element.type as string}
          value={element.value}
          placeholder={element.placeholder}
          onClick={handleClick}
          onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
          onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
          readOnly={mode === 'edit'} // Prevent editing in edit mode
        />
      </div>
    );
  }
  
  // Handle textarea element
  if (element.element === 'textarea') {
    return (
        <div className={isEmpty ? '' : 'relative'}>
        {isEmpty && debugInfo}
        <textarea
          ref={elementRef as React.RefObject<HTMLTextAreaElement>}
          id={element.id}
          className={getClasses()}
          style={getStyle()}
          placeholder={element.placeholder}
          rows={element.data?.attributes?.rows as number || 3}
          onClick={handleClick}
          onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
          onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
          readOnly={mode === 'edit'} // Prevent editing in edit mode
          defaultValue={element.content || element.value || ''}
        />
      </div>
    );
  }
  
  // Handle select element
  if (element.element === 'select') {
    return (
        <div className={isEmpty ? '' : 'relative'}>
        {isEmpty && debugInfo}
        <select
          ref={elementRef as React.RefObject<HTMLSelectElement>}
          id={element.id}
          className={getClasses()}
          style={getStyle()}
          onClick={handleClick}
          onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
          onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
          disabled={mode === 'edit'} // Prevent editing in edit mode
        >
          {element.data?.options?.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // For all other element types
  return (
    <div className={isEmpty ? '' : 'relative'}>
        {isEmpty && debugInfo}
      <Component
        ref={elementRef as React.RefObject<any>}
        id={element.id}
        className={getClasses()}
        style={getStyle()}
        onClick={handleClick}
        onMouseEnter={mode === 'edit' ? () => setHovered(true) : undefined}
        onMouseLeave={mode === 'edit' ? () => setHovered(false) : undefined}
        dangerouslySetInnerHTML={element.content ? { __html: element.content } : undefined}
      />
    </div>
  );
}