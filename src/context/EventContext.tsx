'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';

// Define types for event handling
type EventHandler = (...args: unknown[]) => void;
type EventSubscribers = Record<string, EventHandler[]>;

interface EventContextType {
  subscribe: (event: string, handler: EventHandler) => () => void;
  publish: (event: string, ...args: any[]) => void;
}

// Create the context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Event bus implementation
export function EventProvider({ children }: { children: ReactNode }) {
  // Store event subscribers
  const subscribers: EventSubscribers = {};

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
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }, [subscribers]);

  return (
    <EventContext.Provider value={{ subscribe, publish }}>
      {children}
    </EventContext.Provider>
  );
}

// Custom hook to use the event bus
export function useEventBus() {
  const context = useContext(EventContext);
  
  if (context === undefined) {
    throw new Error('useEventBus must be used within an EventProvider');
  }
  
  return context;
}