'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    STUDIO_COMPONENTS,
    STUDIO_CATEGORIES,
    CATEGORY_COLORS,
    StudioComponentItem,
} from '@/lib/studio/studio-components';
import DeviceRenderer from './DeviceRenderer';
import { componentSourceMap } from '@/registry/source-map';
import {
    Search,
    Code as CodeIcon,
    Smartphone,
    RotateCcw,
    Copy,
    Check,
    ExternalLink,
    Sliders,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Terminal,
    Sparkles,
    ChevronRight,
    X,
    Layers,
    Share2,
    Maximize2,
    Minimize2,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const COMPONENT_SOURCE_KEY_MAP: Record<string, string> = {
    'animated-tab-bar': 'AnimatedTabBar',
    'stars-globe': 'StarsGlobe',
    'photo-album': 'PhotoAlbum',
    'time-picker': 'TimePicker',
    'dynamic-otp': 'DynamicOtp',
    'liquid-action-tab-bar': 'LiquidActionTabBar',
    'rainbow-button': 'RainbowButton',
    'range-slider': 'RangeSlider',
    'switch-toggle': 'SwitchToggle',
    'expandable-card': 'ExpandableCard',
    'expandable-action-menu': 'ExpandableActionMenu',
    'bottom-navigation': 'AnimatedBottomNav',
    'bottom-sheet': 'DynamicBottomSheet',
    'date-picker': 'DatePicker',
    'dynamic-upload': 'DynamicUpload',
    'floating-speed-dial': 'FloatingSpeedDial',
    'gradient-button': 'GradientButton',
    'image-carousel': 'ImageCarousel',
    'custom-input': 'CustomInput',
    'skeleton-loader': 'SkeletonLoader',
    'native-haptics': 'NativeHaptics',
};

export default function InteractiveStudioClient() {
    // ─── Core State ──────────────────────────────────────────────────────────
    const [selectedId, setSelectedId] = useState<string>('stars-globe');
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [codeTab, setCodeTab] = useState<'configured' | 'source' | 'cli'>('configured');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [deviceTheme, setDeviceTheme] = useState<'dark' | 'light'>('light');
    const [zenMode, setZenMode] = useState<boolean>(false);
    const [resetTrigger, setResetTrigger] = useState<number>(0);
    const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
    const [copiedCli, setCopiedCli] = useState<boolean>(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (theme && theme !== 'light') {
            setTheme('light');
        }
    }, [theme, setTheme]);

    // Inspector Props state map: componentId -> { propName: value }
    const [propsState, setPropsState] = useState<Record<string, Record<string, any>>>(() => {
        const initial: Record<string, Record<string, any>> = {};
        for (const comp of STUDIO_COMPONENTS) {
            initial[comp.id] = { ...comp.defaultProps };
        }
        return initial;
    });

    const activeComponent = useMemo(() => {
        return STUDIO_COMPONENTS.find((c) => c.id === selectedId) || STUDIO_COMPONENTS[0];
    }, [selectedId]);

    const activeProps = useMemo(() => {
        return propsState[activeComponent.id] || activeComponent.defaultProps;
    }, [propsState, activeComponent]);

    const handlePropChange = useCallback((propId: string, value: any) => {
        setPropsState((prev) => ({
            ...prev,
            [activeComponent.id]: {
                ...(prev[activeComponent.id] || activeComponent.defaultProps),
                [propId]: value,
            },
        }));
    }, [activeComponent]);

    const handleResetComponent = useCallback(() => {
        setPropsState((prev) => ({
            ...prev,
            [activeComponent.id]: { ...activeComponent.defaultProps },
        }));
        setResetTrigger((prev) => prev + 1);
    }, [activeComponent]);

    // Filtered components list
    const filteredComponents = useMemo(() => {
        return STUDIO_COMPONENTS.filter((comp) => {
            const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery =
                !q ||
                comp.name.toLowerCase().includes(q) ||
                comp.category.toLowerCase().includes(q) ||
                comp.description.toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });
    }, [searchQuery, selectedCategory]);

    // Generated Code
    const generatedScreenCode = useMemo(() => {
        return activeComponent.generateCode(activeProps);
    }, [activeComponent, activeProps]);

    // Raw Component Source Code
    const componentSource = useMemo(() => {
        const sourceKey = COMPONENT_SOURCE_KEY_MAP[activeComponent.id];
        if (sourceKey && componentSourceMap[sourceKey]) {
            return componentSourceMap[sourceKey];
        }
        return `// Source code for ${activeComponent.name}\n// Use "npx nativecn-ui add ${activeComponent.id}" to install this component.`;
    }, [activeComponent]);

    const handleCopyCode = useCallback(() => {
        const textToCopy = codeTab === 'source' ? componentSource : generatedScreenCode;
        navigator.clipboard.writeText(textToCopy);
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2200);
    }, [codeTab, componentSource, generatedScreenCode]);

    const handleCopyCli = useCallback(() => {
        navigator.clipboard.writeText(`npx nativecn-ui add ${activeComponent.id}`);
        setCopiedCli(true);
        setTimeout(() => setCopiedCli(false), 2200);
    }, [activeComponent]);

    // Keyboard shortcut '/' to search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                document.getElementById('studio-search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Group controls by section
    const groupedControls = useMemo(() => {
        const groups: Record<string, typeof activeComponent.controls> = {};
        for (const ctrl of activeComponent.controls) {
            const sec = ctrl.section || 'General';
            if (!groups[sec]) groups[sec] = [];
            groups[sec].push(ctrl);
        }
        return groups;
    }, [activeComponent]);

    return (
        <div data-studio-page="true" className="h-screen overflow-hidden flex flex-col bg-[#FDFCFB] dark:bg-[#09090B] text-foreground select-none relative font-sans">
            {/* Subtle Dot Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-80" />

            {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
            <header className="h-14 border-b border-zinc-200/80 dark:border-white/10 bg-[#FDFCFB]/90 dark:bg-[#09090B]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
                {/* Left: Brand + Breadcrumb */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground transition-transform group-hover:scale-105">
                            <path d="M2 22 L8 2 L14 2 L22 22 L16 22 L11.43 10.57 L8 22 Z" fill="currentColor"/>
                            <path d="M16 2 L22 2 L22 19 L16 4 Z" fill="currentColor"/>
                        </svg>
                        <span className="font-bold text-base tracking-tight leading-none">
                            nativecn<span className="text-primary font-normal text-xs ml-1 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">Studio</span>
                        </span>
                    </Link>

                    <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-800 hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link href="/components" className="hover:text-foreground transition-colors">Library</Link>
                        <span>/</span>
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeComponent.color }} />
                            {activeComponent.name}
                        </span>
                    </div>
                </div>

                {/* Center: View Mode Segmented Pill */}
                <div className="flex items-center p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/50 dark:border-white/10 shadow-inner">
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === 'preview'
                                ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={() => setViewMode('code')}
                        className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            viewMode === 'code'
                                ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <CodeIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* CLI Copy Pill */}
                    <button
                        onClick={handleCopyCli}
                        title="Copy npx add command"
                        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <Terminal className="w-3 h-3 text-primary" />
                        <span>add {activeComponent.id}</span>
                        {copiedCli ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-60" />}
                    </button>

                    {/* Snack Link */}
                    {activeComponent.snackId && (
                        <a
                            href={`https://snack.expo.dev/${activeComponent.snackId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span>Expo Snack</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                    )}

                    {/* Copy Code Button */}
                    <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                        {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                </div>
            </header>

            {/* ─── Main 3-Column Studio Layout ──────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* ─── Column 1: Left "Browse" Panel ───────────────────────────── */}
                <aside
                    className={`border-r border-zinc-200/80 dark:border-white/10 bg-[#FDFCFB]/80 dark:bg-[#09090B]/80 backdrop-blur-md flex flex-col shrink-0 transition-all duration-300 ${
                        zenMode ? 'w-0 opacity-0 pointer-events-none -ml-80' : 'w-72 lg:w-80'
                    }`}
                >
                    {/* Browse Header */}
                    <div className="p-4 border-b border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold tracking-tight">Browse</h2>
                            <span className="text-[11px] text-muted-foreground">{filteredComponents.length} components</span>
                        </div>
                        {selectedCategory !== 'All' && (
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                            >
                                View all
                            </button>
                        )}
                    </div>

                    {/* Search Input */}
                    <div className="p-3 border-b border-zinc-200/80 dark:border-white/10">
                        <div className="relative flex items-center">
                            <Search className="w-3.5 h-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
                            <input
                                id="studio-search-input"
                                type="text"
                                placeholder="Search library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            />
                            {searchQuery ? (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <span className="absolute right-2.5 text-[10px] text-muted-foreground/60 font-mono">/</span>
                            )}
                        </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="px-3 py-2 border-b border-zinc-200/80 dark:border-white/10 overflow-x-auto flex gap-1.5 no-scrollbar">
                        {STUDIO_CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                                        isSelected
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                                            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Component Items List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredComponents.map((comp) => {
                            const isSelected = comp.id === selectedId;
                            return (
                                <button
                                    key={comp.id}
                                    onClick={() => setSelectedId(comp.id)}
                                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                                        isSelected
                                            ? 'bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300 dark:border-white/10 shadow-sm'
                                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60 border border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {/* Category color dot */}
                                    <div
                                        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-xs"
                                        style={{ backgroundColor: comp.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-semibold truncate ${isSelected ? 'text-foreground' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                            {comp.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                                            {comp.typeSubtitle}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground mt-1 shrink-0" />
                                    )}
                                </button>
                            );
                        })}

                        {filteredComponents.length === 0 && (
                            <div className="text-center py-12 text-xs text-muted-foreground">
                                No components match &ldquo;{searchQuery}&rdquo;
                            </div>
                        )}
                    </div>
                </aside>

                {/* ─── Column 2: Center Canvas (Phone Simulator or Code View) ─── */}
                <main className="flex-1 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    {viewMode === 'preview' ? (
                        /* ─── REALISTIC IPHONE 16 PRO DEVICE FRAME ─── */
                        <div className="relative flex flex-col items-center justify-center py-0.5">
                            {/* Smartphone Container with smooth viewport scaling */}
                            <div className="relative transition-transform duration-300 scale-[0.88] sm:scale-[0.94] lg:scale-[0.98] flex items-center justify-center select-none origin-center">
                                {/* Hardware Physical Buttons on Left Side (Brushed Titanium) */}
                                <div className="absolute -left-[3.5px] top-24 w-[3.5px] h-7 bg-gradient-to-r from-[#4b4b50] to-[#2d2d31] rounded-l-xs shadow-xs" />
                                <div className="absolute -left-[3.5px] top-35 w-[3.5px] h-11 bg-gradient-to-r from-[#4b4b50] to-[#2d2d31] rounded-l-xs shadow-xs" />
                                <div className="absolute -left-[3.5px] top-49 w-[3.5px] h-11 bg-gradient-to-r from-[#4b4b50] to-[#2d2d31] rounded-l-xs shadow-xs" />

                                {/* Hardware Physical Power/Siri Button on Right Side */}
                                <div className="absolute -right-[3.5px] top-34 w-[3.5px] h-16 bg-gradient-to-l from-[#4b4b50] to-[#2d2d31] rounded-r-xs shadow-xs" />

                                {/* Outer Brushed Titanium Chassis */}
                                <div
                                    className="w-[330px] h-[654px] rounded-[52px] p-[3px] relative bg-gradient-to-b from-[#4a4a50] via-[#28282c] to-[#161619] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65),0_15px_30px_-10px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.12)]"
                                >
                                    {/* Inner Dark Gasket Bezel Rim */}
                                    <div className="w-full h-full rounded-[49px] p-[6px] bg-[#0c0c0e] ring-1 ring-black/90 ring-inset flex flex-col">
                                        {/* Active OLED Display */}
                                        <div
                                            className={`w-full h-full rounded-[43px] overflow-hidden flex flex-col relative transition-colors duration-300 ${
                                                deviceTheme === 'dark' ? 'bg-[#09090B] text-white' : 'bg-[#F8FAFC] text-zinc-900'
                                            }`}
                                        >
                                            {/* Screen Glass Specular Highlight (Subtle ambient diagonal sheen) */}
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.035] rounded-[43px] z-30" />

                                            {/* Apple Dynamic Island */}
                                            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-3 w-[96px] h-[26px] rounded-full bg-black shadow-xs ring-[0.5px] ring-white/10 pointer-events-none">
                                                {/* Left side TrueDepth Infrared Sensor (Near invisible matte circle) */}
                                                <div className="w-2 h-2 rounded-full bg-[#050508] opacity-80" />
                                                {/* Right side Front Camera Lens with subtle deep navy antireflective coat */}
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#08080d] ring-[0.5px] ring-white/15 relative flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-blue-950/70" />
                                                </div>
                                            </div>

                                            {/* iOS 18 Status Bar */}
                                            <div className="h-11 px-7 pt-2 flex items-center justify-between text-[11px] font-semibold tracking-tight z-30 shrink-0 pointer-events-none select-none">
                                                <span className="font-sans font-semibold tracking-tight">9:41</span>
                                                <div className="flex items-center gap-1.5">
                                                    {/* Cellular Signal (4 graduated bars) */}
                                                    <div className="flex items-end gap-0.5 h-2.5">
                                                        <div className="w-0.5 h-1 bg-current rounded-xs" />
                                                        <div className="w-0.5 h-1.5 bg-current rounded-xs" />
                                                        <div className="w-0.5 h-2 bg-current rounded-xs" />
                                                        <div className="w-0.5 h-2.5 bg-current rounded-xs" />
                                                    </div>
                                                    {/* Wi-Fi Icon */}
                                                    <svg width="12" height="9" viewBox="0 0 16 12" fill="none" className="currentColor">
                                                        <path d="M8 10C8.55228 10 9 10.4477 9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10Z" fill="currentColor"/>
                                                        <path d="M4.5 7.5C5.4665 6.5335 6.7335 6 8 6C9.2665 6 10.5335 6.5335 11.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                        <path d="M2 5C3.65685 3.34315 5.82843 2.5 8 2.5C10.1716 2.5 12.3431 3.34315 14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                    {/* Battery Capsule */}
                                                    <div className="flex items-center gap-0.5">
                                                        <div className="w-[21px] h-[10.5px] rounded-[3px] border border-current p-[1.5px] flex items-center">
                                                            <div className="w-3.5 h-[6px] bg-current rounded-[1px]" />
                                                        </div>
                                                        <div className="w-0.5 h-1 bg-current rounded-r-xs opacity-80" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Component Screen Display Content */}
                                            <div className="flex-1 overflow-hidden relative flex flex-col">
                                                <DeviceRenderer
                                                    componentId={activeComponent.id}
                                                    props={activeProps}
                                                    deviceTheme={deviceTheme}
                                                    resetTrigger={resetTrigger}
                                                />
                                            </div>

                                            {/* iOS Bottom Home Bar */}
                                            <div className="h-5 flex items-center justify-center shrink-0 z-30 pointer-events-none">
                                                <div
                                                    className={`w-32 h-1 rounded-full ${
                                                        deviceTheme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-400'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Canvas Controls Dock */}
                            <div className="mt-4 flex items-center gap-2 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 shadow-lg backdrop-blur-md">

                                {/* Reset component state */}
                                <button
                                    onClick={handleResetComponent}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    title="Reset component state to defaults"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset</span>
                                </button>

                                <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />

                                {/* Zen / Fullscreen mode */}
                                <button
                                    onClick={() => setZenMode(!zenMode)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    title="Toggle Zen / Fullscreen phone focus"
                                >
                                    {zenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                    <span>{zenMode ? 'Exit Zen' : 'Zen Focus'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* ─── CODE INSPECTION VIEW ─── */
                        <div className="w-full max-w-4xl h-full flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
                            {/* Code Header Bar */}
                            <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCodeTab('configured')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            codeTab === 'configured'
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Configured Screen (App.tsx)
                                    </button>
                                    <button
                                        onClick={() => setCodeTab('source')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            codeTab === 'source'
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Component Source ({activeComponent.name}.tsx)
                                    </button>
                                    <button
                                        onClick={() => setCodeTab('cli')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            codeTab === 'cli'
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Install & Dependencies
                                    </button>
                                </div>

                                <button
                                    onClick={handleCopyCode}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                                </button>
                            </div>

                            {/* Code Content */}
                            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#0F172A] text-slate-100">
                                {codeTab === 'cli' ? (
                                    <div className="space-y-6 max-w-xl py-4 font-sans">
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">1. Quick CLI Install</h4>
                                            <p className="text-xs text-slate-400 mb-2">
                                                Add this component directly into your React Native or Expo project with one command:
                                            </p>
                                            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs flex items-center justify-between text-emerald-400">
                                                <span>npx nativecn-ui add {activeComponent.id}</span>
                                                <button
                                                    onClick={handleCopyCli}
                                                    className="p-1 hover:bg-white/10 rounded text-slate-300"
                                                >
                                                    {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">2. Required Dependencies</h4>
                                            <p className="text-xs text-slate-400 mb-2">
                                                Ensure these core animation & gesture libraries are installed in your project:
                                            </p>
                                            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-sky-300">
                                                npx expo install react-native-reanimated react-native-gesture-handler lucide-react-native
                                            </div>
                                        </div>

                                        {activeComponent.snackId && (
                                            <div>
                                                <h4 className="text-sm font-bold text-white mb-2">3. Test on Physical Phone (Expo Snack)</h4>
                                                <p className="text-xs text-slate-400 mb-2">
                                                    Scan with the Expo Go app on your physical iPhone or Android device:
                                                </p>
                                                <a
                                                    href={`https://snack.expo.dev/${activeComponent.snackId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                                                >
                                                    <span>Open in Expo Snack</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <pre className="overflow-x-auto whitespace-pre">
                                        <code>{codeTab === 'source' ? componentSource : generatedScreenCode}</code>
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* ─── Column 3: Right "Inspector" Panel ───────────────────────── */}
                <aside
                    className={`border-l border-zinc-200/80 dark:border-white/10 bg-[#FDFCFB]/80 dark:bg-[#09090B]/80 backdrop-blur-md flex flex-col shrink-0 transition-all duration-300 ${
                        zenMode ? 'w-0 opacity-0 pointer-events-none -mr-80' : 'w-76 lg:w-84'
                    }`}
                >
                    {/* Inspector Header */}
                    <div className="p-4 border-b border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-primary" />
                            <h2 className="text-sm font-bold tracking-tight">Inspector</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-muted-foreground font-medium">
                                {activeComponent.controls.length} controls
                            </span>
                            <button
                                onClick={handleResetComponent}
                                title="Reset to default props"
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Inspector Controls List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {Object.entries(groupedControls).map(([sectionName, controls]) => (
                            <div key={sectionName} className="space-y-4">
                                <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground border-b border-zinc-200/60 dark:border-white/5 pb-1">
                                    {sectionName}
                                </div>

                                {controls.map((ctrl) => {
                                    const currentValue = activeProps[ctrl.id] !== undefined ? activeProps[ctrl.id] : ctrl.defaultValue;

                                    return (
                                        <div key={ctrl.id} className="space-y-1.5">
                                            {/* Control Label + Value Readout */}
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-foreground">
                                                    {ctrl.label}
                                                </label>
                                                {ctrl.type === 'slider' && (
                                                    <span className="text-[11px] font-mono font-medium text-muted-foreground">
                                                        {currentValue}
                                                        {ctrl.unit}
                                                    </span>
                                                )}
                                            </div>

                                            {ctrl.description && (
                                                <p className="text-[10px] text-muted-foreground leading-tight">
                                                    {ctrl.description}
                                                </p>
                                            )}

                                            {/* Slider Control */}
                                            {ctrl.type === 'slider' && (
                                                <div className="pt-1">
                                                    <input
                                                        type="range"
                                                        min={ctrl.min ?? 0}
                                                        max={ctrl.max ?? 100}
                                                        step={ctrl.step ?? 1}
                                                        value={currentValue}
                                                        onChange={(e) => handlePropChange(ctrl.id, Number(e.target.value))}
                                                        className="w-full accent-primary h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                                                    />
                                                </div>
                                            )}

                                            {/* Switch Control */}
                                            {ctrl.type === 'switch' && (
                                                <div className="pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePropChange(ctrl.id, !currentValue)}
                                                        className={`w-11 h-6 rounded-full p-1 relative transition-colors cursor-pointer ${
                                                            currentValue ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-800'
                                                        }`}
                                                    >
                                                        <motion.div
                                                            animate={{ x: currentValue ? 20 : 0 }}
                                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                                                        />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Color Swatch Control */}
                                            {ctrl.type === 'color' && ctrl.palette && (
                                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                                    {ctrl.palette.map((swatch) => {
                                                        const isSelected = currentValue === swatch;
                                                        return (
                                                            <button
                                                                key={swatch}
                                                                type="button"
                                                                onClick={() => handlePropChange(ctrl.id, swatch)}
                                                                className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative shadow-xs border ${
                                                                    isSelected
                                                                        ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent'
                                                                        : 'border-black/10 hover:scale-105'
                                                                }`}
                                                                style={{ backgroundColor: swatch }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Select / Segment Buttons Control */}
                                            {ctrl.type === 'select' && ctrl.options && (
                                                <div className="grid grid-cols-2 gap-1 pt-1">
                                                    {ctrl.options.map((opt) => {
                                                        const isSelected = currentValue === opt.value;
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => handlePropChange(ctrl.id, opt.value)}
                                                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center truncate ${
                                                                    isSelected
                                                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                                                                        : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'
                                                                }`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Text Control */}
                                            {ctrl.type === 'text' && (
                                                <div className="pt-1">
                                                    <input
                                                        type="text"
                                                        value={currentValue}
                                                        onChange={(e) => handlePropChange(ctrl.id, e.target.value)}
                                                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
