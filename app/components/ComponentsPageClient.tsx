'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
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
    const width = 160;
    const height = 48;
    const borderRadius = 16;
    const borderWidth = 2;
    const perimeter = 2 * (width + height - 2 * borderRadius) + 2 * Math.PI * borderRadius;
    const sweepLength = perimeter * 0.35;

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="relative cursor-pointer" style={{ width, height }}>
                <svg width={width} height={height} className="absolute inset-0">
                    <defs>
                        <linearGradient id="rainbow" x1="0" y1="0" x2={width} y2={height} gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#00C0FF" />
                            <stop offset="33%" stopColor="#FFCF00" />
                            <stop offset="66%" stopColor="#FC4F4F" />
                            <stop offset="100%" stopColor="#00C0FF" />
                        </linearGradient>
                    </defs>
                    <rect
                        x={borderWidth / 2}
                        y={borderWidth / 2}
                        width={width - borderWidth}
                        height={height - borderWidth}
                        rx={borderRadius - borderWidth / 2}
                        ry={borderRadius - borderWidth / 2}
                        stroke="#E4E4E7"
                        className="dark:stroke-zinc-800"
                        strokeWidth={borderWidth}
                        fill="none"
                    />
                    <motion.rect
                        x={borderWidth / 2}
                        y={borderWidth / 2}
                        width={width - borderWidth}
                        height={height - borderWidth}
                        rx={borderRadius - borderWidth / 2}
                        ry={borderRadius - borderWidth / 2}
                        stroke="url(#rainbow)"
                        strokeWidth={borderWidth}
                        fill="none"
                        strokeDasharray={`${sweepLength} ${perimeter - sweepLength}`}
                        animate={{
                            strokeDashoffset: [0, -perimeter]
                        }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity
                        }}
                    />
                </svg>
                <div 
                    className="absolute flex items-center justify-center bg-white dark:bg-black font-semibold text-xs text-zinc-800 dark:text-zinc-200"
                    style={{
                        top: borderWidth,
                        left: borderWidth,
                        width: width - borderWidth * 2,
                        height: height - borderWidth * 2,
                        borderRadius: borderRadius - borderWidth
                    }}
                >
                    Rainbow Button
                </div>
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
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div 
            className="w-full h-full flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 p-6"
        >
            <div className="w-full max-w-[280px] flex flex-col items-start gap-1.5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <span className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-400 pl-1">Date of Birth</span>
                <motion.div 
                    layout
                    className="relative bg-white dark:bg-zinc-900 border overflow-hidden flex flex-col items-center justify-start w-full shadow-sm"
                    style={{
                        borderRadius: expanded ? 24 : 16,
                        height: expanded ? 370 : 56,
                        borderColor: '#e5e5e5',
                        backgroundColor: '#ffffff',
                    }}
                    transition={{ type: "spring", damping: 24, stiffness: 200, mass: 0.8 }}
                >
                    {/* Collapsed Input State */}
                    <div 
                        className="flex items-center justify-between px-4 w-full cursor-pointer h-14"
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    >
                        <div className="flex items-center">
                            <div className="w-5 h-5 rounded-[4px] border-[1.5px] border-zinc-900 dark:border-zinc-100 overflow-hidden mr-3 flex flex-col items-center">
                                <div className="w-full h-1 bg-zinc-900 dark:bg-zinc-100"></div>
                                <div className="flex gap-[2px] mt-[3px]">
                                    <div className="w-[2px] h-[2px] rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                                    <div className="w-[2px] h-[2px] rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                                    <div className="w-[2px] h-[2px] rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
                                </div>
                            </div>
                            <span className="text-[16px] font-medium text-zinc-900 dark:bg-zinc-100 tracking-wide">August 18, 2026</span>
                        </div>
                        <motion.div 
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-400 rotate-45 mr-1"
                            style={{ transformOrigin: 'center' }}
                        />
                    </div>

                    {/* Expanded Calendar State */}
                    <motion.div
                        className="absolute inset-0 pt-[60px] px-4 flex flex-col pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: expanded ? 1 : 0 }}
                        transition={{ duration: 0.2, delay: expanded ? 0.1 : 0 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 w-full px-1">
                            <div className="w-8 h-8 rounded-[10px] border border-zinc-200 bg-white flex items-center justify-center text-[14px] font-semibold text-zinc-800">{'<'}</div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">August</span>
                                <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100">2026</span>
                            </div>
                            <div className="w-8 h-8 rounded-[10px] border border-zinc-200 bg-white flex items-center justify-center text-[14px] font-semibold text-zinc-800">{'>'}</div>
                        </div>
                        {/* Days row */}
                        <div className="flex w-full justify-between mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-zinc-400 w-8 text-center">{d}</span>
                            ))}
                        </div>
                        {/* Grid */}
                        <div className="flex flex-wrap gap-y-1 w-full justify-between">
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-[13px] font-medium ${i === 16 ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-700 dark:text-zinc-300'}`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        {/* Confirm Button */}
                        <div className="mt-auto mb-3 w-full h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                            <span className="text-[13px] font-semibold text-white dark:text-black">Confirm</span>
                        </div>
                    </motion.div>
                </motion.div>
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
    const images = [
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=60', title: 'Yosemite Valley', desc: 'California, USA' },
        { url: 'https://images.unsplash.com/photo-1511576661531-b34d7ad5d0db?w=300&auto=format&fit=crop&q=60', title: 'Alpine Peaks', desc: 'Chamonix, France' },
        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=60', title: 'Misty Forest', desc: 'Vancouver, Canada' }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const cardWidth = 100;
    const cardGap = 12;
    const itemSize = cardWidth + cardGap;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
            <div className="relative w-[100px] h-[110px] flex items-center justify-center" style={{ perspective: 1000 }}>
                {images.map((img, idx) => {
                    const offset = idx - activeIndex;
                    let displayOffset = offset;
                    if (offset < -1) displayOffset = offset + images.length;
                    if (offset > 1) displayOffset = offset - images.length;

                    const isActive = displayOffset === 0;
                    const isVisible = Math.abs(displayOffset) <= 1;

                    return (
                        <motion.div
                            key={idx}
                            style={{
                                position: 'absolute',
                                width: cardWidth,
                                height: '100%',
                                borderRadius: '16px',
                                backgroundImage: `url(${img.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: isActive ? 10 : 5,
                            }}
                            animate={{
                                scale: isActive ? 1 : 0.82,
                                x: displayOffset * itemSize,
                                opacity: isVisible ? (isActive ? 1 : 0.45) : 0,
                                rotateY: displayOffset * -35,
                            }}
                            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                            className="border border-white/20 shadow-lg flex items-end overflow-hidden pointer-events-none"
                        >
                            <div className="w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 text-left">
                                <p className="text-[9px] font-bold text-white leading-tight truncate">{img.title}</p>
                                <p className="text-[7.5px] text-zinc-300 truncate">{img.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-center gap-1.5 mt-4 z-10">
                {images.map((_, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                        <motion.div
                            key={idx}
                            className="h-1 bg-zinc-800 dark:bg-zinc-200 rounded-full"
                            animate={{
                                width: isActive ? 12 : 4,
                                opacity: isActive ? 1 : 0.25,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const ImageSkeletonThumbnail = () => {
    const [time, setTime] = useState(0);
    useEffect(() => {
        let frame: number;
        const tick = () => {
            setTime(t => t + 0.02);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, []);

    const width = 200;
    const height = 120;
    const r = Math.min(width, height) * 0.4;
    const cx = width / 2;
    const cy = height / 2;

    const x1 = cx + Math.cos(time) * r;
    const y1 = cy + Math.sin(time) * r;

    const x2 = cx + Math.sin(time * 1.5) * r;
    const y2 = cy + Math.cos(time * 1.5) * r;

    const dotSpacing = 14;
    const cols = Math.floor(width / dotSpacing);
    const rows = Math.floor(height / dotSpacing);
    const offsetX = (width - (cols - 1) * dotSpacing) / 2;
    const offsetY = (height - (rows - 1) * dotSpacing) / 2;

    const dots = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            dots.push({ x: offsetX + i * dotSpacing, y: offsetY + j * dotSpacing });
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div 
                className="relative overflow-hidden bg-[#171717] border border-zinc-200 dark:border-zinc-800" 
                style={{ width, height, borderRadius: 12 }}
            >
                <svg width={width} height={height} className="absolute inset-0">
                    <defs>
                        <radialGradient id="spot1" cx={`${(x1 / width) * 100}%`} cy={`${(y1 / height) * 100}%`} r="35%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="spot2" cx={`${(x2 / width) * 100}%`} cy={`${(y2 / height) * 100}%`} r="30%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        <mask id="dot-mask">
                            <rect width={width} height={height} fill="black" />
                            {dots.map((dot, idx) => (
                                <circle key={idx} cx={dot.x} cy={dot.y} r="1.25" fill="white" />
                            ))}
                        </mask>
                    </defs>

                    <g opacity="0.08">
                        {dots.map((dot, idx) => (
                            <circle key={idx} cx={dot.x} cy={dot.y} r="1.25" fill="#ffffff" />
                        ))}
                    </g>

                    <g mask="url(#dot-mask)">
                        <rect width={width} height={height} fill="url(#spot1)" />
                        <rect width={width} height={height} fill="url(#spot2)" />
                    </g>
                </svg>
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

const ExpandableActionMenuThumbnail = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-end bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden group">
            {/* The expanded background container */}
            <div className="absolute bottom-4 w-[260px] h-[52px] group-hover:h-[180px] bg-white dark:bg-[#1C1C1E] shadow-sm rounded-t-3xl rounded-b-[26px] border border-zinc-200/50 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-end">
                
                {/* Menu Items (Fade in on hover) */}
                <div className="flex-1 flex flex-col px-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 justify-start">
                    <div className="w-full h-8 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="w-24 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <div className="w-16 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-zinc-100 dark:bg-white/5 my-2.5" />
                    <div className="w-full h-8 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="w-28 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <div className="w-14 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar Icons */}
                <div className="absolute bottom-0 left-0 right-0 h-[52px] w-full flex items-center justify-between px-2">
                    {/* Active Pill Indicator */}
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[46px] h-[36px] bg-zinc-100 dark:bg-zinc-800 rounded-[14px] transition-all duration-500 group-hover:opacity-0" />
                    
                    <div className="flex-1 flex items-center justify-center z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <Home className="w-[18px] h-[18px] text-black dark:text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 flex items-center justify-center z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <Search className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400" strokeWidth={2} />
                    </div>
                    
                    {/* Center gap for FAB */}
                    <div className="flex-1 max-w-[48px]" />
                    
                    <div className="flex-1 flex items-center justify-center z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <Bell className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1 flex items-center justify-center z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                        <User className="w-[18px] h-[18px] text-zinc-500 dark:text-zinc-400" strokeWidth={2} />
                    </div>
                </div>
            </div>

            {/* The Floating FAB */}
            <div className="absolute bottom-[40px] group-hover:bottom-5 w-[46px] h-[46px] rounded-full bg-[#18181b] dark:bg-white shadow-lg flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 group-hover:rotate-45">
                <Plus className="w-[22px] h-[22px] text-white dark:text-black" strokeWidth={2.5} />
            </div>
        </div>
    );
};

const LiquidActionTabBarThumbnail = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsOpen((prev) => !prev);
        }, 3200);
        return () => clearInterval(timer);
    }, []);

    const actions = [
        { name: 'Trim', icon: '✂️' },
        { name: 'Crop', icon: '⧉' },
        { name: 'Enhance', icon: '✨' },
        { name: 'Text', icon: 'Aa' },
        { name: 'Audio', icon: '🎵' },
        { name: 'Speed', icon: '🐇' },
        { name: 'Duplicate', icon: '❐' },
        { name: 'Undo', icon: '↩' },
        { name: 'Share', icon: '⎘' },
        { name: 'Save', icon: '🔖' },
        { name: 'Delete', icon: '🗑' },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-end bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden group/liquid">
            {/* Bottom Row Alignment */}
            <div className="w-full flex items-end justify-between gap-2 z-10">
                {/* Left Side Morphing Container */}
                <motion.div
                    initial={false}
                    animate={{
                        height: isOpen ? 170 : 44,
                        borderRadius: isOpen ? 22 : 22,
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-md flex flex-col justify-center overflow-hidden relative"
                >
                    {/* Collapsed State: 4 Tab Icons */}
                    <motion.div
                        animate={{ opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute inset-0 flex items-center justify-around px-2 ${isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-8 h-7 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
                            <span className="text-[13px] text-zinc-900 dark:text-white z-10 relative">🏠</span>
                        </div>
                        <span className="text-[13px] text-zinc-400 dark:text-zinc-500 z-10">📥</span>
                        <span className="text-[13px] text-zinc-400 dark:text-zinc-500 z-10">🔔</span>
                        <span className="text-[13px] text-zinc-400 dark:text-zinc-500 z-10">🥞</span>
                    </motion.div>

                    {/* Expanded State: 4-Column Action Grid */}
                    <motion.div
                        animate={{
                            opacity: isOpen ? 1 : 0,
                            scale: isOpen ? 1 : 0.88,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`p-2 grid grid-cols-4 gap-y-1.5 gap-x-1 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
                        {actions.map((act) => (
                            <div key={act.name} className="flex flex-col items-center">
                                <div className="w-5.5 h-5.5 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] shadow-xs">
                                    {act.icon}
                                </div>
                                <span className="text-[7px] font-medium text-zinc-700 dark:text-zinc-300 mt-0.5 truncate max-w-full">{act.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Side FAB Plus/Close Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-11 h-11 shrink-0 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md flex items-center justify-center text-base font-light transition-transform duration-300 active:scale-90"
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        +
                    </motion.span>
                </button>
            </div>
        </div>
    );
};

const TimePickerThumbnail = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="w-[240px] h-[190px] bg-white dark:bg-[#1C1C1E] rounded-[24px] p-4 flex flex-col shadow-sm border border-zinc-200/60 dark:border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full border-[1.5px] border-zinc-400 dark:border-zinc-500 relative flex items-center justify-center">
                            <div className="w-[1.5px] h-[6px] bg-zinc-400 dark:bg-zinc-500 absolute top-[2px] rounded-full" />
                            <div className="w-[6px] h-[1.5px] bg-zinc-400 dark:bg-zinc-500 absolute top-[6px] left-[6px] rounded-full" />
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500">Time</span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-900 dark:text-white">7:00 pm - 8:00 pm</span>
                </div>
                
                {/* Segmented Control */}
                <div className="w-full h-7 bg-zinc-100 dark:bg-[#2C2C2E] rounded-full mb-4 p-0.5 flex">
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-zinc-500">Single time</span>
                    </div>
                    <div className="flex-1 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 2L2.5 3.5L5 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-900 dark:text-white">Time range</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 items-center justify-between px-1">
                    {/* Clock face (Left) */}
                    <div className="w-[64px] h-[64px] rounded-full bg-zinc-50 dark:bg-[#2C2C2E] relative flex items-center justify-center shadow-inner border border-zinc-100 dark:border-zinc-700/50">
                        {/* Clock hands */}
                        <div className="w-[1.5px] h-[20px] bg-zinc-900 dark:bg-white absolute top-3 left-[31px] rounded-full origin-bottom rotate-[210deg]" />
                        <div className="w-[1.5px] h-[24px] bg-blue-500 absolute top-2 left-[31.5px] rounded-full origin-bottom" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute top-[5px]" />
                        <div className="w-1 h-1 rounded-full bg-white dark:bg-zinc-900 absolute z-10" />
                        
                        {/* Tick marks */}
                        <div className="absolute top-1.5 w-[1.5px] h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <div className="absolute bottom-1.5 w-[1.5px] h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <div className="absolute left-1.5 w-1.5 h-[1.5px] rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <div className="absolute right-1.5 w-1.5 h-[1.5px] rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    </div>

                    {/* Time Lists (Right) */}
                    <div className="relative w-[120px] h-[75px] flex items-center">
                        {/* Highlight Box */}
                        <div className="absolute left-0 right-0 top-[22.5px] h-[30px] bg-zinc-100 dark:bg-white/10 rounded-lg" />
                        
                        {/* Dash Indicator */}
                        <div className="absolute left-0 right-0 top-[22.5px] h-[30px] flex items-center justify-center">
                            <span className="text-[10px] text-zinc-400 font-medium">-</span>
                        </div>

                        {/* Start List */}
                        <div className="absolute left-0 w-[60px] h-full flex flex-col items-center justify-center z-10">
                            <span className="text-[9px] text-zinc-300 dark:text-zinc-600 mb-1.5">6:30 pm</span>
                            <span className="text-[11px] font-semibold text-zinc-900 dark:text-white">7:00 pm</span>
                            <span className="text-[9px] text-zinc-300 dark:text-zinc-600 mt-1.5">7:30 pm</span>
                        </div>

                        {/* End List */}
                        <div className="absolute right-0 w-[60px] h-full flex flex-col items-center justify-center z-10">
                            <span className="text-[9px] text-zinc-300 dark:text-zinc-600 mb-1.5">7:30 pm</span>
                            <span className="text-[11px] font-semibold text-zinc-900 dark:text-white">8:00 pm</span>
                            <span className="text-[9px] text-zinc-300 dark:text-zinc-600 mt-1.5">8:30 pm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExpandableCardThumbnail = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-6 perspective-1000">
            <div className="w-full max-w-[140px] h-36 rounded-xl bg-zinc-800 shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.1] group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Text Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col">
                    <div className="w-16 h-1.5 rounded-full bg-white/70 mb-1.5" />
                    <div className="w-24 h-2.5 rounded-full bg-white" />
                </div>
                
                {/* Expanded State Hint (Fades in on hover) */}
                <div className="absolute inset-0 bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col z-10">
                    <div className="w-full h-24 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center relative">
                        {/* Close button hint */}
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-2 h-[1px] bg-white/80 rotate-45 absolute" />
                            <div className="w-2 h-[1px] bg-white/80 -rotate-45 absolute" />
                        </div>
                    </div>
                    <div className="p-3 bg-zinc-900 flex-1 flex flex-col justify-start">
                        <div className="space-y-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                            <div className="w-full h-1.5 rounded-full bg-zinc-700" />
                            <div className="w-5/6 h-1.5 rounded-full bg-zinc-700" />
                            <div className="w-4/5 h-1.5 rounded-full bg-zinc-700" />
                            <div className="w-full h-1.5 rounded-full bg-zinc-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DynamicOtpThumbnail = () => {
    const [status, setStatus] = useState<'idle' | 'typing' | 'loading' | 'success'>('idle');
    const timer1 = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timer2 = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        setStatus('typing');
        timer1.current = setTimeout(() => {
            setStatus('loading');
            timer2.current = setTimeout(() => {
                setStatus('success');
            }, 1800);
        }, 400);
    };

    const handleMouseLeave = () => {
            if (timer1.current) clearTimeout(timer1.current);
        if (timer2.current) clearTimeout(timer2.current);
        setStatus('idle');
    };

    const getBoxStyle = (index: number) => {
        if (status === 'idle' || status === 'typing') {
            const x = (index - 1.5) * 36;
            return { x, y: 0, scale: 1, borderRadius: 8, width: 32, height: 40 };
        }
        if (status === 'loading') {
            // Box 0: Left, Box 1: Right, Box 2: Top, Box 3: Bottom
            const pos = [
                { x: -30, y: 0 },
                { x: 30, y: 0 },
                { x: 0, y: -30 },
                { x: 0, y: 30 }
            ];
            return {
                x: pos[index].x,
                y: pos[index].y,
                scale: 0.7,
                borderRadius: 20, // perfect circle
                width: 32,
                height: 32,
            };
        }
        // success
        return { x: 0, y: 0, scale: 1.25, borderRadius: 24, width: 32, height: 32 };
    };

    return (
        <div 
            className="relative w-full h-full flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 overflow-hidden cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div 
                className="relative flex items-center justify-center w-40 h-40"
                animate={{ rotate: status === 'loading' ? 360 : 0 }}
                transition={{ 
                    rotate: status === 'loading' ? { duration: 2, ease: "linear", repeat: Infinity } : { duration: 0.5 }
                }}
            >
                {/* Dashed Square for Loading */}
                <motion.div 
                    className="absolute w-[60px] h-[60px] border-[1.5px] border-zinc-300 dark:border-zinc-700 border-dashed rounded-[10px]"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: status === 'loading' ? 0.6 : 0, 
                        scale: status === 'loading' ? 1 : 0.5 
                    }}
                    transition={{ duration: 0.5 }}
                />

                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className={`absolute border-[1.5px] flex items-center justify-center shadow-sm overflow-hidden
                            ${status === 'success' 
                                ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                : (i === 3 && status === 'idle' ? 'border-[#FF5500] bg-[#FF5500]/5 dark:bg-[#FF5500]/10 shadow-[0_0_12px_rgba(255,85,0,0.2)]' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900')
                            }
                        `}
                        animate={getBoxStyle(i)}
                        transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    >
                        <motion.span 
                            className={`text-base font-semibold ${i === 3 ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}
                            animate={{ opacity: (status === 'idle' || status === 'typing') ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {i === 0 ? '4' : i === 1 ? '8' : i === 2 ? '2' : (status === 'typing' ? '9' : '')}
                        </motion.span>
                        
                        {/* Blinking Cursor in 4th box */}
                        {status === 'idle' && i === 3 && (
                            <div className="absolute bottom-2 w-3 h-0.5 bg-[#FF5500] rounded-full animate-pulse" />
                        )}
                    </motion.div>
                ))}

                {/* Success Checkmark */}
                <motion.div
                    className="absolute z-20 text-white font-bold text-xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: status === 'success' ? 1 : 0,
                        scale: status === 'success' ? 1 : 0,
                    }}
                    transition={{ delay: status === 'success' ? 0.3 : 0, type: "spring" }}
                >
                    ✓
                </motion.div>
            </motion.div>
        </div>
    );
};

const DynamicUploadThumbnail = () => {
    const [status, setStatus] = useState<'uploading' | 'paused' | 'success'>('uploading');
    const [progress, setProgress] = useState(2);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'uploading') {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setStatus('success');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
        }
        return () => clearInterval(interval);
    }, [status]);

    const handlePauseResume = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus(s => s === 'uploading' ? 'paused' : 'uploading');
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setProgress(2);
        setStatus('uploading');
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="relative w-full max-w-[260px] bg-white dark:bg-[#18181B] rounded-[18px] p-3 flex items-center shadow-sm border border-black/5 dark:border-white/10 overflow-hidden text-left">
                {/* Background Fill */}
                <motion.div 
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className={`absolute left-0 top-0 bottom-0 z-0 transition-colors duration-300 ${
                        status === 'success' ? 'bg-[#DCFCE7] dark:bg-[#064E3B]/40' : 
                        status === 'paused' ? 'bg-[#F3F4F6] dark:bg-[#27272A]/40' : 
                        'bg-[#E0F2FE] dark:bg-[#1E3A8A]/40'
                    }`}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center w-full">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-[10px] bg-[#107C41] flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                        {/* Fold */}
                        <div className="absolute top-0 right-0 w-3 h-3 bg-white dark:bg-[#18181B] rounded-bl-sm" />
                        
                        <div className="absolute top-[6px] right-[6px] grid grid-cols-2 gap-[2px]">
                            <div className="w-[3px] h-[3px] bg-white/90 rounded-[1px]" />
                            <div className="w-[3px] h-[3px] bg-white/90 rounded-[1px]" />
                            <div className="w-[3px] h-[3px] bg-white/90 rounded-[1px]" />
                            <div className="w-[3px] h-[3px] bg-white/90 rounded-[1px]" />
                        </div>
                        <span className="text-white text-[8px] font-bold mt-3 tracking-wider">XLSX</span>
                    </div>

                    {/* Text */}
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-900 dark:text-[#FAFAFA] truncate">create-ui.xlsx</p>
                        <div className="flex items-center text-[10px] mt-0.5 whitespace-nowrap">
                            {status === 'success' && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[7px] mr-1 shrink-0">
                                    ✓
                                </motion.span>
                            )}
                            <span className={status === 'paused' ? 'text-[#A1A1AA]' : 'text-[#605BFF] dark:text-[#818CF8]'}>
                                {status === 'success' ? '100%' : `${progress}%`}
                            </span>
                            <span className="text-[#71717A] ml-1 truncate">
                                • {status === 'success' ? '2.3MB' : `${(2.3 * (progress / 100)).toFixed(1)} MB of 2.3MB`}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        {status !== 'success' && (
                            <>
                                <button 
                                    onClick={handlePauseResume}
                                    className="w-6 h-6 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] flex items-center justify-center border border-transparent dark:border-[#3F3F46] transition-colors cursor-pointer"
                                >
                                    {status === 'paused' ? (
                                        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[4px] border-l-[#52525B] dark:border-l-[#E4E4E7] border-b-[3px] border-b-transparent ml-[1.5px]" />
                                    ) : (
                                        <div className="flex gap-[2px]">
                                            <div className="w-[2px] h-[8px] bg-[#52525B] dark:bg-[#E4E4E7] rounded-full" />
                                            <div className="w-[2px] h-[8px] bg-[#52525B] dark:bg-[#E4E4E7] rounded-full" />
                                        </div>
                                    )}
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    className="w-6 h-6 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] flex items-center justify-center border border-transparent dark:border-[#3F3F46] transition-colors cursor-pointer"
                                >
                                    <span className="text-[10px] font-medium text-[#52525B] dark:text-[#E4E4E7] mb-[1px]">✕</span>
                                </button>
                            </>
                        )}
                        {status === 'success' && (
                            <button 
                                onClick={handleCancel}
                                className="w-6 h-6 rounded-full bg-[#FEE2E2] dark:bg-[#450A0A] hover:bg-[#FECACA] dark:hover:bg-[#7F1D1D] flex flex-col items-center justify-center border border-[#FEE2E2] dark:border-[#7F1D1D] gap-[1px] transition-colors cursor-pointer"
                            >
                                <div className="w-[8px] h-[1.5px] bg-[#EF4444] dark:bg-[#FCA5A5] rounded-full" />
                                <div className="w-[6px] h-[6px] border border-[#EF4444] dark:border-[#FCA5A5] rounded-sm border-t-0 flex justify-evenly pt-[1px]">
                                    <div className="w-[1px] h-[3px] bg-[#EF4444] dark:bg-[#FCA5A5]" />
                                    <div className="w-[1px] h-[3px] bg-[#EF4444] dark:bg-[#FCA5A5]" />
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

const PhotoAlbumThumbnail = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(100); // 100 = right side (closed)
    const springConfig = { damping: 25, stiffness: 200 };
    const springX = useSpring(mouseX, springConfig);
    // As mouse moves from right (100) to left (0), rotate from 0 to -170 degrees
    const rotateY = useTransform(springX, [100, 0], [0, -170]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        mouseX.set(percent);
    };

    const handlePointerLeave = () => {
        mouseX.set(100); // return to closed state
    };

    return (
        <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center bg-stone-50 dark:bg-stone-950 cursor-ew-resize"
            style={{ perspective: 1000 }}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
        >
            <div className="relative w-20 h-28 shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
                {/* Underneath Page (Right side of open spread) */}
                <div className="absolute inset-0 bg-white rounded-r-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="underneath page" />
                </div>
                
                {/* Rotating Page Container */}
                <motion.div 
                    style={{ rotateY, transformStyle: 'preserve-3d' }}
                    className="absolute inset-0 origin-left z-10"
                >
                    {/* Front Face (Cover) */}
                    <div 
                        className="absolute inset-0 bg-[#CFC7BB] rounded-r-sm flex flex-col items-center justify-start p-1.5 shadow-[-2px_0_5px_rgba(0,0,0,0.1)]"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="w-full h-1/2 bg-white p-0.5 shadow-sm mb-1.5">
                            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="cover image" />
                        </div>
                        <div className="w-4 h-px bg-[#3A332B]/20 mb-1" />
                        <span className="text-[5px] tracking-widest text-[#3A332B] font-medium text-center leading-[1.2]">HOWARD<br/>BEACH</span>
                    </div>

                    {/* Back Face (Left side of open spread) */}
                    <div 
                        className="absolute inset-0 bg-white rounded-r-sm overflow-hidden border border-zinc-200 dark:border-zinc-800"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <img src="https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="back of cover" />
                    </div>
                </motion.div>

                {/* Left side book spine hinge */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/10 z-20 pointer-events-none rounded-l-sm" />
            </div>
        </div>
    );
};

const getThumbnailComponent = (id: string) => {
    switch (id) {
        case 'animated-tab-bar': return <AnimatedTabBarThumbnail />;
        case 'liquid-action-tab-bar': return <LiquidActionTabBarThumbnail />;
        case 'expandable-action-menu': return <ExpandableActionMenuThumbnail />;
        case 'time-picker': return <TimePickerThumbnail />;
        case 'expandable-card': return <ExpandableCardThumbnail />;
        case 'dynamic-otp': return <DynamicOtpThumbnail />;
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
        case 'dynamic-upload': return <DynamicUploadThumbnail />;
        case 'photo-album': return <PhotoAlbumThumbnail />;
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
