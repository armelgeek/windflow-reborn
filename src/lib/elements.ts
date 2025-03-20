import { v4 as uuidv4 } from 'uuid';
import { Element, ElementImage, GridElement, ElementStyle } from '@/types/element';

const defaultElementStyle: ElementStyle = {
    css: '',
    container: ''
};

const defaultImage: ElementImage = {
    url: '',
    caption: '',
    alt: ''
};

export function createElement(
    type: string,
    options: Partial<Element> = {}
): Element {
    const id = options.id || uuidv4();

    return {
        id,
        element: options.element || type.toLowerCase(),
        tag: options.tag || type.toLowerCase(),
        type: options.type || 'element',
        semantic: options.semantic || '',
        level: options.level || undefined,
        content: options.content || '',
        font: options.font || '',
        link: options.link || '',
        anchor: options.anchor || '',
        image: options.image || { ...defaultImage },
        style: options.style || '',
        css: options.css || { ...defaultElementStyle },
        data: options.data || {
            attributes: {},
            options: [],
            alpine: {}
        },
        gsap: options.gsap || {
            animation: '',
            duration: 0,
            delay: 0,
            ease: 'power1.out'
        },
        events: options.events || {
            click: '',
            display: '',
            hide: ''
        },
        blocks: options.blocks || [],
        value: options.value || '',
        icon: options.icon || '',
        placeholder: options.placeholder || '',
        src: options.src || ''
    };
}

export function createHeading(level: number, content: string = ''): Element {
    return createElement('heading', {
        element: 'h' + level,
        tag: 'h' + level,
        level,
        content,
        semantic: 'h' + level,
        icon: 'title'
    });
}

export function createParagraph(content: string = ''): Element {
    return createElement('paragraph', {
        element: 'p',
        tag: 'p',
        content,
        semantic: 'p',
        icon: 'subject'
    });
}

export function createImage(src: string = '', alt: string = ''): Element {
    return createElement('image', {
        element: 'img',
        tag: 'img',
        image: { url: src, alt },
        icon: 'photo'
    });
}

