'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_GLOBE_DOTS } from '@/registry/components/stars-globe/worldData';
import {
    CreditCard,
    Shield,
    Smartphone,
    Home,
    Search,
    Bell,
    User,
    Plus,
    FileText,
    Users,
    Calendar,
    Sparkles,
    Check,
    UploadCloud,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    MapPin,
    Volume2,
    Heart,
    Share2,
    Compass,
    Bookmark,
    Camera,
    Folder,
    Clock,
    X,
    Play,
    Pause,
    Sliders,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Trash2,
    Copy,
    Lock,
    Mail,
    Wifi,
    Bluetooth,
    Plane,
    TrendingUp,
    ArrowUpRight,
    Star,
    Layers,
    Archive,
    MessageCircle,
    Loader2,
    List,
} from 'lucide-react';

interface DeviceRendererProps {
    componentId: string;
    props: Record<string, any>;
    deviceTheme: 'dark' | 'light';
    resetTrigger: number;
}

const springTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
} as const;

// ─── 1. Stars Globe ──────────────────────────────────────────────────────────
const COUNTRY_TELEMETRY: Record<
    string,
    { name: string; flag: string; lat: number; lng: number; users: string; speed: string; ping: string; status: string }
> = {
    US: { name: 'United States', flag: '🇺🇸', lat: 38, lng: -97, users: '48.2M', speed: '940 Mbps', ping: '12 ms', status: 'Optimal' },
    IN: { name: 'India', flag: '🇮🇳', lat: 21, lng: 78, users: '82.4M', speed: '620 Mbps', ping: '18 ms', status: 'Optimal' },
    GB: { name: 'United Kingdom', flag: '🇬🇧', lat: 55, lng: -3, users: '18.7M', speed: '850 Mbps', ping: '9 ms', status: 'Optimal' },
    JP: { name: 'Japan', flag: '🇯🇵', lat: 36, lng: 138, users: '34.8M', speed: '1.2 Gbps', ping: '8 ms', status: 'Optimal' },
    BR: { name: 'Brazil', flag: '🇧🇷', lat: -14, lng: -51, users: '29.3M', speed: '480 Mbps', ping: '26 ms', status: 'Operational' },
    SG: { name: 'Singapore', flag: '🇸🇬', lat: 1.3, lng: 103.8, users: '5.2M', speed: '1.4 Gbps', ping: '6 ms', status: 'Optimal' },
};

function circlePath(cx: number, cy: number, r: number): string {
    const rx = Math.round(cx * 10) / 10;
    const ry = Math.round(cy * 10) / 10;
    const rr = Math.round(r * 10) / 10;
    return `M${rx - rr} ${ry}a${rr} ${rr} 0 1 0 ${2 * rr} 0a${rr} ${rr} 0 1 0 ${-2 * rr} 0`;
}

