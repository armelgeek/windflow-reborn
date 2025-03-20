'use client';

import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useEditor, editorActions } from '@/context/EditorContext';
import { RiCloseLine, RiMenu2Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface TabsProps {
    className?: string;
}

export default function Tabs({ className = '' }: TabsProps) {
    const { state: desktopState, dispatch: desktopDispatch } = useDesktop();
    const { state: editorState, dispatch: editorDispatch } = useEditor();
    const router = useRouter();

    const isPreview = false; // Replace with actual check

    const handleHomeClick = () => {
        desktopActions.setCurrentTab(desktopDispatch, -1);
        router.push('/');
    };

    const openTab = (index: number) => {
        desktopActions.setCurrentTab(desktopDispatch, index);

        const tab = desktopState.tabs[index];
        if (tab.type === 'editor') {
            editorActions.setPage(editorDispatch, tab.object);
            editorActions.setDocument(editorDispatch, tab.object.json.blocks);
        }

        if (tab.type === 'component') {
            desktopActions.setComponent(desktopDispatch, tab.object);
        }
    };

    const removeTab = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        desktopActions.removeTab(desktopDispatch, index);
    };

    const getActiveTabClass = (index: number) => {
        return index === desktopState.currentTab
            ? 'bg-white text-gray-400'
            : 'bg-purple-900';
    };

    if (!desktopState.tabs || isPreview) return null;

    return (
        <div className={`fixed top-0 left-0 h-8 items-center bg-purple-900 w-screen z-30 flex flex-wrap ${className}`}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="h-8 w-8 items-center justify-center flex text-white"
                onClick={handleHomeClick}
            >
                <RiMenu2Line />
            </motion.button>

            {desktopState.tabs.map((tab, index) => (
                <div
                    key={`tab-${index}`}
                    className={`relative border-l border-r border-purple-600 rounded-t hover:bg-black text-white px-2 flex items-center cursor-pointer h-8 w-32 ${getActiveTabClass(index)}`}
                    title={tab.label}
                >
          <span
              className="w-24 truncate ml-1"
              onClick={() => openTab(index)}
          >
            {tab.label}
          </span>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-0 mr-2"
                        onClick={(e) => removeTab(index, e)}
                    >
                        <RiCloseLine />
                    </motion.button>
                </div>
            ))}
        </div>
    );
}
