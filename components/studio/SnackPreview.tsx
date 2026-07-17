'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Snack } from 'snack-sdk';

interface SnackPreviewProps {
    /** Generated App.tsx code */
    code: string;
    /** Component names to fetch source for */
    componentNames: string[];
    /** Whether the preview is currently active/visible */
    isActive: boolean;
}

/**
 * Renders a live React Native Web preview using the Snack SDK.
 */
export default function SnackPreview({ code, componentNames, isActive }: SnackPreviewProps) {
    const webPreviewRef = useRef<Window | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const snackRef = useRef<Snack | null>(null);
    const [webPreviewURL, setWebPreviewURL] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [debugError, setDebugError] = useState<string | null>(null);
    const [debugLog, setDebugLog] = useState<string[]>([]);

    const addLog = useCallback((msg: string) => {
        const ts = new Date().toISOString().split('T')[1].split('.')[0];
        console.log(`[SnackPreview ${ts}] ${msg}`);
        setDebugLog(prev => [...prev.slice(-30), `[${ts}] ${msg}`]);
    }, []);

    // Stable component name string to avoid unnecessary re-renders
    const componentKey = useMemo(() => componentNames.join(','), [componentNames]);

    // Fetch component source files + detected dependencies from our API
    const fetchComponentData = useCallback(async (names: string[]): Promise<{
        sources: Record<string, string>;
        dependencies: string[];
        error?: string;
    }> => {
        if (names.length === 0) return { sources: {}, dependencies: [] };
        try {
            const res = await fetch('/api/studio/snack/sources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ components: names }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.error) {
                    return { sources: {}, dependencies: [], error: data.error };
                }
                const missing = names.filter(n => !data.sources[n]);
                if (missing.length > 0) {
                    return { ...data, error: `Missing files from server: ${missing.join(', ')}` };
                }
                return data;
            }
            return { sources: {}, dependencies: [], error: `Server returned status: ${res.status}` };
        } catch (err: any) {
            console.error('Failed to fetch component sources:', err);
            return { sources: {}, dependencies: [], error: err.message };
        }
    }, []);

    // Monitor postMessage traffic for debugging
    useEffect(() => {
        if (!isActive) return;

        const handler = (event: MessageEvent) => {
            const origin = event.origin;
            const dataPreview = typeof event.data === 'string'
                ? event.data.substring(0, 80)
                : JSON.stringify(event.data).substring(0, 80);
            addLog(`MSG from ${origin}: ${dataPreview}`);
        };

        window.addEventListener('message', handler);
        addLog(`postMessage listener attached on window (origin: ${window.location.origin})`);

        return () => window.removeEventListener('message', handler);
    }, [isActive, addLog]);

    // Initialize the Snack instance
    useEffect(() => {
        if (!isActive) {
            if (snackRef.current) {
                snackRef.current.setOnline(false);
                snackRef.current = null;
            }
            setWebPreviewURL(undefined);
            setIsLoading(true);
            setIsReady(false);
            setDebugError(null);
            setDebugLog([]);
            return;
        }

        let cancelled = false;

        const initSnack = async () => {
            setIsLoading(true);
            setIsReady(false);
            setDebugError(null);

            addLog(`Fetching sources for: ${componentNames.join(', ') || '(none)'}`);
            const { sources, dependencies, error } = await fetchComponentData(componentNames);

            if (cancelled) return;

            if (error) {
                setDebugError(`Live Preview API Error:\n${error}`);
                setIsLoading(false);
                return;
            }

            addLog(`Got ${Object.keys(sources).length} sources, ${dependencies.length} deps`);

            // Build files object
            const files: Record<string, { type: 'CODE'; contents: string }> = {
                'App.tsx': { type: 'CODE', contents: code },
            };
            for (const [name, src] of Object.entries(sources)) {
                files[`${name}.tsx`] = { type: 'CODE', contents: src };
            }

            // Build dependencies object
            const deps: Record<string, { version: string }> = {};
            for (const dep of dependencies) {
                deps[dep] = { version: '*' };
            }

            // Cleanup previous
            if (snackRef.current) {
                snackRef.current.setOnline(false);
            }

            addLog(`Creating Snack with webPreviewRef...`);
            addLog(`window type: ${typeof window}, window === globalThis: ${window === globalThis}`);

            const snack = new Snack({
                files,
                dependencies: deps,
                webPreviewRef,
            });

            snackRef.current = snack;

            // Listen for state changes
            const unsubscribe = snack.addStateListener((state) => {
                if (cancelled) return;

                const snackState = state as any;
                if (snackState.errors && snackState.errors.length > 0) {
                    const errorMessages = snackState.errors
                        .map((e: any) => `[${e.fileName || 'Bundler'}] ${e.message}`)
                        .join('\n');
                    setDebugError(`Snack Bundler Error:\n${errorMessages}`);
                    setIsLoading(false);
                    return;
                }

                const url = state.webPreviewURL;
                if (url && !webPreviewURL) {
                    addLog(`webPreviewURL: ${url.substring(0, 100)}...`);
                    setWebPreviewURL(url);
                    setIsLoading(false);
                }
            });

            snack.setOnline(true);
            addLog('Snack online=true');

            const initialState = snack.getState() as any;
            addLog(`Initial state - webPreviewURL: ${initialState.webPreviewURL ? 'YES' : 'NO'}, online: ${initialState.online}`);

            if (initialState.webPreviewURL) {
                addLog(`Initial webPreviewURL: ${initialState.webPreviewURL.substring(0, 100)}...`);
                setWebPreviewURL(initialState.webPreviewURL);
                setIsLoading(false);
            }

            return () => {
                unsubscribe();
            };
        };

        initSnack();

        return () => {
            cancelled = true;
            if (snackRef.current) {
                snackRef.current.setOnline(false);
                snackRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    // Update files when code or components change while already active
    useEffect(() => {
        if (!isActive || !snackRef.current) return;

        let cancelled = false;

        const updateFiles = async () => {
            const { sources, dependencies } = await fetchComponentData(componentNames);

            if (cancelled || !snackRef.current) return;

            const files: Record<string, { type: 'CODE'; contents: string }> = {
                'App.tsx': { type: 'CODE', contents: code },
            };
            for (const [name, src] of Object.entries(sources)) {
                files[`${name}.tsx`] = { type: 'CODE', contents: src };
            }

            const deps: Record<string, { version: string }> = {};
            for (const dep of dependencies) {
                deps[dep] = { version: '*' };
            }

            snackRef.current.updateFiles(files);
            snackRef.current.updateDependencies(deps);
        };

        const timeout = window.setTimeout(updateFiles, 600);
        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
        };
    }, [code, componentKey, isActive, fetchComponentData]);

    // Handle iframe load and log ref status
    const handleIframeLoad = useCallback(() => {
        addLog(`Iframe onLoad - webPreviewRef.current: ${webPreviewRef.current ? 'SET' : 'NULL'}`);
        addLog(`Iframe contentWindow: ${iframeRef.current?.contentWindow ? 'EXISTS' : 'NULL'}`);
        // Ensure ref is set after load
        if (iframeRef.current?.contentWindow) {
            webPreviewRef.current = iframeRef.current.contentWindow;
            addLog('webPreviewRef forced update after iframe load');
        }
        window.setTimeout(() => setIsReady(true), 1500);
    }, [addLog]);

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Loading State */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]"
                style={{
                    opacity: isReady ? 0 : 1,
                    transition: 'opacity 0.4s ease-out',
                    pointerEvents: isReady ? 'none' : 'auto',
                }}
            >
                <div className="relative">
                    <div className="w-12 h-12 border-[3px] border-indigo-500/20 rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-[3px] border-transparent border-t-indigo-400 rounded-full animate-spin" />
                </div>
                <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase mt-2">
                    Starting Emulator...
                </span>
                <div className="flex gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>

                {/* Debug log visible in loading state */}
                {debugLog.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 max-h-[40vh] overflow-auto">
                        <pre className="text-[7px] text-white/30 font-mono leading-tight whitespace-pre-wrap">
                            {debugLog.join('\n')}
                        </pre>
                    </div>
                )}
            </div>

            {/* Error State */}
            {debugError && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#1a0f14]/95 backdrop-blur-md text-red-200 text-center">
                    <svg className="w-10 h-10 mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-red-100 mb-2">Preview Failed</h3>
                    <pre className="text-[10px] w-full max-w-[280px] overflow-auto max-h-[40vh] bg-black/40 p-4 rounded-lg border border-red-500/20 whitespace-pre-wrap text-left font-mono leading-relaxed">
                        {debugError}
                    </pre>
                </div>
            )}

            {/* Preview iframe */}
            <iframe
                ref={(c) => {
                    iframeRef.current = c;
                    webPreviewRef.current = c?.contentWindow ?? null;
                }}
                src={webPreviewURL}
                onLoad={handleIframeLoad}
                allow="geolocation; camera; microphone; accelerometer; gyroscope; screen-wake-lock"
                className="w-full h-full border-none"
                style={{ background: '#fff' }}
            />
        </div>
    );
}
