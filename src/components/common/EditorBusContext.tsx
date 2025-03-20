'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';

// Define types for event handling
type EventHandler = (...args: unknown[]) => void;
type EventSubscribers = Record<string, EventHandler[]>;

interface EditorBusContextType {
  subscribe: (event: string, handler: EventHandler) => () => void;
  publish: (event: string, ...args: any[]) => void;
  subscribeToEvent: (eventName: string, callbackName: string, callback: EventHandler) => void;
  unsubscribeFromEvent: (eventName: string, callbackName: string, callback: EventHandler) => void;
}

// Create the context
const EditorBusContext = createContext<EditorBusContextType | undefined>(undefined);

// Editor bus implementation
export function EditorBusProvider({ children }: { children: ReactNode }) {
  // Store event subscribers
  const subscribers: EventSubscribers = {};
  
  // Track named callbacks for easier unsubscribing
  const namedCallbacks: Record<string, Record<string, EventHandler>> = {};

  // Subscribe to an event
  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    
    subscribers[event].push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = subscribers[event]?.indexOf(handler);
      if (index !== undefined && index > -1) {
        subscribers[event].splice(index, 1);
      }
    };
  }, [subscribers]);

  // Publish an event
  const publish = useCallback((event: string, ...args: any[]) => {
    if (!subscribers[event]) return;
    
    subscribers[event].forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in editor event handler for ${event}:`, error);
      }
    });
  }, [subscribers]);

  // Subscribe with a named callback for easier management
  const subscribeToEvent = useCallback((
    eventName: string, 
    callbackName: string, 
    callback: EventHandler
  ) => {
    // Initialize event and callback tracking if needed
    if (!namedCallbacks[eventName]) {
      namedCallbacks[eventName] = {};
    }
    
    // Store the callback
    namedCallbacks[eventName][callbackName] = callback;
    
    // Subscribe to the event
    subscribe(eventName, callback);
  }, [subscribe]);

  // Unsubscribe a named callback
  const unsubscribeFromEvent = useCallback((
    eventName: string, 
    callbackName: string, 
    callback: EventHandler
  ) => {
    if (
      namedCallbacks[eventName] && 
      namedCallbacks[eventName][callbackName]
    ) {
      // Get the stored callback
      const storedCallback = namedCallbacks[eventName][callbackName];
      
      // Find and remove from subscribers
      const index = subscribers[eventName]?.indexOf(storedCallback);
      if (index !== undefined && index > -1) {
        subscribers[eventName].splice(index, 1);
      }
      
      // Remove from named callbacks
      delete namedCallbacks[eventName][callbackName];
    }
  }, [subscribers]);

  return (
    <EditorBusContext.Provider value={{ 
      subscribe, 
      publish, 
      subscribeToEvent, 
      unsubscribeFromEvent 
    }}>
      {children}
    </EditorBusContext.Provider>
  );
}

// Custom hook to use the editor bus
export function useEditorBus() {
  const context = useContext(EditorBusContext);
  
  if (context === undefined) {
    throw new Error('useEditorBus must be used within an EditorBusProvider');
  }
  
  return context;
}