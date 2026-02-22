'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';

interface StudioState {
    screenName: string;
    setScreenName: (name: string) => void;
    showCode: boolean;
    setShowCode: (show: boolean) => void;
    hasNodes: boolean;
    setHasNodes: (has: boolean) => void;
    onClearAll: () => void;
    registerClearAll: (fn: () => void) => void;
}

const StudioContext = createContext<StudioState | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
    const [screenName, setScreenName] = useState('MyScreen');
    const [showCode, setShowCode] = useState(false);
    const [hasNodes, setHasNodes] = useState(false);
    const clearRef = useRef<() => void>(() => { });

    const onClearAll = useCallback(() => {
        clearRef.current();
    }, []);

    const registerClearAll = useCallback((fn: () => void) => {
        clearRef.current = fn;
    }, []);

    const value = useMemo(() => ({
        screenName, setScreenName,
        showCode, setShowCode,
        hasNodes, setHasNodes,
        onClearAll,
        registerClearAll,
    }), [screenName, showCode, hasNodes, onClearAll, registerClearAll]);

    return (
        <StudioContext.Provider value={value}>
            {children}
        </StudioContext.Provider>
    );
}

export function useStudio() {
    return useContext(StudioContext);
}
