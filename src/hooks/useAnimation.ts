import { useEffect, useRef } from 'react';
import { Element } from '@/types/element';
import { applyAnimation } from '@/lib/animations';

/**
 * Hook to apply GSAP animations to an element
 * @param element - The element with animation settings
 * @returns A ref to attach to the DOM element
 */
export const useAnimation = (element: Element) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only apply animation if needed
    if (
      element.gsap?.animation && 
      element.gsap.duration && 
      elementRef.current
    ) {
      const animation = applyAnimation(element, elementRef);
      
      // Cleanup on unmount
      return () => {
        if (animation) {
          animation.kill();
        }
      };
    }
  }, [
    element.id,
    element.gsap?.animation,
    element.gsap?.duration,
    element.gsap?.delay,
    element.gsap?.ease,
    element.gsap?.trigger
  ]);
  
  return elementRef;
};

export default useAnimation;