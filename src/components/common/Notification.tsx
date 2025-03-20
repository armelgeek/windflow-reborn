'use client';

import { useNotification } from '@/context/NotificationContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notification() {
    const { state } = useNotification();
    const { isVisible, message, type } = state;
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);
        } else {
            const timer = setTimeout(() => {
                setIsShowing(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!isShowing) return null;

    const getBorderColor = () => {
        switch (type) {
            case 'error':
                return 'border-red-500';
            case 'success':
                return 'border-lime-500';
            case 'warning':
                return 'border-yellow-500';
            default:
                return 'border-blue-500';
        }
    };

    return (
        <div className="fixed z-50 bottom-0 left-0 w-screen h-24 mb-3">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full md:w-4/5 m-auto bg-white shadow flex flex-row items-center p-2 border-l-4 text-lg py-4 ${getBorderColor()}`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
