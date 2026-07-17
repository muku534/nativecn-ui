'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, CreditCard, Home, Search, User, Plus, Bell, FileText, Users } from 'lucide-react';
import { useState, useRef } from 'react';

// Reusable motion configurations for that premium springy feel
const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30
} as const;

export default function HeroShowcase() {
    // State for interactive components
    const [isToggled, setIsToggled] = useState(true);
    const [sliderValue, setSliderValue] = useState(60);
    const [activeTab, setActiveTab] = useState('Pay');
    const [activeNav, setActiveNav] = useState('Home');
    const [fabOpen, setFabOpen] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setSliderValue(Math.round(percent));
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-24 relative z-10">
            {/* The Bento Grid Container - Ultra minimal on light mode */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 rounded-[2rem] bg-white border border-neutral-200 dark:bg-black/80 dark:border-white/10 relative z-10 shadow-sm">

                {/* 1. Animated Tab Bar (col-span-4) - reduced height and padding */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden relative group min-h-[120px]"
                >
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">AnimatedTabBar</p>

                    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl flex gap-1 relative w-full max-w-[320px]">
                        {['Pay', 'Request', 'Scan'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 relative py-2 text-sm font-medium transition-colors z-10 ${activeTab === tab ? 'text-black dark:text-white' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-x-0 inset-y-0 bg-white dark:bg-zinc-700 rounded-xl border border-zinc-200/50 dark:border-white/5"
                                        transition={springTransition}
                                    />
                                )}
                                <span className="relative z-20 flex items-center justify-center gap-2">
                                    {tab === 'Pay' && <CreditCard className="w-4 h-4" />}
                                    {tab === 'Request' && <Shield className="w-4 h-4" />}
                                    {tab === 'Scan' && <Smartphone className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{tab}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* 2. Switch Toggle (col-span-2) - reduced height and padding */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden relative group min-h-[120px]"
                >
                    <div className="absolute top-4 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-red-500/40" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                        <div className="w-2 h-2 rounded-full bg-green-500/40" />
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">SwitchToggle</p>

                    <motion.button
                        onClick={() => setIsToggled(!isToggled)}
                        className={`w-14 h-8 rounded-full p-1 relative transition-colors duration-300 ${isToggled ? 'bg-black dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
                            }`}
                    >
                        <motion.div
                            animate={{ x: isToggled ? 24 : 0 }}
                            transition={springTransition}
                            className={`w-6 h-6 rounded-full bg-white dark:bg-black shadow-sm`}
                        />
                    </motion.button>
                </motion.div>

                {/* 3. Bottom Navigation (col-span-3) - reduced padding, removed heavy shadow from pill */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    // Since it shares a row with FAB, it will stretch gracefully to match FAB's height
                    className="md:col-span-3 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden relative group"
                >
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">AnimatedBottomNav</p>

                    <div className="bg-white dark:bg-[#1C1C1E] border border-zinc-200/80 dark:border-white/10 p-2 rounded-[2rem] flex justify-between items-center w-full max-w-[280px] shadow-sm relative z-10">
                        {['Home', 'Search', 'Bell', 'User'].map((item) => {
                            const Icon = item === 'Home' ? Home : item === 'Search' ? Search : item === 'Bell' ? Bell : User;
                            const isActive = activeNav === item;
                            return (
                                <button key={item} onClick={() => setActiveNav(item)} className={`relative flex-1 py-2.5 flex flex-col items-center justify-center transition-colors z-20 ${isActive ? 'text-primary' : 'text-zinc-500 dark:text-zinc-600 hover:text-foreground'}`}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNavIndicator"
                                            className="absolute inset-x-2 inset-y-1 rounded-[1rem] bg-zinc-100 dark:bg-white/10 -z-10"
                                            transition={springTransition}
                                        />
                                    )}
                                    <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={springTransition}>
                                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                    </motion.div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* 4. Floating Action Button (col-span-3) - Explicitly taller so it has space to open */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    // Removed min-h-[180px] to match others, positioned absolute menu high enough
                    className="md:col-span-3 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-visible relative group min-h-[120px]"
                >
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">FloatingSpeedDial</p>

                    <div className="relative flex flex-col items-end pt-5">
                        <AnimatePresence>
                            {fabOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    // Puts the expanded buttons absolutely positioned ABOVE the container to not break layout
                                    className="absolute bottom-14 right-0 flex flex-col items-end gap-2.5 z-[100]"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="bg-black/80 text-white text-[10px] px-2.5 py-1 rounded-md font-medium shadow-sm border border-white/10 whitespace-nowrap">Add Friends</span>
                                        <button className="w-11 h-11 flex-shrink-0 rounded-full bg-white text-zinc-800 flex items-center justify-center border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors shadow-sm">
                                            <Users className="w-4 h-4 cursor-pointer pointer-events-none" />
                                        </button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="bg-black/80 text-white text-[10px] px-2.5 py-1 rounded-md font-medium shadow-sm border border-white/10 whitespace-nowrap">Upload Doc</span>
                                        <button className="w-11 h-11 flex-shrink-0 rounded-full bg-white text-zinc-800 flex items-center justify-center border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors shadow-sm">
                                            <FileText className="w-4 h-4 cursor-pointer pointer-events-none" />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={() => setFabOpen(!fabOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-transparent shadow-sm z-50 relative"
                        >
                            <motion.div animate={{ rotate: fabOpen ? 45 : 0 }} transition={springTransition}>
                                <Plus className="w-6 h-6" />
                            </motion.div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* 5. Fluid Slider (col-span-4) - reduced padding/height */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    className="md:col-span-4 flex flex-col justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden relative group min-h-[120px]"
                >
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">RangeSlider</p>

                    <div className="w-full max-w-sm mx-auto space-y-4 pt-1">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span>Intensity</span>
                            <span className="text-muted-foreground">{sliderValue}%</span>
                        </div>

                        <div
                            ref={sliderRef}
                            className="relative w-full h-8 flex items-center group/slider z-20 cursor-grab active:cursor-grabbing touch-none"
                            onPointerDown={(e) => {
                                e.currentTarget.setPointerCapture(e.pointerId);
                                handlePointerMove(e);
                            }}
                            onPointerMove={(e) => {
                                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                                    handlePointerMove(e);
                                }
                            }}
                        >
                            <div className="absolute inset-x-0 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full pointer-events-none" />

                            <motion.div
                                className="absolute left-0 h-2 bg-black dark:bg-white rounded-full pointer-events-none"
                                animate={{ width: `${sliderValue}%` }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            />

                            <motion.div
                                className="absolute h-5 w-5 bg-white border-[1.5px] border-black dark:border-white rounded-full shadow-sm pointer-events-none"
                                animate={{ left: `calc(${sliderValue}% - 10px)` }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            />
                        </div>

                        <div className="flex justify-between w-full px-1">
                            {[0, 25, 50, 75, 100].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setSliderValue(val)}
                                    className={`text-[10px] font-mono px-2 py-1 rounded-md transition-colors z-30 ${val === sliderValue
                                        ? 'bg-zinc-200 dark:bg-zinc-800 text-foreground text-xs font-bold'
                                        : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                        }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 6. Skeleton Loader (col-span-2) - reduced padding/height */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springTransition}
                    className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-white/5 overflow-hidden relative group min-h-[120px]"
                >
                    <p className="text-[10px] font-mono text-muted-foreground absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">SkeletonLoader</p>

                    <div className="w-full max-w-[200px] space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse" />
                                <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse delay-75" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse delay-100" />
                            <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse delay-150" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
