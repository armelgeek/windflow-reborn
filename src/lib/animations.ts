import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation durations
const duration = 0.7;

/**
 * Initialize GSAP animations and register effects
 */
export const initGsapAnimations = () => {
  // Scale effect
  gsap.registerEffect({
    name: "scale",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: config.duration, 
          ease: config.ease,
          delay: config.delay
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Scale out effect
  gsap.registerEffect({
    name: "scale-out",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          scale: 1
        },
        {
          scale: 1.1,
          opacity: 1,
          duration: config.duration, 
          ease: config.ease,
          delay: config.delay
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Scale in effect
  gsap.registerEffect({
    name: "scale-in",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          scale: 2,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: config.duration, 
          ease: config.ease,
          delay: config.delay
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Fade effect
  gsap.registerEffect({
    name: "fade",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          opacity: 0
        }, 
        {
          opacity: 1,
          duration: config.duration, 
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Rotate and scale effect
  gsap.registerEffect({
    name: "rotate-scale",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          opacity: 0,
          scale: 0.5,
          x: 300
        }, 
        {
          duration: config.duration, 
          opacity: 1,
          scale: 1,
          rotation: 360,
          x: 0,
          ease: config.ease,
          delay: config.delay
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Rotate effect
  gsap.registerEffect({
    name: "rotate",
    effect: (targets, config) => {
      return gsap.to(targets, 
        {
          rotationX: 360,
          opacity: 1,
          scale: 1,
          duration: config.duration,
          ease: config.ease 
        }
      );
    },
    defaults: { duration },
    extendTimeline: true
  });

  // Flip X effect
  gsap.registerEffect({
    name: "flip-x",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          opacity: 0
        },
        {
          rotationX: 360,
          opacity: 1,
          scale: 1,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Flip Y effect
  gsap.registerEffect({
    name: "flip-y",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          opacity: 0
        },
        {
          rotationY: 360,
          opacity: 1,
          scale: 1,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Slide from left effect
  gsap.registerEffect({
    name: "slide-left",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          autoAlpha: 0,
          x: 300
        },
        {
          autoAlpha: 1,
          x: 0,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Slide from right effect
  gsap.registerEffect({
    name: "slide-right",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          autoAlpha: 0,
          x: -300
        },
        {
          autoAlpha: 1,
          x: 0,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Slide from top effect
  gsap.registerEffect({
    name: "slide-top",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          autoAlpha: 0,
          y: 200
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Slide from bottom effect
  gsap.registerEffect({
    name: "slide-down",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          autoAlpha: 0,
          y: -200
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });

  // Width grow effect
  gsap.registerEffect({
    name: "grow-width",
    effect: (targets, config) => {
      return gsap.fromTo(targets, 
        {
          opacity: 0,
          x: "100%"
        },
        {
          opacity: 1,
          x: 0,
          duration: config.duration,
          delay: config.delay,
          ease: config.ease,
          clearProps: 'opacity'
        }
      );
    },
    defaults: { duration, delay: 0, ease: "power1" },
    extendTimeline: true
  });
  
  // ... autres animations omises pour concision
};

/**
 * Apply GSAP animation to an element
 * @param element - The element object with animation settings
 * @param elementRef - The React ref to the DOM element
 */
export const applyAnimation = (element: any, elementRef: React.RefObject<HTMLElement>) => {
  if (!elementRef.current || !element.gsap.animation || !element.gsap.duration) {
    return null;
  }

  const animation = gsap.effects[element.gsap.animation](elementRef.current, {
    duration: parseFloat(element.gsap.duration),
    delay: parseFloat(element.gsap.delay) || 0,
    ease: element.gsap.ease || "power1.out"
  });

  // Create scroll trigger if not a hover trigger
  if (!element.gsap.trigger) {
    ScrollTrigger.create({
      id: element.id,
      start: "top 99.99%",
      trigger: elementRef.current,
      toggleActions: "play pause restart none",
      animation,
      onEnter: () => {
        if (element.gsap.delay) {
          animation.play();
        } else {
          animation.play(0);
        }
      }
    });
  } else {
    // Setup hover animations
    const el = elementRef.current;
    let ani: gsap.core.Timeline;

    el.onmouseover = () => {
      ani = gsap.effects[element.gsap.animation](el, {
        duration: parseFloat(element.gsap.duration),
        delay: parseFloat(element.gsap.delay) || 0,
        ease: element.gsap.ease || "power1.out"
      });
      ani.play();
    };

    el.onmouseleave = () => {
      el.style.cssText = '';
      ani?.reverse();
    };
  }

  return animation;
};

// Define available animation names
export const gsapEffects = [
  'fade',
  'scale',
  'scale-in',
  'scale-out',
  'flip-x',
  'flip-y',
  'slide-left',
  'slide-right',
  'slide-top',
  'slide-down',
  'rotate',
  'rotate-3DY',
  'rotate-scale',
  'rotate-hover',
  'grow-width',
  'width-reverse',
  'close-left',
  'close-right',
  'grow-height'
];

// Define available easing functions
export const gsapEase = [
  'none',
  'power1',
  'power2',
  'power3',
  'power4',
  'back',
  'elastic',
  'bounce',
  'rough',
  'slow',
  'steps',
  'circ',
  'expo',
  'sine'
];

export default { 
  initGsapAnimations, 
  applyAnimation, 
  gsapEffects, 
  gsapEase 
};