'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef } from 'react';
import type { ComponentMetadata } from '@/lib/types';
import { CreditCard, Shield, Smartphone, Home, Search, Bell, User, Plus, FileText, Users, Calendar, Type, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30
} as const;

// Interactive Thumbnails
const AnimatedTabBarThumbnail = () => {
    const [activeTab, setActiveTab] = useState('Pay');
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="bg-zinc-200/50 dark:bg-zinc-900/50 p-1 rounded-2xl flex gap-1 relative w-full max-w-[240px]">
                {['Pay', 'Request', 'Scan'].map((tab) => (
                    <button
                        key={tab}
                        onClick={(e) => { e.preventDefault(); setActiveTab(tab); }}
                        className={`flex-1 relative py-1.5 text-[10px] font-medium transition-colors z-10 ${activeTab === tab ? 'text-black dark:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {activeTab === tab && (
                            <motion.div layoutId="activeTabPill-thumb" className="absolute inset-x-0 inset-y-0 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200/50 dark:border-white/5 shadow-sm" transition={springTransition} />
                        )}
                        <span className="relative z-20 flex items-center justify-center gap-1.5">
                            {tab === 'Pay' && <CreditCard className="w-3 h-3" />}
                            {tab === 'Request' && <Shield className="w-3 h-3" />}
                            {tab === 'Scan' && <Smartphone className="w-3 h-3" />}
                            <span>{tab}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const SwitchToggleThumbnail = () => {
    const [isToggled, setIsToggled] = useState(true);
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <button
                onClick={(e) => { e.preventDefault(); setIsToggled(!isToggled); }}
                className={`w-12 h-7 rounded-full p-1 relative transition-colors duration-300 ${isToggled ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-800'}`}
            >
                <motion.div animate={{ x: isToggled ? 20 : 0 }} transition={springTransition} className={`w-5 h-5 rounded-full bg-white dark:bg-black shadow-sm`} />
            </button>
        </div>
    );
};

const AnimatedBottomNavThumbnail = () => {
    const [activeNav, setActiveNav] = useState('Home');
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-white/10 p-1.5 rounded-[1.5rem] flex justify-between items-center w-full max-w-[200px] shadow-sm relative z-10">
                {['Home', 'Search', 'Bell', 'User'].map((item) => {
                    const Icon = item === 'Home' ? Home : item === 'Search' ? Search : item === 'Bell' ? Bell : User;
                    const isActive = activeNav === item;
                    return (
                        <button key={item} onClick={(e) => { e.preventDefault(); setActiveNav(item); }} className={`relative flex-1 py-1.5 flex flex-col items-center justify-center transition-colors z-20 ${isActive ? 'text-primary' : 'text-zinc-500 hover:text-foreground'}`}>
                            {isActive && <motion.div layoutId="bottomNavIndicator-thumb" className="absolute inset-x-1 inset-y-0.5 rounded-lg bg-zinc-100 dark:bg-white/10 -z-10" transition={springTransition} />}
                            <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={springTransition}>
                                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                            </motion.div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const RangeSliderThumbnail = () => {
    const [sliderValue, setSliderValue] = useState(60);
    const sliderRef = useRef<HTMLDivElement>(null);
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setSliderValue(Math.round(percent));
    };
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-8">
            <div className="w-full max-w-[200px]">
                <div className="flex justify-between items-center text-[10px] font-medium mb-3">
                    <span className="text-muted-foreground">Intensity</span>
                    <span className="text-foreground">{sliderValue}%</span>
                </div>
                <div
                    ref={sliderRef}
                    className="relative w-full h-6 flex items-center cursor-grab touch-none"
                    onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); handlePointerMove(e); }}
                    onPointerMove={(e) => { e.preventDefault(); if (e.currentTarget.hasPointerCapture(e.pointerId)) handlePointerMove(e); }}
                >
                    <div className="absolute inset-x-0 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full pointer-events-none" />
                    <motion.div className="absolute left-0 h-1.5 bg-black dark:bg-white rounded-full pointer-events-none" animate={{ width: `${sliderValue}%` }} transition={{ type: "spring", stiffness: 400, damping: 40 }} />
                    <motion.div className="absolute h-4 w-4 bg-white border border-black dark:border-white rounded-full shadow-sm pointer-events-none" animate={{ left: `calc(${sliderValue}% - 8px)` }} transition={{ type: "spring", stiffness: 400, damping: 40 }} />
                </div>
            </div>
        </div>
    );
};

const FloatingSpeedDialThumbnail = () => {
    const [fabOpen, setFabOpen] = useState(false);
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative">
            <div className="relative flex flex-col items-end">
                <AnimatePresence>
                    {fabOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-12 right-0 flex flex-col items-end gap-2 z-[10]">
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} transition={{ duration: 0.2, delay: 0.1 }} className="flex items-center gap-1.5">
                                <span className="bg-black/80 text-white text-[8px] px-2 py-0.5 rounded font-medium shadow-sm border border-white/10">Add</span>
                                <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm"><Users className="w-3 h-3 text-zinc-800" /></div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} transition={{ duration: 0.2 }} className="flex items-center gap-1.5">
                                <span className="bg-black/80 text-white text-[8px] px-2 py-0.5 rounded font-medium shadow-sm border border-white/10">Doc</span>
                                <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm"><FileText className="w-3 h-3 text-zinc-800" /></div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button onClick={(e) => { e.preventDefault(); setFabOpen(!fabOpen); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md z-20 relative">
                    <motion.div animate={{ rotate: fabOpen ? 45 : 0 }} transition={springTransition}><Plus className="w-5 h-5" /></motion.div>
                </motion.button>
            </div>
        </div>
    );
};

const SkeletonLoaderThumbnail = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="w-full max-w-[200px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800/80 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-800/80 rounded-full animate-pulse" />
                    <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800/80 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="w-full max-w-[200px] mt-4 space-y-2">
                <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800/80 rounded-xl animate-pulse" />
            </div>
        </div>
    );
};

const RainbowButtonThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="relative group/btn cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00C0FF] via-[#FFCF00] to-[#FC4F4F] rounded-xl blur opacity-60 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200 animate-pulse"></div>
                <button className="relative px-6 py-2.5 bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Rainbow Button</span>
                </button>
            </div>
        </div>
    );
};

