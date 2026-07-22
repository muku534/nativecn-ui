'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
    return (
        <div className="group/picker w-full h-full flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="w-full max-w-[180px] space-y-1.5 relative">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Date of Birth</span>
                <div className="w-full h-9 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-between px-3 bg-white dark:bg-zinc-900 cursor-pointer shadow-sm">
                    <span className="text-[11px] text-zinc-950 dark:text-zinc-50">08/17/2026</span>
                    <span className="text-xs">📅</span>
                </div>

                <div className="absolute top-16 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-20 scale-90 origin-top opacity-0 group-hover/picker:opacity-100 group-hover/picker:scale-100 transition-all duration-300 pointer-events-none">
                    <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30">
                        <span className="text-[9px] font-semibold text-zinc-500">Select Date</span>
                    </div>
                    <div className="relative h-20 flex items-center justify-center overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/10">
                        <div className="absolute left-1 right-1 h-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-lg border border-zinc-200/50 dark:border-zinc-700/30" />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white dark:from-zinc-900 via-transparent to-white dark:to-zinc-900 opacity-95" />
                        <div className="flex justify-around w-full px-1.5 z-10 font-mono text-[9px]">
                            <div className="flex flex-col items-center">
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">July</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">August</span>
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">Sept</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">16</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">17</span>
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">18</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">2025</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">2026</span>
                                <span className="text-[7.5px] text-zinc-400 dark:text-zinc-650">2027</span>
                            </div>
                        </div>
                    </div>
                </div>
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

const getThumbnailComponent = (id: string) => {
    switch (id) {
        case 'animated-tab-bar': return <AnimatedTabBarThumbnail />;
        case 'liquid-action-tab-bar': return <LiquidActionTabBarThumbnail />;
        case 'time-picker': return <TimePickerThumbnail />;
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
