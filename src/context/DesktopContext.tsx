'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { DesktopState } from '@/types/desktop';
import {UIKit} from "@/types/ui-kit";

const initialDesktopState: DesktopState = {
    tabs: [],
    currentTab: -1,
    component: null,
    library: null,
    uikits: [],
    galleryFilter: '',
    dbmode: false
};

// Action types
type DesktopAction =
    | { type: 'ADD_TAB'; payload: { label: string; object: never; type: string; mode?: string } }
    | { type: 'REMOVE_TAB'; payload: number }
    | { type: 'SET_CURRENT_TAB'; payload: number }
    | { type: 'SET_COMPONENT'; payload: never }
    | { type: 'SET_LIBRARY'; payload: UIKit | null }
    | { type: 'ADD_UIKIT'; payload: UIKit }
    | { type: 'SET_GALLERY_FILTER'; payload: string }
    | { type: 'SET_DBMODE'; payload: boolean };

// Reducer
function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
    switch (action.type) {
        case 'ADD_TAB':
            return {
                ...state,
                tabs: [...state.tabs, action.payload],
                currentTab: state.tabs.length
            };
        case 'REMOVE_TAB':
            return {
                ...state,
                tabs: state.tabs.filter((_, index) => index !== action.payload),
                currentTab: action.payload >= state.tabs.length - 1 ? state.tabs.length - 2 : state.currentTab
            };
        case 'SET_CURRENT_TAB':
            return { ...state, currentTab: action.payload };
        case 'SET_COMPONENT':
            return { ...state, component: action.payload };
        case 'SET_LIBRARY':
            return { ...state, library: action.payload };
        case 'ADD_UIKIT':
            return {
                ...state,
                uikits: [...state.uikits, action.payload]
            };
        case 'SET_GALLERY_FILTER':
            return { ...state, galleryFilter: action.payload };
        case 'SET_DBMODE':
            return { ...state, dbmode: action.payload };
        default:
            return state;
    }
}

// Create context
const DesktopContext = createContext<{
    state: DesktopState;
    dispatch: Dispatch<DesktopAction>;
}>({
    state: initialDesktopState,
    dispatch: () => null,
});

export function DesktopProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(desktopReducer, initialDesktopState);

    return (
        <DesktopContext.Provider value={{ state, dispatch }}>
            {children}
        </DesktopContext.Provider>
    );
}

export const useDesktop = () => {
    const context = useContext(DesktopContext);
    if (context === undefined) {
        throw new Error('useDesktop must be used within a DesktopProvider');
    }
    return context;
};

export const desktopActions = {
    addTab: (
        dispatch: Dispatch<DesktopAction>,
        tab: { label: string; object: never; type: string; mode?: string }
    ) => {
        dispatch({ type: 'ADD_TAB', payload: tab });
    },
    removeTab: (dispatch: Dispatch<DesktopAction>, index: number) => {
        dispatch({ type: 'REMOVE_TAB', payload: index });
    },
    setCurrentTab: (dispatch: Dispatch<DesktopAction>, index: number) => {
        dispatch({ type: 'SET_CURRENT_TAB', payload: index });
    },
    setComponent: (dispatch: Dispatch<DesktopAction>, component: never) => {
        dispatch({ type: 'SET_COMPONENT', payload: component });
    },
    setLibrary: (dispatch: Dispatch<DesktopAction>, library: UIKit | null) => {
        dispatch({ type: 'SET_LIBRARY', payload: library });
    },
    addUIKit: (dispatch: Dispatch<DesktopAction>, uikit: UIKit) => {
        dispatch({ type: 'ADD_UIKIT', payload: uikit });
    },
    setGalleryFilter: (dispatch: Dispatch<DesktopAction>, filter: string) => {
        dispatch({ type: 'SET_GALLERY_FILTER', payload: filter });
    },
    setDbMode: (dispatch: Dispatch<DesktopAction>, mode: boolean) => {
        dispatch({ type: 'SET_DBMODE', payload: mode });
    }
};
