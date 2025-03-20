import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { gsapEffects, gsapEase } from '@/lib/animations';

const BlockAnimation: React.FC = () => {
  const { state, dispatch } = useEditor();
  const element = state.current;

  if (!element) {
    return null;
  }

  // Handle animation selection change
  const handleAnimationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT_ANIMATION',
      payload: {
        ...element,
        gsap: {
          ...element.gsap,
          animation: e.target.value
        }
      }
    });
  };

  // Handle ease selection change
  const handleEaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT_ANIMATION',
      payload: {
        ...element,
        gsap: {
          ...element.gsap,
          ease: e.target.value
        }
      }
    });
  };

  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT_ANIMATION',
      payload: {
        ...element,
        gsap: {
          ...element.gsap,
          duration: parseFloat(e.target.value) || 0
        }
      }
    });
  };

  // Handle delay change
  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_CURRENT_ANIMATION',
      payload: {
        ...element,
        gsap: {
          ...element.gsap,
          delay: parseFloat(e.target.value) || 0
        }
      }
    });
  };

  return (
    <div className="p-2 flex flex-col">
      <strong>Animation</strong>
      
      <label className="mt-2 mb-1">Name</label>
      <select 
        className="p-1 bg-gray-100 w-full rounded" 
        value={element.gsap.animation || ''}
        onChange={handleAnimationChange}
      >
        <option value="">none</option>
        {gsapEffects.map(animation => (
          <option key={animation} value={animation}>
            {animation}
          </option>
        ))}
      </select>
      
      <label className="mt-2 mb-1">Ease</label>
      <select 
        className="p-1 bg-gray-100 w-full rounded" 
        value={element.gsap.ease || ''}
        onChange={handleEaseChange}
      >
        {gsapEase.map(ease => (
          <option key={ease} value={ease}>
            {ease}
          </option>
        ))}
      </select>
      
      <label className="mt-2 mb-1">Duration (ms)</label>
      <input 
        className="p-1 bg-gray-100 w-full rounded" 
        type="text" 
        min="1" 
        value={element.gsap.duration || 0}
        onChange={handleDurationChange}
      />
      
      <label className="mt-2 mb-1">Delay (ms)</label>
      <input 
        className="p-1 bg-gray-100 w-full rounded" 
        type="text" 
        min="0" 
        value={element.gsap.delay || 0}
        onChange={handleDelayChange}
      />
      
      <p className="text-xs text-gray-400 mt-4">
        <b>Animations require GSAP as animation engine</b>.<br /><br />
        Using whoobe-one-next to deploy your template will automatically include 
        the animation engine based on GSAP (GreenSock).
      </p>
    </div>
  );
};

export default BlockAnimation;