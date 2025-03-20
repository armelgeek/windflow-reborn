'use client';

import { useModal, modalComponents } from '@/context/ModalContext';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal() {
    const { state, dispatch } = useModal();
    const { isOpen, component, title, width, options } = state;

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrag = (e: MouseEvent) => {
        if (isDragging && modalRef.current) {
            setPosition({
                x: position.x + e.movementX,
                y: position.y + e.movementY
            });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', handleDragEnd);
        } else {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDragging, position]);

    // Reset position when modal opens
    useEffect(() => {
        if (isOpen) {
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    const closeModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    const ModalComponent = component ? modalComponents[component] : null;

    if (!isOpen || !ModalComponent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <AnimatePresence>
                <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: position.x,
                        y: position.y
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className={`bg-white shadow-xl rounded ${width} overflow-hidden`}
                >
                    <div
                        ref={headerRef}
                        onMouseDown={handleDragStart}
                        className="dialogHeader capitalize cursor-move h-10 w-full flex items-center text-white text-base px-2 bg-purple-800 rounded-t"
                    >
                        {title}
                        <button
                            onClick={closeModal}
                            className="cursor-pointer absolute top-0 right-0 z-50 text-gray-100 mt-1 text-2xl"
                        >
                            <RiCloseLine />
                        </button>
                    </div>
                    <div className="p-2">
                        <ModalComponent options={options} onClose={closeModal} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
