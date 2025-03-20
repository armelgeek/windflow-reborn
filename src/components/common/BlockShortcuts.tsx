'use client';

import { useState, useEffect } from 'react';
import shortcuts from '@/lib/hotkeys';

interface ShortcutEntry {
  key: string;
  description: string;
}

export default function BlockShortcuts() {
  const [shortcutEntries, setShortcutEntries] = useState<ShortcutEntry[]>([]);
  
  useEffect(() => {
    // Convert shortcuts object to array of entries
    const entries = Object.keys(shortcuts).map(key => ({
      key,
      description: shortcuts[key as keyof typeof shortcuts]
    }));
    
    setShortcutEntries(entries);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
      {shortcutEntries.map(shortcut => (
        <div key={shortcut.key} className="my-1 flex items-center">
          <span className="chip p-1 px-2 bg-gray-200 rounded">Alt</span>
          <span> + </span>
          <span className="chip bg-purple-400 p-1 px-2 text-white font-bold rounded mx-1">
            {shortcut.key}
          </span>
          <span className="ml-2 font-bold">{shortcut.description}</span>
        </div>
      ))}
    </div>
  );
}