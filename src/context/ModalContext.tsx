// context/ModalContext.tsx
'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { ModalState } from '@/types/modal';

// Initial state
const initialModalState: ModalState = {
    isOpen: false,
    component: null,
    title: '',
    width: 'w-1/3',
    options: null
};

// Action types
type ModalAction =
    | { type: 'OPEN_MODAL'; payload: { component: string; title: string; width?: string; options?: any } }
    | { type: 'CLOSE_MODAL' };

// Reducer
function modalReducer(state: ModalState, action: ModalAction): ModalState {
    switch (action.type) {
        case 'OPEN_MODAL':
            return {
                ...state,
                isOpen: true,
                component: action.payload.component,
                title: action.payload.title,
                width: action.payload.width || 'w-1/3',
                options: action.payload.options || null
            };
        case 'CLOSE_MODAL':
            return {
                ...state,
                isOpen: false
            };
        default:
            return state;
    }
}

// Create context
const ModalContext = createContext<{
    state: ModalState;
    dispatch: Dispatch<ModalAction>;
}>({
    state: initialModalState,
    dispatch: () => null,
});

// Provider component
export function ModalProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(modalReducer, initialModalState);

    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            {children}
        </ModalContext.Provider>
    );
}

// Custom hook to use the modal context
export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

// Helper functions
export const modalActions = {
    openModal: (
        dispatch: Dispatch<ModalAction>,
        component: string,
        title: string,
        width?: string,
        options?: any
    ) => {
        dispatch({
            type: 'OPEN_MODAL',
            payload: { component, title, width, options }
        });
    },
    closeModal: (dispatch: Dispatch<ModalAction>) => {
        dispatch({ type: 'CLOSE_MODAL' });
    }
};

export const modalComponents: Record<string, React.ComponentType<never>> = {
    // You'll need to import and map all your modal components here
    // For example:
    // 'settings': Settings,
    // 'importPage': ImportPage,
    // etc.
};
