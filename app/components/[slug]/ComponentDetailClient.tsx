'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronLeft, ChevronRight, Code2, Package, Zap, BookOpen, ArrowRight, Play, ExternalLink, Terminal, Layers, LayoutGrid, Compass, Sliders, MousePointer2, Loader2, Clock } from 'lucide-react';
import type { ComponentData, ComponentMetadata } from '@/lib/types';
import { trackComponentView, trackCopyCode, trackSnackOpen, trackTabSwitch } from '@/lib/analytics';

const categoryIcons: Record<string, any> = {
    'All': LayoutGrid,
    'Navigation': Compass,
    'Input': Sliders,
    'Button': MousePointer2,
    'Modal': Layers,
    'Loading': Loader2,
};

interface ComponentDetailClientProps {
    component: ComponentData;
    relatedComponents: ComponentMetadata[];
}

export default function ComponentDetailClient({ component, relatedComponents }: ComponentDetailClientProps) {
    const [activeTab, setActiveTab] = useState<'typescript' | 'javascript'>('typescript');
    const [copiedSection, setCopiedSection] = useState<string | null>(null);
    const hasTrackedView = useRef(false);

    // Track component view on mount (once)
    useEffect(() => {
        if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            trackComponentView(component.id, component.name, component.category);
        }
    }, [component.id, component.name, component.category]);

    const handleCopy = async (text: string, section: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedSection(section);
        trackCopyCode(
            component.id,
            component.name,
            section,
            section.startsWith('code-') ? activeTab : undefined
        );
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const handleTabSwitch = (newTab: 'typescript' | 'javascript') => {
        if (newTab !== activeTab) {
            trackTabSwitch(component.id, activeTab, newTab);
            setActiveTab(newTab);
        }
    };

    const handleSnackOpen = () => {
        trackSnackOpen(component.id, component.name, component.snackId || '');
    };

    return (
        <div className="min-h-screen pb-20 bg-background">
            {/* Header Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-10 pb-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[13px] text-zinc-400 dark:text-zinc-500 mb-6">
                        <Link href="/components" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Components</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="font-medium text-zinc-600 dark:text-zinc-400">{component.category}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{component.name}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                                {component.difficulty}
                            </span>
                        </div>
                        
                        <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">{component.longDescription}</p>
                        
                        <div className="flex items-center gap-5 mt-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            <div className="flex items-center gap-1.5">
                                <Package className="w-4 h-4" /> v{component.version}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" /> Updated {component.lastUpdated}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12 min-w-0">

                        {/* Live Preview */}
                        {component.id !== 'native-haptics' && (
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Live Preview</h2>
                                    <a
                                        href={component.snackId ? `https://snack.expo.dev/${component.snackId}` : 'https://snack.expo.dev/'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs md:text-sm font-medium transition-colors text-zinc-800 dark:text-zinc-200"
                                        onClick={handleSnackOpen}
                                    >
                                        Open in Snack <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-950 shadow-sm">
                                    {/* Mac Window Controls */}
                                    <div className="h-10 bg-zinc-900/50 border-b border-zinc-800/30 flex items-center px-4 gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-zinc-700/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-zinc-700/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-zinc-700/60" />
                                        <div className="flex-1 text-center text-[11px] font-medium text-zinc-500 font-mono">
                                            Preview
                                        </div>
                                    </div>
                                    <div className="h-[600px] w-full bg-transparent">
                                        <iframe
                                            src={`https://snack.expo.dev/embedded/${component.snackId || ''}?preview=true&platform=ios&theme=dark`}
                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                            title={`${component.name} Preview`}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Installation */}
                        {component.installation && (
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Installation</h2>
                                
                                <div className="relative border-l border-zinc-200 dark:border-zinc-800/80 ml-3 space-y-6 pb-4 mt-4">
                                    {component.installation.steps?.map((step, i) => {
                                    const isCommand = step.startsWith('npm') || step.startsWith('yarn') || step.startsWith('bun') || step.startsWith('expo') || step.startsWith('cd') || step.startsWith('npx');
                                    return (
                                        <div key={i} className="relative pl-8 group">
                                            <div className="absolute -left-3 top-1 flex items-center justify-center w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-500 dark:text-zinc-400 font-medium text-[11px] shadow-sm">
                                                {i + 1}
                                            </div>
                                            <div 
                                                className={`bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl transition-all ${isCommand ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 active:scale-[0.99]' : ''}`}
                                                onClick={() => isCommand && handleCopy(step, `install-${i}`)}
                                                role={isCommand ? "button" : undefined}
                                                tabIndex={isCommand ? 0 : undefined}
                                            >
                                                {isCommand ? (
                                                    <div className="flex items-center justify-between gap-6">
                                                        <code className="text-xs md:text-sm font-mono text-zinc-800 dark:text-zinc-200">{step}</code>
                                                        <div className={`shrink-0 p-1.5 rounded-md transition-all ${copiedSection === `install-${i}` ? 'text-green-500 opacity-100' : 'text-zinc-400 opacity-0 group-hover:opacity-100'}`}>
                                                            <AnimatePresence mode="wait">
                                                                {copiedSection === `install-${i}` ? (
                                                                    <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                        <Copy className="w-3.5 h-3.5" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{step}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {component.installation.nativeSetup && component.installation.nativeSetup.length > 0 && (
                                <div className="mt-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl p-5 flex gap-3">
                                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1 text-sm">Native Setup Required</p>
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-xs md:text-sm text-amber-600/80 dark:text-amber-400/80">
                                            {component.installation.nativeSetup.map((step, i) => <li key={i}>{step}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.section>
                        )}

                        {/* Source Code */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Source Code</h2>

                            {component.nativeFiles && Object.keys(component.nativeFiles).length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(component.nativeFiles).map(([fileName, content], idx) => (
                                        <div key={fileName} className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800/30">
                                                <span className="text-xs font-mono text-zinc-400">{fileName}</span>
                                                <button 
                                                    onClick={() => handleCopy(content, `code-${fileName}`)} 
                                                    className={`p-1.5 rounded-md transition-all ${copiedSection === `code-${fileName}` ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                    title="Copy code"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {copiedSection === `code-${fileName}` ? (
                                                            <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                <Check className="w-3.5 h-3.5" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                            <pre className="overflow-x-auto p-5 text-[13px] text-zinc-300 max-h-[400px] custom-scrollbar font-mono"><code>{content}</code></pre>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="flex p-1 mb-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl w-fit border border-zinc-200 dark:border-zinc-800">
                                        <button onClick={() => handleTabSwitch('typescript')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${activeTab === 'typescript' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>TypeScript</button>
                                        <button onClick={() => handleTabSwitch('javascript')} className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${activeTab === 'javascript' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}>JavaScript</button>
                                    </div>
                                    <div className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800/30">
                                            <span className="text-xs font-mono text-zinc-400">
                                                {component.name.replace(/\s+/g, '')}.{activeTab === 'typescript' ? 'tsx' : 'jsx'}
                                            </span>
                                            <button 
                                                onClick={() => handleCopy(component.fullCode[activeTab], `code-${activeTab}`)} 
                                                className={`p-1.5 rounded-md transition-all ${copiedSection === `code-${activeTab}` ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                title="Copy code"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {copiedSection === `code-${activeTab}` ? (
                                                        <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                            <Check className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                        <pre className="overflow-x-auto p-5 text-[13px] text-zinc-300 max-h-[600px] custom-scrollbar font-mono"><code>{component.fullCode[activeTab]}</code></pre>
                                    </div>
                                </>
                            )}
                        </motion.section>

                        {/* Usage Examples */}
                        {component.usage && component.usage.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Usage Examples</h2>
                            <div className="space-y-6">
                                {component.usage.map((example, i) => (
                                    <div key={i} className="flex flex-col gap-3">
                                        <div>
                                            <h3 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{example.title}</h3>
                                            {example.description && (
                                                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{example.description}</p>
                                            )}
                                        </div>
                                        <div className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800/30">
                                                <span className="text-[11px] font-mono text-zinc-500">Example Code</span>
                                                <button 
                                                    onClick={() => handleCopy(example.code, `example-${i}`)} 
                                                    className={`p-1.5 rounded-md transition-all ${copiedSection === `example-${i}` ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                    title="Copy code"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {copiedSection === `example-${i}` ? (
                                                            <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                <Check className="w-3.5 h-3.5" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}>
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                            <pre className="overflow-x-auto p-5 text-[13px] text-zinc-300 custom-scrollbar font-mono"><code>{example.code}</code></pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                        )}

                        {/* Props Documentation */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Props</h2>
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto bg-transparent">
                                <table className="w-full min-w-[600px] text-xs md:text-sm">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left font-semibold text-zinc-500 dark:text-zinc-400">Prop</th>
                                            <th className="px-5 py-3.5 text-left font-semibold text-zinc-500 dark:text-zinc-400">Type</th>
                                            <th className="px-5 py-3.5 text-left font-semibold text-zinc-500 dark:text-zinc-400">Default</th>
                                            <th className="px-5 py-3.5 text-left font-semibold text-zinc-500 dark:text-zinc-400">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                                        {component.props.map((prop, i) => (
                                            <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-[11px] font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800/50">{prop.name}</code>
                                                        {prop.required && <span className="text-[9px] uppercase font-bold text-red-500 dark:text-red-400 tracking-wider">Required</span>}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4"><code className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{prop.type}</code></td>
                                                <td className="px-5 py-4">
                                                    {prop.default ? <code className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{prop.default}</code> : <span className="text-zinc-400/50 dark:text-zinc-500/50">-</span>}
                                                </td>
                                                <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">{prop.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar Panels */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="sticky top-24 space-y-6">

                            {/* Features */}
                            <div className="bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-4 text-[15px]">Features</h3>
                                <ul className="space-y-3">
                                    {component.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Native Capabilities */}
                            {component.dependencies.optional.includes('native-haptics') && (
                                <div className="bg-gradient-to-br from-zinc-100/50 to-zinc-50/20 dark:from-zinc-900/30 dark:to-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-2 text-[15px]">
                                        <Zap className="w-4 h-4 text-zinc-600 dark:text-zinc-400 animate-pulse" /> Native Capabilities
                                    </h3>
                                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed relative z-10">
                                        Includes a zero-dependency native haptic feedback implementation for premium feel.
                                    </p>
                                    <Link href="/components/native-haptics" className="text-xs md:text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:underline transition-all inline-flex items-center gap-1.5 relative z-10">
                                        View Implementation <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}

                            {/* Dependencies */}
                            <div className="bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-4 text-[15px]">Dependencies</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Required</p>
                                        {component.dependencies.required.length === 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-medium border border-emerald-500/20">
                                                <Check className="w-3 h-3" />Zero Dependencies
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1.5">
                                                {component.dependencies.required.map((dep, i) => (
                                                    <code key={i} className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300">{dep}</code>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {component.dependencies.optional.filter(d => d !== 'native-haptics').length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Optional</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {component.dependencies.optional
                                                    .filter(d => d !== 'native-haptics')
                                                    .map((dep, i) => (
                                                        <code key={i} className="text-[11px] font-mono bg-zinc-50 dark:bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-200/30 dark:border-zinc-800/30 text-zinc-500 dark:text-zinc-400">{dep}</code>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Related Components */}
                            {relatedComponents.length > 0 && (
                                <div className="bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-4 text-[15px]">Related Components</h3>
                                    <div className="space-y-1.5">
                                        {relatedComponents.map(related => (
                                            <Link key={related.id} href={`/components/${related.id}`} className="flex items-center gap-3 p-2 -mx-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 rounded-xl transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-none transition-colors">
                                                    <Layers className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-xs md:text-sm text-zinc-800 dark:text-zinc-200 truncate">{related.name}</p>
                                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{related.category}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
