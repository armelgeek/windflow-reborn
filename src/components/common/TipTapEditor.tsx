import React, { useEffect, useState } from 'react';
import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, 
  Heading3, List, ListOrdered, Quote, Undo, Redo, 
  Image as ImageIcon
} from 'lucide-react';

interface TipTapEditorProps {
  onClose?: () => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onClose }) => {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const [image, setImage] = useState<string | null>(null);
  const [addImage, setAddImage] = useState(false);
  
  // Setup TipTap editor
  const editor = useTiptapEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content: state.current?.content || '',
    onUpdate: ({ editor }) => {
      if (state.current) {
        dispatch({
          type: 'UPDATE_CURRENT',
          payload: {
            ...state.current,
            content: editor.getHTML()
          }
        });
      }
    }
  });
  
  // Handle setting an image
  const handleSetImage = () => {
    if (editor && image) {
      editor.chain().focus().setImage({ src: image }).run();
      setImage(null);
      setAddImage(false);
    }
  };
  
  // Close modal
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      modalDispatch({ type: 'CLOSE_MODAL' });
    }
  };
  
  if (!editor) {
    return null;
  }
  
  return (
    <div className="p-2 bg-white h-3/4">
      {/* Toolbar */}
      <div className="flex flex-row w-full shadow p-1 items-center justify-between mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        >
          <Strikethrough size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
        >
          <Code size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
        >
          <span className="font-bold">P</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading1 size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading2 size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading3 size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-icon p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        >
          <Quote size={20} />
        </button>
        
        <button
          onClick={() => setAddImage(!addImage)}
          className="toolbar-icon p-2 rounded"
        >
          <ImageIcon size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="toolbar-icon p-2 rounded"
          disabled={!editor.can().undo()}
        >
          <Undo size={20} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="toolbar-icon p-2 rounded"
          disabled={!editor.can().redo()}
        >
          <Redo size={20} />
        </button>
      </div>
      
      {/* Image URL input */}
      {addImage && (
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter image URL"
            value={image || ''}
            onChange={(e) => setImage(e.target.value)}
            className="p-2 border rounded flex-grow mr-2"
          />
          <button
            onClick={handleSetImage}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Insert
          </button>
        </div>
      )}
      
      {/* Editor content */}
      <div className="absolute inset-0 overflow-y-auto mt-32 mb-10 mx-4 border">
        <EditorContent editor={editor} className="p-4 min-h-full" />
      </div>
      
      {/* Bottom buttons */}
      <div className="absolute bottom-0 right-0 p-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

export default TipTapEditor;