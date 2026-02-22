'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    closestCenter,
    type DragStartEvent,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CanvasNode, SavedDesign } from '@/lib/studio/types';
import {
    COMPONENT_DEFINITIONS,
    CATEGORIES,
    getDefinition,
} from '@/lib/studio/component-definitions';
import { generateScreenCode, getRequiredFiles } from '@/lib/studio/code-generator';
import { trackStudioBuilderView, trackStudioComponentAdded, trackStudioCodeExport, trackStudioCodeCopy, trackStudioPropsUpdated } from '@/lib/analytics';
import { useStudio } from '@/lib/studio/context';

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = process.env.NEXT_PUBLIC_STUDIO_STORAGE_KEY || 'nativecn_studio';
const TTL_MINUTES = parseInt(process.env.NEXT_PUBLIC_STUDIO_TTL_MINUTES || '60', 10);
const TTL_MS = TTL_MINUTES * 60 * 1000;

// ─── localStorage with 60-min TTL ────────────────────────────────────────────

function saveDesign(nodes: CanvasNode[]) {
    if (typeof window === 'undefined') return;
    const design: SavedDesign = {
        nodes,
        savedAt: Date.now(),
        expiresAt: Date.now() + TTL_MS,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
}

function loadDesign(): CanvasNode[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const design: SavedDesign = JSON.parse(raw);
        if (Date.now() > design.expiresAt) {
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
        return design.nodes;
    } catch {
        return [];
    }
}

function clearDesign() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// ─── ID Generator ────────────────────────────────────────────────────────────

let idCounter = 0;
function newId(): string {
    return `node_${Date.now()}_${idCounter++}`;
}

// ─── Palette Item (Draggable) ────────────────────────────────────────────────

function PaletteItem({ type, name, icon }: { type: string; name: string; icon: string }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { type, fromPalette: true },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing border transition-all text-sm
                ${isDragging
                    ? 'opacity-50 border-blue-400 bg-blue-50 dark:bg-blue-950'
                    : 'border-border/50 bg-card hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                }`}
        >
            <span className="text-base">{icon}</span>
            <span className="font-medium text-foreground/80">{name}</span>
        </div>
    );
}

// ─── Visual Component Preview ────────────────────────────────────────────────
// Renders an interactive approximation of each component inside the phone mockup

function ComponentPreview({ node }: { node: CanvasNode }) {
    const [showPassword, setShowPassword] = useState(false);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const def = getDefinition(node.type);
    if (!def) return null;

    // ─── Input variants
    if (node.type.startsWith('input-')) {
        const label = node.props.label || 'Label';
        const placeholder = node.props.placeholder || '';
        const variant = node.props.variant || 'outlined';
        const isPassword = node.props.secureTextEntry;
        const isMultiline = node.props.multiline;
        const isSearch = node.type === 'input-search';

        const variantStyles: Record<string, string> = {
            outlined: 'border border-gray-300 bg-white rounded-lg',
            filled: 'border-0 bg-gray-100 rounded-lg',
            underlined: 'border-0 border-b-2 border-gray-300 bg-transparent rounded-none',
            default: 'border border-gray-200 bg-white rounded-lg',
        };

        return (
            <div className="px-4 py-1">
                <label className="block text-[10px] font-medium text-gray-600 mb-1">{label} {node.props.required && <span className="text-red-500">*</span>}</label>
                <div className={`${variantStyles[variant] || variantStyles.outlined} px-3 ${isMultiline ? 'py-3 min-h-[60px]' : 'py-2.5'} flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow`}>
                    {isSearch && <span className="text-gray-400 text-xs select-none">🔍</span>}

                    {isMultiline ? (
                        <textarea
                            className="flex-1 text-[11px] bg-transparent outline-none resize-none text-gray-900 placeholder:text-gray-400 min-h-[40px] appearance-none"
                            placeholder={placeholder || 'Enter text...'}
                            onClick={(e) => e.stopPropagation()}
                            required={node.props.required}
                        />
                    ) : (
                        <input
                            type={node.type === 'input-password' ? (showPassword ? 'text' : 'password') : node.type === 'input-email' ? 'email' : node.type === 'input-phone' ? 'tel' : node.type === 'input-number' ? 'number' : 'text'}
                            className="flex-1 text-[11px] bg-transparent outline-none text-gray-900 placeholder:text-gray-400 min-w-0 appearance-none"
                            placeholder={placeholder || 'Enter text...'}
                            onClick={(e) => e.stopPropagation()}
                            required={node.props.required}
                        />
                    )}

                    {isPassword && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                            className="text-gray-400 text-[10px] hover:text-gray-600 focus:outline-none p-1"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? '�' : '�👁'}
                        </button>
                    )}
                    {node.props.clearable && (
                        <button type="button" onClick={(e) => e.stopPropagation()} className="text-gray-400 text-[10px] hover:text-gray-600 focus:outline-none p-1">✕</button>
                    )}
                </div>
            </div>
        );
    }

    // ─── Date Picker
    if (node.type === 'date-picker') {
        return (
            <div className="px-4 py-1">
                <label className="block text-[10px] font-medium text-gray-600 mb-1">{node.props.label || 'Select Date'}</label>
                <div className="border border-gray-300 bg-white rounded-lg px-3 py-2 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
                    <input
                        type="date"
                        className="flex-1 text-[11px] bg-transparent outline-none text-gray-900 w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        );
    }

    // ─── Switch Toggle
    if (node.type === 'switch-toggle') {
        return (
            <div className="px-4 py-1">
                <div
                    className="flex items-center justify-between py-1 cursor-pointer group select-none"
                    onClick={(e) => { e.stopPropagation(); setSwitchChecked(!switchChecked); }}
                >
                    <span className="text-[11px] font-medium text-gray-700">{node.props.label || 'Toggle'}</span>
                    <div className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ease-in-out ${switchChecked ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-gray-400'}`}>
                        <div className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200 ease-in-out ${switchChecked ? 'left-[20px]' : 'left-[2px]'}`} />
                    </div>
                </div>
            </div>
        );
    }

    // ─── Button
    if (node.type === 'rainbow-button') {
        const w = Number(node.props.width || 320);
        const h = Number(node.props.height || 50);
        const borderRadius = 16;
        const borderWidth = 2;
        const perimeter = 2 * (w + h - 2 * borderRadius) + 2 * Math.PI * borderRadius;
        const sweepLength = perimeter * 0.35;

        return (
            <div className="px-4 py-1 flex justify-center w-full">
                <style>{`
                    @keyframes rainbow-dash-${node.id} {
                        0% { stroke-dashoffset: 0; }
                        100% { stroke-dashoffset: -${perimeter}; }
                    }
                `}</style>
                <button
                    className={`relative flex items-center justify-center max-w-full transition-all duration-150 group ${isPressed ? 'scale-95 opacity-90' : 'scale-100 hover:opacity-95'}`}
                    style={{
                        width: w,
                        height: h,
                        borderRadius: borderRadius,
                        padding: borderWidth,
                    }}
                    onPointerDown={(e) => { e.stopPropagation(); setIsPressed(true); }}
                    onPointerUp={(e) => { e.stopPropagation(); setIsPressed(false); }}
                    onPointerLeave={(e) => { e.stopPropagation(); setIsPressed(false); }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                        <defs>
                            <linearGradient id={`rainbow-${node.id}`} x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#00C0FF" />
                                <stop offset="33%" stopColor="#FFCF00" />
                                <stop offset="66%" stopColor="#FC4F4F" />
                                <stop offset="100%" stopColor="#00C0FF" />
                            </linearGradient>
                        </defs>
                        <rect
                            x={borderWidth / 2}
                            y={borderWidth / 2}
                            width={`calc(100% - ${borderWidth}px)`}
                            height={`calc(100% - ${borderWidth}px)`}
                            rx={borderRadius - borderWidth / 2}
                            ry={borderRadius - borderWidth / 2}
                            stroke="#F5F5F5"
                            strokeWidth={borderWidth}
                            fill="none"
                        />
                        <rect
                            x={borderWidth / 2}
                            y={borderWidth / 2}
                            width={`calc(100% - ${borderWidth}px)`}
                            height={`calc(100% - ${borderWidth}px)`}
                            rx={borderRadius - borderWidth / 2}
                            ry={borderRadius - borderWidth / 2}
                            stroke={`url(#rainbow-${node.id})`}
                            strokeWidth={borderWidth}
                            fill="none"
                            strokeDasharray={`${sweepLength},${perimeter - sweepLength}`}
                            style={{
                                animation: `rainbow-dash-${node.id} 3s linear infinite`
                            }}
                        />
                    </svg>

                    {/* Inner Button Background */}
                    <div
                        className="relative w-full h-full bg-[#F5F5F5] flex items-center justify-center pointer-events-none"
                        style={{ borderRadius: borderRadius - borderWidth }}
                    >
                        <span className="text-[14px] font-bold text-gray-800 px-2 truncate transition-colors">
                            {node.props.text || 'Submit'}
                        </span>
                    </div>
                </button>
            </div>
        );
    }

    // ─── Gradient Button (Tripookie Style)
    if (node.type === 'button-gradient') {
        const title = node.props.title || 'Submit';
        const color1 = node.props.color1 || '#FF5F6D';
        const color2 = node.props.color2 || '#FFC371';
        const width = node.props.width || '250';
        const height = node.props.height || 50;
        const size = node.props.size || 'medium';
        const borderRadius = node.props.borderRadius ?? 12;

        const py = size === 'small' ? 'py-1.5' : size === 'large' ? 'py-3' : 'py-2.5';
        const textCls = size === 'small' ? 'text-[11px]' : size === 'large' ? 'text-[14px]' : 'text-[12px]';

        return (
            <div className="px-4 py-1 flex justify-center w-full">
                <button
                    className={`flex items-center justify-center shadow-md overflow-hidden transition-all duration-150 ${isPressed ? 'scale-95 opacity-90' : 'scale-100 hover:opacity-95'}`}
                    style={{
                        background: `linear-gradient(to right, ${color1}, ${color2})`,
                        borderRadius: borderRadius,
                        width: width === '100%' ? '100%' : Number(width),
                        height: Number(height),
                    }}
                    onPointerDown={(e) => { e.stopPropagation(); setIsPressed(true); }}
                    onPointerUp={(e) => { e.stopPropagation(); setIsPressed(false); }}
                    onPointerLeave={(e) => { e.stopPropagation(); setIsPressed(false); }}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <span className={`${textCls} font-semibold text-white px-4 truncate pointer-events-none select-none`}>
                        {title}
                    </span>
                </button>
            </div>
        );
    }

    // ─── Heading
    if (node.type === 'heading') {
        const align = node.props.align || 'left';
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
        return (
            <div className="px-4 py-1">
                <p className={`text-[15px] font-bold text-gray-900 ${alignClass}`}>
                    {node.props.text || 'Screen Title'}
                </p>
            </div>
        );
    }

    // ─── Spacer
    if (node.type === 'spacer') {
        return (
            <div className="px-4">
                <div
                    className="border border-dashed border-gray-200 rounded bg-gray-50/50 flex items-center justify-center"
                    style={{ height: Math.min(node.props.height || 20, 60) }}
                >
                    <span className="text-[8px] text-gray-300">↕ {node.props.height || 20}px</span>
                </div>
            </div>
        );
    }

    return null;
}

// ─── Canvas Node (Sortable) with Visual Preview ──────────────────────────────

function CanvasNodeItem({
    node,
    isSelected,
    onSelect,
    onDelete,
}: {
    node: CanvasNode;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: node.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onSelect}
            className={`group relative transition-all cursor-pointer rounded-md mx-2 border border-transparent
                ${isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50/10 z-20'
                    : 'hover:ring-1 hover:ring-gray-300 z-10'
                }`}
        >
            {/* Visual preview */}
            <div className="py-2">
                <ComponentPreview node={node} />
            </div>

            {/* Action Bar (Visible on hover or when selected) */}
            <div className={`absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-white dark:bg-zinc-800 rounded-md shadow-md border border-border p-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-muted rounded flex items-center justify-center"
                    title="Drag to reorder"
                >
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3C6.32843 3 7 2.32843 7 1.5C7 0.671573 6.32843 0 5.5 0C4.67157 0 4 0.671573 4 1.5C4 2.32843 4.67157 3 5.5 3ZM9.5 3C10.3284 3 11 2.32843 11 1.5C11 0.671573 10.3284 0 9.5 0C8.67157 0 8 0.671573 8 1.5C8 2.32843 8.67157 3 9.5 3ZM11 7.5C11 8.32843 10.3284 9 9.5 9C8.67157 9 8 8.32843 8 7.5C8 6.67157 8.67157 6 9.5 6C10.3284 6 11 6.67157 11 7.5ZM7 7.5C7 8.32843 6.32843 9 5.5 9C4.67157 9 4 8.32843 4 7.5C4 6.67157 4.67157 6 5.5 6C6.32843 6 7 6.67157 7 7.5ZM11 13.5C11 14.3284 10.3284 15 9.5 15C8.67157 15 8 14.3284 8 13.5C8 12.6716 8.67157 12 9.5 12C10.3284 12 11 12.6716 11 13.5ZM7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5Z" fill="currentColor"></path></svg>
                </div>
                <div className="h-px w-4 bg-border mx-0.5" />
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded flex items-center justify-center"
                    title="Delete component"
                >
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor"></path></svg>
                </button>
            </div>
        </div>
    );
}

// ─── Phone Mockup Drop Zone ──────────────────────────────────────────────────

function PhoneMockup({
    children,
    isEmpty,
    deviceType,
    onDeviceChange,
}: {
    children: React.ReactNode;
    isEmpty: boolean;
    deviceType: 'ios' | 'android';
    onDeviceChange: (device: 'ios' | 'android') => void;
}) {
    const { isOver, setNodeRef } = useDroppable({ id: 'canvas-drop' });

    const isIOS = deviceType === 'ios';

    return (
        <div className="relative flex flex-col items-center min-h-full">
            {/* Device Toggle - Absolute Top Right */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-1 bg-white/60 dark:bg-zinc-800/80 rounded-xl p-1 border border-border/50 backdrop-blur-md shadow-sm">
                <button
                    onClick={() => onDeviceChange('ios')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${isIOS
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                >
                    iPhone 15 Pro
                </button>
                <button
                    onClick={() => onDeviceChange('android')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${!isIOS
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                >
                    Pixel 8
                </button>
            </div>

            {/* ── Device Frame ── */}
            <div ref={setNodeRef} className="relative" style={{ width: isIOS ? 340 : 330, height: 680 }}>

                {/* Side buttons — iOS */}
                {isIOS && (
                    <>
                        {/* Silent switch */}
                        <div className="absolute -left-[3px] top-[100px] w-[3px] h-[28px] rounded-l-sm"
                            style={{ background: 'linear-gradient(to bottom, #2a2a2e, #1a1a1e, #2a2a2e)' }} />
                        {/* Volume Up */}
                        <div className="absolute -left-[3px] top-[148px] w-[3px] h-[52px] rounded-l-sm"
                            style={{ background: 'linear-gradient(to bottom, #2a2a2e, #1a1a1e, #2a2a2e)' }} />
                        {/* Volume Down */}
                        <div className="absolute -left-[3px] top-[210px] w-[3px] h-[52px] rounded-l-sm"
                            style={{ background: 'linear-gradient(to bottom, #2a2a2e, #1a1a1e, #2a2a2e)' }} />
                        {/* Power button */}
                        <div className="absolute -right-[3px] top-[168px] w-[3px] h-[72px] rounded-r-sm"
                            style={{ background: 'linear-gradient(to bottom, #2a2a2e, #1a1a1e, #2a2a2e)' }} />
                    </>
                )}

                {/* Side buttons — Android */}
                {!isIOS && (
                    <>
                        {/* Volume rocker */}
                        <div className="absolute -right-[3px] top-[140px] w-[3px] h-[64px] rounded-r-sm"
                            style={{ background: 'linear-gradient(to bottom, #1a1a1e, #0e0e10, #1a1a1e)' }} />
                        {/* Power */}
                        <div className="absolute -right-[3px] top-[220px] w-[3px] h-[44px] rounded-r-sm"
                            style={{ background: 'linear-gradient(to bottom, #1a1a1e, #0e0e10, #1a1a1e)' }} />
                    </>
                )}

                {/* Outer device body — metallic frame */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        borderRadius: isIOS ? 52 : 36,
                        background: isIOS
                            ? 'linear-gradient(145deg, #3a3a3e 0%, #1a1a1e 30%, #2a2a2e 50%, #1a1a1e 70%, #3a3a3e 100%)'
                            : 'linear-gradient(145deg, #1c1c20 0%, #0c0c0e 40%, #1c1c20 60%, #0c0c0e 100%)',
                        padding: isIOS ? 10 : 8,
                        boxShadow: `
                            0 0 0 1px rgba(255,255,255,0.08) inset,
                            0 25px 60px -12px rgba(0,0,0,0.5),
                            0 12px 28px -8px rgba(0,0,0,0.4),
                            0 4px 12px rgba(0,0,0,0.2),
                            0 0 80px -20px rgba(0,0,0,0.3)
                        `,
                    }}
                >
                    {/* Inner bezel highlight */}
                    <div
                        className="absolute inset-[1px] pointer-events-none"
                        style={{
                            borderRadius: isIOS ? 51 : 35,
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.05) 100%)',
                        }}
                    />

                    {/* Screen area */}
                    <div
                        className="relative w-full h-full overflow-hidden flex flex-col"
                        style={{
                            borderRadius: isIOS ? 42 : 28,
                            background: '#000',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.8) inset, 0 0 8px rgba(0,0,0,0.5) inset',
                        }}
                    >
                        {/* Status bar */}
                        {isIOS ? (
                            <div className="relative bg-white px-7 pt-3.5 pb-2 flex items-center justify-between z-10">
                                <span className="text-[11px] font-semibold text-gray-900" style={{ fontFamily: '-apple-system, SF Pro Text, sans-serif' }}>9:41</span>
                                {/* Dynamic Island */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[100px] h-[28px] bg-black rounded-full flex items-center justify-end pr-2.5"
                                    style={{ boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}>
                                    {/* Front camera lens */}
                                    <div className="w-[10px] h-[10px] rounded-full"
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #1a1a3a, #0a0a0f)', boxShadow: '0 0 2px rgba(255,255,255,0.15) inset, 0 0 1px rgba(100,100,255,0.3)' }} />
                                </div>
                                <div className="flex items-center gap-[5px]">
                                    {/* Signal bars */}
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                                        <rect x="0" y="9" width="3" height="3" rx="0.5" fill="#1d1d1f" />
                                        <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="#1d1d1f" />
                                        <rect x="9" y="3" width="3" height="9" rx="0.5" fill="#1d1d1f" />
                                        <rect x="13" y="0" width="3" height="12" rx="0.5" fill="#1d1d1f" />
                                    </svg>
                                    {/* WiFi */}
                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="#1d1d1f">
                                        <path d="M7 9.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM7 6.5c1.66 0 3 .9 3 2l-.8-.8c-.6-.4-1.4-.7-2.2-.7s-1.6.3-2.2.7l-.8.8c0-1.1 1.34-2 3-2zm0-3c2.76 0 5 1.34 5 3l-1-.9C10 4.5 8.6 3.9 7 3.9S4 4.5 3 5.6l-1 .9c0-1.66 2.24-3 5-3zm0-3c4 0 7.2 1.8 7.2 4l-1-1C12 2.2 9.7 1 7 1S2 2.2.8 3.5l-1 1C-.2 2.3 3 .5 7 .5z" />
                                    </svg>
                                    {/* Battery */}
                                    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
                                        <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#1d1d1f" strokeWidth="1" />
                                        <rect x="19.5" y="3" width="2" height="5" rx="1" fill="#1d1d1f" />
                                        <rect x="2" y="2" width="13" height="7" rx="1" fill="#34c759" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="relative bg-white px-5 pt-2 pb-1.5 flex items-center justify-between z-10">
                                <span className="text-[11px] font-medium text-gray-800" style={{ fontFamily: 'Roboto, sans-serif' }}>12:00</span>
                                {/* Punch-hole camera */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-[8px] w-[14px] h-[14px] rounded-full bg-black"
                                    style={{ boxShadow: '0 0 3px rgba(0,0,0,0.4)' }}>
                                    <div className="absolute inset-[3px] rounded-full"
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #1a1a3a, #0a0a0f)', boxShadow: '0 0 1px rgba(100,100,255,0.2)' }} />
                                </div>
                                <div className="flex items-center gap-[5px]">
                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="#3c4043">
                                        <path d="M7 9.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM7 6.5c1.66 0 3 .9 3 2l-.8-.8c-.6-.4-1.4-.7-2.2-.7s-1.6.3-2.2.7l-.8.8c0-1.1 1.34-2 3-2zm0-3c2.76 0 5 1.34 5 3l-1-.9C10 4.5 8.6 3.9 7 3.9S4 4.5 3 5.6l-1 .9c0-1.66 2.24-3 5-3z" />
                                    </svg>
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                                        <rect x="0" y="9" width="3" height="3" rx="0.5" fill="#3c4043" />
                                        <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="#3c4043" />
                                        <rect x="9" y="3" width="3" height="9" rx="0.5" fill="#3c4043" />
                                        <rect x="13" y="0" width="3" height="12" rx="0.5" fill="#3c4043" />
                                    </svg>
                                    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
                                        <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#3c4043" strokeWidth="1" />
                                        <rect x="19.5" y="3" width="2" height="5" rx="1" fill="#3c4043" />
                                        <rect x="2" y="2" width="13" height="7" rx="1" fill="#3c4043" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Screen content (scrollable drop zone) */}
                        <div
                            className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-colors ${isOver
                                ? 'bg-blue-50/60'
                                : 'bg-white'
                                }`}
                            style={{ paddingBottom: isIOS ? 34 : 16 }}
                        >
                            {isEmpty ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                                    <div className="text-3xl">📲</div>
                                    <p className="text-[11px] font-medium text-gray-400">Drop components here</p>
                                    <p className="text-[9px] text-gray-300">Build your screen visually</p>
                                </div>
                            ) : (
                                <div className="py-2 space-y-0.5">{children}</div>
                            )}
                        </div>

                        {/* Bottom bar */}
                        {isIOS ? (
                            <div className="bg-white pb-2 pt-1.5 flex justify-center">
                                <div className="w-[120px] h-[4px] bg-gray-900 rounded-full"
                                    style={{ boxShadow: '0 0 2px rgba(0,0,0,0.1)' }} />
                            </div>
                        ) : (
                            <div className="bg-white pb-2 pt-1 flex justify-center">
                                <div className="w-[100px] h-[3px] bg-gray-800 rounded-full opacity-60" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Screen glass reflection overlay */}
                <div
                    className="absolute pointer-events-none z-20"
                    style={{
                        top: isIOS ? 10 : 8,
                        left: isIOS ? 10 : 8,
                        right: isIOS ? 10 : 8,
                        bottom: isIOS ? 10 : 8,
                        borderRadius: isIOS ? 42 : 28,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 100%)',
                    }}
                />
            </div>
        </div>
    );
}

