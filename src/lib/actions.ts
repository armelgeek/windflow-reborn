import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import jp from 'jsonpath';
import { Block, Page } from '@/types/block';
import { Dispatch } from 'react';
import { EditorAction, editorActions } from '@/context/EditorContext';
import { createContainer, createFlexbox } from './elements';
import { createTemplate } from './blocks';
import Template from './templates';
import { modalActions } from '@/context/ModalContext';

/**
 * Exports the current document as a JSON file
 * 
 * @param dispatch Editor context dispatch function
 * @param confirmSave Whether to show a confirmation dialog
 * @param name Default name for the saved file
 * @param type Type of document being exported (document, block)
 */
export function exportDocument(
  dispatch: Dispatch<EditorAction>,
  confirmSave = true,
  name = 'windflow-document',
  type = 'document'
) {
  // Show confirmation dialog if needed
  if (confirmSave) {
    const result = window.confirm('Save Page?');
    if (!result) return;
  }
  
  // Get current page from editor state
  // We'll use getState helper to get the current state from context
  // This is an async operation so we'll handle it with a promise
  return new Promise((resolve, reject) => {
    dispatch({ 
      type: 'GET_STATE', 
      callback: (state) => {
        try {
          let page = { ...state.page };
          delete page.json;
          
          // Create info for building
          const pagePurge: Block = {
            id: 'temp-id',
            name: 'temp',
            description: '',
            category: 'Default',
            tags: [],
            json: {
              blocks: state.document,
              build: {
                purgeCSS: null,
                images: null,
                fonts: null,
                plugins: null
              }
            }
          };
          
          // Generate purge data
          purgeData(pagePurge);
          
          // Update page JSON
          const json = {
            blocks: state.document,
            build: pagePurge.json.build
          };
          
          page.json = json;
          
          // Remove coords & tailwind keys
          removeNestedObjectsKey(page.json.blocks, 'blocks', 'coords');
          removeNestedObjectsKey(page.json.blocks, 'blocks', 'tailwind');
          
          // Create and save the file
          const data = JSON.stringify(page);
          const blob = new Blob([data], { type: 'application/json' });
          saveAs(blob, page.name || name);
          
          resolve(true);
        } catch (error) {
          console.error('Error exporting document:', error);
          reject(error);
        }
      }
    });
  });
}

/**
 * Removes specified keys from all objects in a nested structure
 * 
 * @param currentNode The current node to process
 * @param arrayKey The key containing child arrays
 * @param deleteKey The key to delete
 */
function removeNestedObjectsKey(currentNode = {}, arrayKey = [], deleteKey = '') {
  delete currentNode[deleteKey];
  
  if (currentNode[arrayKey] && Array.isArray(currentNode[arrayKey])) {
    currentNode[arrayKey].forEach(obj => {
      removeNestedObjectsKey(obj, arrayKey, deleteKey);
    });
  }
  
  return currentNode;
}

/**
 * Generates purge data for the document
 * 
 * @param block The block to process
 */
function purgeData(block: Block) {
  // Purge CSS
  const css = jp.query(block.json.blocks, '$..blocks..css.css')
    .filter(a => a)
    .join(',')
    .split(' ')
    .filter(b => b)
    .join(',')
    .replaceAll(',,', ',')
    .split(',');
  
  const containers = jp.query(block.json.blocks, '$..blocks..css.container')
    .filter(c => c)
    .join(',')
    .split(' ')
    .filter(d => d)
    .join(',')
    .replaceAll(',,', ',')
    .split(',');
  
  const toPurge = [...css, ...containers];
  block.json.build.purgeCSS = [...new Set(toPurge)].sort();
  
  // Purge images
  const data = jp.query(block.json.blocks, '$..blocks..image.url')
    .filter(img => img);
  
  block.json.build.images = [...new Set(data.filter(a => !a.includes('http'))
    .join(',')
    .split(' '))]
    .filter(a => a);
  
  // Extract fonts
  const fonts = jp.query(block.json.blocks, '$..blocks..style')
    .filter(s => s && s.includes('font-family'))
    .map(f => f.replace('font-family:', '').replaceAll('"', '').replace(/[^a-z0-9]+/gi, ''));
  
  block.json.build.fonts = [...new Set(fonts)];
  
  return block;
}

export const createEmptyBlock = (
  editorDispatch: Dispatch<EditorAction>,
  desktopDispatch: Dispatch<DesktopAction>
) => {
  // 1. Créer le bloc conteneur racine (document)
  const rootContainer = createContainer({
    element: 'div',
    tag: 'document',
    icon: 'dashboard',
    type: 'container',
    css: { css: 'min-h-screen', container: 'flex flex-col' }
  });
  
  // 2. Créer un bloc flex à l'intérieur du document
  const flexBlock = createFlexbox('col');
  
  // 3. Ajouter le bloc flex au conteneur racine
  rootContainer.blocks.push(flexBlock);
  
  // 4. Créer un template avec le conteneur racine
  const template: Template = createTemplate('New Component', rootContainer);
  
  // 5. Mettre à jour l'état dans l'éditeur
  editorActions.setPage(editorDispatch, template);
  editorActions.setDocument(editorDispatch, template.json.blocks);
  editorActions.setCurrent(editorDispatch, flexBlock);
  
  // 6. Ajouter le template aux onglets
  desktopDispatch({
    type: 'ADD_TAB',
    payload: {
      label: template.name,
      object: template,
      type: 'editor'
    }
  });
};

