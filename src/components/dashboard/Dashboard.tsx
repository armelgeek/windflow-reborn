'use client';

import { useDesktop, desktopActions } from '@/context/DesktopContext';
import { useModal, modalActions } from '@/context/ModalContext';
import { motion } from 'framer-motion';
import {
  RiAddLine,
  RiLayoutGridLine,
  RiCodeLine,
  RiSettings3Line,
  RiGithubLine,
  RiQuestionLine
} from 'react-icons/ri';
import { useEffect } from 'react';

// Menu item type
interface MenuItem {
  label: string;
  icon: JSX.Element;
  action: () => void;
}

export default function Dashboard() {
  const { dispatch: desktopDispatch } = useDesktop();
  const { dispatch: modalDispatch } = useModal();

  // Define menu items
  const menuItems: MenuItem[] = [
    {
      label: 'New template',
      icon: <RiAddLine className="text-3xl" />,
      action: () => modalActions.openModal(modalDispatch, 'startEmpty', 'New Template')
    },
    {
      label: 'UI Kit',
      icon: <RiLayoutGridLine className="text-3xl" />,
      action: () => {
        desktopActions.addTab(desktopDispatch, {
          label: 'UI Kit',
          object: 'UIKitComponent',
          type: 'component'
        });
      }
    },
    {
      label: 'Templates',
      icon: <RiCodeLine className="text-3xl" />,
      action: () => {
        desktopActions.setDbMode(desktopDispatch, true);
        desktopActions.addTab(desktopDispatch, {
          label: 'Templates',
          object: 'TemplatesComponent',
          type: 'component',
          mode: 'dbmode'
        });
      }
    },
    {
      label: 'Settings',
      icon: <RiSettings3Line className="text-3xl" />,
      action: () => modalActions.openModal(modalDispatch, 'settings', 'Settings')
    },
    {
      label: 'Github',
      icon: <RiGithubLine className="text-3xl" />,
      action: () => window.open('https://github.com/username/whoobe-next', '_blank')
    },
    {
      label: 'Docs',
      icon: <RiQuestionLine className="text-3xl" />,
      action: () => modalActions.openModal(modalDispatch, 'help', 'Documentation')
    }
  ];

  // Reset active tab on mount
  useEffect(() => {
    desktopActions.setCurrentTab(desktopDispatch, -1);
  }, [desktopDispatch]);

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: index * 0.1
      }
    })
  };

  return (
    <div className="flex flex-wrap p-8 items-center justify-center">
      {menuItems.map((option, index) => (
        <motion.div
          key={option.label}
          className="w-20 h-20 flex flex-col items-center justify-center shadow-xl bg-gray-700 rounded text-gray-500 m-4 hover:text-gray-400 cursor-pointer"
          title={option.label}
          onClick={option.action}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          initial="hidden"
          animate="visible"
          custom={index}
          variants={itemVariants}
        >
          {option.icon}
          <div>{option.label}</div>
        </motion.div>
      ))}
    </div>
  );
}