import { v4 as uuidv4 } from 'uuid';
import { Block } from '@/types/block';
import { Element } from '@/types/element';
import {
    createButton,
    createContainer,
    createFlexbox,
    createForm,
    createGrid,
    createHeading,
    createInput,
    createParagraph, createTextarea
} from './elements';
import {Template} from "@/types/template";
import { randomId } from './utils';

export function createBlock(name: string, element: Element): Block {
    return {
        id: randomId(),
        name,
        description: '',
        category: 'Default',
        tags: [],
        json: {
            blocks: element
        }
    };
}

export function createTemplate(name: string, element: Element): Template {
    return {
        id: randomId(),
        name,
        description: '',
        category: 'Default',
        tags: [],
        json: {
            blocks: element
        }
    };
}

export function createEmptyTemplate(): Template {
    const rootElement = createContainer({
        semantic: 'div',
        css: { css: 'min-h-screen bg-white', container: 'flex flex-col' }
    });

    return createTemplate('New Template', rootElement);
}

export function createDefaultTemplate(): Template {
    const rootElement = createContainer({
        semantic: 'div',
        css: { css: 'min-h-screen bg-white', container: 'flex flex-col' }
    });

    const header = createGrid(3);
    header.semantic = 'header';

    const logo = createFlexbox('row', 1);
    logo.blocks.push(createHeading(1, 'Logo/Name'));

    const nav = createFlexbox('row', 2);

    header.blocks.push(logo);
    header.blocks.push(nav);

    const main = createGrid(1);
    main.semantic = 'main';
    main.css.css = 'h-3/4';

    const content = createFlexbox('col');
    content.blocks.push(createParagraph('Main content area'));

    main.blocks.push(content);

    const footer = createGrid(2);
    footer.semantic = 'footer';

    const footerLeft = createFlexbox();
    const footerRight = createFlexbox();

    footer.blocks.push(footerLeft);
    footer.blocks.push(footerRight);

    rootElement.blocks.push(header);
    rootElement.blocks.push(main);
    rootElement.blocks.push(footer);

    return createTemplate('Default Template', rootElement);
}

export const templateSnippets = {
    hero: () => {
        const hero = createContainer({
            semantic: 'section',
            css: { css: 'bg-gray-100 py-12', container: 'container mx-auto px-4' }
        });

        const content = createFlexbox('row');
        content.css.container = 'flex flex-col md:flex-row items-center';

        const textCol = createFlexbox('col', 1);
        textCol.css.css = 'md:w-1/2 mb-8 md:mb-0 md:pr-8';

        textCol.blocks.push(createHeading(1, 'Your Awesome Headline'));
        textCol.blocks.push(createParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae dui nec arcu tincidunt auctor.'));

        const imageCol = createFlexbox('col', 1);
        imageCol.css.css = 'md:w-1/2';

        const image = createImage();
        image.image = { url: '/api/placeholder/600/400', alt: 'Hero image' };
        image.css.css = 'rounded-lg shadow-lg';

        imageCol.blocks.push(image);

        content.blocks.push(textCol);
        content.blocks.push(imageCol);
        hero.blocks.push(content);

        return hero;
    },

    features: () => {
        const features = createContainer({
            semantic: 'section',
            css: { css: 'py-12 bg-white', container: 'container mx-auto px-4' }
        });

        const heading = createFlexbox('col');
        heading.css.css = 'text-center mb-12';

        heading.blocks.push(createHeading(2, 'Features'));
        heading.blocks.push(createParagraph('Our amazing features that will help you succeed.'));

        features.blocks.push(heading);

        const grid = createGrid(3);
        grid.css.container = 'grid grid-cols-1 md:grid-cols-3 gap-8';

        for (let i = 1; i <= 3; i++) {
            const feature = createFlexbox('col');
            feature.css.css = 'p-6 border rounded-lg';

            const icon = createIcon('star');
            icon.css.css = 'text-3xl text-blue-500 mb-4';

            feature.blocks.push(icon);
            feature.blocks.push(createHeading(3, `Feature ${i}`));
            feature.blocks.push(createParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'));

            grid.blocks.push(feature);
        }

        features.blocks.push(grid);

        return features;
    },

    contactForm: () => {
        const contact = createContainer({
            semantic: 'section',
            css: { css: 'py-12 bg-gray-100', container: 'container mx-auto px-4 max-w-3xl' }
        });

        const heading = createFlexbox('col');
        heading.css.css = 'text-center mb-8';

        heading.blocks.push(createHeading(2, 'Contact Us'));
        heading.blocks.push(createParagraph('Fill out the form below and we\'ll get back to you.'));

        contact.blocks.push(heading);

        const form = createForm();
        form.css.css = 'bg-white p-6 rounded-lg shadow-md';

        const nameField = createFlexbox('col');
        nameField.css.css = 'mb-4';

        nameField.blocks.push(createLabel('Name'));
        nameField.blocks.push(createInput('text', 'Your name'));

        const emailField = createFlexbox('col');
        emailField.css.css = 'mb-4';

        emailField.blocks.push(createLabel('Email'));
        emailField.blocks.push(createInput('email', 'Your email'));

        const messageField = createFlexbox('col');
        messageField.css.css = 'mb-6';

        messageField.blocks.push(createLabel('Message'));

        const textarea = createTextarea('Your message', 5);
        textarea.css.css = 'w-full px-3 py-2 border rounded';

        messageField.blocks.push(textarea);

        const submitButton = createButton('Send Message');
        submitButton.css.css = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full';

        const buttonField = createFlexbox('col');
        buttonField.blocks.push(submitButton);

        form.blocks.push(nameField);
        form.blocks.push(emailField);
        form.blocks.push(messageField);
        form.blocks.push(buttonField);

        contact.blocks.push(form);

        return contact;
    }
};

function createLabel(text: string): Element {
    return createElement('label', {
        element: 'label',
        tag: 'label',
        content: text,
        semantic: 'label',
        css: { css: 'block text-gray-700 text-sm font-bold mb-2', container: '' }
    });
}

function createElement(
    type: string,
    options: Partial<Element> = {}
): Element {
    const id = options.id || randomId();

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
        image: options.image || { url: '', caption: '', alt: '' },
        style: options.style || '',
        css: options.css || { css: '', container: '' },
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

function createImage(src: string = '', alt: string = ''): Element {
    return createElement('image', {
        element: 'img',
        tag: 'img',
        image: { url: src, alt },
        icon: 'photo'
    });
}

function createIcon(icon: string = 'star'): Element {
    return createElement('icon', {
        element: 'span',
        tag: 'iconify',
        icon,
        data: {
            icon
        }
    });
}