export function createButton(content: string = 'Button'): Element {
    return createElement('button', {
        element: 'button',
        tag: 'button',
        content,
        semantic: 'button',
        icon: 'smart_button',
        css: { css: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', container: '' }
    });
}

export function createInput(type: string = 'text', placeholder: string = ''): Element {
    return createElement('input', {
        element: 'input',
        tag: 'input',
        type: 'element',
        placeholder,
        icon: 'input',
        data: {
            attributes: {
                type,
                placeholder,
                name: `input-${uuidv4().slice(0, 8)}`
            },
            options: [],
            alpine: {}
        }
    });
}

export function createLink(content: string = 'Link', href: string = '#'): Element {
    return createElement('link', {
        element: 'a',
        tag: 'a',
        content,
        link: href,
        icon: 'link',
        data: {
            attributes: {
                href
            },
            options: [],
            alpine: {}
        }
    });
}

export function createContainer(options: Partial<Element> = {}): Element {
    return createElement('container', {
        element: 'div',
        tag: 'div',
        type: 'container',
        semantic: options.semantic || 'div',
        css: options.css || { css: '', container: 'flex flex-col' },
        blocks: options.blocks || [],
        icon: options.icon || 'widgets',
        ...options
    });
}

export function createFlexbox(
    direction: 'row' | 'col' = 'row',
    colspan: number = 1,
    options: Partial<Element> = {}
): Element {
    return createContainer({
        element: 'div',
        tag: 'flex',
        css: {
            css: colspan > 1 ? `col-span-${colspan}` : '',
            container: `flex flex-${direction}`
        },
        icon: 'dashboard',
        ...options
    });
}

export function createGrid(
    cols: number = 1,
    options: Partial<Element> = {}
): Element {
    return createContainer({
        element: 'div',
        tag: 'grid',
        css: { css: '', container: `grid grid-cols-${cols} gap-4` },
        icon: 'grid_view',
        ...options
    });
}

export function createSection(
    options: Partial<Element> = {}
): Element {
    return createContainer({
        element: 'section',
        tag: 'section',
        semantic: 'section',
        css: { css: 'w-full py-8', container: 'container mx-auto px-4' },
        icon: 'article',
        ...options
    });
}

export function createSlider(
    options: Partial<Element> = {}
): Element {
    return createElement('slider', {
        element: 'div',
        tag: 'slider',
        type: 'slider',
        css: { css: 'w-full', container: '' },
        icon: 'view_carousel',
        data: {
            slider: {
                navigation: {
                    enable: true,
                    dots: true,
                    arrows: true,
                    position: 'bottom'
                }
            },
            ...options.data
        },
        blocks: options.blocks || [],
        ...options
    });
}

export function createForm(
    action: string = '',
    method: string = 'post',
    options: Partial<Element> = {}
): Element {
    return createContainer({
        element: 'form',
        tag: 'form',
        semantic: 'form',
        css: { css: 'w-full', container: 'flex flex-col space-y-4' },
        icon: 'assignment',
        data: {
            attributes: {
                action,
                method,
                id: `form-${uuidv4().slice(0, 8)}`,
                name: `form-${uuidv4().slice(0, 8)}`
            },
            ...options.data
        },
        ...options
    });
}

export function createSelect(
    options: string[] = [],
    placeholder: string = 'Select an option'
): Element {
    return createElement('select', {
        element: 'select',
        tag: 'select',
        icon: 'expand_more',
        data: {
            options,
            attributes: {
                name: `select-${uuidv4().slice(0, 8)}`,
                id: `select-${uuidv4().slice(0, 8)}`
            },
            alpine: {}
        },
        placeholder
    });
}

export function createTextarea(
    placeholder: string = '',
    rows: number = 4
): Element {
    return createElement('textarea', {
        element: 'textarea',
        tag: 'textarea',
        icon: 'text_fields',
        data: {
            attributes: {
                placeholder,
                rows,
                name: `textarea-${uuidv4().slice(0, 8)}`,
                id: `textarea-${uuidv4().slice(0, 8)}`
            },
            options: [],
            alpine: {}
        }
    });
}

export function createIcon(icon: string = 'star'): Element {
    return createElement('icon', {
        element: 'span',
        tag: 'iconify',
        icon,
        data: {
            icon
        }
    });
}

export function createIFrame(src: string = ''): Element {
    return createElement('iframe', {
        element: 'iframe',
        tag: 'iframe',
        src,
        icon: 'code',
        data: {
            attributes: {
                src,
                frameborder: '0',
                allowfullscreen: 'true'
            },
            options: [],
            alpine: {}
        }
    });
}

export const elementGroups = [
    {
        label: 'Basic',
        elements: [
            { name: 'Heading', icon: 'title' },
            { name: 'Paragraph', icon: 'subject' },
            { name: 'Button', icon: 'smart_button' },
            { name: 'Link', icon: 'link' },
            { name: 'Image', icon: 'photo' }
        ]
    },
    {
        label: 'Layout',
        elements: [
            { name: 'Container', icon: 'widgets' },
            { name: 'Flexbox', icon: 'dashboard' },
            { name: 'Grid', icon: 'grid_view' },
            { name: 'Section', icon: 'article' }
        ]
    },
    {
        label: 'Form',
        elements: [
            { name: 'Form', icon: 'assignment' },
            { name: 'Input', icon: 'input' },
            { name: 'Select', icon: 'expand_more' },
            { name: 'Textarea', icon: 'text_fields' }
        ]
    },
    {
        label: 'Special',
        elements: [
            { name: 'Icon', icon: 'star' },
            { name: 'Slider', icon: 'view_carousel' },
            { name: 'IFrame', icon: 'code' }
        ]
    }
];

/**
 * Creates a grid container element with specified number of columns
 * 
 * @param cols Number of columns for the grid (default: 1)
 * @param options Optional properties to customize the grid element
 * @returns A grid Element object
 */
export function createGridElement(
  cols: number = 1, 
  options: Partial<Element> = {}
): GridElement {
  const id = options.id || uuidv4();
  
  // Default grid styles
  const defaultStyle: ElementStyle = {
    css: options.css?.css || '',
    container: `grid grid-cols-${cols} gap-4`
  };
  
  return {
    id,
    element: 'div',
    tag: 'grid',
    type: 'container',
    semantic: options.semantic || 'div',
    content: options.content || '',
    font: options.font || '',
    link: options.link || '',
    anchor: options.anchor || '',
    image: options.image || { url: '', caption: '', alt: '' },
    style: options.style || '',
    css: options.css || defaultStyle,
    data: options.data || {
      attributes: {},
      options: [],
      alpine: {},
      grid: {
        cols: cols
      }
    },
    gsap: options.gsap || {
      animation: '',
      duration: 0,
      delay: 0,
      ease: 'power1.out'
    },
    events: options.events || {
      click: '',
      display: '',
      hide: ''
    },
    blocks: options.blocks || [],
    icon: options.icon || 'grid_view',
    helper: 'GridHelper'
  };
}

/**
 * Creates a flexbox container element
 * 
 * @param direction Direction of the flexbox ('row' | 'col')
 * @param colspan Column span for the flexbox in a grid layout
 * @param options Optional properties to customize the flexbox element
 * @returns A flexbox Element object
 */
export function createFlexboxElement(
  direction: 'row' | 'col' = 'row', 
  colspan: number = 1, 
  options: Partial<Element> = {}
): Element {
  const id = options.id || uuidv4();
  
  // Default flexbox styles
  const defaultStyle: ElementStyle = {
    css: colspan > 1 ? `col-span-${colspan}` : '',
    container: `flex flex-${direction}`
  };
  
  return {
    id,
    element: 'div',
    tag: 'flex',
    type: 'container',
    semantic: options.semantic || 'div',
    content: options.content || '',
    font: options.font || '',
    link: options.link || '',
    anchor: options.anchor || '',
    image: options.image || { url: '', caption: '', alt: '' },
    style: options.style || '',
    css: options.css || defaultStyle,
    data: options.data || {
      attributes: {},
      options: [],
      alpine: {},
      flex: {
        direction: direction,
        colspan: colspan
      }
    },
    gsap: options.gsap || {
      animation: '',
      duration: 0,
      delay: 0,
      ease: 'power1.out'
    },
    events: options.events || {
      click: '',
      display: '',
      hide: ''
    },
    blocks: options.blocks || [],
    icon: options.icon || 'dashboard'
  };
}