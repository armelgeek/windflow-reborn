// lib/findElements.ts

/**
 * Finds elements in a document structure using a path expression similar to JSONPath
 * @param obj The object to search
 * @param path The path expression to match
 * @returns Array of matching elements
 */
export function findElements(obj: any, path: string): any[] {
    if (!obj) return [];
    
    // Parse the path expression
    const parts = path.split('..');
    const rootPart = parts[0];
    const propertyPath = parts[1];
    
    // Regular expressions for matching parts of the path
    const blockRegex = /\$\.blocks/;
    const propertyRegex = /\[(.*?)\]/;
    
    // Extract the property name from the path
    const propertyMatch = propertyPath?.match(propertyRegex);
    const propertyName = propertyMatch ? propertyMatch[1].replace(/['"]/g, '') : propertyPath;
    
    // Helper function to recursively traverse the object
    function traverse(current: any, results: any[] = []): any[] {
      // Skip if current is not an object or is null
      if (!current || typeof current !== 'object') {
        return results;
      }
      
      // Check if the current object has the property we're looking for
      if (propertyName && current.hasOwnProperty(propertyName)) {
        if (current[propertyName]) {
          results.push(current[propertyName]);
        }
      }
      
      // Check for blocks property and traverse each block
      if (current.blocks && Array.isArray(current.blocks)) {
        current.blocks.forEach((block: any) => {
          traverse(block, results);
        });
      }
      
      // Check other properties that might be objects or arrays
      Object.keys(current).forEach((key) => {
        const value = current[key];
        
        // Skip blocks property as we've already handled it
        if (key === 'blocks') {
          return;
        }
        
        // Traverse arrays
        if (Array.isArray(value)) {
          value.forEach((item) => {
            traverse(item, results);
          });
        }
        // Traverse objects
        else if (value && typeof value === 'object') {
          traverse(value, results);
        }
      });
      
      return results;
    }
    
    return traverse(obj);
  }
  
  /**
   * Find elements with a specific property set to a certain value
   * @param obj The object to search
   * @param property The property name to check
   * @param value The value to match
   * @returns Array of matching elements
   */
  export function findElementsByProperty(obj: any, property: string, value: any): any[] {
    const results: any[] = [];
    
    // Helper function to recursively traverse the object
    function traverse(current: any): void {
      // Skip if current is not an object or is null
      if (!current || typeof current !== 'object') {
        return;
      }
      
      // Check if the current object has the property we're looking for
      if (current.hasOwnProperty(property) && current[property] === value) {
        results.push(current);
      }
      
      // Check for blocks property and traverse each block
      if (current.blocks && Array.isArray(current.blocks)) {
        current.blocks.forEach((block: any) => {
          traverse(block);
        });
      }
      
      // Check other properties that might be objects or arrays
      Object.keys(current).forEach((key) => {
        const propValue = current[key];
        
        // Skip blocks property as we've already handled it
        if (key === 'blocks') {
          return;
        }
        
        // Traverse arrays
        if (Array.isArray(propValue)) {
          propValue.forEach((item) => {
            traverse(item);
          });
        }
        // Traverse objects
        else if (propValue && typeof propValue === 'object') {
          traverse(propValue);
        }
      });
    }
    
    traverse(obj);
    return results;
  }
  
  /**
   * Find an element by ID
   * @param obj The object to search
   * @param id The ID to find
   * @returns The matching element or null
   */
  export function findElementById(obj: any, id: string): any | null {
    // Skip if obj is not an object or is null
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    
    // Check if the current object has the ID we're looking for
    if (obj.id === id) {
      return obj;
    }
    
    // Check for blocks property and traverse each block
    if (obj.blocks && Array.isArray(obj.blocks)) {
      for (const block of obj.blocks) {
        const found = findElementById(block, id);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  }
  
  export default {
    findElements,
    findElementsByProperty,
    findElementById
  };