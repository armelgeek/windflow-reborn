'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Element } from '@/types/element';
import { useEventBus } from '@/context/EventContext';
import { formatImageUrl } from '@/lib/utils';
import IconifyIcon from '@/components/common/IconifyIcon';

interface BlockElementProps {
  element: Element;
  mode?: 'edit' | 'preview';
  onSelect?: (element: Element) => void;
}

export default function BlockElement({ element, mode = 'edit', onSelect }: BlockElementProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(true);
  const { subscribe, publish } = useEventBus();

  // Determine the component's CSS classes
  const getClasses = (): string => {
    let classes = Object.values(element.css).join(' ').trim();
    
    if (!display) {
      classes += ' hidden';
    }
    
    return classes;
  };

  // Determine inline styles
  const getStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    // Add background image if present
    if (element.image && element.element !== 'img' && element.image.url) {
      styles.backgroundImage = `url(${formatImageUrl(element.image)})`;
    }
    
    // Add font family if present
    if (element.font) {
      styles.fontFamily = `"${element.font.replace('+', ' ')}"`;
    }
    
    // Add any additional inline styles from the element
    if (element.style) {
      // Parse style string into object
      const styleObj = element.style.split(';')
        .filter(Boolean)
        .reduce((acc, style) => {
          const [property, value] = style.split(':');
          if (property && value) {
            // Convert kebab-case to camelCase
            const camelProperty = property.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            acc[camelProperty] = value.trim();
          }
          return acc;
        }, {} as Record<string, string>);
      
      Object.assign(styles, styleObj);
    }
    
    return styles;
  };

  // Determine the component type
  const getComponent = (): keyof JSX.IntrinsicElements => {
    if (element.semantic) return element.semantic as keyof JSX.IntrinsicElements;
    
    if (element.hasOwnProperty('level')) {
      return `h${element.level}` as keyof JSX.IntrinsicElements;
    }
    
    return element.element as keyof JSX.IntrinsicElements;
  };

  // Handle click event
  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'edit') {
      e.stopPropagation();
      
      if (onSelect) {
        onSelect(element);
      }
    }
    
    if (element.events.click) {
      publish(element.events.click);
    }
  };

  // Set up event listeners
  useEffect(() => {
    if (element.events.display) {
      setDisplay(false);
      
      const toggleDisplay = () => {
        setDisplay(prev => !prev);
      };
      
      const unsubscribe = subscribe(element.events.display, toggleDisplay);
      return () => unsubscribe();
    }
    
    if (element.events.hide) {
      const toggleDisplay = () => {
        setDisplay(prev => !prev);
      };
      
      const unsubscribe = subscribe(element.events.hide, toggleDisplay);
      return () => unsubscribe();
    }
  }, [element.events, subscribe, publish]);

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
    if (element.data.attributes) {
      Object.entries(element.data.attributes).forEach(([attribute, value]) => {
        elementRef.current?.setAttribute(attribute, value as string);
      });
    }
    
    // Add Alpine.js directives if defined
    if (element.data.alpine) {
      Object.entries(element.data.alpine).forEach(([attr, value]) => {
        if (value) {
          elementRef.current?.setAttribute(attr, value);
        }
      });
    }
    
    // Set up GSAP animation if defined
    if (element.gsap.animation && element.gsap.duration && display) {
      // GSAP animation would be implemented here
      // This would need integration with a GSAP library wrapper for React
    }
  }, [element, display]);

  // Special case for Iconify icon
  if (element.tag === 'iconify') {
    return <IconifyIcon block={element} />;
  }

  // Special handling for image element
  if (element.element === 'img') {
    return (
      <img
        ref={elementRef as React.RefObject<HTMLImageElement>}
        id={element.id}
        className={getClasses()}
        style={getStyle()}
        src={element.image?.url ? formatImageUrl(element.image) : '/no-image.png'}
        alt={element.image?.alt || element.element}
        title={element.image?.caption || element.element}
        onClick={handleClick}
      />
    );
  }

  // Create the dynamic component
  const Component = getComponent();
  
  return (
    <Component
      ref={elementRef as React.RefObject<any>}
      id={element.id}
      className={getClasses()}
      style={getStyle()}
      onClick={handleClick}
      dangerouslySetInnerHTML={element.content ? { __html: element.content } : undefined}
    />
  );
}