// ─── Props Panel ─────────────────────────────────────────────────────────────

function PropsPanel({
    node,
    onChange,
}: {
    node: CanvasNode;
    onChange: (props: Record<string, any>) => void;
}) {
    const def = getDefinition(node.type);
    if (!def) return null;

    const updateProp = (name: string, value: any) => {
        onChange({ ...node.props, [name]: value });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{def.icon}</span>
                <h3 className="font-semibold text-sm">{def.name} Properties</h3>
            </div>

            {def.propControls.map((ctrl) => (
                <div key={ctrl.name} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        {ctrl.label}
                    </label>

                    {ctrl.type === 'text' && (
                        <input
                            type="text"
                            value={node.props[ctrl.name] ?? ctrl.defaultValue ?? ''}
                            onChange={(e) => updateProp(ctrl.name, e.target.value)}
                            placeholder={ctrl.placeholder}
                            className="w-full px-2.5 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    )}

                    {ctrl.type === 'number' && (
                        <input
                            type="number"
                            value={node.props[ctrl.name] ?? ctrl.defaultValue ?? 0}
                            onChange={(e) => updateProp(ctrl.name, Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    )}

                    {ctrl.type === 'boolean' && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={node.props[ctrl.name] ?? ctrl.defaultValue ?? false}
                                onChange={(e) => updateProp(ctrl.name, e.target.checked)}
                                className="rounded border-border accent-blue-500"
                            />
                            <span className="text-xs text-foreground/70">
                                {node.props[ctrl.name] ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>
                    )}

                    {ctrl.type === 'color' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={node.props[ctrl.name] ?? ctrl.defaultValue ?? '#000000'}
                                onChange={(e) => updateProp(ctrl.name, e.target.value)}
                                className="w-8 h-8 rounded border border-border cursor-pointer p-0 appearance-none bg-transparent"
                            />
                            <input
                                type="text"
                                value={node.props[ctrl.name] ?? ctrl.defaultValue ?? '#000000'}
                                onChange={(e) => updateProp(ctrl.name, e.target.value)}
                                className="flex-1 px-2.5 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 uppercase font-mono"
                            />
                        </div>
                    )}

                    {ctrl.type === 'select' && ctrl.options && (
                        <select
                            value={node.props[ctrl.name] ?? ctrl.defaultValue ?? ''}
                            onChange={(e) => updateProp(ctrl.name, e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {ctrl.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Main Studio Builder Page ────────────────────────────────────────────────────

export default function StudioBuilderPage() {
    const [nodes, setNodes] = useState<CanvasNode[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');
    const [inputExpanded, setInputExpanded] = useState(false);
    const [buttonExpanded, setButtonExpanded] = useState(true);
    const [mounted, setMounted] = useState(false);

    const studio = useStudio();

    // Prevent hydration mismatch — @dnd-kit generates different aria IDs on server vs client
    useEffect(() => {
        setMounted(true);
        trackStudioBuilderView();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Load from localStorage on mount
    useEffect(() => {
        const saved = loadDesign();
        if (saved.length > 0) setNodes(saved);
    }, []);

    // Sync state to context for Navbar
    useEffect(() => {
        studio?.setHasNodes(nodes.length > 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes.length]);

    // Register clear handler
    useEffect(() => {
        studio?.registerClearAll(() => {
            setNodes([]);
            setSelectedId(null);
            clearDesign();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-save on change
    useEffect(() => {
        if (nodes.length > 0) {
            saveDesign(nodes);
        }
    }, [nodes]);

    const selectedNode = nodes.find((n) => n.id === selectedId);

    // ─── Drag handlers ──────────────────────────

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        // Dropping from palette onto canvas OR onto an existing node
        if (String(active.id).startsWith('palette-')) {
            const type = active.data.current?.type;
            const def = getDefinition(type);
            if (!def) return;

            trackStudioComponentAdded(type || 'unknown');

            // Create default props
            const defaultProps: Record<string, any> = {};
            for (const ctrl of def.propControls) {
                defaultProps[ctrl.name] = ctrl.defaultValue;
            }

            const newNode: CanvasNode = {
                id: newId(),
                type,
                props: defaultProps,
                order: nodes.length,
            };

            setNodes((prev) => [...prev, newNode]);
            setSelectedId(newNode.id);
            return;
        }

        // Reordering within canvas
        if (!String(active.id).startsWith('palette-') && over.id !== 'canvas-drop') {
            const oldIndex = nodes.findIndex((n) => n.id === active.id);
            const newIndex = nodes.findIndex((n) => n.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setNodes((prev) => {
                    const reordered = arrayMove(prev, oldIndex, newIndex);
                    return reordered.map((n, i) => ({ ...n, order: i }));
                });
            }
        }
    };

    const handleDeleteNode = useCallback((id: string) => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
        if (selectedId === id) setSelectedId(null);
    }, [selectedId]);

    const handleUpdateProps = useCallback((props: Record<string, any>) => {
        if (!selectedId) return;
        setNodes((prev) => {
            const updatedNode = prev.find(n => n.id === selectedId);
            if (updatedNode) {
                trackStudioPropsUpdated(updatedNode.type);
            }
            return prev.map((n) => (n.id === selectedId ? { ...n, props } : n));
        });
    }, [selectedId]);

    const screenName = studio?.screenName || 'MyScreen';
    const showCode = studio?.showCode || false;

    const code = generateScreenCode(nodes, screenName);
    const requiredFiles = getRequiredFiles(nodes);

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        trackStudioCodeCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Render ─────────────────────────────────

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background pt-16">
                <div className="max-w-[1600px] mx-auto px-4 py-4">
                    <div className="flex items-center justify-center h-[60vh] text-muted-foreground/40">
                        <div className="text-center space-y-2">
                            <div className="text-4xl animate-pulse">📱</div>
                            <p className="text-sm">Loading Studio...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            {/* Main Content — no separate header, controls are in the Navbar */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="max-w-[1600px] mx-auto px-4 py-4">
                    {showCode ? (
                        /* ─── Code View ─── */
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{screenName}.tsx</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {nodes.length} component{nodes.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all
                                            ${copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {copied ? '✓ Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                                <pre className="p-4 text-sm overflow-auto max-h-[70vh] font-mono leading-relaxed">
                                    <code>{code}</code>
                                </pre>
                            </div>

                            {requiredFiles.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                                        📋 Required Component Files
                                    </h4>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                                        Copy these files from nativecn-ui into your project:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {requiredFiles.map((f) => (
                                            <span key={f} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-mono px-2.5 py-1 rounded-md">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ─── Builder View ─── */
                        <div className="grid grid-cols-[280px_1fr_320px] gap-4 min-h-[calc(100vh-100px)]">
                            {/* Left — Component Palette */}
                            <div className="bg-card border border-border rounded-xl p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                                    Components
                                </h3>
                                {CATEGORIES.map((cat) => {
                                    const items = COMPONENT_DEFINITIONS.filter(
                                        (d) => d.category === cat
                                    );
                                    if (items.length === 0) return null;

                                    // Input category is collapsible
                                    if (cat === 'Input') {
                                        return (
                                            <div key={cat} className="mb-4">
                                                <button
                                                    onClick={() => setInputExpanded((v) => !v)}
                                                    className={`w-full flex flex-col p-px rounded-xl overflow-hidden transition-all duration-300 ${inputExpanded ? 'bg-gradient-to-b from-blue-500/20 to-purple-500/20 shadow-sm' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                >
                                                    <div className={`w-full flex items-center justify-between gap-3 p-3 rounded-[11px] backdrop-blur-md transition-all ${inputExpanded ? 'bg-white/80 dark:bg-zinc-900/80 border border-white/20 dark:border-white/10' : 'bg-transparent border border-transparent'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${inputExpanded ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-secondary text-muted-foreground'}`}>
                                                                <span className="text-sm">⌨️</span>
                                                            </div>
                                                            <span className={`text-sm font-semibold transition-colors ${inputExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>Inputs</span>
                                                        </div>
                                                        <svg
                                                            className={`w-4 h-4 transition-transform duration-300 ${inputExpanded ? 'rotate-180 text-gray-900 dark:text-white' : 'text-muted-foreground/50'}`}
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${inputExpanded ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                    <div className="space-y-2 pl-4 border-l-2 border-border/30 ml-4">
                                                        {items.map((d) => (
                                                            <PaletteItem
                                                                key={d.type}
                                                                type={d.type}
                                                                name={d.name}
                                                                icon={d.icon}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Button category is collapsible
                                    if (cat === 'Button') {
                                        return (
                                            <div key={cat} className="mb-4">
                                                <button
                                                    onClick={() => setButtonExpanded((v) => !v)}
                                                    className={`w-full flex flex-col p-px rounded-xl overflow-hidden transition-all duration-300 ${buttonExpanded ? 'bg-gradient-to-b from-pink-500/20 to-orange-500/20 shadow-sm' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                >
                                                    <div className={`w-full flex items-center justify-between gap-3 p-3 rounded-[11px] backdrop-blur-md transition-all ${buttonExpanded ? 'bg-white/80 dark:bg-zinc-900/80 border border-white/20 dark:border-white/10' : 'bg-transparent border border-transparent'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${buttonExpanded ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400' : 'bg-secondary text-muted-foreground'}`}>
                                                                <span className="text-sm">🖱️</span>
                                                            </div>
                                                            <span className={`text-sm font-semibold transition-colors ${buttonExpanded ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>Buttons</span>
                                                        </div>
                                                        <svg
                                                            className={`w-4 h-4 transition-transform duration-300 ${buttonExpanded ? 'rotate-180 text-gray-900 dark:text-white' : 'text-muted-foreground/50'}`}
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${buttonExpanded ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                    <div className="space-y-2 pl-4 border-l-2 border-border/30 ml-4">
                                                        {items.map((d) => (
                                                            <PaletteItem
                                                                key={d.type}
                                                                type={d.type}
                                                                name={d.name}
                                                                icon={d.icon}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Other categories remain always expanded
                                    return (
                                        <div key={cat} className="mb-4">
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-1.5 px-1">
                                                {cat}
                                            </p>
                                            <div className="space-y-1">
                                                {items.map((d) => (
                                                    <PaletteItem
                                                        key={d.type}
                                                        type={d.type}
                                                        name={d.name}
                                                        icon={d.icon}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="mt-4 pt-3 border-t border-border/50">
                                    <p className="text-[10px] text-muted-foreground/50 text-center">
                                        Drag → Device → Configure
                                    </p>
                                </div>
                            </div>

                            {/* Center — Phone Mockup Canvas */}
                            <div className="bg-slate-50 dark:bg-zinc-950 border border-border rounded-xl p-4 overflow-y-auto">
                                <SortableContext
                                    items={nodes.map((n) => n.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <PhoneMockup
                                        isEmpty={nodes.length === 0}
                                        deviceType={deviceType}
                                        onDeviceChange={setDeviceType}
                                    >
                                        {nodes.map((node) => (
                                            <CanvasNodeItem
                                                key={node.id}
                                                node={node}
                                                isSelected={selectedId === node.id}
                                                onSelect={() => setSelectedId(node.id)}
                                                onDelete={() => handleDeleteNode(node.id)}
                                            />
                                        ))}
                                    </PhoneMockup>
                                </SortableContext>
                            </div>

                            {/* Right — Properties Panel */}
                            <div className="bg-card border border-border rounded-xl p-5 overflow-y-auto max-h-[calc(100vh-100px)]">
                                {selectedNode ? (
                                    <PropsPanel node={selectedNode} onChange={handleUpdateProps} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                        <div className="text-4xl mb-3">⚙️</div>
                                        <p className="text-xs text-center px-4">
                                            Select a component on the device to configure its properties
                                        </p>
                                    </div>
                                )}

                                {/* Export button */}
                                {nodes.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-border/50">
                                        <button
                                            onClick={() => {
                                                studio?.setShowCode(true);
                                                trackStudioCodeExport();
                                            }}
                                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
                                        >
                                            Export Code →
                                        </button>
                                        <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                                            Auto-saved • Resets in {TTL_MINUTES} min
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Visual Drag Overlay --- */}
                <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                    {activeId ? (
                        activeId.startsWith('palette-') ? (
                            (() => {
                                const type = activeId.replace('palette-', '');
                                const def = getDefinition(type);
                                return def ? (
                                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-blue-400 bg-blue-50 dark:bg-blue-950/80 shadow-xl opacity-90 backdrop-blur-sm pointer-events-none scale-105 border">
                                        <span className="text-base">{def.icon}</span>
                                        <span className="font-medium text-blue-900 dark:text-blue-100">{def.name}</span>
                                    </div>
                                ) : null;
                            })()
                        ) : (
                            (() => {
                                const activeNode = nodes.find(n => n.id === activeId);
                                return activeNode ? (
                                    <div className="opacity-90 shadow-2xl scale-105 pointer-events-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-1 border border-blue-500">
                                        <ComponentPreview node={activeNode} />
                                    </div>
                                ) : null;
                            })()
                        )
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
