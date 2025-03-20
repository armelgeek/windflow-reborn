'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';

export default function BlockEvents() {
  const { state, dispatch } = useEditor();
  
  if (!state.current) {
    return null;
  }
  
  // Handle input change for event handlers
  const handleEventChange = (event: string, value: string) => {
    if (state.current) {
      dispatch({
        type: 'UPDATE_CURRENT_EVENTS',
        payload: {
          event,
          value
        }
      });
    }
  };
  
  return (
    <div className="p-2">
      <strong>Event Bus</strong>
      {state.current.events && Object.keys(state.current.events).map(event => (
        <div key={event}>
          <div>@{event}</div>
          <input 
            type="text" 
            className="p-1 bg-gray-100 w-full" 
            value={state.current.events[event] || ''}
            onChange={(e) => handleEventChange(event, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}