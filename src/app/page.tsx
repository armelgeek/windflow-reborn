'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import DesktopSidebarLeft from '@/components/dashboard/DesktopSidebarLeft';
import { useModal } from '@/context/ModalContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';
import { motion } from 'framer-motion';
import {BiChart} from "react-icons/bi";

export default function Home() {
  const [start, setStart] = useState(true);
  const [preview, setPreview] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { dispatch: modalDispatch } = useModal();
  const { dispatch: notificationDispatch } = useNotification();

  useEffect(() => {
    const hasTemplates = localStorage.getItem('windflow-templates');

    if (!hasTemplates) {
      setStart(false);
    }

    // Check for preview mode
    const isPreviewMode = localStorage.getItem('windflow-preview-mode') === 'true';
    setPreview(isPreviewMode);

    localStorage.setItem('windflow-preview-mode', 'false');
  }, []);

  const importDB = () => {
    localStorage.setItem('windflow-templates', 'true');
    setStart(true);

    // Show notification
    notificationActions.showNotification(
        notificationDispatch,
        'Templates imported successfully',
        'success'
    );
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (preview) {
    return <div>Preview mode</div>;
  }

  return (
      <div className="bg-gray-800 w-screen h-screen max-h-screen">
        {showSidebar && <DesktopSidebarLeft onToggle={toggleSidebar} />}

        <div className="modal w-5/6">
          <motion.div
              className="w-full md:w-1/2 lg:w-1/3 py-10 m-auto cursor-pointer relative flex flex-col items-center justify-center p-4 text-white rounded-lg shadow-xl"
              style={{ fontFamily: 'Barlow Condensed' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="m-auto flex items-center">
              windflow<span className="text-purple-500 font-bold"></span>
              <BiChart className="text-3xl text-yellow-500 ml-2" />
            </h1>
            <div className="text-base text-gray-400 -mb-8">component builder for TailwindCSS</div>
          </motion.div>

          {start ? (
              <Dashboard />
          ) : (
              <motion.div
                  className="flex flex-col p-4 m-auto w-1/2 bg-gray-600 mt-20 text-white text-base justify-center items-center text-center rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
              >
                <div className="p-4">
                  Templates library not found.<br />
                  Do you want to install the default WhoobeOne library?
                </div>
                <div className="flex justify-around w-full">
                  <motion.button
                      className="lg bg-purple-500 btn"
                      onClick={importDB}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    Load library
                  </motion.button>
                  <motion.button
                      className="lg bg-blue-400 btn"
                      onClick={() => setStart(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    Proceed
                  </motion.button>
                </div>
              </motion.div>
          )}
        </div>
      </div>
  );
}
