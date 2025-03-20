'use client';

import { motion } from 'framer-motion';
import {BiChart} from "react-icons/bi";

interface LoadingProps {
    isVisible?: boolean;
}

export default function Loading({ isVisible = true }: LoadingProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-5xl text-gray-100"
            >
                <BiChart />
            </motion.div>
        </div>
    );
}
