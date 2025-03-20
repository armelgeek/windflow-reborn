// lib/hotkeys.ts

// Define the keyboard shortcuts and their descriptions
const shortcuts = {
    R: 'Remove selected block',
    D: 'Duplicate selected block',
    C: 'Copy selected block',
    V: 'Paste block',
    G: 'Copy block CSS and style',
    H: 'Paste CSS and style',
    K: 'Keyboard Shortcuts',
    Z: 'Customizer',
    '+': 'Add element',
    '<': 'Edit CSS and style',
    N: 'Preview',
    '1': 'Add Grid',
    '2': 'Add Flexbox',
    '3': 'Add Heading',
    '4': 'Add Paragraph',
    '5': 'Add Inline Text',
    '6': 'Add Image',
    '7': 'Add Button'
  };
  
  // If you're using TypeScript, you can add a type definition to make
  // working with this object easier in other files
  type ShortcutKeys = 'R' | 'D' | 'C' | 'V' | 'G' | 'H' | 'K' | 'Z' | '+' | '<' | 'N' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
  type ShortcutsType = Record<ShortcutKeys, string>;
  
  // Export the shortcuts object
  export default shortcuts as ShortcutsType;
  
  // You would set up keyboard event listeners in a separate file
  // that watches for these key combinations and triggers the appropriate actions.
  // Example implementation would be in a useKeyboardShortcuts.ts hook.