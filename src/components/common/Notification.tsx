'use client';

import { useNotification, notificationActions } from '@/context/NotificationContext';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

export default function Notification() {
  const { state, dispatch } = useNotification();
  const { isVisible, message, type, duration } = state;
  const [isShowing, setIsShowing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle notification visibility
  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      
      // Auto-dismiss after duration (default: 5000ms)
      const notificationDuration = duration || 5000;
      
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer to hide notification
      timerRef.current = setTimeout(() => {
        notificationActions.hideNotification(dispatch);
      }, notificationDuration);
    } else {
      // Add small delay for exit animation
      const timer = setTimeout(() => {
        setIsShowing(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, duration, dispatch]);

  if (!isShowing) return null;

  // Get icon and colors based on notification type
  const getNotificationStyles = () => {
    switch (type) {
      case 'error':
        return {
          borderColor: 'border-red-500',
          icon: <AlertCircle className="text-red-500" size={24} />,
          backgroundColor: 'bg-red-50'
        };
      case 'success':
        return {
          borderColor: 'border-green-500',
          icon: <CheckCircle className="text-green-500" size={24} />,
          backgroundColor: 'bg-green-50'
        };
      case 'warning':
        return {
          borderColor: 'border-yellow-500',
          icon: <AlertTriangle className="text-yellow-500" size={24} />,
          backgroundColor: 'bg-yellow-50'
        };
      default: // info
        return {
          borderColor: 'border-blue-500',
          icon: <Info className="text-blue-500" size={24} />,
          backgroundColor: 'bg-blue-50'
        };
    }
  };

  const { borderColor, icon, backgroundColor } = getNotificationStyles();

  // Calculate progress based on timer
  const Progress = () => {
    const progressDuration = duration || 5000;
    
    return (
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: progressDuration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${borderColor.replace('border', 'bg')}`}
      />
    );
  };

  // Dismiss notification manually
  const handleDismiss = () => {
    notificationActions.hideNotification(dispatch);
  };

  return (
    <div className="fixed z-50 bottom-0 left-0 w-full px-4 sm:px-6 md:px-8 pointer-events-none mb-4">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300
            }}
            className={`w-full max-w-md mx-auto ${backgroundColor} shadow-lg rounded-lg overflow-hidden pointer-events-auto border-l-4 relative ${borderColor}`}
          >
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                {icon}
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleDismiss}
                >
                  <span className="sr-only">Close</span>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <Progress />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}