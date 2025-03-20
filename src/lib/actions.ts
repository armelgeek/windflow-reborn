// lib/actions.ts

import { saveAs } from 'file-saver';
import jp from 'jsonpath';
import { Block, Page } from '@/types/block';
import { Dispatch } from 'react';
import { EditorAction } from '@/context/EditorContext';

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
  name = 'whoobe-document',
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