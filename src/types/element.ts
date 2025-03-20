export interface ElementStyle {
    css: string;
    container: string;
}

export interface ElementImage {
    url: string;
    caption?: string;
    alt?: string;
}

export interface ElementData {
    icon?: string;
    attributes?: Record<string, any>;
    options?: string[];
    alpine?: Record<string, string>;
    slider?: {
        navigation: {
            enable: boolean;
            dots: boolean;
            arrows: boolean;
            position: string;
        }
    };
    javascript?: string;
}

export interface ElementGsap {
    animation: string;
    duration: number;
    delay: number;
    ease: string;
}

export interface ElementEvents {
    click?: string;
    display?: string;
    hide?: string;
}

export interface Element {
    id: string;
    element: string;
    tag: string;
    type: 'container' | 'element' | 'slider';
    semantic?: string;
    level?: number;
    content?: string;
    font?: string;
    link?: string;
    anchor?: string;
    image?: ElementImage;
    style?: string;
    css: ElementStyle;
    data: ElementData;
    gsap: ElementGsap;
    events: ElementEvents;
    blocks?: Element[];
    value?: string;
    icon?: string;
    placeholder?: string;
    src?: string;
}

export interface ElementImage {
    url: string;
    caption?: string;
    alt?: string;
    size?: string;
    width?: number;
    height?: number;
  }
  
  export interface ElementStyle {
    css: string;
    container: string;
  }
  
  export interface ElementData {
    attributes?: Record<string, string | number | boolean>;
    options?: any[];
    alpine?: Record<string, string>;
    grid?: {
      cols: number;
    };
    flex?: {
      direction: 'row' | 'col';
      colspan: number;
    };
    slider?: {
      navigation?: {
        enable?: boolean;
        dots?: boolean;
        arrows?: boolean;
        position?: 'top' | 'bottom' | 'left' | 'right';
      };
    };
    [key: string]: any;
  }
  
  export interface ElementGsap {
    animation: string;
    duration: number;
    delay: number;
    ease: string;
    trigger?: boolean;
  }
  
  export interface ElementEvents {
    click: string;
    display: string;
    hide: string;
    mouseenter?: string;
    mouseleave?: string;
    focus?: string;
    blur?: string;
    keydown?: string;
  }
  
  export interface Element {
    id: string;
    element: string;
    tag: string;
    type: 'element' | 'container' | 'slider' | 'video' | 'audio' | 'file' | 'button';
    semantic?: string;
    level?: number;
    content: string;
    font: string;
    link: string;
    anchor: string;
    image: ElementImage;
    style: string;
    css: ElementStyle;
    data: ElementData;
    gsap: ElementGsap;
    events: ElementEvents;
    blocks: Element[];
    value?: string;
    icon?: string;
    helper?: string;
    dialog?: string;
    placeholder?: string;
    src?: string;
    editable?: boolean;
    description?: string;
    categories?: string[];
    coords?: DOMRect;
  }
  
  // Specific element types
  export interface GridElement extends Element {
    tag: 'grid';
    data: ElementData & {
      grid: {
        cols: number;
      };
    };
  }
  
  export interface FlexboxElement extends Element {
    tag: 'flex';
    data: ElementData & {
      flex: {
        direction: 'row' | 'col';
        colspan: number;
      };
    };
  }
  
  export interface SliderElement extends Element {
    tag: 'slider';
    type: 'slider';
    data: ElementData & {
      slider: {
        navigation?: {
          enable?: boolean;
          dots?: boolean;
          arrows?: boolean;
          position?: 'top' | 'bottom' | 'left' | 'right';
        };
      };
    };
  }
  
  export interface HeadingElement extends Element {
    element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
  
  export interface ImageElement extends Element {
    element: 'img';
    image: ElementImage;
  }
  
  export interface InputElement extends Element {
    element: 'input';
    placeholder: string;
    data: ElementData & {
      attributes: {
        name: string;
        id: string;
        placeholder: string;
        required?: boolean;
        type?: string;
      };
    };
  }