'use client';

import { useRouter } from 'next/navigation';
import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useModal, modalActions } from '@/context/ModalContext';
import {
    RiArrowLeftLine,
    RiDashboardLine,
    RiAddLine,
    RiLayoutGridLine,
    RiCodeLine,
    RiSettings3Line,
    RiGithubLine,
    RiQuestionLine
} from 'react-icons/ri';
import { motion } from 'framer-motion';

interface DesktopSidebarLeftProps {
    onToggle?: () => void;
}

export default function DesktopSidebarLeft({ onToggle }: DesktopSidebarLeftProps) {
    const router = useRouter();
    const { dispatch: desktopDispatch } = useDesktop();
    const { dispatch: modalDispatch } = useModal();

    const handleClose = () => {
        if (onToggle) onToggle();
    };

    const navigateToDashboard = () => {
        desktopActions.setCurrentTab(desktopDispatch, -1);
        desktopActions.setComponent(desktopDispatch, null);
        handleClose();
    };

    const openStartEmptyDialog = () => {
        modalActions.openModal(
            modalDispatch,
            'startEmpty',
            'New Template',
            'w-1/2',
            {}
        );
        handleClose();
    };

    const openUIKitDialog = () => {
        desktopActions.addTab(desktopDispatch, {
            label: 'UI Kit',
            object: 'UIKitComponent',
            type: 'component'
        });
        handleClose();
    };

    const openTemplatesDialog = () => {
        desktopActions.setDbMode(desktopDispatch, true);
        desktopActions.addTab(desktopDispatch, {
            label: 'Templates',
            object: 'TemplatesComponent',
            type: 'component',
            mode: 'dbmode'
        });
        handleClose();
    };

    const openSettingsDialog = () => {
        modalActions.openModal(
            modalDispatch,
            'settings',
            'Settings'
        );
        handleClose();
    };

    const openGithubLink = () => {
        window.open('https://github.com/username/create-next', '_blank');
        handleClose();
    };

    const openHelpDialog = () => {
        modalActions.openModal(
            modalDispatch,
            'help',
            'Documentation'
        );
        handleClose();
    };

    return (
        <div className="fixed z-30 w-12 md:w-10 flex flex-col items-center pt-2 h-screen bg-purple-900 text-white cursor-pointer">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={handleClose}
                title="Close"
            >
                <RiArrowLeftLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={navigateToDashboard}
                title="Dashboard"
            >
                <RiDashboardLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={openStartEmptyDialog}
                title="New template"
            >
                <RiAddLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={openUIKitDialog}
                title="UI Kit"
            >
                <RiLayoutGridLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={openTemplatesDialog}
                title="Templates"
            >
                <RiCodeLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={openSettingsDialog}
                title="Settings"
            >
                <RiSettings3Line />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button mb-2"
                onClick={openGithubLink}
                title="Github"
            >
                <RiGithubLine />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="icon-button"
                onClick={openHelpDialog}
                title="Docs"
            >
                <RiQuestionLine />
            </motion.button>
        </div>
    );
}
