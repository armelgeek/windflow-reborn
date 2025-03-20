// lib/templates.ts
import { v4 as uuidv4 } from 'uuid';
import { Element, ElementImage, ElementStyle } from '@/types/element';
import { createElement, createFlexbox, createGrid, createHeading, createParagraph, createButton, createImage, createIcon } from '@/lib/elements';

// Interface for template definition
export interface TemplateIcon {
  icon: string;
  template: string;
}

// Available template types
export const templatesIcon: Record<string, TemplateIcon> = {
  'Empty': { icon: 'mi:highlight_alt', template: 'empty' },
  'Navbar': { icon: 'mi:more_horiz', template: 'navbar' },
  'Call To Action': { icon: 'mi:call_to_action', template: 'cta' },
  'Call To Action Hor': { icon: 'mi:call_to_action', template: 'ctaHorizontal' },
  'Info Card': { icon: 'mi:feed', template: 'infoCard' },
  'Feature': { icon: 'mi:featured_video', template: 'feature' },
  'Pricing Box': { icon: 'mi:price_change', template: 'pricing' },
  'Hero': { icon: 'mi:art_track', template: 'hero' },
  'Slider': { icon: 'mi:view_carousel', template: 'slider' },
  'Team': { icon: 'mi:account_box', template: 'team' },
  'Simple form': { icon: 'mi:call_to_action', template: 'simpleForm' },
  'Rounded Input': { icon: 'mi:input', template: 'roundedInput' },
  'Input Icon': { icon: 'mi:input', template: 'inputIcon' },
  'Input Icon(R)': { icon: 'mi:input', template: 'inputIconR' },
  'Article': { icon: 'mi:article', template: 'article' },
  'Classic Page': { icon: 'mi:web', template: 'classicPage' },
  'Blog Homepage': { icon: 'mi:web', template: 'blog' }
};

// Template class for building template instances
export class Template {
  blocks: Element[];
  
  constructor() {
    this.blocks = [];
  }
  
  // Build a template based on the requested type
  build(name: string): Template | null {
    switch (name) {
      case 'empty': return this.empty();
      case 'article': return this.article();
      case 'classicPage': return this.classicPage();
      case 'blog': return this.blog();
      case 'navbar': return this.navbar();
      case 'infoCard': return this.infoCard();
      case 'hero': return this.hero();
      case 'slider': return this.slider();
      case 'cta': return this.cta();
      case 'ctaHorizontal': return this.ctaHorizontal();
      case 'feature': return this.feature();
      case 'pricing': return this.pricing();
      case 'team': return this.team();
      case 'simpleForm': return this.simpleForm();
      case 'roundedInput': return this.roundedInput();
      case 'inputIcon': return this.inputIcon();
      case 'inputIconR': return this.inputIconRight();
      default: return null;
    }
  }
  
  // Empty template
  empty(): Template {
    this.blocks.push(createFlexbox({
      direction: 'col',
      colspan: 1
    }));
    return this;
  }
  
  // Blog template
  blog(): Template {
    const container = createGrid();
    container.css.css = 'min-h-screen w-full';
    container.css.container = 'grid grid-cols-12 gap-4';
    
    const sidebar = createFlexbox({ direction: 'col', colspan: 3 });
    const body = createFlexbox({ direction: 'col', colspan: 9 });
    
    container.blocks.push(sidebar);
    container.blocks.push(body);
    this.blocks.push(container);
    
    return this;
  }
  
  // Classic page template with header, body, footer
  classicPage(): Template {
    const header = createGrid();
    header.css.container = 'grid grid-cols-3 gap-4';
    header.semantic = 'Header';
    
    const body = createGrid();
    body.css.css = 'h-3/4';
    body.css.container = 'grid grid-cols-1 gap-4';
    body.semantic = 'Main';
    
    const footer = createGrid();
    footer.css.container = 'grid grid-cols-2 gap-4';
    footer.semantic = 'Footer';
    
    // Add content to header
    const logo = createFlexbox({ direction: 'row', colspan: 1 });
    const menu = createFlexbox({ direction: 'row', colspan: 2 });
    logo.blocks.push(createHeading(1, 'Logo/Name'));
    
    header.blocks.push(logo);
    header.blocks.push(menu);
    
    // Add content to body
    const content = createFlexbox({ direction: 'col' });
    content.blocks.push(createParagraph('Main content area'));
    body.blocks.push(content);
    
    // Add content to footer
    const footerLeft = createFlexbox();
    const footerRight = createFlexbox();
    footer.blocks.push(footerLeft);
    footer.blocks.push(footerRight);
    
    this.blocks.push(header);
    this.blocks.push(body);
    this.blocks.push(footer);
    
    return this;
  }
  
