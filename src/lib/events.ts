// lib/events.ts

import { Dispatch } from 'react';
import { EditorAction } from '@/context/EditorContext';

/**
 * Triggers an event in the editor context
 * This replaces Vue's event bus functionality
 * 
 * @param dispatch Editor context dispatch function
 * @param event The name of the event to trigger
 * @param payload Optional data to pass with the event
 * @returns Promise that resolves when event is handled
 */
export function triggerEvent(
  dispatch: Dispatch<EditorAction>,
  event: string,
  payload?: any
): Promise<void> {
  return new Promise((resolve) => {
    dispatch({
      type: 'TRIGGER_EVENT',
      payload: {
        event,
        data: payload
      },
      callback: () => {
        resolve();
      }
    });
  });
}

/**
 * Registers an event listener in the editor context
 * 
 * @param dispatch Editor context dispatch function
 * @param event The name of the event to listen for
 * @param handler The function to call when the event is triggered
 */
export function registerListener(
  dispatch: Dispatch<EditorAction>,
  event: string,
  handler: (...args: any[]) => void
): void {
  dispatch({
    type: 'REGISTER_LISTENER',
    payload: {
      event,
      handler
    }
  });
}

/**
 * Removes an event listener from the editor context
 * 
 * @param dispatch Editor context dispatch function
 * @param event The name of the event to stop listening for
 */
export function removeListener(
  dispatch: Dispatch<EditorAction>,
  event: string
): void {
  dispatch({
    type: 'REMOVE_LISTENER',
    payload: {
      event
    }
  });
}

/**
 * Clears all event listeners for a specific event or all events
 * 
 * @param dispatch Editor context dispatch function
 * @param event Optional event name, if not provided all events are cleared
 */
export function clearListeners(
  dispatch: Dispatch<EditorAction>,
  event?: string
): void {
  dispatch({
    type: 'CLEAR_LISTENERS',
    payload: {
      event
    }
  });
}