'use client';

import { useState, useEffect } from 'react';
import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEditor } from '@/context/EditorContext';
import { Icon } from '@iconify/react';

interface BlockTipTapProps {
  value?: string;
  onInput?: (html: string) => void;
  onClose?: () => void;
}

export default function BlockTipTap({ value, onInput, onClose }: BlockTipTapProps) {
  const [image, setImage] = useState<string | null>(null);
  const [addImage, setAddImage] = useState<boolean>(false);
  const { state: editorState, dispatch } = useEditor();
  
  // Initialize TipTap editor
  const tiptapEditor = useTiptapEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content: value || (editorState.current?.content || ''),
    onUpdate: ({ editor }) => {
      // Get HTML content from editor
      const html = editor.getHTML();
      
      // Pass to parent if callback provided
      if (onInput) {
        onInput(html);
      } else if (editorState.current && dispatch) {
        // Otherwise update current element content
        const updatedElement = { ...editorState.current };
        updatedElement.content = html;
        dispatch({ type: 'SET_CURRENT', payload: updatedElement });
      }
    }
  });
  
  // Handle image addition
  const setImageInEditor = () => {
    if (image && tiptapEditor) {
      tiptapEditor.chain().focus().setImage({ src: image }).run();
      setImage(null);
      setAddImage(false);
    }
  };
  
  return (
    <div className="p-2 bg-white h-3/4">
      {tiptapEditor && (
        <div className="flex flex-row w-full shadow p-1 items-center justify-between">
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('bold') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleBold().run()}
          >
            <Icon icon="mi:format_bold" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('italic') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleItalic().run()}
          >
            <Icon icon="mi:format_italic" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('strike') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleStrike().run()}
          >
            <Icon icon="mi:format_strikethrough" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('code') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleCode().run()}
          >
            <Icon icon="mi:code" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('paragraph') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().setParagraph().run()}
          >
            <Icon icon="mi:subject" className="text-xl" />
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            h1
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            h2
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            h3
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 4 }).run()}
          >
            h4
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 5 }).run()}
          >
            h5
          </button>
          
          <button 
            className="toolbar-icon bg-transparent text-black p-0"
            onClick={() => tiptapEditor.chain().focus().toggleHeading({ level: 6 }).run()}
          >
            h6
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('bulletList') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleBulletList().run()}
          >
            <Icon icon="mi:list" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('orderedList') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleOrderedList().run()}
          >
            <Icon icon="mi:format_list_numbered" className="text-xl" />
          </button>
          
          <button 
            className={`toolbar-icon ${tiptapEditor.isActive('blockquote') ? 'is-active' : ''}`}
            onClick={() => tiptapEditor.chain().focus().toggleBlockquote().run()}
          >
            <Icon icon="mi:format_quote" className="text-xl" />
          </button>
          
          <button 
            className="toolbar-icon"
            onClick={() => tiptapEditor.chain().focus().setHorizontalRule().run()}
          >
            <Icon icon="mi:horizontal_rule" className="text-xl" />
          </button>
          
          <button 
            className="toolbar-icon"
            onClick={() => setAddImage(!addImage)}
          >
            <Icon icon="mi:photo" className="text-xl" />
          </button>
          
          {addImage && (
            <div className="flex">
              <input 
                type="text" 
                value={image || ''}
                onChange={(e) => setImage(e.target.value)}
                className="border rounded px-2 py-1 mr-1"
                placeholder="Image URL"
              />
              <button 
                onClick={setImageInEditor}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="absolute inset-0 overflow-y-auto mt-32 mb-10 mx-4 border">
        <EditorContent editor={tiptapEditor} />
      </div>

      <style jsx>{`
        .toolbar-icon {
          @apply mx-1 p-1 rounded hover:bg-gray-200 cursor-pointer;
        }
        
        .is-active {
          @apply bg-gray-200;
        }
      `}</style>
    </div>
  );
}