  // Navbar template
  navbar(): Template {
    const container = createGrid();
    container.css.css = 'w-full bg-white shadow-lg';
    container.css.container = 'grid grid-cols-12 gap-4';
    
    const logo = createFlexbox({ direction: 'col', colspan: 3 });
    logo.css.css = 'items-center justify-center';
    
    const title = createHeading(2, 'Title');
    logo.blocks.push(title);
    
    const menu = createFlexbox({ direction: 'row', colspan: 9 });
    menu.css.css = 'items-center justify-center';
    
    // Add menu items
    for (let n = 0; n < 3; n++) {
      const menuItem = createElement('span', {
        content: `Item_${n + 1}`,
        css: { css: 'border-b border-transparent hover:border-black mx-6' }
      });
      menu.blocks.push(menuItem);
    }
    
    container.blocks.push(logo);
    container.blocks.push(menu);
    this.blocks.push(container);
    
    return this;
  }
  
  // Call to action template
  cta(): Template {
    const container = createGrid();
    container.css.css = 'w-full bg-white shadow-lg';
    container.css.container = 'grid grid-cols-12 gap-4';
    
    const flexbox = createFlexbox({ direction: 'col', colspan: 12 });
    flexbox.css.css = 'w-full items-center justify-center';
    
    const title = createHeading(2, 'Call To Action');
    const payoff = createHeading(4, 'Some CTA description');
    const button = createButton('Click me');
    button.css.css = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700';
    
    container.blocks.push(flexbox);
    flexbox.blocks.push(title);
    flexbox.blocks.push(payoff);
    flexbox.blocks.push(button);
    
    this.blocks.push(container);
    
    return this;
  }
  
  // Horizontal call to action
  ctaHorizontal(): Template {
    const container = createGrid();
    container.css.css = 'w-full bg-white shadow-lg';
    container.css.container = 'grid grid-cols-12 gap-4';
    
    const flexboxL = createFlexbox({ direction: 'col', colspan: 8 });
    flexboxL.css.css = 'w-full items-center justify-center';
    
    const flexboxR = createFlexbox({ direction: 'col', colspan: 4 });
    flexboxR.css.css = 'w-full items-center justify-center';
    
    const title = createHeading(2, 'Call To Action');
    const payoff = createHeading(4, 'Some CTA description');
    const button = createButton('Click me');
    button.css.css = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700';
    
    container.blocks.push(flexboxL);
    container.blocks.push(flexboxR);
    
    flexboxL.blocks.push(title);
    flexboxL.blocks.push(payoff);
    flexboxR.blocks.push(button);
    
    this.blocks.push(container);
    
    return this;
  }
  
  // Info card template
  infoCard(): Template {
    const container = createFlexbox({ direction: 'col' });
    container.css.css = 'w-64 justify-center items-center shadow';
    
    const content = createFlexbox({ direction: 'col' });
    content.css.css = 'w-full p-4 justify-start';
    
    const img = createImage();
    img.css.css = 'w-full h-auto object-cover';
    img.image = {
      url: 'https://res.cloudinary.com/moodgiver/image/upload/v1633344243/adventure_woman_rujic1.webp',
      alt: 'Info Card Image',
      caption: ''
    };
    
    const title = createHeading(4, 'Info Card');
    title.css.css = 'border-b-2';
    
    const description = createParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    
    const btn = createButton('Read more');
    btn.css.css = 'my-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700';
    
    container.blocks.push(img);
    content.blocks.push(title);
    content.blocks.push(description);
    content.blocks.push(btn);
    container.blocks.push(content);
    
    this.blocks.push(container);
    
    return this;
  }
  
  // Hero template
  hero(): Template {
    const grid = createGrid();
    grid.css.css = 'w-full p-2 md:p-20';
    grid.css.container = 'grid grid-cols-2 gap-4';
    
    const flexLeft = createFlexbox({ direction: 'col' });
    flexLeft.css.css = 'h-1/2 p-4 items-start justify-center';
    
    const flexRight = createFlexbox({ direction: 'col' });
    flexRight.css.css = 'h-1/2 bg-contain bg-no-repeat bg-center';
    flexRight.image = { 
      url: 'https://res.cloudinary.com/moodgiver/image/upload/v1617306150/Web_design_SVG_tsvcpl.svg',
      alt: 'Hero Image', 
      caption: '' 
    };
    
    const title = createHeading(1, 'I am a Hero');
    title.css.css = 'font-bold';
    
    const description = createParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    description.css.css = 'text-lg my-2';
    
    const cta = createButton('Click Me');
    cta.css.css = 'px-4 py-2 rounded bg-blue-400 text-white hover:bg-blue-700 my-4';
    
    flexLeft.blocks = [title, description, cta];
    grid.blocks = [flexLeft, flexRight];
    
    this.blocks.push(grid);
    
    return this;
  }
  
