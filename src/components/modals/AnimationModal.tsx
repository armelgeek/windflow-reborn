'use client';

import { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useNotification, notificationActions } from '@/context/NotificationContext';

interface AnimationModalProps {
  options?: any;
  onClose: () => void;
}

// Animation types based on original Vue implementation
const animationTypes = [
  { value: 'fade', label: 'Fade In' },
  { value: 'scale', label: 'Scale' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'scale-out', label: 'Scale Out' },
  { value: 'flip-x', label: 'Flip X' },
  { value: 'flip-y', label: 'Flip Y' },
  { value: 'slide-left', label: 'Slide from Left' },
  { value: 'slide-right', label: 'Slide from Right' },
  { value: 'slide-top', label: 'Slide from Top' },
  { value: 'slide-down', label: 'Slide from Bottom' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'rotate-3DY', label: 'Rotate 3D Y' },
  { value: 'rotate-scale', label: 'Rotate & Scale' },
  { value: 'grow-width', label: 'Grow Width' },
  { value: 'grow-height', label: 'Grow Height' }
];

// Ease function options
const easingOptions = [
  { value: 'none', label: 'None' },
  { value: 'power1', label: 'Power 1' },
  { value: 'power2', label: 'Power 2' },
  { value: 'power3', label: 'Power 3' },
  { value: 'power4', label: 'Power 4' },
  { value: 'back', label: 'Back' },
  { value: 'elastic', label: 'Elastic' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'rough', label: 'Rough' },
  { value: 'slow', label: 'Slow' },
  { value: 'steps', label: 'Steps' },
  { value: 'circ', label: 'Circular' },
  { value: 'expo', label: 'Exponential' },
  { value: 'sine', label: 'Sine' }
];

export default function AnimationModal({ onClose }: AnimationModalProps) {
  const { state, dispatch } = useEditor();
  const { dispatch: notifyDispatch } = useNotification();
  
  const [animation, setAnimation] = useState<string>('');
  const [duration, setDuration] = useState<number>(0.7);
  const [delay, setDelay] = useState<number>(0);
  const [ease, setEase] = useState<string>('power1');
  const [trigger, setTrigger] = useState<boolean>(false);
  
  // Initialize state from current element
  useEffect(() => {
    if (state.current?.gsap) {
      setAnimation(state.current.gsap.animation || '');
      setDuration(state.current.gsap.duration || 0.7);
      setDelay(state.current.gsap.delay || 0);
      setEase(state.current.gsap.ease || 'power1');
      setTrigger(!!state.current.gsap.trigger);
    }
  }, [state.current]);
  
  const handlePreview = () => {
    // In a real implementation, this would trigger a GSAP animation preview
    notificationActions.showNotification(
      notifyDispatch,
      'Animation preview functionality coming soon',
      'info'
    );
  };
  
  const handleApply = () => {
    if (!state.current) return;
    
    // Update the element's GSAP properties
    dispatch({
      type: 'UPDATE_CURRENT',
      payload: {
        ...state.current,
        gsap: {
          animation,
          duration,
          delay,
          ease,
          trigger
        }
      }
    });
    
    notificationActions.showNotification(
      notifyDispatch,
      'Animation applied successfully',
      'success'
    );
    
    onClose();
  };
  
  if (!state.current) {
    return (
      <div className="p-4 text-center">
        <p>No element selected to animate</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Animation Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Apply GSAP animations to the selected element.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Animation Type */}
        <div>
          <label htmlFor="animation-type" className="block text-sm font-medium text-gray-700">
            Animation Type
          </label>
          <select
            id="animation-type"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            value={animation}
            onChange={(e) => setAnimation(e.target.value)}
          >
            <option value="">None</option>
            {animationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (seconds)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="duration"
              min="0.1"
              max="3"
              step="0.1"
              className="w-full"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="w-20 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              min="0.1"
              max="3"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        {/* Delay */}
        <div>
          <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
            Delay (seconds)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="delay"
              min="0"
              max="2"
              step="0.1"
              className="w-full"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
            />
            <input
              type="number"
              className="w-20 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              min="0"
              max="2"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        {/* Easing */}
        <div>
          <label htmlFor="ease" className="block text-sm font-medium text-gray-700">
            Easing Function
          </label>
          <select
            id="ease"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            value={ease}
            onChange={(e) => setEase(e.target.value)}
          >
            {easingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Trigger */}
        <div className="flex items-center">
          <input
            id="trigger"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            checked={trigger}
            onChange={(e) => setTrigger(e.target.checked)}
          />
          <label htmlFor="trigger" className="ml-3 block text-sm font-medium text-gray-700">
            Use as hover/trigger animation
          </label>
        </div>
        
        {/* Preview section */}
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700">Preview</h4>
            <button
              type="button"
              className="rounded-md bg-purple-600 py-1 px-3 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={handlePreview}
            >
              Play
            </button>
          </div>
          
          <div className="h-32 border rounded-md bg-white flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-500 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}