const BottomSheetThumbnail = () => {
    return (
        <div className="w-full h-full flex items-end justify-center bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.2]" />
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
                className="w-[80%] h-[120px] bg-white dark:bg-zinc-950 rounded-t-[2rem] shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col items-center pt-3 relative z-10"
            >
                <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-4" />
                <div className="w-full px-6 space-y-3">
                    <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-md" />
                </div>
            </motion.div>
        </div>
    );
};

const DatePickerThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm w-48">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-400 font-medium">Select a date</span>
            </div>
        </div>
    );
};

const NativeHapticsThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative">
            <motion.div
                animate={{ x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.4 }}
                className="w-16 h-24 border-2 border-zinc-300 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-between p-2 relative bg-white dark:bg-zinc-900"
            >
                <div className="w-4 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <Sparkles className="w-5 h-5 text-zinc-400" />
                <div className="w-full flex justify-center">
                    <div className="w-6 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                {/* Ripple rings */}
                <motion.div
                    animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-primary/50 rounded-full"
                />
            </motion.div>
        </div>
    );
};

const CustomInputThumbnail = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-8">
            <div className="w-full max-w-[200px] relative">
                <div className="absolute left-3 top-2.5 text-[10px] text-primary font-medium bg-white dark:bg-zinc-950 px-1 -mt-4 transition-all z-10">Email Address</div>
                <div className="w-full h-10 border-2 border-primary rounded-xl flex items-center px-3 bg-transparent relative z-0">
                    <span className="text-xs text-foreground">hello@nativecn.com</span>
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-[1.5px] h-4 bg-primary ml-1"
                    />
                </div>
            </div>
        </div>
    );
};

const GradientButtonThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow">
                Premium Feature
            </button>
        </div>
    );
};

const ImageCarouselThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <div className="flex gap-3 px-4 w-full">
                <motion.div animate={{ x: [-100, 0] }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 8, ease: "linear" }} className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-32 h-20 rounded-xl bg-zinc-200 dark:bg-zinc-800/80 flex-shrink-0 flex items-center justify-center shadow-sm">
                            <ImageIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const ImageSkeletonThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="w-32 h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800/80 animate-pulse flex items-center justify-center relative overflow-hidden">
                <ImageIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
            </div>
        </div>
    );
};

const MinimalistPlaceholder = ({ title }: { title: string }) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.2]" />
            <div className="px-4 py-2 border border-zinc-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm relative z-10">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{title}</span>
            </div>
        </div>
    );
}

const getThumbnailComponent = (id: string) => {
    switch (id) {
        case 'animated-tab-bar': return <AnimatedTabBarThumbnail />;
        case 'switch-toggle': return <SwitchToggleThumbnail />;
        case 'bottom-navigation': return <AnimatedBottomNavThumbnail />;
        case 'floating-speed-dial': return <FloatingSpeedDialThumbnail />;
        case 'range-slider': return <RangeSliderThumbnail />;
        case 'skeleton-loader': return <SkeletonLoaderThumbnail />;
        case 'rainbow-button': return <RainbowButtonThumbnail />;
        case 'bottom-sheet': return <BottomSheetThumbnail />;
        case 'date-picker': return <DatePickerThumbnail />;
        case 'native-haptics': return <NativeHapticsThumbnail />;
        case 'custom-input': return <CustomInputThumbnail />;
        case 'gradient-button': return <GradientButtonThumbnail />;
        case 'image-carousel': return <ImageCarouselThumbnail />;
        case 'image-skeleton': return <ImageSkeletonThumbnail />;
        default: return <MinimalistPlaceholder title={id} />;
    }
}

export default function ComponentsPageClient({ components = [] }: { components?: (ComponentMetadata & { slug: string })[] }) {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-6 py-20 md:py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 md:mb-10 flex flex-col items-start w-full"
                >
                    <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-3 gap-4 md:gap-0">
                        <h1 className="text-3xl md:text-3xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Components
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed max-w-xl">
                        A curated collection of beautiful, high-performance React Native components.
                        Zero dependencies, 60fps animations. Copy, paste, and ship.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {components.map((component, index) => (
                        <motion.div
                            key={component.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Link href={`/components/${component.slug}`}>
                                <div className="group relative flex flex-col h-full rounded-[22px] border border-border/60 bg-card overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-300 shadow-sm hover:shadow-md">

                                    {/* Thumbnail Area - Ultra Minimal */}
                                    <div className="w-full h-56 relative overflow-hidden border-b border-border/50">
                                        {getThumbnailComponent(component.id)}
                                    </div>

                                    {/* Content Area - Compact and Crisp */}
                                    <div className="p-5 flex flex-col flex-grow bg-card z-10 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                                                {component.name}
                                            </h3>
                                        </div>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                                            {component.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