  // Feature template
  feature(): Template {
    const container = createFlexbox({ direction: 'col' });
    container.css.css = 'w-full md:w-56 justify-center items-center shadow px-6 py-4';
    
    const icon = createIcon('mi:laptop');
    icon.css.css = 'text-3xl';
    
    const title = createHeading(4, 'Feature');
    title.css.css = 'my-8';
    
    const description = createParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    description.css.css = 'text-center';
    
    container.blocks.push(icon);
    container.blocks.push(title);
    container.blocks.push(description);
    
    this.blocks.push(container);
    
    return this;
  }
  
  // Article template
  article(): Template {
    const container = createFlexbox({ direction: 'col' });
    container.css.css = 'justify-start items-start';
    
    const title = createHeading(1, 'Article Title');
    const subtitle = createElement('span', {
      content: 'Article Subtitle',
      css: { css: 'italic text-sm' }
    });
    
    const content = createParagraph(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dui nec arcu tincidunt auctor. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    );
    content.css.css = 'my-4 px-4';
    
    container.blocks = [title, subtitle, content];
    
    this.blocks.push(container);
    
    return this;
  }
  
  // Simplified versions of other templates
  // You would implement these methods similarly to the ones above
  
  slider(): Template {
    // Simplified implementation
    const slider = createElement('slider', {
      element: 'div',
      tag: 'slider',
      type: 'slider',
      css: { css: 'h-auto', container: '' },
      data: {
        slider: {
          navigation: {
            enable: true,
            dots: true,
            arrows: true,
            position: 'bottom'
          }
        }
      }
    });
    
    // Add a sample slide (reusing hero template)
    const heroTemplate = this.hero();
    slider.blocks = heroTemplate.blocks;
    
    this.blocks.push(slider);
    return this;
  }
  
  pricing(): Template {
    const container = createFlexbox({ direction: 'col' });
    container.css.css = 'w-full md:w-56 justify-center items-center shadow px-6 py-4';
    
    const price = createHeading(3, '<small>$</small> <b>99</b>.<small>00</small>');
    const title = createHeading(4, 'Basic');
    title.css.css = 'mb-4 border-t';
    
    const description = createParagraph('<ul><li>Unlimited users</li><li>Unlimited Bandwidth</li><li>Free Plugins</li></ul>');
    description.css.css = 'my-4';
    
    const button = createButton('Buy now');
    button.css.css = 'bg-blue-400 text-base text-white px-4 py-2 rounded hover:bg-blue-700';
    
    container.blocks.push(price);
    container.blocks.push(title);
    container.blocks.push(description);
    container.blocks.push(button);
    
    this.blocks.push(container);
    return this;
  }
  
  team(): Template {
    const container = createFlexbox({ direction: 'col' });
    container.css.css = 'w-56 justify-center items-center shadow px-6 py-4';
    
    const img = createImage();
    img.css.css = 'rounded-full h-40 w-40 object-cover';
    img.image = {
      url: 'https://res.cloudinary.com/moodgiver/image/upload/v1608198254/thumbnail_fashion_1_d66f5610d2.jpg',
      alt: 'Team Member',
      caption: ''
    };
    
    const title = createHeading(4, 'Sara Doe');
    title.css.css = 'mt-8 border-b-2';
    
    const description = createElement('span', {
      content: 'CEO',
      css: { css: 'text-center capitalize' }
    });
    
    container.blocks.push(img);
    container.blocks.push(title);
    container.blocks.push(description);
    
    this.blocks.push(container);
    return this;
  }
  
  // Form-related templates would use form elements
  simpleForm(): Template {
    // Implementation would go here
    this.blocks.push(createFlexbox({ direction: 'col' }));
    return this;
  }
  
  roundedInput(): Template {
    // Implementation would go here
    this.blocks.push(createFlexbox({ direction: 'row' }));
    return this;
  }
  
  inputIcon(): Template {
    // Implementation would go here
    this.blocks.push(createFlexbox({ direction: 'row' }));
    return this;
  }
  
  inputIconRight(): Template {
    // Implementation would go here
    this.blocks.push(createFlexbox({ direction: 'row' }));
    return this;
  }
}

export default Template;