/**
 * Opens the default template
 */
export const openDefaultTemplate = async (
  editorDispatch: Dispatch<EditorAction>,
  desktopDispatch: Dispatch<any>
) => {
  // This would typically fetch a default template from an API or local storage
  // For now, we'll create a simple default template
  const defaultTemplate = createDefaultTemplate();
  
  // Set the current document and page in editor context
  editorDispatch({ type: 'SET_PAGE', payload: defaultTemplate });
  editorDispatch({ type: 'SET_DOCUMENT', payload: defaultTemplate.json.blocks });
  
  // Add the template to tabs
  desktopDispatch({
    type: 'ADD_TAB',
    payload: {
      label: defaultTemplate.name,
      object: defaultTemplate,
      type: 'editor'
    }
  });
};

/**
 * Creates a default template with header, main, and footer sections
 */
export function createDefaultTemplate(): Template {
  // Create the root container
  const rootElement = createContainer({
    semantic: 'div',
    css: { css: 'min-h-screen bg-white', container: 'flex flex-col' }
  });
  
  // Create header, main, and footer sections
  const header = createHeaderSection();
  const main = createMainSection();
  const footer = createFooterSection();
  
  // Add sections to root element
  rootElement.blocks.push(header);
  rootElement.blocks.push(main);
  rootElement.blocks.push(footer);
  
  // Create and return the template
  return createTemplate('Default Template', rootElement);
}

/**
 * Creates a header section with logo and navigation
 */
export function createHeaderSection(): Element {
  const header = createContainer({
    semantic: 'header',
    tag: 'grid',
    css: { css: '', container: 'grid grid-cols-3 gap-4 p-4' }
  });
  
  // Logo area (1 column)
  const logo = createFlexbox('row', 1);
  logo.blocks.push(createHeading(1, 'Logo/Name'));
  
  // Navigation area (2 columns)
  const nav = createFlexbox('row', 2);
  nav.css.css = 'flex justify-end items-center';
  
  // Add logo and navigation to header
  header.blocks.push(logo);
  header.blocks.push(nav);
  
  return header;
}

/**
 * Creates a main content section
 */
export function createMainSection(): Element {
  const main = createContainer({
    semantic: 'main',
    tag: 'grid',
    css: { css: 'h-3/4', container: 'grid grid-cols-1 gap-4 p-4' }
  });
  
  // Create content area
  const content = createFlexbox('col');
  content.blocks.push(createParagraph('Main content area'));
  
  main.blocks.push(content);
  
  return main;
}

/**
 * Creates a footer section
 */
export function createFooterSection(): Element {
  const footer = createContainer({
    semantic: 'footer',
    tag: 'grid',
    css: { css: '', container: 'grid grid-cols-2 gap-4 p-4 bg-gray-100' }
  });
  
  // Create footer sections
  const footerLeft = createFlexbox();
  footerLeft.blocks.push(createParagraph('© 2025 My Website'));
  
  const footerRight = createFlexbox();
  footerRight.css.css = 'flex justify-end';
  footerRight.blocks.push(createParagraph('Contact Us'));
  
  footer.blocks.push(footerLeft);
  footer.blocks.push(footerRight);
  
  return footer;
}

/**
 * Opens the start empty dialog
 */
export const openStartEmptyDialog = (
  modalDispatch: Dispatch<any>
) => {
  modalActions.openModal(
    modalDispatch,
    'startEmpty',
    'New Template',
    'w-1/2',
    {}
  );
};

/**
 * Import helpers from elements.ts that were referenced in the original actions.js
 * These are simplified versions - the full implementation would be in elements.ts
 */
export function createHeading(level: number, content: string = ''): Element {
  return {
    id: uuidv4(),
    element: `h${level}`,
    tag: `h${level}`,
    level,
    content,
    semantic: `h${level}`,
    type: 'element',
    icon: 'title',
    blocks: [],
    css: { css: '', container: '' },
    data: { attributes: {}, options: [], alpine: {} },
    gsap: { animation: '', duration: 0, delay: 0, ease: 'power1.out' },
    events: { click: '', display: '', hide: '' },
    image: { url: '', caption: '', alt: '' }
  };
}

export function createParagraph(content: string = ''): Element {
  return {
    id: uuidv4(),
    element: 'p',
    tag: 'p',
    content,
    semantic: 'p',
    type: 'element',
    icon: 'subject',
    blocks: [],
    css: { css: '', container: '' },
    data: { attributes: {}, options: [], alpine: {} },
    gsap: { animation: '', duration: 0, delay: 0, ease: 'power1.out' },
    events: { click: '', display: '', hide: '' },
    image: { url: '', caption: '', alt: '' }
  };
}