function StarsGlobeDevice({
    props,
}: {
    props: Record<string, any>;
    isDark?: boolean;
}) {
    const [rotationLng, setRotationLng] = useState(-70);
    const [tiltLat, setTiltLat] = useState(18);
    const [selectedCountry, setSelectedCountry] = useState(props.selectedCountry || 'US');
    const [pulse, setPulse] = useState(0);
    const [mode, setMode] = useState<'globe' | 'flat'>(props.mode === 'flat' ? 'flat' : 'globe');
    const [morphProgress, setMorphProgress] = useState(props.mode === 'flat' ? 0 : 1);
    const [isInteracting, setIsInteracting] = useState(false);

    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, lng: -70, lat: 18 });
    const animRef = useRef<number | null>(null);

    // Sync external mode prop
    useEffect(() => {
        if (props.mode === 'flat' || props.mode === 'globe') {
            setMode(props.mode);
        }
    }, [props.mode]);

    // Sync selected country
    useEffect(() => {
        if (props.selectedCountry && COUNTRY_TELEMETRY[props.selectedCountry]) {
            setSelectedCountry(props.selectedCountry);
            const c = COUNTRY_TELEMETRY[props.selectedCountry];
            setRotationLng(-c.lng);
            setTiltLat(Math.max(-40, Math.min(40, c.lat * 0.5)));
        }
    }, [props.selectedCountry]);

    // Morph animation between Globe (1) and Flat (0)
    const targetMorph = mode === 'globe' ? 1 : 0;
    useEffect(() => {
        let startTime: number | null = null;
        const startVal = morphProgress;
        const duration = 650;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const p = Math.min(1, elapsed / duration);
            const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            setMorphProgress(startVal + (targetMorph - startVal) * eased);
            if (p < 1) requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [targetMorph]);

    // 60FPS continuous auto-rotation loop when not interacting
    useEffect(() => {
        let lastTime = Date.now();
        const speed = typeof props.rotationSpeed === 'number' ? props.rotationSpeed : 20;

        const loop = () => {
            const now = Date.now();
            const dt = Math.min(0.1, (now - lastTime) / 1000);
            lastTime = now;

            if (!isDraggingRef.current && mode === 'globe' && speed > 0) {
                setRotationLng((prev) => (prev + speed * dt * 0.5) % 360);
            }
            setPulse((prev) => (prev + dt * 1.5) % 1);
            animRef.current = requestAnimationFrame(loop);
        };
        animRef.current = requestAnimationFrame(loop);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [props.rotationSpeed, mode]);

    // Touch & Pointer Drag Rotation Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        isDraggingRef.current = true;
        setIsInteracting(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            lng: rotationLng,
            lat: tiltLat,
        };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        const sensitivity = 0.65;
        const newLng = (dragStartRef.current.lng + dx * sensitivity) % 360;
        const newLat = Math.max(-55, Math.min(55, dragStartRef.current.lat - dy * (sensitivity * 0.7)));

        setRotationLng(newLng);
        setTiltLat(newLat);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        isDraggingRef.current = false;
        setTimeout(() => setIsInteracting(false), 200);
    };

    const handleSelectCountry = (code: string) => {
        setSelectedCountry(code);
        const c = COUNTRY_TELEMETRY[code];
        if (!c) return;
        const targetLng = -c.lng;
        const targetLat = Math.max(-40, Math.min(40, c.lat * 0.5));
        setRotationLng(targetLng);
        setTiltLat(targetLat);
    };

    // Projection calculation
    const cx = 150;
    const cy = 145;
    const radius = 90;
    const cardW = 270;
    const cardH = 150;
    const cardX = cx - cardW / 2;
    const cardY = cy - cardH / 2;

    const padX = 14;
    const padY = 12;
    const flatW = cardW - padX * 2;
    const flatH = cardH - padY * 2;
    const flatLeft = cardX + padX;
    const flatTop = cardY + padY;

    const radLng = (rotationLng * Math.PI) / 180;
    const radLat = (tiltLat * Math.PI) / 180;
    const cosLatTilt = Math.cos(radLat);
    const sinLatTilt = Math.sin(radLat);
    const m = morphProgress;

    let frontLandDots = '';
    let frontOceanDots = '';
    let backDotsPath = '';
    let highlightDotsPath = '';

    for (let i = 0; i < ALL_GLOBE_DOTS.length; i++) {
        const dot = ALL_GLOBE_DOTS[i];
        const phi = (dot.lat * Math.PI) / 180;
        const theta = (dot.lng * Math.PI) / 180 + radLng;

        const x0 = Math.cos(phi) * Math.sin(theta);
        const y0 = -Math.sin(phi);
        const z0 = Math.cos(phi) * Math.cos(theta);

        const targetX = x0;
        const targetY = y0 * cosLatTilt - z0 * sinLatTilt;
        const targetZ = y0 * sinLatTilt + z0 * cosLatTilt;

        const gx = cx + targetX * radius;
        const gy = cy + targetY * radius;

        const fx = flatLeft + ((dot.lng + 180) / 360) * flatW;
        const fy = flatTop + ((90 - dot.lat) / 180) * flatH;

        const curX = fx + (gx - fx) * m;
        const curY = fy + (gy - fy) * m;

        const isFront = targetZ > -0.05 || m < 0.35;
        const isLand = dot.code !== 'O' && dot.code !== '';

        if (isFront) {
            const dotR = isLand ? 1.7 : 0.9;
            const p = circlePath(curX, curY, dotR);
            if (isLand) frontLandDots += p;
            else frontOceanDots += p;

            if (dot.code === selectedCountry) {
                highlightDotsPath += circlePath(curX, curY, 2.5);
            }
        } else if (m > 0.4) {
            backDotsPath += circlePath(curX, curY, 0.6);
        }
    }

    const landColor = props.landColor || '#00D4FF';
    const oceanOpacity = props.oceanOpacity !== undefined ? props.oceanOpacity : 0.22;
    const activeData = COUNTRY_TELEMETRY[selectedCountry] || COUNTRY_TELEMETRY.US;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 select-none">
            {/* Header / Mode Switch */}
            <div className="w-full flex items-center justify-between pt-1">
                <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                        3D SKIA SPHERE
                    </span>
                    <h3 className="text-base font-bold tracking-tight">Global Mesh</h3>
                </div>

                {/* Mode Toggle Button */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-[10px] font-semibold">
                    <button
                        onClick={() => setMode('globe')}
                        className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${mode === 'globe'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Globe 🌐
                    </button>
                    <button
                        onClick={() => setMode('flat')}
                        className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${mode === 'flat'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Flat 🗺️
                    </button>
                </div>
            </div>

            {/* Interactive 3D Canvas with Touch / Drag Rotation */}
            <div
                className="relative w-[300px] h-[260px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <svg width={300} height={260} viewBox="0 15 300 260" className="overflow-visible">
                    <defs>
                        {/* Deep Space Spherical Core */}
                        <radialGradient id="deepSpaceCore" cx="42%" cy="38%" r="62%">
                            <stop offset="0%" stopColor="#1E293B" />
                            <stop offset="45%" stopColor="#0F172A" />
                            <stop offset="80%" stopColor="#0A0F1D" />
                            <stop offset="100%" stopColor="#020617" />
                        </radialGradient>

                        {/* Atmosphere Rim Gradient */}
                        <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="78%" stopColor={landColor} stopOpacity="0.32" />
                            <stop offset="100%" stopColor={landColor} stopOpacity="0" />
                        </radialGradient>

                        {/* Flat Card Background */}
                        <linearGradient id="flatCardBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0F172A" />
                            <stop offset="100%" stopColor="#020617" />
                        </linearGradient>
                    </defs>

                    {/* Mode Background: Morphing between Flat Card and Deep Space Sphere */}
                    {m < 0.95 && (
                        <rect
                            x={cardX}
                            y={cardY}
                            width={cardW}
                            height={cardH}
                            rx={18}
                            fill="url(#flatCardBg)"
                            opacity={1 - m}
                            stroke="#38BDF8"
                            strokeWidth={1}
                            strokeOpacity={0.4}
                        />
                    )}

                    {m > 0.05 && (
                        <>
                            {/* Deep Space Core */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={radius * m}
                                fill="url(#deepSpaceCore)"
                                opacity={m}
                            />

                            {/* Atmosphere Glow Halo */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={radius * 1.15 * m}
                                fill="url(#atmosphereGlow)"
                                opacity={m * 0.9}
                            />

                            {/* Outer Orbit Rim Ring */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={radius * 1.04 * m}
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="1.5"
                                opacity={0.65 * m}
                            />

                            {/* Dashed Equatorial Ring */}
                            <circle
                                cx={cx}
                                cy={cy}
                                r={radius * 1.12 * m}
                                fill="none"
                                stroke="#00D4FF"
                                strokeWidth="1"
                                strokeDasharray="3 5"
                                opacity={0.35 * m}
                            />
                        </>
                    )}

                    {/* Dots Layers */}
                    <path d={backDotsPath} fill="#475569" opacity={0.35 * m} />
                    <path d={frontOceanDots} fill="#38BDF8" opacity={oceanOpacity} />
                    <path d={frontLandDots} fill={landColor} opacity={0.95} />

                    {/* Highlighted Country Beacon */}
                    {highlightDotsPath && (
                        <path d={highlightDotsPath} fill="#FBBF24" opacity={0.85 + 0.15 * pulse} />
                    )}
                </svg>

                {/* Interaction Overlay Hint */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-wider flex items-center gap-1.5 shadow-sm pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{isInteracting ? 'Rotating 3D' : 'Drag to rotate in 3D'}</span>
                </div>
            </div>

            {/* Country Selector Chips */}
            <div className="flex items-center justify-center gap-1.5 w-full overflow-x-auto py-1">
                {Object.entries(COUNTRY_TELEMETRY).map(([code, c]) => {
                    const isSelected = selectedCountry === code;
                    return (
                        <button
                            key={code}
                            onClick={() => handleSelectCountry(code)}
                            className={`px-2 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${isSelected
                                    ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span>{c.flag}</span>
                            <span>{code}</span>
                        </button>
                    );
                })}
            </div>

            {/* Telemetry Stats Card */}
            <div className="w-full p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                            <span>{activeData.flag}</span>
                            <span>{activeData.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                            {activeData.users} · {activeData.speed} · {activeData.ping}
                        </div>
                    </div>
                </div>
                <div className="text-right text-[10px] font-mono font-bold text-primary">
                    {Math.round(rotationLng)}° E · {Math.round(tiltLat)}° N
                </div>
            </div>
        </div>
    );
}

// ─── 2. Animated Tab Bar ─────────────────────────────────────────────────────
function AnimatedTabBarDevice({ props, isDark }: { props: Record<string, any>; isDark: boolean }) {
    const rawCount = parseInt(props.tabCount || '3', 10);
    const tabs = useMemo(() => {
        if (rawCount === 4) return ['Home', 'Pay', 'Cards', 'More'];
        if (rawCount === 5) return ['Home', 'Search', 'Pay', 'Bell', 'User'];
        return ['Pay', 'Request', 'Scan'];
    }, [rawCount]);

    const [activeTab, setActiveTab] = useState(tabs[0]);
    useEffect(() => {
        if (!tabs.includes(activeTab)) setActiveTab(tabs[0]);
    }, [tabs]);

    const activeColor = props.activeTabColor || '#FF0080';
    const indicatorColor = props.indicatorColor || (isDark ? '#27272A' : '#FFFFFF');
    const borderRadius = props.borderRadius || 24;

    return (
        <div className="w-full h-full flex flex-col justify-between p-5">
            <div className="pt-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">FLUID NAVIGATION</div>
                <h2 className="text-xl font-bold tracking-tight mt-0.5">Quick Actions</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Sliding spring indicator with active scale</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="w-full max-w-[270px] p-5 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-white/10 text-center shadow-sm"
                >
                    <div
                        className="w-13 h-13 rounded-2xl mx-auto flex items-center justify-center text-white mb-3 shadow-md transition-colors"
                        style={{ backgroundColor: activeColor }}
                    >
                        {activeTab === 'Pay' && <CreditCard className="w-6 h-6" />}
                        {activeTab === 'Request' && <Shield className="w-6 h-6" />}
                        {activeTab === 'Scan' && <Smartphone className="w-6 h-6" />}
                        {activeTab === 'Home' && <Home className="w-6 h-6" />}
                        {activeTab === 'Cards' && <CreditCard className="w-6 h-6" />}
                        {activeTab === 'Search' && <Search className="w-6 h-6" />}
                        {activeTab === 'Bell' && <Bell className="w-6 h-6" />}
                        {activeTab === 'User' && <User className="w-6 h-6" />}
                        {activeTab === 'More' && <Sparkles className="w-6 h-6" />}
                    </div>
                    <h4 className="text-sm font-bold">{activeTab} Section</h4>
                    <p className="text-xs text-muted-foreground mt-1">Instant indicator spring physics with tactile feedback.</p>
                </motion.div>
            </div>

            <div className="pb-3">
                <div
                    className="p-1.5 flex gap-1 relative w-full shadow-lg border border-black/5 dark:border-white/10"
                    style={{
                        backgroundColor: isDark ? '#18181B' : '#F4F4F5',
                        borderRadius: borderRadius,
                    }}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="flex-1 relative py-2.5 text-xs font-semibold transition-colors z-10 flex items-center justify-center gap-1.5 cursor-pointer"
                                style={{
                                    color: isActive ? activeColor : isDark ? '#A1A1AA' : '#52525B',
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="studioActiveTabPill"
                                        className="absolute inset-0 shadow-sm border border-black/5 dark:border-white/10"
                                        style={{
                                            backgroundColor: indicatorColor,
                                            borderRadius: Math.max(4, borderRadius - 4),
                                        }}
                                        transition={springTransition}
                                    />
                                )}
                                <span className="relative z-20 flex items-center gap-1">
                                    <span>{tab}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── 3. Photo Album 3D (12-Strip Progressive Page Curl) ──────────────────────
interface StripSliceProps {
    stripIndex: number;
    N: number;
    pageWidth: number;
    localProgress: number;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
}

// 12-Strip recursive element: outer strips curl more than inner strips (reproducing PhotoAlbum.tsx)
function StripSlice({
    stripIndex,
    N,
    pageWidth,
    localProgress,
    frontContent,
    backContent,
}: StripSliceProps) {
    const isSpine = stripIndex === 0;
    const stripWidth = pageWidth / N;

    // Spine rotates from 0 to -180deg; outer strips bend progressively like real paper peeling
    let rotateY = 0;
    if (isSpine) {
        rotateY = -localProgress * 180;
    } else {
        const stripFactor = stripIndex / (N - 1);
        const maxBend = 26 * (0.15 + 0.85 * stripFactor);
        rotateY =
            localProgress < 0.5
                ? (localProgress / 0.5) * maxBend
                : ((1 - localProgress) / 0.5) * maxBend;
    }

    const shift = -stripIndex * stripWidth;
    const showFront = localProgress < 0.5;

    const childNode =
        stripIndex + 1 < N ? (
            <StripSlice
                stripIndex={stripIndex + 1}
                N={N}
                pageWidth={pageWidth}
                localProgress={localProgress}
                frontContent={frontContent}
                backContent={backContent}
            />
        ) : null;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: isSpine ? 0 : stripWidth,
                width: stripWidth + 0.45, // 0.45px overlap completely prevents subpixel gaps
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotateY}deg)`,
            }}
        >
            {/* Front Face Slice */}
            {showFront && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: stripWidth + 0.45,
                        height: '100%',
                        overflow: 'hidden',
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: shift,
                            width: pageWidth,
                            height: '100%',
                        }}
                    >
                        {frontContent}
                    </div>
                </div>
            )}

            {/* Back Face Slice (un-mirrored via scaleX(-1) matching PhotoAlbum.tsx line 132) */}
            {!showFront && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: stripWidth + 0.45,
                        height: '100%',
                        overflow: 'hidden',
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: shift,
                            width: pageWidth,
                            height: '100%',
                            transform: 'scaleX(-1)',
                            transformOrigin: 'center center',
                        }}
                    >
                        {backContent}
                    </div>
                </div>
            )}

            {childNode}
        </div>
    );
}

function PhotoAlbumDevice({ props }: { props: Record<string, any> }) {
    const coverColor = props.coverColor || '#CFC7BB';
    const title = props.albumTitle || 'HOWARD BEACH';

    // 2 sheets total:
    // Sheet 0: Cover (front) / Page 1 "Coastal Ridge" (back)
    // Sheet 1: Page 2 "Highland Cliffs" (front) / Page 3 & Back Cover (back)
    const sheetCount = 2;

    // progress: 0 (closed on front cover) -> 1 (open spread 1: pages 1 & 2) -> 2 (open spread 2 / back cover)
    const [progress, setProgress] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);

    const dragStartX = useRef<number>(0);
    const dragStartProgress = useRef<number>(0);
    const lastDragX = useRef<number>(0);
    const lastDragTime = useRef<number>(0);
    const animFrameId = useRef<number | null>(null);

    // Sync with Inspector 'spread' select control
    useEffect(() => {
        if (typeof props.spread === 'string' || typeof props.spread === 'number') {
            const targetSpread = Math.max(0, Math.min(sheetCount, Number(props.spread)));
            springTo(targetSpread);
        } else if (typeof props.spreadAngle === 'number') {
            const angleRatio = Math.max(0, Math.min(180, props.spreadAngle)) / 180;
            setProgress(angleRatio);
        }
    }, [props.spread, props.spreadAngle]);

    // Spring animation to target page matching PhotoAlbum.tsx spring physics
    const springTo = (target: number) => {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        const clampedTarget = Math.max(0, Math.min(sheetCount, target));

        let current = progress;
        let velocity = 0;
        const stiffness = 120;
        const damping = 22;
        let lastTime = performance.now();

        const step = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.032);
            lastTime = time;

            const displacement = current - clampedTarget;
            const force = -stiffness * displacement;
            const dampingForce = -damping * velocity;
            const acceleration = force + dampingForce;

            velocity += acceleration * dt;
            current += velocity * dt;

            if (Math.abs(displacement) < 0.002 && Math.abs(velocity) < 0.01) {
                setProgress(clampedTarget);
                animFrameId.current = null;
                return;
            }

            setProgress(current);
            animFrameId.current = requestAnimationFrame(step);
        };

        animFrameId.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        return () => {
            if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        };
    }, []);

    // Pointer gesture matching Gesture.Pan() in PhotoAlbum.tsx
    const handlePointerDown = (e: React.PointerEvent) => {
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragStartProgress.current = progress;
        lastDragX.current = e.clientX;
        lastDragTime.current = performance.now();
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const deltaX = dragStartX.current - e.clientX; // Dragging left advances page
        const pageDelta = deltaX / (PAGE_WIDTH * 1.05);
        const newProgress = Math.max(0, Math.min(sheetCount, dragStartProgress.current + pageDelta));
        setProgress(newProgress);
        lastDragX.current = e.clientX;
        lastDragTime.current = performance.now();
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        const totalDelta = Math.abs(dragStartX.current - e.clientX);

        // Tap detection (< 10px movement)
        if (totalDelta < 10) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            if (clickRatio > 0.5) {
                // Clicked right half: turn to next spread
                springTo(Math.min(sheetCount, Math.floor(progress) + 1));
            } else {
                // Clicked left half: turn to previous spread
                springTo(Math.max(0, Math.ceil(progress) - 1));
            }
            return;
        }

        // Fling momentum calculation
        const dt = Math.max(0.001, (performance.now() - lastDragTime.current) / 1000);
        const vx = (lastDragX.current - e.clientX) / dt;
        const velocityProgress = vx / 450;

        let target = Math.round(progress + velocityProgress * 0.22);
        target = Math.max(0, Math.min(sheetCount, target));
        springTo(target);
    };

    // Album dimensions matching PhotoAlbum.tsx
    const PAGE_WIDTH = 142;
    const ALBUM_HEIGHT = 196;
    const ALBUM_WIDTH = PAGE_WIDTH * 2; // 284px

    // Centering formula directly from PhotoAlbum.tsx line 362:
    let translateX = 0;
    if (progress < 1) {
        translateX = (progress - 1) * (PAGE_WIDTH / 2);
    } else if (progress > sheetCount - 1) {
        translateX = (progress - (sheetCount - 1)) * (PAGE_WIDTH / 2);
    }

    const openness = progress < 1 ? progress : progress > sheetCount - 1 ? sheetCount - progress : 1;

    // High resolution gallery pages
    const pageData = [
        // 0: Front Cover
        {
            title: title,
            subtitle: 'MONOGRAPH NO. 04 · 2026',
            img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=700&auto=format&fit=crop',
            location: 'MONTEREY PENINSULA',
        },
        // 1: Inside Left Spread
        {
            title: 'COASTAL RIDGE',
            subtitle: 'PACIFIC HORIZON',
            plate: 'PLATE 01',
            coords: '36.3615° N, 121.8563° W',
            img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=700&auto=format&fit=crop',
        },
        // 2: Inside Right Spread
        {
            title: 'HIGHLAND CLIFFS',
            subtitle: 'ISLE OF SKYE',
            plate: 'PLATE 02',
            coords: '57.5359° N, 6.2263° W',
            img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=700&auto=format&fit=crop',
        },
        // 3: Inside Left Spread 2
        {
            title: 'NORDIC ARCHIPELAGO',
            subtitle: 'LOFOTEN BASIN',
            plate: 'PLATE 03',
            coords: '68.2084° N, 13.9056° E',
            img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=700&auto=format&fit=crop',
        },
        // 4: Back Cover
        {
            title: 'STUDIO EDITION',
            subtitle: 'NATIVECN PRESS · NEW YORK',
            img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=700&auto=format&fit=crop',
        },
    ];

    const sheet0Prog = Math.max(0, Math.min(1, progress));
    const sheet1Prog = Math.max(0, Math.min(1, progress - 1));

    // Cover Page JSX (Front Face of Sheet 0)
    const coverContent = (
        <div
            className="w-full h-full flex flex-col items-center justify-between p-3 relative select-none rounded-r-xs overflow-hidden border border-black/15 shadow-sm"
            style={{ backgroundColor: coverColor }}
        >
            {/* Spine Crease Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-white/15 to-transparent pointer-events-none" />

            {/* Framed Fine Art Photo */}
            <div className="w-full h-[58%] bg-white p-1 shadow-md rounded-xs overflow-hidden mt-1">
                <img
                    src={pageData[0].img}
                    alt={pageData[0].title}
                    className="w-full h-full object-cover pointer-events-none"
                />
            </div>

            {/* Debossed Typography */}
            <div className="w-full flex flex-col items-center text-center pb-1">
                <div className="w-6 h-px bg-neutral-900/30 mb-1.5" />
                <span className="text-[11px] font-bold tracking-widest text-neutral-900 uppercase leading-none font-serif">
                    {title}
                </span>
                <span className="text-[7px] text-neutral-800/80 tracking-wider font-medium mt-1 uppercase">
                    {pageData[0].subtitle}
                </span>
            </div>

            {/* Dynamic Specular Sheen */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity"
                style={{
                    background: `linear-gradient(${105 + sheet0Prog * 30}deg, rgba(255,255,255,${Math.sin(sheet0Prog * Math.PI) * 0.35
                        }) 0%, rgba(0,0,0,${Math.sin(sheet0Prog * Math.PI) * 0.2}) 100%)`,
                    opacity: sheet0Prog > 0 && sheet0Prog < 1 ? 1 : 0,
                }}
            />
        </div>
    );

    // Inside Left Spread JSX (Back Face of Sheet 0: "COASTAL RIDGE", Plate 01)
    const page1Content = (
        <div className="w-full h-full flex flex-col p-2.5 relative select-none rounded-l-xs overflow-hidden border border-black/10 bg-[#FAF9F5]">
            {/* Spine Gutter Shadow on right edge */}
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/25 to-transparent pointer-events-none z-10" />

            <div className="w-full h-[72%] rounded-xs overflow-hidden shadow-xs relative">
                <img
                    src={pageData[1].img}
                    alt={pageData[1].title}
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white">
                    {pageData[1].plate}
                </div>
            </div>

            <div className="mt-2 flex flex-col">
                <span className="text-[9px] font-bold text-neutral-900 tracking-wide uppercase">
                    {pageData[1].title}
                </span>
                <span className="text-[7px] text-neutral-500 font-mono tracking-tight mt-0.5">
                    {pageData[1].coords}
                </span>
            </div>
        </div>
    );

    // Inside Right Spread JSX (Front Face of Sheet 1: "HIGHLAND CLIFFS", Plate 02)
    const page2Content = (
        <div className="w-full h-full flex flex-col p-2.5 relative select-none rounded-r-xs overflow-hidden border border-black/10 bg-[#FAF9F5]">
            <div className="w-full h-[72%] rounded-xs overflow-hidden shadow-xs relative">
                <img
                    src={pageData[2].img}
                    alt={pageData[2].title}
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white">
                    {pageData[2].plate}
                </div>
            </div>

            <div className="mt-2 flex flex-col">
                <span className="text-[9px] font-bold text-neutral-900 tracking-wide uppercase">
                    {pageData[2].title}
                </span>
                <span className="text-[7px] text-neutral-500 font-mono tracking-tight mt-0.5">
                    {pageData[2].coords}
                </span>
            </div>
        </div>
    );

    // Back Cover JSX (Back Face of Sheet 1)
    const backCoverContent = (
        <div
            className="w-full h-full flex flex-col items-center justify-center p-3 relative select-none rounded-l-xs overflow-hidden border border-black/15 shadow-sm"
            style={{ backgroundColor: coverColor }}
        >
            <span className="text-[9px] font-bold tracking-widest text-neutral-900 uppercase font-serif">
                {pageData[4].title}
            </span>
            <span className="text-[7px] text-neutral-700 tracking-wider font-medium mt-1 uppercase">
                {pageData[4].subtitle}
            </span>
        </div>
    );

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full flex flex-col items-center justify-between p-4 py-5 select-none bg-[#EAE8E4] cursor-grab active:cursor-grabbing touch-none relative"
        >
            {/* Header info */}
            <div className="text-center pt-1 z-10 pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                    3D HARDCOVER ALBUM
                </span>
                <h3 className="text-base font-bold tracking-tight text-neutral-900 leading-snug">
                    {title}
                </h3>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                    Swipe horizontally or tap book to flip
                </p>
            </div>

            {/* Interactive Book Stage */}
            <div
                className="relative my-auto flex items-center justify-center"
                style={{
                    width: ALBUM_WIDTH + 40,
                    height: ALBUM_HEIGHT + 24,
                    perspective: 1400,
                }}
            >
                {/* Floating Navigation Arrows */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        springTo(Math.max(0, Math.round(progress) - 1));
                    }}
                    disabled={progress <= 0.05}
                    className={`absolute -left-3 z-40 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-black/5 flex items-center justify-center text-neutral-800 transition-opacity cursor-pointer ${progress <= 0.05 ? 'opacity-0 pointer-events-none' : 'opacity-85 hover:opacity-100 hover:scale-105'
                        }`}
                    title="Previous Spread"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        springTo(Math.min(sheetCount, Math.round(progress) + 1));
                    }}
                    disabled={progress >= sheetCount - 0.05}
                    className={`absolute -right-3 z-40 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-black/5 flex items-center justify-center text-neutral-800 transition-opacity cursor-pointer ${progress >= sheetCount - 0.05 ? 'opacity-0 pointer-events-none' : 'opacity-85 hover:opacity-100 hover:scale-105'
                        }`}
                    title="Next Spread"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Centering Album Wrapper */}
                <div
                    className="relative"
                    style={{
                        width: ALBUM_WIDTH,
                        height: ALBUM_HEIGHT,
                        transformStyle: 'preserve-3d',
                        transform: `translateX(${translateX}px)`,
                    }}
                >
                    {/* Underlying Left Base (Spread 2 Left Page: "NORDIC ARCHIPELAGO") */}
                    {progress > 1 && (
                        <div
                            className="absolute top-0 bottom-0 left-0 rounded-l-xs overflow-hidden border border-black/10 bg-[#FAF9F5] shadow-lg"
                            style={{ width: PAGE_WIDTH }}
                        >
                            <div className="w-full h-full flex flex-col p-2.5 relative">
                                <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/25 to-transparent pointer-events-none z-10" />
                                <div className="w-full h-[72%] rounded-xs overflow-hidden shadow-xs relative">
                                    <img
                                        src={pageData[3].img}
                                        alt={pageData[3].title}
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white">
                                        {pageData[3].plate}
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <span className="text-[9px] font-bold text-neutral-900 tracking-wide uppercase">
                                        {pageData[3].title}
                                    </span>
                                    <span className="text-[7px] text-neutral-500 font-mono tracking-tight mt-0.5">
                                        {pageData[3].coords}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Underlying Right Base: Page 2 (Revealed as Sheet 0 turns) */}
                    <div
                        className="absolute top-0 bottom-0 right-0 rounded-r-xs overflow-hidden border border-black/10 bg-[#FAF9F5] shadow-lg"
                        style={{ width: PAGE_WIDTH }}
                    >
                        <div className="w-full h-full flex flex-col p-2.5 relative">
                            {/* Spine Gutter Shadow on left edge */}
                            <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10" />

                            <div className="w-full h-[72%] rounded-xs overflow-hidden shadow-xs relative">
                                <img
                                    src={pageData[2].img}
                                    alt={pageData[2].title}
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7px] font-mono text-white">
                                    {pageData[2].plate}
                                </div>
                            </div>

                            <div className="mt-2 flex flex-col">
                                <span className="text-[9px] font-bold text-neutral-900 tracking-wide uppercase">
                                    {pageData[2].title}
                                </span>
                                <span className="text-[7px] text-neutral-500 font-mono tracking-tight mt-0.5">
                                    {pageData[2].coords}
                                </span>
                            </div>

                            {/* Dynamic Cast Shadow from Sheet 0 turning over it */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity"
                                style={{
                                    backgroundColor: '#000',
                                    opacity:
                                        sheet0Prog < 1
                                            ? Math.sin(sheet0Prog * Math.PI) * 0.35
                                            : sheet1Prog > 0
                                                ? Math.sin(sheet1Prog * Math.PI) * 0.35
                                                : 0,
                                }}
                            />
                        </div>
                    </div>

                    {/* SHEET 0 (Front Cover & Page 1): 12-Strip Progressive Page Curl */}
                    <div
                        className="absolute top-0 bottom-0 select-none"
                        style={{
                            left: PAGE_WIDTH,
                            width: PAGE_WIDTH,
                            transformStyle: 'preserve-3d',
                            zIndex: sheet0Prog < 0.5 ? 20 : 10,
                            filter:
                                sheet0Prog === 0
                                    ? 'drop-shadow(0 14px 28px rgba(0,0,0,0.22))'
                                    : sheet0Prog >= 1
                                        ? 'drop-shadow(0 10px 22px rgba(0,0,0,0.18))'
                                        : `drop-shadow(${sheet0Prog < 0.5 ? -10 * sheet0Prog : 10 * (1 - sheet0Prog)
                                        }px 14px 24px rgba(0,0,0,${0.25 * Math.sin(sheet0Prog * Math.PI)}))`,
                        }}
                    >
                        <StripSlice
                            stripIndex={0}
                            N={12}
                            pageWidth={PAGE_WIDTH}
                            localProgress={sheet0Prog}
                            frontContent={coverContent}
                            backContent={page1Content}
                        />
                    </div>

                    {/* SHEET 1 (Page 2 & Back Cover): 12-Strip Progressive Page Curl */}
                    {progress > 0.05 && (
                        <div
                            className="absolute top-0 bottom-0 select-none pointer-events-none"
                            style={{
                                left: PAGE_WIDTH,
                                width: PAGE_WIDTH,
                                transformStyle: 'preserve-3d',
                                zIndex: sheet1Prog < 0.5 ? 15 : 5,
                                opacity: sheet1Prog > 0 ? 1 : 0,
                            }}
                        >
                            <StripSlice
                                stripIndex={0}
                                N={12}
                                pageWidth={PAGE_WIDTH}
                                localProgress={sheet1Prog}
                                frontContent={page2Content}
                                backContent={backCoverContent}
                            />
                        </div>
                    )}

                    {/* Spine Gutter Shadow down center crease */}
                    <div
                        className="absolute top-0 bottom-0 pointer-events-none z-30"
                        style={{
                            left: PAGE_WIDTH - 6,
                            width: 12,
                            opacity: openness * 0.9,
                            background:
                                'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)',
                        }}
                    />

                    {/* Book Paper Stack Edges (Thickness) */}
                    <div
                        className="absolute top-0.5 bottom-0.5 bg-[#EDE8DF] border-r border-black/15 z-0 pointer-events-none shadow-xs"
                        style={{
                            right: -3,
                            width: 3,
                            opacity: Math.max(0, 1 - progress / sheetCount),
                        }}
                    />
                    <div
                        className="absolute top-0.5 bottom-0.5 bg-[#EDE8DF] border-l border-black/15 z-0 pointer-events-none shadow-xs"
                        style={{
                            left: -3,
                            width: 3,
                            opacity: Math.min(1, progress),
                        }}
                    />
                </div>
            </div>

            {/* Interactive Spread Pills */}
            <div className="flex flex-col items-center gap-1.5 pt-1 z-10">
                <div className="flex items-center gap-1.5 bg-neutral-200/60 p-1 rounded-full backdrop-blur-xs">
                    {[
                        { label: 'Cover', p: 0 },
                        { label: 'Spread 1 (Plates 01 & 02)', p: 1 },
                        { label: 'Spread 2 / Back', p: 2 },
                    ].map((item) => {
                        const active = Math.round(progress) === item.p;
                        return (
                            <button
                                key={item.p}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    springTo(item.p);
                                }}
                                className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition-all cursor-pointer ${active
                                        ? 'bg-neutral-900 text-white shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── 4. Time Picker (Faithful Re-creation of TimePicker.tsx) ───────────────────
const TIMES_DATA = Array.from({ length: 48 }, (_, i) => {
    const totalMinutes = i * 30;
    const h24 = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
    const ampm = h24 < 12 ? 'am' : 'pm';
    return {
        id: `time-${i}`,
        label: `${h12}:${m === 0 ? '00' : m} ${ampm}`,
        hour: h12,
        minute: m,
        totalMinutes,
        index: i,
    };
});

// Built-in Clock Icon matching TimePicker.tsx lines 43-79
function TimePickerClockIcon({ color, size = 18 }: { color: string; size?: number }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                border: `1.5px solid ${color}`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    width: 1.5,
                    height: size * 0.25,
                    backgroundColor: color,
                    position: 'absolute',
                    top: size * 0.15,
                    borderRadius: 1,
                }}
            />
            <div
                style={{
                    width: size * 0.2,
                    height: 1.5,
                    backgroundColor: color,
                    position: 'absolute',
                    top: size * 0.4,
                    left: size * 0.4,
                    borderRadius: 1,
                }}
            />
        </div>
    );
}

function TimePickerDevice({ props }: { props: Record<string, any> }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectionMode, setSelectionMode] = useState<'single' | 'range'>(
        props.mode === 'range' ? 'range' : 'single'
    );
    const [startIndex, setStartIndex] = useState(38); // 7:00 pm (matches initialIndex in TimePicker.tsx)
    const [endIndex, setEndIndex] = useState(42);     // 9:00 pm
    const [startContinuous, setStartContinuous] = useState(38);
    const [endContinuous, setEndContinuous] = useState(42);

    const startListRef = useRef<HTMLDivElement>(null);
    const endListRef = useRef<HTMLDivElement>(null);

    // Color theme matching TimePicker.tsx lines 137-142:
    const isDark = props.theme !== 'light';
    const bgPrimary = isDark ? '#1C1C1E' : '#FFFFFF';
    const bgSecondary = isDark ? '#2C2C2E' : '#F2F2F7';
    const textPrimary = isDark ? '#FFFFFF' : '#000000';
    const textSecondary = '#8E8E93';
    const activeHighlightBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const accentColorStart = props.accentColor || '#0A84FF'; // Blue
    const accentColorEnd = '#FF9F0A'; // Orange

    // Sync mode with Inspector
    useEffect(() => {
        if (props.mode === 'single' || props.mode === 'range') {
            setSelectionMode(props.mode);
        }
    }, [props.mode]);

    // Initial centering of wheels to 7:00 pm and 9:00 pm
    useEffect(() => {
        const timer = setTimeout(() => {
            const ITEM_HEIGHT = 44;
            if (startListRef.current) {
                startListRef.current.scrollTop = 38 * ITEM_HEIGHT;
            }
            if (endListRef.current) {
                endListRef.current.scrollTop = 42 * ITEM_HEIGHT;
            }
        }, 60);
        return () => clearTimeout(timer);
    }, [isExpanded, selectionMode]);

    const handleScrollStart = (e: React.UIEvent<HTMLDivElement>) => {
        const ITEM_HEIGHT = 44;
        const top = e.currentTarget.scrollTop;
        const continuous = top / ITEM_HEIGHT;
        setStartContinuous(continuous);
        const snapped = Math.round(continuous);
        if (snapped >= 0 && snapped < TIMES_DATA.length && snapped !== startIndex) {
            setStartIndex(snapped);
        }
    };

    const handleScrollEnd = (e: React.UIEvent<HTMLDivElement>) => {
        const ITEM_HEIGHT = 44;
        const top = e.currentTarget.scrollTop;
        const continuous = top / ITEM_HEIGHT;
        setEndContinuous(continuous);
        const snapped = Math.round(continuous);
        if (snapped >= 0 && snapped < TIMES_DATA.length && snapped !== endIndex) {
            setEndIndex(snapped);
        }
    };

    const scrollToStart = (idx: number) => {
        setStartIndex(idx);
        setStartContinuous(idx);
        if (startListRef.current) {
            startListRef.current.scrollTo({
                top: idx * 44,
                behavior: 'smooth',
            });
        }
    };

    const scrollToEnd = (idx: number) => {
        setEndIndex(idx);
        setEndContinuous(idx);
        if (endListRef.current) {
            endListRef.current.scrollTo({
                top: idx * 44,
                behavior: 'smooth',
            });
        }
    };

    // Continuous clock hand rotations derived from scroll offset matching TimePicker.tsx lines 234-244
    const startMinutes = startContinuous * 30;
    const startHourRotation = ((startMinutes / 60) % 12) * 30;
    const startMinuteRotation = (startMinutes % 60) * 6;

    const endMinutes = endContinuous * 30;
    const endHourRotation = ((endMinutes / 60) % 12) * 30;
    const endMinuteRotation = (endMinutes % 60) * 6;

    const startTimeLabel = TIMES_DATA[startIndex]?.label || '7:00 pm';
    const endTimeLabel = TIMES_DATA[endIndex]?.label || '9:00 pm';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none bg-[#F2F2F7]">
            {/* Expandable iOS Card matching TimePicker.tsx */}
            <motion.div
                layout
                transition={springTransition}
                style={{
                    backgroundColor: bgPrimary,
                }}
                className="w-full max-w-[326px] rounded-[24px] shadow-2xl overflow-hidden border border-black/5"
            >
                {/* HEADER (Height 64px matching TimePicker.tsx line 430) */}
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ height: 64 }}
                    className="px-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <div className="flex items-center gap-2.5">
                        <TimePickerClockIcon color={textSecondary} size={20} />
                        <span
                            style={{ color: textSecondary, fontSize: 17, fontWeight: 500 }}
                        >
                            Time
                        </span>
                    </div>
                    <span
                        style={{ color: textPrimary, fontSize: 17, fontWeight: 600 }}
                    >
                        {selectionMode === 'single'
                            ? startTimeLabel
                            : `${startTimeLabel} - ${endTimeLabel}`}
                    </span>
                </div>

                {/* EXPANDED CONTENT (Height ~316px when open) */}
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={springTransition}
                            className="px-5 pb-5 pt-0 flex flex-col overflow-hidden"
                        >
                            {/* SEGMENTED CONTROL (Height 36px matching TimePicker.tsx lines 455-474) */}
                            <div
                                style={{
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: bgSecondary,
                                }}
                                className="w-full p-0.5 flex relative mb-6"
                            >
                                {/* Sliding Pill Indicator */}
                                <motion.div
                                    layoutId="timePickerSegmentPill"
                                    transition={springTransition}
                                    style={{
                                        width: 'calc(50% - 2px)',
                                        left: selectionMode === 'single' ? 2 : 'calc(50%)',
                                        backgroundColor: bgPrimary,
                                        borderRadius: 16,
                                    }}
                                    className="absolute top-0.5 bottom-0.5 shadow-sm"
                                />

                                {/* Single Time Button */}
                                <button
                                    onClick={() => setSelectionMode('single')}
                                    className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold z-10 cursor-pointer transition-colors"
                                    style={{
                                        color: selectionMode === 'single' ? textPrimary : textSecondary,
                                    }}
                                >
                                    {selectionMode === 'single' && (
                                        <div
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: accentColorStart }}
                                        >
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                    )}
                                    <span>Single time</span>
                                </button>

                                {/* Time Range Button */}
                                <button
                                    onClick={() => setSelectionMode('range')}
                                    className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold z-10 cursor-pointer transition-colors"
                                    style={{
                                        color: selectionMode === 'range' ? textPrimary : textSecondary,
                                    }}
                                >
                                    {selectionMode === 'range' && (
                                        <div
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: accentColorEnd }}
                                        >
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                    )}
                                    <span>Time range</span>
                                </button>
                            </div>

                            {/* MAIN ROW: Analog Clock & Time Wheels */}
                            <div className="flex items-center justify-between gap-2">
                                {/* ANALOG CLOCK (150px x 150px matching TimePicker.tsx line 513) */}
                                <div className="flex-1 flex items-center justify-center">
                                    <motion.div
                                        animate={{
                                            scale: selectionMode === 'range' ? 0.88 : 1,
                                        }}
                                        transition={springTransition}
                                        style={{
                                            width: 146,
                                            height: 146,
                                            borderRadius: 73,
                                            backgroundColor: bgSecondary,
                                        }}
                                        className="relative flex items-center justify-center shadow-inner"
                                    >
                                        {/* 12 Hour Ticks */}
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-[2px] h-[6px] rounded-full"
                                                style={{
                                                    backgroundColor: textSecondary,
                                                    opacity: 0.35,
                                                    transform: `rotate(${i * 30}deg) translateY(-64px)`,
                                                }}
                                            />
                                        ))}

                                        {/* Start Hour Hand (height 38px, top 37) */}
                                        <div
                                            className="absolute w-[4.5px] h-[38px] rounded-[2.5px] origin-bottom shadow-xs"
                                            style={{
                                                backgroundColor: textPrimary,
                                                bottom: '50%',
                                                transform: `rotate(${startHourRotation}deg)`,
                                                transition: 'transform 0.05s linear',
                                            }}
                                        />

                                        {/* Start Minute Hand (height 54px, top 21) with Accent Dot */}
                                        <div
                                            className="absolute w-[3px] h-[54px] rounded-[1.5px] origin-bottom"
                                            style={{
                                                backgroundColor: accentColorStart,
                                                bottom: '50%',
                                                transform: `rotate(${startMinuteRotation}deg)`,
                                                transition: 'transform 0.05s linear',
                                            }}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full absolute -top-1 -left-[2.5px]"
                                                style={{ backgroundColor: accentColorStart }}
                                            />
                                        </div>

                                        {/* End Hands (in Range Mode) */}
                                        {selectionMode === 'range' && (
                                            <>
                                                {/* End Hour Hand (height 32px, top 43) */}
                                                <div
                                                    className="absolute w-[3.5px] h-[32px] rounded-[2px] origin-bottom shadow-xs opacity-60"
                                                    style={{
                                                        backgroundColor: textSecondary,
                                                        bottom: '50%',
                                                        transform: `rotate(${endHourRotation}deg)`,
                                                        transition: 'transform 0.05s linear',
                                                    }}
                                                />
                                                {/* End Minute Hand (height 46px, top 29) with Orange Dot */}
                                                <div
                                                    className="absolute w-[2.5px] h-[46px] rounded-[1.5px] origin-bottom"
                                                    style={{
                                                        backgroundColor: accentColorEnd,
                                                        bottom: '50%',
                                                        transform: `rotate(${endMinuteRotation}deg)`,
                                                        transition: 'transform 0.05s linear',
                                                    }}
                                                >
                                                    <div
                                                        className="w-1.5 h-1.5 rounded-full absolute -top-1 -left-[2px]"
                                                        style={{ backgroundColor: accentColorEnd }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Center Pin (8px) */}
                                        <div
                                            className="w-2 h-2 rounded-full z-20 shadow-xs"
                                            style={{ backgroundColor: textPrimary }}
                                        />
                                    </motion.div>
                                </div>

                                {/* TIME LIST CONTAINER (Height 220px matching TimePicker.tsx line 570) */}
                                <div className="relative flex items-center justify-center h-[220px] overflow-hidden">
                                    {/* Active Highlight Band (height 44px, centered at top 88px) */}
                                    <div
                                        style={{
                                            top: 88,
                                            height: 44,
                                            backgroundColor: activeHighlightBg,
                                            borderRadius: 12,
                                        }}
                                        className="absolute left-1 right-1 pointer-events-none z-0"
                                    />

                                    {/* Start Time Wheel */}
                                    <div
                                        ref={startListRef}
                                        onScroll={handleScrollStart}
                                        className="h-full overflow-y-auto z-10 [&::-webkit-scrollbar]:hidden"
                                        style={{
                                            width: selectionMode === 'single' ? 120 : 80,
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            paddingTop: 88,
                                            paddingBottom: 88,
                                        }}
                                    >
                                        {TIMES_DATA.map((t, idx) => {
                                            const dist = Math.abs(startContinuous - idx);
                                            const opacity = dist < 0.6 ? 1 : dist < 1.6 ? 0.5 : 0.2;
                                            const scale = dist < 0.6 ? 1.1 : dist < 1.6 ? 0.9 : 0.8;

                                            return (
                                                <button
                                                    key={`start-${t.id}`}
                                                    onClick={() => scrollToStart(idx)}
                                                    className="h-11 w-full flex items-center justify-center px-1 text-[16px] transition-transform cursor-pointer"
                                                    style={{
                                                        transform: `scale(${scale})`,
                                                        opacity,
                                                        color: textPrimary,
                                                        fontWeight: dist < 0.6 ? 600 : 500,
                                                        letterSpacing: '0.3px',
                                                    }}
                                                >
                                                    {t.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Range Dash Indicator & End Time Wheel */}
                                    {selectionMode === 'range' && (
                                        <>
                                            <div
                                                style={{ color: textSecondary }}
                                                className="z-10 px-0.5 text-xs font-semibold"
                                            >
                                                –
                                            </div>
                                            <div
                                                ref={endListRef}
                                                onScroll={handleScrollEnd}
                                                className="h-full overflow-y-auto z-10 w-20 [&::-webkit-scrollbar]:hidden"
                                                style={{
                                                    scrollbarWidth: 'none',
                                                    msOverflowStyle: 'none',
                                                    paddingTop: 88,
                                                    paddingBottom: 88,
                                                }}
                                            >
                                                {TIMES_DATA.map((t, idx) => {
                                                    const dist = Math.abs(endContinuous - idx);
                                                    const opacity = dist < 0.6 ? 1 : dist < 1.6 ? 0.5 : 0.2;
                                                    const scale = dist < 0.6 ? 1.1 : dist < 1.6 ? 0.9 : 0.8;

                                                    return (
                                                        <button
                                                            key={`end-${t.id}`}
                                                            onClick={() => scrollToEnd(idx)}
                                                            className="h-11 w-full flex items-center justify-center px-1 text-[16px] transition-transform cursor-pointer"
                                                            style={{
                                                                transform: `scale(${scale})`,
                                                                opacity,
                                                                color: textPrimary,
                                                                fontWeight: dist < 0.6 ? 600 : 500,
                                                                letterSpacing: '0.3px',
                                                            }}
                                                        >
                                                            {t.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

// ─── 5. Dynamic OTP ──────────────────────────────────────────────────────────
function DynamicOtpDevice({ props }: { props: Record<string, any> }) {
    const [code, setCode] = useState('8492');
    const [activeIdx, setActiveIdx] = useState(3);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(props.status || 'idle');
    const [lastAction, setLastAction] = useState<string>('');

    // Keep status in sync with inspector control
    useEffect(() => {
        if (props.status) {
            setStatus(props.status);
        }
    }, [props.status]);

    const focusColor = props.focusColor || '#FF5500';

    // Box position coordinates for 4 morph states
    // Idle: 4 horizontal boxes with center (0,0)
    // Loading: 4-node diamond at radius 44px
    const boxNodes = [
        { idleX: -84, idleY: 0, loadX: -44, loadY: 0 },
        { idleX: -28, idleY: 0, loadX: 0, loadY: -44 },
        { idleX: 28, idleY: 0, loadX: 0, loadY: 44 },
        { idleX: 84, idleY: 0, loadX: 44, loadY: 0 },
    ];

    const handleKeyPress = (num: string) => {
        if (code.length < 4) {
            const next = code + num;
            setCode(next);
            setActiveIdx(next.length);
            if (next.length === 4) {
                // Auto-test loading and success
                setStatus('loading');
                setLastAction('Validating OTP...');
                setTimeout(() => {
                    setStatus('success');
                    setLastAction('Verified successfully!');
                }, 1600);
            }
        }
    };

    const handleBackspace = () => {
        if (code.length > 0) {
            const next = code.slice(0, -1);
            setCode(next);
            setActiveIdx(next.length);
            if (status !== 'idle') setStatus('idle');
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between p-4">
            {/* Header with state indicator */}
            <div className="pt-2 text-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">DYNAMIC MORPH ENGINE</span>
                <h3 className="text-lg font-bold tracking-tight mt-0.5">Verification Code</h3>
                <p className="text-[11px] text-muted-foreground">Shape-morphing diamond loader & checkmark</p>

                {/* State selector pills */}
                <div className="flex justify-center gap-1 mt-2.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-white/10 w-fit mx-auto">
                    {(['idle', 'loading', 'success', 'error'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => {
                                setStatus(s);
                                if (s === 'idle' && code.length === 0) setCode('8492');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all cursor-pointer ${status === s
                                    ? 'bg-white dark:bg-zinc-800 text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Central Dynamic Morph Stage */}
            <div className="relative h-44 flex items-center justify-center overflow-hidden my-auto">
                <motion.div
                    animate={
                        status === 'error'
                            ? { x: [-12, 12, -8, 8, -4, 4, 0] }
                            : status === 'loading'
                                ? { rotate: 360 }
                                : { rotate: 0, x: 0 }
                    }
                    transition={
                        status === 'loading'
                            ? { repeat: Infinity, duration: 2.4, ease: 'linear' }
                            : status === 'error'
                                ? { duration: 0.45, ease: 'easeInOut' }
                                : { duration: 0.3 }
                    }
                    className="relative w-0 h-0 flex items-center justify-center"
                >
                    {boxNodes.map((node, idx) => {
                        const val = code[idx] || '';
                        const isFocus = status === 'idle' && code.length === idx;
                        const isSuccess = status === 'success';
                        const isLoading = status === 'loading';
                        const isError = status === 'error';

                        // Target positions
                        const tx = isSuccess ? 0 : isLoading ? node.loadX : node.idleX;
                        const ty = isSuccess ? 0 : isLoading ? node.loadY : node.idleY;

                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    x: tx,
                                    y: ty,
                                    scale: isSuccess && idx !== 0 ? 0 : 1,
                                    opacity: isSuccess && idx !== 0 ? 0 : 1,
                                    borderRadius: isSuccess ? 30 : isLoading ? 12 : 14,
                                }}
                                transition={{ type: 'spring', damping: 16, stiffness: 120 }}
                                className={`absolute w-12 h-12 flex items-center justify-center font-mono font-bold transition-colors select-none ${isSuccess && idx === 0
                                        ? 'bg-emerald-500 border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                                        : isError
                                            ? 'border-2 border-red-500 bg-red-500/10 text-red-500'
                                            : isFocus
                                                ? 'border-2 bg-white/5 dark:bg-white/5 text-foreground'
                                                : 'border-1.5 border-zinc-300 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-900/80 text-foreground'
                                    }`}
                                style={{
                                    borderColor: isFocus ? focusColor : undefined,
                                    boxShadow: isFocus ? `0 0 0 3px ${focusColor}25` : undefined,
                                }}
                            >
                                {isSuccess && idx === 0 ? (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                        className="text-white text-xl font-bold"
                                    >
                                        ✓
                                    </motion.span>
                                ) : isLoading ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
                                ) : (
                                    <span>{val}</span>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Simulated Keypad for Real Input Testing */}
            <div className="grid grid-cols-3 gap-1.5 px-4 pb-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (k === '⌫') handleBackspace();
                            else if (k) handleKeyPress(k);
                        }}
                        disabled={!k || status === 'loading'}
                        className={`h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${k
                                ? 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 text-foreground'
                                : 'opacity-0 pointer-events-none'
                            }`}
                    >
                        {k}
                    </button>
                ))}
            </div>

            <div className="text-center text-[10px] text-muted-foreground pb-1">
                {lastAction ? (
                    <span className="font-semibold text-emerald-500">{lastAction}</span>
                ) : (
                    <span>Type 4 digits or use status tabs above</span>
                )}
            </div>
        </div>
    );
}

// ─── 6. Liquid Action Tab Bar ────────────────────────────────────────────────
function LiquidTabBarDevice({ props, isDark }: { props: Record<string, any>; isDark: boolean }) {
    const [isExpanded, setIsExpanded] = useState(props.isExpanded || false);
    const [activeTab, setActiveTab] = useState(props.activeTab || 'home');
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    useEffect(() => {
        if (props.isExpanded !== undefined) setIsExpanded(props.isExpanded);
    }, [props.isExpanded]);

    useEffect(() => {
        if (props.activeTab) setActiveTab(props.activeTab);
    }, [props.activeTab]);

    const accentColor = props.accentColor || '#0A84FF';
    const barBg = isDark ? '#18181B' : '#FFFFFF';

    const CREATIVE_TOOLS = [
        { id: 'trim', label: 'Trim', icon: '✂️' },
        { id: 'crop', label: 'Crop', icon: '⧉' },
        { id: 'enhance', label: 'Enhance', icon: '✨' },
        { id: 'text', label: 'Text', icon: 'Aa' },
        { id: 'audio', label: 'Audio', icon: '🎵' },
        { id: 'speed', label: 'Speed', icon: '🐇' },
        { id: 'duplicate', label: 'Duplicate', icon: '❐' },
        { id: 'undo', label: 'Undo', icon: '↩' },
        { id: 'share', label: 'Share', icon: '⎘' },
        { id: 'save', label: 'Save', icon: '🔖' },
        { id: 'delete', label: 'Delete', icon: '🗑' },
    ];

    return (
        <div className="w-full h-full flex flex-col justify-between p-4 relative overflow-hidden">
            {/* Header */}
            <div className="pt-2 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">STUDIO CANVAS</span>
                    <h2 className="text-lg font-bold tracking-tight">Liquid Action Bar</h2>
                </div>
                <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10">
                    {isExpanded ? '11 Tools Open' : 'Collapsed Bar'}
                </div>
            </div>

            {/* Media Content Preview */}
            <div className="flex-1 my-3 overflow-y-auto space-y-3 scrollbar-none">
                <div className="rounded-2xl overflow-hidden relative h-36 border border-black/10 shadow-sm bg-zinc-900">
                    <img
                        src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Santorini"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-sky-400">Cinematic View</span>
                        <h4 className="text-sm font-bold">Santorini Caldera 4K</h4>
                        <span className="text-[10px] text-zinc-300">Tap center FAB button below to trigger tool grid</span>
                    </div>
                </div>

                {selectedTool && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs"
                    >
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            Active Tool: {CREATIVE_TOOLS.find((t) => t.id === selectedTool)?.label} {CREATIVE_TOOLS.find((t) => t.id === selectedTool)?.icon}
                        </span>
                        <button
                            onClick={() => setSelectedTool(null)}
                            className="text-[10px] underline text-blue-500 cursor-pointer"
                        >
                            Clear
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Backdrop Scrim when Expanded */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-xs z-10 cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Morphing Liquid Action Tab Bar Container */}
            <motion.div
                layout
                animate={{
                    height: isExpanded ? 280 : 64,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="relative z-20 w-full rounded-[28px] border border-zinc-200 dark:border-white/10 shadow-xl overflow-hidden flex flex-col"
                style={{ backgroundColor: barBg }}
            >
                {/* Elevated FAB Trigger positioned at top center */}
                <div className="absolute left-1/2 top-2 -translate-x-1/2 z-30">
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                    >
                        <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }}>
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>
                    </motion.button>
                </div>

                {isExpanded ? (
                    /* 11-Tool Creative Action Grid */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="pt-14 px-3 pb-3 flex-1 flex flex-col"
                    >
                        <div className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Creative Action Grid
                        </div>
                        <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto">
                            {CREATIVE_TOOLS.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => setSelectedTool(tool.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer ${selectedTool === tool.id
                                            ? 'bg-blue-500/10 border-blue-500 shadow-xs'
                                            : 'bg-zinc-100 dark:bg-zinc-800/80 border-transparent hover:border-zinc-300'
                                        }`}
                                >
                                    <span className="text-lg leading-none mb-1">{tool.icon}</span>
                                    <span className="text-[10px] font-bold text-foreground truncate w-full text-center">
                                        {tool.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* Collapsed Tab Bar (4 Routes with center notch) */
                    <div className="h-full px-5 flex items-center justify-between">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-[9px] font-medium">Home</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'inbox' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Folder className="w-4 h-4" />
                            <span className="text-[9px] font-medium">Vault</span>
                        </button>

                        <div className="w-12" />

                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'notifications' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Bell className="w-4 h-4" />
                            <span className="text-[9px] font-medium">Alerts</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('layers')}
                            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'layers' ? 'text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span className="text-[9px] font-medium">Feed</span>
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// ─── 7. Rainbow Button ───────────────────────────────────────────────────────
function RainbowButtonDevice({ props }: { props: Record<string, any> }) {
    const width = 230;
    const height = 52;
    const borderRadius = props.borderRadius || 16;
    const borderWidth = props.borderWidth || 2;
    const speed = props.speed || 3;
    const perimeter = 2 * (width + height - 2 * borderRadius) + 2 * Math.PI * borderRadius;
    const sweepLength = perimeter * 0.35;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">LASER PERIMETER</span>
                <h3 className="text-xl font-bold tracking-tight mt-1">Rainbow Border Glow</h3>
                <p className="text-xs text-muted-foreground mt-1">Hypnotic orbital gradient traced in real-time.</p>
            </div>

            <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
                style={{ width, height }}
            >
                <svg width={width} height={height} className="absolute inset-0">
                    <defs>
                        <linearGradient id="rainbowGrad" x1="0" y1="0" x2={width} y2={height} gradientUnits="userSpaceOnUse">
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
                        stroke="#27272A"
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
                        stroke="url(#rainbowGrad)"
                        strokeWidth={borderWidth}
                        fill="none"
                        strokeDasharray={`${sweepLength} ${perimeter - sweepLength}`}
                        animate={{ strokeDashoffset: [0, -perimeter] }}
                        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
                    />
                </svg>
                <div
                    className="absolute flex items-center justify-center bg-zinc-900 font-semibold text-xs text-white shadow-xl"
                    style={{
                        top: borderWidth,
                        left: borderWidth,
                        width: width - borderWidth * 2,
                        height: height - borderWidth * 2,
                        borderRadius: borderRadius - borderWidth,
                    }}
                >
                    {props.buttonText || 'Get Unlimited Access'}
                </div>
            </motion.div>
        </div>
    );
}

// ─── 8. Range Slider ─────────────────────────────────────────────────────────
function RangeSliderDevice({ props }: { props: Record<string, any> }) {
    const min = props.min !== undefined ? props.min : 0;
    const max = props.max !== undefined ? props.max : 100;
    const step = parseInt(props.step || '1', 10);
    const [sliderVal, setSliderVal] = useState(props.value !== undefined ? props.value : 65);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.value !== undefined) setSliderVal(props.value);
    }, [props.value]);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const rawPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const rawVal = min + rawPercent * (max - min);
        const steppedVal = Math.round(rawVal / step) * step;
        setSliderVal(Math.max(min, Math.min(max, steppedVal)));
    };

    const activeColor = props.activeTrackColor || props.accentColor || '#FF0080';
    const percent = Math.round(((sliderVal - min) / (max - min)) * 100);

    return (
        <div className="w-full h-full flex flex-col justify-center p-6">
            <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">CONTINUOUS PANRESPONDER</span>
                <h3 className="text-xl font-bold tracking-tight mt-1">Intensity Level</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Continuous drag with spring snapping thumb.</p>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground">Output Gain</span>
                    <span className="font-mono text-base font-bold text-foreground" style={{ color: activeColor }}>
                        {sliderVal}%
                    </span>
                </div>

                <div
                    ref={sliderRef}
                    className="relative w-full h-8 flex items-center cursor-grab active:cursor-grabbing touch-none select-none"
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        handlePointerMove(e);
                    }}
                    onPointerMove={(e) => {
                        if (e.currentTarget.hasPointerCapture(e.pointerId)) handlePointerMove(e);
                    }}
                >
                    <div className="w-full bg-zinc-300 dark:bg-zinc-800 rounded-full h-2" />
                    <motion.div
                        className="absolute left-0 rounded-full pointer-events-none h-2"
                        style={{
                            backgroundColor: activeColor,
                        }}
                        animate={{ width: `${percent}%` }}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                    <motion.div
                        className="absolute h-6 w-6 bg-white rounded-full shadow-lg border-2 pointer-events-none flex items-center justify-center"
                        style={{
                            borderColor: activeColor,
                        }}
                        animate={{ left: `calc(${percent}% - 12px)` }}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }} />
                    </motion.div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1">
                    <span>Min: {min}%</span>
                    <span>Step: {step}</span>
                    <span>Max: {max}%</span>
                </div>
            </div>
        </div>
    );
}

// ─── 9. Switch Toggle ────────────────────────────────────────────────────────
function SwitchToggleDevice({ props }: { props: Record<string, any> }) {
    const [toggled, setToggled] = useState(props.state !== false);
    const [wifiToggled, setWifiToggled] = useState(true);
    const [btToggled, setBtToggled] = useState(false);

    useEffect(() => {
        if (props.state !== undefined) setToggled(props.state);
    }, [props.state]);

    const onColor = props.onColor || '#374151';
    const label = props.label || 'Airplane Mode';
    const disabled = props.disabled || false;

    return (
        <div className="w-full h-full flex flex-col justify-between p-5">
            <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">SYSTEM SETTINGS</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Control Center</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Tactile spring switches with haptic physics</p>
            </div>

            <div className="space-y-3">
                {/* Active configurable toggle */}
                <div
                    className={`p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-between transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : ''
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <Plane className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">{label}</div>
                            <div className="text-[10px] text-muted-foreground">
                                {disabled ? 'Controls locked (Disabled)' : 'Disable cellular transmissions'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => !disabled && setToggled(!toggled)}
                        className="w-13 h-7 rounded-full p-0.5 relative transition-colors duration-300 cursor-pointer"
                        style={{
                            backgroundColor: toggled ? onColor : '#71717A',
                        }}
                    >
                        <motion.div
                            animate={{ x: toggled ? 22 : 0 }}
                            transition={springTransition}
                            className="w-6 h-6 rounded-full bg-white shadow-md"
                        />
                    </button>
                </div>

                {/* Second toggle */}
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                            <Wifi className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">Wi-Fi Network</div>
                            <div className="text-[10px] text-muted-foreground">NativeCN-5G Studio</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setWifiToggled(!wifiToggled)}
                        className="w-13 h-7 rounded-full p-0.5 relative transition-colors duration-300 cursor-pointer"
                        style={{
                            backgroundColor: wifiToggled ? onColor : '#71717A',
                        }}
                    >
                        <motion.div
                            animate={{ x: wifiToggled ? 22 : 0 }}
                            transition={springTransition}
                            className="w-6 h-6 rounded-full bg-white shadow-md"
                        />
                    </button>
                </div>

                {/* Third toggle */}
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <Bluetooth className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">Bluetooth</div>
                            <div className="text-[10px] text-muted-foreground">AirPods Max connected</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setBtToggled(!btToggled)}
                        className="w-13 h-7 rounded-full p-0.5 relative transition-colors duration-300 cursor-pointer"
                        style={{
                            backgroundColor: btToggled ? onColor : '#71717A',
                        }}
                    >
                        <motion.div
                            animate={{ x: btToggled ? 22 : 0 }}
                            transition={springTransition}
                            className="w-6 h-6 rounded-full bg-white shadow-md"
                        />
                    </button>
                </div>
            </div>

            <div className="text-center text-[10px] text-muted-foreground pb-2">
                Spring toggle physics · Track tone: <span className="font-mono font-bold">{onColor}</span>
            </div>
        </div>
    );
}

// ─── 10. Expandable Card ─────────────────────────────────────────────────────
function ExpandableCardDevice({ props }: { props: Record<string, any> }) {
    const [expanded, setExpanded] = useState(false);
    const title = props.cardTitle || 'Design Systems 2026';
    const category = props.category || 'FEATURED STORY';
    const cornerRadius = props.cornerRadius || 20;

    return (
        <div className="w-full h-full flex flex-col justify-center p-5">
            <motion.div
                onClick={() => setExpanded(!expanded)}
                animate={{ height: expanded ? 340 : 160 }}
                transition={springTransition}
                className="w-full rounded-3xl overflow-hidden relative cursor-pointer shadow-xl border border-white/10 flex flex-col justify-end p-5 text-white"
                style={{
                    borderRadius: cornerRadius,
                    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%), url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400">{category}</span>
                        <h3 className="text-base font-bold leading-tight mt-0.5">{title}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        {expanded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                </div>

                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="mt-3 pt-3 border-t border-white/20 text-xs text-white/80 space-y-2"
                    >
                        <p>Fluid micro-animations with shared layout transitions create a tactile native feel.</p>
                        <div className="flex gap-2 pt-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[9px] font-medium">Reanimated</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[9px] font-medium">Figma Tokens</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>
            <p className="text-center text-xs text-muted-foreground mt-4">Tap card to expand / collapse</p>
        </div>
    );
}

// ─── 11. Date Picker ─────────────────────────────────────────────────────────
function DatePickerDevice({ props }: { props: Record<string, any> }) {
    const [expanded, setExpanded] = useState(true);
    const [pickerMode, setPickerMode] = useState<'date' | 'month' | 'year'>(props.pickerMode || 'date');
    const [selectedDay, setSelectedDay] = useState(18);
    const [selectedMonth, setSelectedMonth] = useState(7); // August (0-indexed)
    const [selectedYear, setSelectedYear] = useState(2026);
    const [yearPage, setYearPage] = useState(2020);

    useEffect(() => {
        if (props.pickerMode) setPickerMode(props.pickerMode);
    }, [props.pickerMode]);

    const primaryColor = props.primaryColor || '#09090B';
    const label = props.label || 'Appointment Date';
    const placeholder = props.placeholder || 'Select Date';

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = Array.from({ length: 12 }, (_, i) => yearPage + i);

    const handlePrev = () => {
        if (pickerMode === 'date') {
            if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear((y) => y - 1);
            } else {
                setSelectedMonth((m) => m - 1);
            }
        } else if (pickerMode === 'month') {
            setSelectedYear((y) => y - 1);
        } else {
            setYearPage((y) => y - 12);
        }
    };

    const handleNext = () => {
        if (pickerMode === 'date') {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear((y) => y + 1);
            } else {
                setSelectedMonth((m) => m + 1);
            }
        } else if (pickerMode === 'month') {
            setSelectedYear((y) => y + 1);
        } else {
            setYearPage((y) => y + 12);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-[270px] flex flex-col items-start gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground pl-1">{label}</span>
                <motion.div
                    layout
                    className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col items-center justify-start w-full shadow-lg"
                    style={{
                        borderRadius: expanded ? 24 : 16,
                        height: expanded ? 370 : 54,
                    }}
                    transition={{ type: 'spring', damping: 24, stiffness: 200, mass: 0.8 }}
                >
                    {/* Collapsed State Bar */}
                    <div
                        className="flex items-center justify-between px-4 w-full cursor-pointer h-14 shrink-0"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-foreground">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-foreground">
                                {shortMonths[selectedMonth]} {selectedDay}, {selectedYear}
                            </span>
                        </div>
                        <motion.div
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                    </div>

                    {/* Expanded Calendar / Month / Year View */}
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                className="w-full px-4 pt-1 pb-3 flex flex-col flex-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Header with Mode Switching */}
                                <div className="flex items-center justify-between mb-2 w-full">
                                    <button
                                        onClick={handlePrev}
                                        className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="flex items-center gap-1.5 text-xs">
                                        <button
                                            onClick={() => setPickerMode(pickerMode === 'month' ? 'date' : 'month')}
                                            className={`font-bold hover:underline cursor-pointer ${pickerMode === 'month' ? 'text-primary' : 'text-foreground'
                                                }`}
                                        >
                                            {pickerMode === 'year' ? `${yearPage} - ${yearPage + 11}` : monthNames[selectedMonth]}
                                        </button>
                                        {pickerMode !== 'year' && (
                                            <button
                                                onClick={() => setPickerMode('year')}
                                                className="font-medium hover:underline cursor-pointer text-muted-foreground"
                                            >
                                                {selectedYear}
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold cursor-pointer"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Body switches based on pickerMode */}
                                {pickerMode === 'month' ? (
                                    /* 12-Month Selector Grid */
                                    <div className="grid grid-cols-3 gap-2 py-3 flex-1">
                                        {shortMonths.map((m, idx) => {
                                            const isSel = idx === selectedMonth;
                                            return (
                                                <button
                                                    key={m}
                                                    onClick={() => {
                                                        setSelectedMonth(idx);
                                                        setPickerMode('date');
                                                    }}
                                                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSel
                                                            ? 'text-white shadow-sm'
                                                            : 'text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                        }`}
                                                    style={{ backgroundColor: isSel ? primaryColor : 'transparent' }}
                                                >
                                                    {m}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : pickerMode === 'year' ? (
                                    /* 12-Year Selector Grid */
                                    <div className="grid grid-cols-3 gap-2 py-3 flex-1">
                                        {years.map((y) => {
                                            const isSel = y === selectedYear;
                                            return (
                                                <button
                                                    key={y}
                                                    onClick={() => {
                                                        setSelectedYear(y);
                                                        setPickerMode('month');
                                                    }}
                                                    className={`py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${isSel
                                                            ? 'text-white shadow-sm'
                                                            : 'text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                        }`}
                                                    style={{ backgroundColor: isSel ? primaryColor : 'transparent' }}
                                                >
                                                    {y}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Day Grid */
                                    <>
                                        <div className="flex w-full justify-between mb-1.5">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                                <span key={i} className="text-[10px] font-bold text-muted-foreground w-7 text-center">
                                                    {d}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-y-1 w-full justify-items-center">
                                            {Array.from({ length: 31 }).map((_, i) => {
                                                const dayNum = i + 1;
                                                const isSel = dayNum === selectedDay;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedDay(dayNum)}
                                                        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer ${isSel
                                                                ? 'text-white shadow-sm'
                                                                : 'text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                            }`}
                                                        style={{
                                                            backgroundColor: isSel ? primaryColor : 'transparent',
                                                        }}
                                                    >
                                                        {dayNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* Confirm Button */}
                                <button
                                    onClick={() => setExpanded(false)}
                                    className="mt-auto w-full py-2.5 rounded-full text-xs font-semibold text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>
                                        Confirm {shortMonths[selectedMonth]} {selectedDay}, {selectedYear}
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <span className="text-[10px] text-muted-foreground pl-1 mt-1">Tap month or year in header to switch mode</span>
            </div>
        </div>
    );
}

// ─── 12. Floating Bottom Navigation ──────────────────────────────────────────
function BottomNavDevice({ props }: { props: Record<string, any> }) {
    const [activeNav, setActiveNav] = useState('Home');
    const activeColor = props.activeColor || '#0A84FF';
    const elevation = props.elevation || 10;

    return (
        <div className="w-full h-full flex flex-col justify-between p-4">
            {/* Real App Screen Feed */}
            <div className="pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">DISCOVERY HUB</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Hello, Alex</h3>
                <p className="text-xs text-muted-foreground">Your daily intelligence brief</p>

                <div className="mt-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Total Portfolio</span>
                        <span className="text-xs font-bold text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%</span>
                    </div>
                    <div className="text-2xl font-bold tracking-tight font-mono">$48,250.00</div>
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold">Smart Sync Activated</div>
                            <div className="text-[10px] text-muted-foreground">Updated 2 minutes ago</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Island Bottom Nav */}
            <div className="pb-3 flex justify-center">
                <div
                    className="bg-white dark:bg-[#1C1C1E] border border-zinc-200 dark:border-white/10 p-1.5 rounded-[1.8rem] flex justify-between items-center w-full max-w-[240px] relative z-10"
                    style={{
                        boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.18)`,
                    }}
                >
                    {['Home', 'Search', 'Bell', 'User'].map((item) => {
                        const Icon = item === 'Home' ? Home : item === 'Search' ? Search : item === 'Bell' ? Bell : User;
                        const isActive = activeNav === item;
                        return (
                            <button
                                key={item}
                                onClick={() => setActiveNav(item)}
                                className="relative flex-1 py-2 flex flex-col items-center justify-center transition-colors z-20 cursor-pointer"
                                style={{
                                    color: isActive ? activeColor : undefined,
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator-studio"
                                        className="absolute inset-x-1.5 inset-y-1 rounded-xl bg-zinc-100 dark:bg-white/10 -z-10"
                                        transition={springTransition}
                                    />
                                )}
                                <motion.div animate={{ scale: isActive ? 1.15 : 1 }} transition={springTransition}>
                                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                                </motion.div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── 13. Dynamic Bottom Sheet ────────────────────────────────────────────────
function BottomSheetDevice({ props }: { props: Record<string, any> }) {
    const [sheetOpen, setSheetOpen] = useState(true);
    const sheetHeight = props.sheetHeight || 60;
    const showHandle = props.handleBar !== false;

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
            {/* Background Screen */}
            <div className="pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">ACCOUNT DASHBOARD</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Profile Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Interactive spring slide-up sheet</p>

                <div className="mt-5 space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-xs font-semibold">Payment Methods</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-xs font-semibold">Security & Privacy</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {!sheetOpen && (
                <div className="pb-4 flex justify-center">
                    <button
                        onClick={() => setSheetOpen(true)}
                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                        <ChevronUp className="w-4 h-4" />
                        <span>Open Bottom Sheet</span>
                    </button>
                </div>
            )}

            {/* Bottom Sheet Modal */}
            <AnimatePresence>
                {sheetOpen && (
                    <>
                        {/* Backdrop Scrim */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSheetOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs z-30 cursor-pointer"
                        />

                        {/* Sheet Container */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#18181B] rounded-t-[32px] border-t border-zinc-200 dark:border-white/10 shadow-2xl z-40 p-5 flex flex-col"
                            style={{ height: `${sheetHeight}%` }}
                        >
                            {/* Drag Handle */}
                            {showHandle && (
                                <div
                                    onClick={() => setSheetOpen(false)}
                                    className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-4 cursor-pointer hover:bg-zinc-400"
                                />
                            )}

                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-base font-bold">Quick Actions</h4>
                                <button
                                    onClick={() => setSheetOpen(false)}
                                    className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="space-y-2 overflow-y-auto flex-1">
                                <button className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center gap-3 text-xs font-semibold cursor-pointer">
                                    <Share2 className="w-4 h-4 text-blue-500" />
                                    <span>Share Portfolio Summary</span>
                                </button>
                                <button className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center gap-3 text-xs font-semibold cursor-pointer">
                                    <Bookmark className="w-4 h-4 text-emerald-500" />
                                    <span>Save to Collections</span>
                                </button>
                                <button className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center gap-3 text-xs font-semibold cursor-pointer">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    <span>Export Monthly Statement (PDF)</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setSheetOpen(false)}
                                className="w-full mt-3 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold cursor-pointer"
                            >
                                Done
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── 14. Custom Input ────────────────────────────────────────────────────────
function CustomInputDevice({ props }: { props: Record<string, any> }) {
    const [value, setValue] = useState('alex.design@apple.com');
    const [password, setPassword] = useState('supersecret123');
    const [showPassword, setShowPassword] = useState(false);

    const variant = props.variant || 'outlined';
    const size = props.size || 'medium';
    const label = props.label || 'Email Address';
    const placeholder = props.placeholder || 'you@domain.com';
    const validation = props.validationState || 'default';
    const clearable = props.clearable !== false;
    const autoPassword = props.autoPassword !== false;

    // Size mappings
    const sizeClasses: Record<string, { height: string; text: string; icon: string; px: string }> = {
        small: { height: 'h-9', text: 'text-xs', icon: 'w-3.5 h-3.5', px: 'px-2.5' },
        medium: { height: 'h-11', text: 'text-xs', icon: 'w-4 h-4', px: 'px-3.5' },
        large: { height: 'h-13', text: 'text-sm', icon: 'w-5 h-5', px: 'px-4' },
    };

    const currentSize = sizeClasses[size] || sizeClasses.medium;

    // Validation border & text
    const isError = validation === 'error';
    const isSuccess = validation === 'success';

    let borderClass = 'border border-zinc-200 dark:border-white/10';
    if (isError) borderClass = 'border-2 border-red-500 shadow-xs shadow-red-500/20';
    else if (isSuccess) borderClass = 'border-2 border-emerald-500 shadow-xs shadow-emerald-500/20';
    else if (variant === 'outlined') borderClass = 'border-2 border-primary';
    else if (variant === 'underlined') borderClass = 'border-b-2 border-primary rounded-none px-0.5';

    let bgClass = 'bg-transparent';
    if (variant === 'filled') bgClass = 'bg-zinc-100 dark:bg-zinc-800/80 border-transparent';
    if (variant === 'search') bgClass = 'bg-zinc-100 dark:bg-zinc-800/90 rounded-full border border-zinc-200 dark:border-white/10';

    return (
        <div className="w-full h-full flex flex-col justify-between p-5">
            <div className="pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">FORM ARCHITECTURE</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Account Sign In</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Custom input with size, variant, & validation states</p>
            </div>

            <div className="space-y-4 my-auto">
                {/* Email Input Field */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-1 pl-0.5">
                        <label className="text-xs font-semibold text-foreground">
                            {label}
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{variant} · {size}</span>
                    </div>

                    <div
                        className={`relative flex items-center transition-all ${currentSize.height} ${currentSize.px} ${borderClass} ${bgClass} rounded-xl`}
                    >
                        {variant === 'search' ? (
                            <Search className={`${currentSize.icon} text-muted-foreground mr-2 shrink-0`} />
                        ) : (
                            <Mail className={`${currentSize.icon} ${isError ? 'text-red-500' : isSuccess ? 'text-emerald-500' : 'text-primary'} mr-2 shrink-0`} />
                        )}

                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className={`w-full bg-transparent ${currentSize.text} text-foreground outline-none font-medium placeholder:text-muted-foreground`}
                        />

                        {clearable && value && (
                            <button
                                onClick={() => setValue('')}
                                className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 text-foreground flex items-center justify-center text-[10px] cursor-pointer ml-1.5 shrink-0"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        )}

                        {isError && (
                            <AlertCircle className={`${currentSize.icon} text-red-500 ml-1.5 shrink-0`} />
                        )}
                        {isSuccess && (
                            <CheckCircle2 className={`${currentSize.icon} text-emerald-500 ml-1.5 shrink-0`} />
                        )}
                    </div>

                    {/* Helper / Error Text */}
                    <div className="mt-1 pl-0.5 text-[11px]">
                        {isError ? (
                            <span className="text-red-500 font-medium flex items-center gap-1">
                                Please enter a valid work email address
                            </span>
                        ) : isSuccess ? (
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                                ✓ Verified email format
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                We will send a one-time login verification link.
                            </span>
                        )}
                    </div>
                </div>

                {/* Password Demo Field (Auto-Password toggle demo) */}
                <div className="w-full">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 pl-0.5">
                        Account Password
                    </label>
                    <div className={`h-11 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-3`}>
                        <Lock className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent text-xs text-foreground outline-none font-mono"
                        />
                        {autoPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md cursor-pointer">
                Continue to Dashboard
            </button>
        </div>
    );
}

// ─── 15. Dynamic Upload ──────────────────────────────────────────────────────
function DynamicUploadDevice({ props }: { props: Record<string, any> }) {
    const [progress, setProgress] = useState<number>(props.progress !== undefined ? props.progress : 68);
    const [status, setStatus] = useState<'uploading' | 'paused' | 'success'>(
        props.status || 'uploading'
    );

    useEffect(() => {
        if (props.status) setStatus(props.status);
    }, [props.status]);

    useEffect(() => {
        if (props.progress !== undefined) setProgress(props.progress);
    }, [props.progress]);

    const fileName = props.fileName || 'create-ui.xlsx';
    const fileSize = props.fileSize || '2.3MB';

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
            }, 60);
        }
        return () => clearInterval(interval);
    }, [status]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-5">
            <div className="text-center mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">MICRO-ANIMATION PIPELINE</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Asset Upload</h3>
                <p className="text-xs text-muted-foreground">Interactive file upload progress card</p>
            </div>

            <div className="relative w-full max-w-[270px] bg-white dark:bg-[#18181B] rounded-[20px] p-3.5 flex items-center shadow-lg border border-black/5 dark:border-white/10 overflow-hidden text-left">
                {/* Background Fill Bar */}
                <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className={`absolute left-0 top-0 bottom-0 z-0 transition-colors duration-300 ${status === 'success' ? 'bg-[#DCFCE7] dark:bg-[#064E3B]/40' :
                            status === 'paused' ? 'bg-[#F3F4F6] dark:bg-[#27272A]/40' :
                                'bg-[#E0F2FE] dark:bg-[#1E3A8A]/40'
                        }`}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center w-full">
                    {/* Excel Green Badge Icon with 4-square fold */}
                    <div className="w-10 h-10 rounded-[10px] bg-[#107C41] flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm text-white">
                        <div className="grid grid-cols-2 gap-0.5 mb-0.5">
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-xs" />
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-xs" />
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-xs" />
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-xs" />
                        </div>
                        <span className="text-[7.5px] font-bold tracking-wider leading-none">XLSX</span>
                    </div>

                    {/* Text Details */}
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-[#FAFAFA] truncate">{fileName}</p>
                        <div className="flex items-center text-[10px] mt-0.5 whitespace-nowrap">
                            {status === 'success' && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[8px] mr-1 shrink-0 font-bold">
                                    ✓
                                </motion.span>
                            )}
                            <span className={status === 'paused' ? 'text-[#A1A1AA]' : 'text-[#605BFF] dark:text-[#818CF8] font-semibold font-mono'}>
                                {status === 'success' ? '100%' : `${progress}%`}
                            </span>
                            <span className="text-[#71717A] ml-1 truncate">
                                • {status === 'success' ? fileSize : `${((parseFloat(fileSize) || 2.3) * (progress / 100)).toFixed(1)} of ${fileSize}`}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        {status !== 'success' && (
                            <>
                                <button
                                    onClick={() => setStatus((s) => (s === 'uploading' ? 'paused' : 'uploading'))}
                                    className="w-6 h-6 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] flex items-center justify-center border border-transparent dark:border-[#3F3F46] transition-colors cursor-pointer"
                                    title={status === 'paused' ? 'Resume' : 'Pause'}
                                >
                                    {status === 'paused' ? <Play className="w-3 h-3 fill-current text-zinc-600 dark:text-zinc-300" /> : <Pause className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />}
                                </button>
                                <button
                                    onClick={() => { setProgress(0); setStatus('uploading'); }}
                                    className="w-6 h-6 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] flex items-center justify-center border border-transparent dark:border-[#3F3F46] transition-colors cursor-pointer"
                                    title="Cancel"
                                >
                                    <X className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
                                </button>
                            </>
                        )}
                        {status === 'success' && (
                            <button
                                onClick={() => { setProgress(15); setStatus('uploading'); }}
                                className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center cursor-pointer"
                                title="Re-upload"
                            >
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-6 text-center">Tap play / pause or reload to test states</p>
        </div>
    );
}

// ─── 16. Floating Speed Dial ─────────────────────────────────────────────────
function FloatingSpeedDialDevice({ props }: { props: Record<string, any> }) {
    const [open, setOpen] = useState(props.isOpen || false);
    const [showMap, setShowMap] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);

    useEffect(() => {
        if (props.isOpen !== undefined) {
            setOpen(props.isOpen);
        }
    }, [props.isOpen]);

    const preset = props.gradientPreset || 'pink-orange';
    const gradientPresets: Record<string, string> = {
        'pink-orange': 'linear-gradient(135deg, #FF0080 0%, #FF6347 100%)',
        'purple-blue': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'emerald-cyan': 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        'black-zinc': 'linear-gradient(135deg, #27272A 0%, #09090B 100%)',
    };
    const activeGradient = gradientPresets[preset] || gradientPresets['pink-orange'];

    const handleAction = (label: string) => {
        setLastAction(label);
        setTimeout(() => setLastAction(null), 2200);
    };

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-5 select-none">
            <div className="pt-2 z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">RADIAL GRADIENT FAB</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Explore Spaces</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Speed dial with 45° rotation & sub-actions</p>

                {/* Content preview area */}
                <div className="mt-4 space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-500 font-bold text-xs">
                                01
                            </div>
                            <div>
                                <span className="text-xs font-semibold block">Design Systems Hub</span>
                                <span className="text-[10px] text-muted-foreground">San Francisco · 12 assets</span>
                            </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">Active</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-xs">
                                02
                            </div>
                            <div>
                                <span className="text-xs font-semibold block">Mobile Animation Tokens</span>
                                <span className="text-[10px] text-muted-foreground">Tokyo HQ · 48 files</span>
                            </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">Synced</span>
                    </div>
                </div>

                {lastAction && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 p-2.5 rounded-xl bg-black/90 text-white dark:bg-white dark:text-black text-[11px] font-semibold text-center shadow-lg"
                    >
                        Triggered: {lastAction}
                    </motion.div>
                )}
            </div>

            {/* Backdrop Scrim */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] z-20 cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Floating Speed Dial Stack */}
            <div className="absolute bottom-5 right-5 flex flex-col items-end z-30">
                <AnimatePresence>
                    {open && (
                        <div className="flex flex-col items-end gap-2.5 mb-2.5">
                            {/* Action 3: Switch View */}
                            <motion.div
                                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 12, scale: 0.85 }}
                                transition={{ duration: 0.16, delay: 0.06 }}
                                className="flex items-center gap-2"
                            >
                                <span className="bg-zinc-900/90 dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-md backdrop-blur-xs">
                                    {showMap ? 'List View' : 'Map View'}
                                </span>
                                <button
                                    onClick={() => {
                                        setShowMap(!showMap);
                                        handleAction(showMap ? 'Switched to List View' : 'Switched to Map View');
                                    }}
                                    className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                >
                                    {showMap ? (
                                        <List className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                                    ) : (
                                        <MapPin className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                                    )}
                                </button>
                            </motion.div>

                            {/* Action 2: Add Friends */}
                            <motion.div
                                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 12, scale: 0.85 }}
                                transition={{ duration: 0.16, delay: 0.03 }}
                                className="flex items-center gap-2"
                            >
                                <span className="bg-zinc-900/90 dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-md backdrop-blur-xs">
                                    Add Friends
                                </span>
                                <button
                                    onClick={() => handleAction('Added Friends Modal')}
                                    className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <Users className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                                </button>
                            </motion.div>

                            {/* Action 1: Upload Doc */}
                            <motion.div
                                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 12, scale: 0.85 }}
                                transition={{ duration: 0.16 }}
                                className="flex items-center gap-2"
                            >
                                <span className="bg-zinc-900/90 dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-0.5 rounded-full font-medium shadow-md backdrop-blur-xs">
                                    Upload Doc
                                </span>
                                <button
                                    onClick={() => handleAction('Upload Document Dialog')}
                                    className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <FileText className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200" />
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Action FAB (sleek 48px size) */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setOpen(!open)}
                    className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer"
                    style={{ background: activeGradient }}
                >
                    <motion.div animate={{ rotate: open ? 45 : 0 }} transition={springTransition}>
                        <Plus className="w-5 h-5" />
                    </motion.div>
                </motion.button>
            </div>
        </div>
    );
}

// ─── 17. Gradient Button ─────────────────────────────────────────────────────
function GradientButtonDevice({ props }: { props: Record<string, any> }) {
    const [taps, setTaps] = useState(0);
    const title = props.title || 'Get Started Today';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const preset = props.gradientPreset || 'sunset';
    const borderRadius = props.borderRadius ?? 16;
    const loading = Boolean(props.loading);
    const disabled = Boolean(props.disabled);

    const gradients: Record<string, string> = {
        'sunset': 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
        'purple-pink': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'ocean-blue': 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
        'emerald': 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    };
    const activeGradient = gradients[preset] || gradients['sunset'];

    const sizeClasses: Record<string, string> = {
        small: 'py-2 px-4 text-xs font-semibold',
        medium: 'py-3.5 px-6 text-sm font-bold',
        large: 'py-4.5 px-8 text-base font-bold',
    };

    let buttonStyle: React.CSSProperties = { borderRadius };
    let variantClasses = '';

    if (variant === 'primary') {
        buttonStyle.background = activeGradient;
        variantClasses = 'text-white shadow-lg shadow-black/10';
    } else if (variant === 'secondary') {
        variantClasses = 'bg-zinc-900 text-white border border-white/10 dark:bg-zinc-800';
    } else if (variant === 'outline') {
        variantClasses = 'bg-transparent text-foreground border-2 border-primary';
    } else if (variant === 'ghost') {
        variantClasses = 'bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800';
    }

    return (
        <div className="w-full h-full flex flex-col justify-between p-6 text-center select-none">
            <div className="pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">LINEAR GRADIENT ENGINE</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Gradient Button</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Primary, Secondary, Outline & Loading states</p>
            </div>

            <div className="my-auto space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Selected Variant:</span>
                        <span className="capitalize font-mono px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800">{variant}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Button Size:</span>
                        <span className="capitalize font-mono px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800">{size}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Color Preset:</span>
                        <span className="capitalize font-mono px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800">{preset}</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
                    whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
                    disabled={disabled || loading}
                    onClick={() => setTaps((t) => t + 1)}
                    className={`w-full flex items-center justify-center gap-2 cursor-pointer transition-all ${sizeClasses[size] || sizeClasses.medium} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    style={buttonStyle}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <span>{title}</span>
                    )}
                </motion.button>
            </div>

            <div className="pb-2 text-[11px] text-muted-foreground">
                Tapped <span className="font-bold text-foreground">{taps}</span> times · {loading ? 'Loading active' : disabled ? 'Disabled' : 'Ready'}
            </div>
        </div>
    );
}

// ─── 18. Image Carousel ──────────────────────────────────────────────────────
function ImageCarouselDevice({ props }: { props: Record<string, any> }) {
    const images = [
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop', title: 'Yosemite Valley', subtitle: 'California, USA' },
        { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop', title: 'Alpine Peaks', subtitle: 'Chamonix, France' },
        { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&auto=format&fit=crop', title: 'Misty Valley', subtitle: 'Vancouver, Canada' },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const layout = props.layout || 'depth'; // 'depth' | 'stack' | 'perspective'
    const orientation = props.orientation || 'horizontal'; // 'horizontal' | 'vertical'
    const autoPlay = props.autoPlay !== false;
    const interval = (props.autoPlayInterval || 3.5) * 1000;
    const showPagination = props.showPagination !== false;

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, images.length]);

    return (
        <div className="w-full h-full flex flex-col justify-between p-5 select-none">
            <div className="pt-2 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">3D CARD CAROUSEL</span>
                    <h3 className="text-xl font-bold tracking-tight mt-0.5">Alpine Wonders</h3>
                    <p className="text-[11px] text-muted-foreground capitalize">Layout: {layout} · {orientation}</p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center cursor-pointer text-foreground hover:scale-105 active:scale-95 transition-transform"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center cursor-pointer text-foreground hover:scale-105 active:scale-95 transition-transform"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 3D Stage */}
            <div className="my-auto relative w-full h-80 flex items-center justify-center" style={{ perspective: 1200 }}>
                {images.map((item, idx) => {
                    const offset = (idx - activeIndex + images.length) % images.length;
                    const isCenter = offset === 0;

                    let motionStyle = {};
                    if (layout === 'depth') {
                        if (isCenter) {
                            motionStyle = { scale: 1, rotateY: 0, rotateX: 0, zIndex: 10, opacity: 1, x: 0, y: 0 };
                        } else if (offset === 1) {
                            motionStyle = orientation === 'horizontal'
                                ? { scale: 0.85, rotateY: -35, rotateX: 0, zIndex: 5, opacity: 0.5, x: 55, y: 0 }
                                : { scale: 0.85, rotateX: 35, rotateY: 0, zIndex: 5, opacity: 0.5, x: 0, y: 55 };
                        } else {
                            motionStyle = orientation === 'horizontal'
                                ? { scale: 0.85, rotateY: 35, rotateX: 0, zIndex: 5, opacity: 0.5, x: -55, y: 0 }
                                : { scale: 0.85, rotateX: -35, rotateY: 0, zIndex: 5, opacity: 0.5, x: 0, y: -55 };
                        }
                    } else if (layout === 'stack') {
                        if (isCenter) {
                            motionStyle = { scale: 1, zIndex: 10, opacity: 1, x: 0, y: 0 };
                        } else if (offset === 1) {
                            motionStyle = orientation === 'horizontal'
                                ? { scale: 0.9, zIndex: 8, opacity: 0.7, x: 28, y: -12 }
                                : { scale: 0.9, zIndex: 8, opacity: 0.7, x: -12, y: 28 };
                        } else {
                            motionStyle = orientation === 'horizontal'
                                ? { scale: 0.82, zIndex: 6, opacity: 0.45, x: 52, y: -22 }
                                : { scale: 0.82, zIndex: 6, opacity: 0.45, x: -22, y: 52 };
                        }
                    } else if (layout === 'perspective') {
                        if (isCenter) {
                            motionStyle = { scale: 1, rotateY: 0, rotateX: 0, zIndex: 10, opacity: 1, x: 0, y: 0 };
                        } else {
                            motionStyle = orientation === 'horizontal'
                                ? { scale: 0.75, rotateY: offset === 1 ? -65 : 65, zIndex: 4, opacity: 0, x: offset === 1 ? 90 : -90, y: 0 }
                                : { scale: 0.75, rotateX: offset === 1 ? 65 : -65, zIndex: 4, opacity: 0, x: 0, y: offset === 1 ? 90 : -90 };
                        }
                    }

                    return (
                        <motion.div
                            key={idx}
                            animate={motionStyle}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => setActiveIndex(idx)}
                            className="absolute w-[240px] h-[300px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-white/10"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">{item.subtitle}</span>
                                <h4 className="text-base font-bold leading-tight mt-0.5">{item.title}</h4>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Indicator */}
            {showPagination && (
                <div className="pb-2 flex justify-center items-center gap-1.5">
                    {images.map((_, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className="h-1.5 rounded-full transition-all cursor-pointer"
                                style={{
                                    width: isActive ? 24 : 6,
                                    backgroundColor: isActive ? 'var(--primary, #0A84FF)' : 'rgba(128,128,128,0.3)',
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── 19. Skeleton Loader ─────────────────────────────────────────────────────
function SkeletonLoaderDevice({ props }: { props: Record<string, any> }) {
    const [loaded, setLoaded] = useState(false);
    const variant = props.variant || 'card'; // 'card' | 'list'
    const duration = props.duration || 1.5;
    const borderRadius = props.borderRadius ?? 8;

    return (
        <div className="w-full h-full flex flex-col justify-between p-5 select-none">
            <div className="pt-2 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">SHIMMER SKELETON</span>
                    <h3 className="text-xl font-bold tracking-tight mt-0.5">Linear Gradient</h3>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">Pattern: {variant} variant</p>
                </div>
                <button
                    onClick={() => setLoaded(!loaded)}
                    className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-800 text-foreground cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                    {loaded ? 'Show Skeleton' : 'Show Loaded'}
                </button>
            </div>

            <div className="my-auto">
                {loaded ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {variant === 'card' ? (
                            <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 space-y-3">
                                <div className="h-36 rounded-xl overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"
                                        className="w-full h-full object-cover"
                                        alt="Modern UI"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold">Fluid Motion Tokens</h4>
                                    <p className="text-xs text-muted-foreground">Reactive native components with 60fps animations.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {[
                                    { name: 'Sarah Lin', role: 'Design Architect', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                                    { name: 'David Chen', role: 'iOS Engineer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
                                    { name: 'Elena Rostova', role: 'Systems Lead', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center gap-3">
                                        <img src={item.img} alt={item.name} className="w-11 h-11 rounded-full object-cover" />
                                        <div>
                                            <h4 className="text-xs font-bold">{item.name}</h4>
                                            <p className="text-[10px] text-muted-foreground">{item.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {variant === 'card' ? (
                            /* SkeletonCard matching registry */
                            <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 space-y-3">
                                <div
                                    className="h-36 w-full relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                                    style={{ borderRadius }}
                                >
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                    />
                                </div>
                                <div className="space-y-2 pt-1">
                                    <div
                                        className="h-4 w-4/5 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                                        style={{ borderRadius }}
                                    >
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                        />
                                    </div>
                                    <div
                                        className="h-3 w-2/5 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                                        style={{ borderRadius }}
                                    >
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* SkeletonList matching registry */
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center gap-3"
                                    >
                                        <div className="w-11 h-11 rounded-full relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                                            <motion.div
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div
                                                className="h-3.5 w-3/4 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                                                style={{ borderRadius }}
                                            >
                                                <motion.div
                                                    animate={{ x: ['-100%', '200%'] }}
                                                    transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                                />
                                            </div>
                                            <div
                                                className="h-2.5 w-2/5 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                                                style={{ borderRadius }}
                                            >
                                                <motion.div
                                                    animate={{ x: ['-100%', '200%'] }}
                                                    transition={{ repeat: Infinity, duration, ease: 'linear' }}
                                                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/15 to-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="text-center text-[11px] text-muted-foreground pb-2">
                Linear gradient sweep: <span className="font-mono font-semibold">{duration}s</span> · Radius: {borderRadius}pt
            </div>
        </div>
    );
}

// ─── 20. Skia Image Skeleton (Dual Orbiting Spotlight) ──────────────────────
function ImageSkeletonDevice({ props }: { props: Record<string, any> }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const duration = props.duration || 4; // seconds for full 360 loop
    const baseColor = props.baseColor || '#171717';
    const accentColor = props.accentColor || '#FFFFFF';
    const borderRadius = props.borderRadius ?? 16;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let startTime: number | null = null;

        const DOT_SPACING = 16;
        const DOT_RADIUS = 2;

        const render = (time: number) => {
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000;
            const progress = ((elapsed % duration) / duration) * Math.PI * 2;

            const w = canvas.width;
            const h = canvas.height;

            // Clear background
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, w, h);

            // Compute orbit centers matching ImageSkeleton.tsx
            const r = Math.min(w, h) * 0.4;
            const c1x = w / 2 + Math.cos(progress) * r;
            const c1y = h / 2 + Math.sin(progress) * r;

            const c2x = w / 2 + Math.sin(progress * 1.5) * r;
            const c2y = h / 2 + Math.cos(progress * 1.5) * r;

            const cols = Math.floor(w / DOT_SPACING);
            const rows = Math.floor(h / DOT_SPACING);
            const offsetX = (w - (cols - 1) * DOT_SPACING) / 2;
            const offsetY = (h - (rows - 1) * DOT_SPACING) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = offsetX + i * DOT_SPACING;
                    const y = offsetY + j * DOT_SPACING;

                    const d1 = Math.hypot(x - c1x, y - c1y);
                    const d2 = Math.hypot(x - c2x, y - c2y);

                    const spotRadius = 75;
                    const b1 = Math.max(0, 1 - d1 / spotRadius);
                    const b2 = Math.max(0, 1 - d2 / spotRadius);
                    const brightness = Math.min(1, 0.12 + Math.pow(b1, 2) * 0.88 + Math.pow(b2, 2) * 0.88);

                    ctx.beginPath();
                    ctx.arc(x, y, DOT_RADIUS * (0.8 + brightness * 0.7), 0, Math.PI * 2);
                    ctx.fillStyle = accentColor;
                    ctx.globalAlpha = brightness;
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [duration, baseColor, accentColor]);

    return (
        <div className="w-full h-full flex flex-col justify-between p-5 select-none">
            <div className="pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">SHOPIFY SKIA SHADER</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Image Skeleton</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Dual orbiting radial spotlights on 16px dot matrix</p>
            </div>

            <div className="my-auto w-full flex flex-col items-center">
                <div
                    className="relative overflow-hidden shadow-2xl border border-white/10"
                    style={{
                        width: 280,
                        height: 220,
                        borderRadius,
                        backgroundColor: baseColor,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={280}
                        height={220}
                        className="w-full h-full block"
                    />
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>60 FPS Skia Orbit: {duration}s cycle</span>
                </div>
            </div>

            <div className="text-center text-[11px] text-muted-foreground pb-2">
                Base: <span className="font-mono">{baseColor}</span> · Accent: <span className="font-mono">{accentColor}</span>
            </div>
        </div>
    );
}

// ─── 21. Native Haptics ──────────────────────────────────────────────────────
function NativeHapticsDevice({ props }: { props: Record<string, any> }) {
    const [shake, setShake] = useState(0);
    const [shakeType, setShakeType] = useState('selection');
    const [lastTrigger, setLastTrigger] = useState(props.feedbackType || 'selection');

    useEffect(() => {
        if (props.feedbackType && props.feedbackType !== lastTrigger) {
            triggerHaptic(props.feedbackType);
        }
    }, [props.feedbackType]);

    const playHapticTone = (type: string) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'selection') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
            } else if (type === 'success') {
                [523.25, 659.25].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + i * 0.08);
                    osc.stop(ctx.currentTime + i * 0.08 + 0.08);
                });
            } else if (type === 'error') {
                [220, 180, 140].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
                    gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.06);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + i * 0.06);
                    osc.stop(ctx.currentTime + i * 0.06 + 0.06);
                });
            } else {
                // impact types
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(type === 'heavy' ? 120 : type === 'medium' ? 220 : 340, ctx.currentTime);
                gain.gain.setValueAtTime(type === 'heavy' ? 0.3 : 0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            }
        } catch {
            // Audio context blocked or not supported
        }
    };

    const triggerHaptic = (type: string) => {
        setLastTrigger(type);
        setShakeType(type);
        setShake((s) => s + 1);
        playHapticTone(type);
    };

    const shakeVariants: Record<string, number[]> = {
        selection: [-1, 1, 0],
        light: [-2, 2, -1, 1, 0],
        medium: [-4, 4, -3, 3, 0],
        heavy: [-7, 7, -5, 5, -2, 2, 0],
        success: [-2, 2, 0, -3, 3, 0],
        error: [-5, 5, -5, 5, -3, 3, 0],
    };

    return (
        <motion.div
            key={shake}
            animate={{ x: shakeVariants[shakeType] || [-2, 2, 0] }}
            transition={{ duration: 0.25 }}
            className="w-full h-full flex flex-col justify-between p-5 select-none"
        >
            <div className="pt-2 text-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">TACTILE ENGINE</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Native Haptics</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Tap cards to test simulated Taptic Engine impulses</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-auto">
                {[
                    { id: 'selection', label: 'Selection', desc: 'Light Tick' },
                    { id: 'light', label: 'Impact Light', desc: 'Soft Pulse' },
                    { id: 'medium', label: 'Impact Med', desc: 'Solid Tap' },
                    { id: 'heavy', label: 'Impact Heavy', desc: 'Deep Thump' },
                    { id: 'success', label: 'Success', desc: 'Double Pulse' },
                    { id: 'error', label: 'Error', desc: 'Triple Buzz' },
                ].map((item) => {
                    const isActive = lastTrigger === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => triggerHaptic(item.id)}
                            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${isActive
                                    ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary/40'
                                    : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                                }`}
                        >
                            <Sparkles className={`w-4 h-4 mb-1.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="text-xs font-bold text-foreground">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="p-3 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-white/10 text-center text-xs font-mono">
                Active Haptic: <span className="font-bold text-primary capitalize">{lastTrigger}</span>
            </div>
        </motion.div>
    );
}

// ─── 22. Expandable Action Menu ──────────────────────────────────────────────
function ExpandableActionMenuDevice({ props, isDark = false }: { props: Record<string, any>; isDark?: boolean }) {
    const [expanded, setExpanded] = useState(props.isExpanded || false);
    const [activeTab, setActiveTab] = useState(props.activeTab || 'home');
    const [lastAction, setLastAction] = useState<string | null>(null);

    useEffect(() => {
        if (props.isExpanded !== undefined) {
            setExpanded(props.isExpanded);
        }
    }, [props.isExpanded]);

    useEffect(() => {
        if (props.activeTab !== undefined) {
            const tab = props.activeTab;
            if (tab === 'bell') setActiveTab('notifications');
            else if (tab === 'user') setActiveTab('profile');
            else setActiveTab(tab);
        }
    }, [props.activeTab]);

    const isDefaultAccent = !props.accentColor || props.accentColor === '#18181B';
    const fabBg = isDefaultAccent ? (isDark ? '#FFFFFF' : '#18181B') : props.accentColor;
    const fabColor = isDefaultAccent ? (isDark ? '#18181B' : '#FFFFFF') : '#FFFFFF';

    const handleActionClick = (actionName: string) => {
        setLastAction(actionName);
        setExpanded(false);
        setTimeout(() => setLastAction(null), 2500);
    };

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'search', label: 'Search', icon: Search },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className={`w-full h-full flex flex-col justify-between relative overflow-hidden select-none transition-colors duration-200 ${
            isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
        }`}>
            {/* Top Header */}
            <div className="p-5 pt-6 z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">EXPANDABLE TAB BAR</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">Workspace Hub</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Expanding 76px → 324px modal tab bar</p>

                {/* Content Preview */}
                <div className="mt-4 space-y-2.5">
                    <div className={`p-4 rounded-2xl border shadow-xs transition-colors ${
                        isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white border-zinc-200/80'
                    }`}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>Recent Communications</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">Live feed</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            Tap the center elevated plus button to expand the full 3-item action menu with fluid spring motion.
                        </p>
                    </div>

                    {lastAction && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-3 rounded-2xl text-xs font-semibold text-center shadow-lg ${
                                isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                            }`}
                        >
                            Triggered: {lastAction}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Backdrop Scrim */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpanded(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Expanding Bottom Tab Bar matching ExpandableActionMenu.tsx */}
            <motion.div
                animate={{
                    height: expanded ? 324 : 76,
                    borderTopLeftRadius: expanded ? 32 : 24,
                    borderTopRightRadius: expanded ? 32 : 24,
                }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                className={`w-full border-t shadow-2xl relative z-30 flex flex-col justify-between overflow-visible transition-colors ${
                    isDark ? 'bg-[#18181B] border-white/10' : 'bg-white border-zinc-200/80'
                }`}
            >
                {/* Expanded Menu Rows */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="px-4 pt-3 flex-1 flex flex-col justify-between pb-1 overflow-hidden"
                        >
                            {/* Drag handle */}
                            <div className={`w-10 h-1 rounded-full mx-auto mb-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />

                            <div className="space-y-1">
                                {/* Item 1: Archived */}
                                <motion.button
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ delay: 0.04 }}
                                    onClick={() => handleActionClick('Archived Chats')}
                                    className={`w-full py-2.5 px-3 rounded-2xl active:scale-[0.99] flex items-center justify-between cursor-pointer transition-all text-left ${
                                        isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] flex items-center justify-center shrink-0">
                                            <Archive className="w-5 h-5 text-[#0284C7]" />
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>Archived</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">See hidden chats</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                </motion.button>

                                <div className={`h-px ml-16 mr-3 ${isDark ? 'bg-zinc-800/80' : 'bg-zinc-100'}`} />

                                {/* Item 2: New Contacts */}
                                <motion.button
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ delay: 0.08 }}
                                    onClick={() => handleActionClick('New Contacts')}
                                    className={`w-full py-2.5 px-3 rounded-2xl active:scale-[0.99] flex items-center justify-between cursor-pointer transition-all text-left ${
                                        isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
                                            <Users className="w-5 h-5 text-[#16A34A]" />
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>New Contacts</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">Add a new friend</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                </motion.button>

                                <div className={`h-px ml-16 mr-3 ${isDark ? 'bg-zinc-800/80' : 'bg-zinc-100'}`} />

                                {/* Item 3: New Chat */}
                                <motion.button
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ delay: 0.12 }}
                                    onClick={() => handleActionClick('New Chat')}
                                    className={`w-full py-2.5 px-3 rounded-2xl active:scale-[0.99] flex items-center justify-between cursor-pointer transition-all text-left ${
                                        isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
                                            <MessageCircle className="w-5 h-5 text-[#9333EA]" />
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>New Chat</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">Start a new conversation</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Bar: Tab Icons (Hidden when expanded) + FAB */}
                <div className="h-16 px-4 flex items-center justify-between relative">
                    {/* Left 2 tabs - fade out & slide down on expand */}
                    <motion.div
                        animate={{
                            opacity: expanded ? 0 : 1,
                            y: expanded ? 20 : 0,
                            pointerEvents: expanded ? 'none' : 'auto',
                        }}
                        transition={{ duration: 0.16 }}
                        className="flex items-center gap-1 flex-1 justify-around"
                    >
                        {tabs.slice(0, 2).map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-colors relative ${
                                        isActive
                                            ? (isDark ? 'text-white' : 'text-zinc-900')
                                            : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="expandableTabPill"
                                            className={`absolute inset-0 rounded-2xl -z-10 shadow-xs ${
                                                isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                                            }`}
                                            transition={springTransition}
                                        />
                                    )}
                                    <Icon className="w-5 h-5 stroke-[2.2]" />
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Center FAB - floating elevated when collapsed, centered dismiss button when expanded */}
                    <div className="w-16 flex items-center justify-center relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setExpanded(!expanded)}
                            animate={{
                                y: expanded ? 0 : -18, // Elevated above the bar when collapsed!
                            }}
                            transition={{ type: 'spring', damping: 20, stiffness: 240 }}
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer shrink-0 z-20"
                            style={{
                                backgroundColor: fabBg,
                                color: fabColor,
                            }}
                        >
                            <motion.div
                                animate={{ rotate: expanded ? 45 : 0 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 240 }}
                            >
                                <Plus className="w-6 h-6 stroke-[2.4]" />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Right 2 tabs - fade out & slide down on expand */}
                    <motion.div
                        animate={{
                            opacity: expanded ? 0 : 1,
                            y: expanded ? 20 : 0,
                            pointerEvents: expanded ? 'none' : 'auto',
                        }}
                        transition={{ duration: 0.16 }}
                        className="flex items-center gap-1 flex-1 justify-around"
                    >
                        {tabs.slice(2, 4).map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer transition-colors relative ${
                                        isActive
                                            ? (isDark ? 'text-white' : 'text-zinc-900')
                                            : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="expandableTabPill"
                                            className={`absolute inset-0 rounded-2xl -z-10 shadow-xs ${
                                                isDark ? 'bg-zinc-800' : 'bg-zinc-100'
                                            }`}
                                            transition={springTransition}
                                        />
                                    )}
                                    <Icon className="w-5 h-5 stroke-[2.2]" />
                                </button>
                            );
                        })}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Master Device Renderer Switch ───────────────────────────────────────────
export default function DeviceRenderer({
    componentId,
    props,
    deviceTheme,
    resetTrigger,
}: DeviceRendererProps) {
    const isDark = deviceTheme === 'dark';

    switch (componentId) {
        case 'stars-globe':
        case 'stars-world':
            return <StarsGlobeDevice key={resetTrigger} props={props} isDark={isDark} />;
        case 'animated-tab-bar':
            return <AnimatedTabBarDevice key={resetTrigger} props={props} isDark={isDark} />;
        case 'photo-album':
            return <PhotoAlbumDevice key={resetTrigger} props={props} />;
        case 'time-picker':
            return <TimePickerDevice key={resetTrigger} props={props} />;
        case 'dynamic-otp':
            return <DynamicOtpDevice key={resetTrigger} props={props} />;
        case 'liquid-action-tab-bar':
            return <LiquidTabBarDevice key={resetTrigger} props={props} isDark={isDark} />;
        case 'rainbow-button':
            return <RainbowButtonDevice key={resetTrigger} props={props} />;
        case 'range-slider':
            return <RangeSliderDevice key={resetTrigger} props={props} />;
        case 'switch-toggle':
            return <SwitchToggleDevice key={resetTrigger} props={props} />;
        case 'expandable-card':
            return <ExpandableCardDevice key={resetTrigger} props={props} />;
        case 'date-picker':
            return <DatePickerDevice key={resetTrigger} props={props} />;
        case 'bottom-navigation':
            return <BottomNavDevice key={resetTrigger} props={props} />;
        case 'bottom-sheet':
            return <BottomSheetDevice key={resetTrigger} props={props} />;
        case 'custom-input':
            return <CustomInputDevice key={resetTrigger} props={props} />;
        case 'dynamic-upload':
            return <DynamicUploadDevice key={resetTrigger} props={props} />;
        case 'floating-speed-dial':
            return <FloatingSpeedDialDevice key={resetTrigger} props={props} />;
        case 'gradient-button':
            return <GradientButtonDevice key={resetTrigger} props={props} />;
        case 'image-carousel':
            return <ImageCarouselDevice key={resetTrigger} props={props} />;
        case 'skeleton-loader':
            return <SkeletonLoaderDevice key={resetTrigger} props={props} />;
        case 'image-skeleton':
            return <ImageSkeletonDevice key={resetTrigger} props={props} />;
        case 'native-haptics':
            return <NativeHapticsDevice key={resetTrigger} props={props} />;
        case 'expandable-action-menu':
            return <ExpandableActionMenuDevice key={resetTrigger} props={props} isDark={isDark} />;
        default:
            return <DatePickerDevice key={resetTrigger} props={props} />;
    }
}

