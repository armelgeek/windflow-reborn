'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useModal } from '@/context/ModalContext';
import { IconButton } from '@/components/ui/IconButton';
import { 
  Blocks, 
  Paintbrush, 
  Code, 
  FileAttributes, 
  Snippets, 
  Package, 
  Animation, 
  LogoJavascript, 
  Sitemap 
} from 'lucide-react';

interface EditorSidebarTabsProps {
  tab?: string;
  expand?: boolean;
}

export default function EditorSidebarTabs({ tab, expand = false }: EditorSidebarTabsProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: modalDispatch } = useModal();
  const [iconTab, setIconTab] = useState<string>('elements');
  const [extend, setExtend] = useState<boolean>(false);

  // Initialize tab from props
  useEffect(() => {
    if (tab) {
      setIconTab(tab);
    }
  }, [tab]);

  // Listen for editor bus events
  useEffect(() => {
    // These would be replaced by context actions in React
    const handleCustomizeBlock = () => {
      sidebarHandler('customize');
    };

    const handleAddBlock = () => {
      sidebarHandler('elements');
    };

    const handleCssBlock = () => {
      sidebarHandler('css');
    };

    const handleAnimationBlock = () => {
      sidebarHandler('animation');
    };

    // Set up event listeners via context
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'customizeBlock', handler: handleCustomizeBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'addBlock', handler: handleAddBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'cssBlock', handler: handleCssBlock } });
    dispatch({ type: 'REGISTER_LISTENER', payload: { event: 'animationBlock', handler: handleAnimationBlock } });

    // Cleanup event listeners
    return () => {
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'customizeBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'addBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'cssBlock' } });
      dispatch({ type: 'REMOVE_LISTENER', payload: { event: 'animationBlock' } });
    };
  }, [dispatch]);

  // Check if tab is active
  const isTabActive = (tabName: string): boolean => {
    return iconTab === tabName;
  };

  // Handle sidebar tab clicks
  const sidebarHandler = (tabName: string) => {
    setIconTab(tabName);
    dispatch({ type: 'SIDEBAR', payload: tabName });
  };

  // Handle blocks gallery click
  const blocksGalleryHandler = () => {
    modalDispatch({ type: 'OPEN_MODAL', payload: { component: 'blocksGallery', title: 'Blocks Gallery' } });
  };

  // Only render if there's a current editor document
  if (!state.editor?.current) {
    return null;
  }

  return (
    <div className="pl-1 cursor-pointer text-gray-400">
      {/* Elements tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('elements') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('elements')}
        title="Add element"
      />

      {/* Customize tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('customize') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('customize')}
        title="Tailwind Controls"
      />

      {/* CSS tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('css') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('css')}
        title="CSS & Style"
      />

      {/* Attributes tab */}
      <button
        className="text-xl icon-button ml-0 mb-1 cursor-pointer"
        onClick={() => sidebarHandler('attributes')}
        title="Attributes"
      />

      {/* Snippets tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('snippets') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('snippets')}
        title="Snippets"
      />

      {/* Library tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('library') ? 'bg-purple-600 text-white' : ''}`}
        onClick={blocksGalleryHandler}
        title="Library"
      />

      {/* Animation tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('animation') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('animation')}
        title="Animation"
      />

      {/* Alpine JS tab */}
      <button
        className="text-xl icon-button ml-0 mb-1 cursor-pointer"
        onClick={() => sidebarHandler('alpine')}
        title="Alpine JS"
      />

      {/* Element Tree tab */}
      <button
        className={`icon-button ml-0 mb-1 ${isTabActive('info') ? 'bg-purple-600 text-white' : ''}`}
        onClick={() => sidebarHandler('tree')}
        title="Element Tree"
      />
    </div>
  );
}