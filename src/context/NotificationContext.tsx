'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { NotificationState } from '@/types/notification';

// Initial state
const initialNotificationState: NotificationState = {
    message: '',
    type: 'info',
    isVisible: false
};

type NotificationAction =
    | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: 'info' | 'error' | 'warning' | 'success' } }
    | { type: 'HIDE_NOTIFICATION' };

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
                isVisible: true
            };
        case 'HIDE_NOTIFICATION':
            return {
                ...state,
                isVisible: false
            };
        default:
            return state;
    }
}

const NotificationContext = createContext<{
    state: NotificationState;
    dispatch: Dispatch<NotificationAction>;
}>({
    state: initialNotificationState,
    dispatch: () => null,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);

    useEffect(() => {
        if (state.isVisible) {
            const timer = setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [state.isVisible]);

    return (
        <NotificationContext.Provider value={{ state, dispatch }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const notificationActions = {
    showNotification: (
        dispatch: Dispatch<NotificationAction>,
        message: string,
        type: 'info' | 'error' | 'warning' | 'success' = 'info'
    ) => {
        dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: { message, type }
        });
    },
    hideNotification: (dispatch: Dispatch<NotificationAction>) => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
    }
};
