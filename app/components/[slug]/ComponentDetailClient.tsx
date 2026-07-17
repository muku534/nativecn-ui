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
        <div className="min-h-screen pb-20">
            {/* Minimalist Header */}
            <div className="border-b border-border bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        
                        {/* Breadcrumbs / Category */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <Link href="/components" className="hover:text-foreground transition-colors">Components</Link>
                            <ChevronRight className="w-4 h-4" />
                            {(() => {
                                const Icon = categoryIcons[component.category] || LayoutGrid;
                                return <span className="flex items-center gap-1.5 font-medium text-foreground"><Icon className="w-4 h-4" /> {component.category}</span>;
                            })()}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{component.name}</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    component.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                    component.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                }`}>
                                    {component.difficulty}
                                </span>
                            </div>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{component.longDescription}</p>
                            
                            <div className="flex items-center gap-5 mt-2 text-sm font-medium">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Package className="w-4 h-4" /> v{component.version}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" /> Updated {component.lastUpdated}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12 min-w-0">

                        {/* Live Preview - PRIORITY #1 */}
                        {component.id !== 'native-haptics' && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Live Preview</h2>
                                    <a
                                        href={component.snackId ? `https://snack.expo.dev/${component.snackId}` : 'https://snack.expo.dev/'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-md text-sm font-medium transition-colors text-secondary-foreground"
                                        onClick={handleSnackOpen}
                                    >
                                        Open in Snack <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>

                                <div className="relative rounded-2xl overflow-hidden border border-border bg-[#0d1117] shadow-xl">
                                    {/* Mac Window Controls */}
                                    <div className="h-10 bg-[#161b22] border-b border-border/10 flex items-center px-4 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        <div className="flex-1 text-center text-xs font-medium text-slate-400 font-mono">
                                            Preview
                                        </div>
                                    </div>
                                    <div className="h-[600px] w-full bg-black/50">
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
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Installation</h2>
                            
                            <div className="relative border-l border-border/60 ml-4 space-y-6 pb-4 mt-4 max-w-2xl">
                                {component.installation.steps.map((step, i) => {
                                    const isCommand = step.startsWith('npm') || step.startsWith('yarn') || step.startsWith('bun') || step.startsWith('expo') || step.startsWith('cd') || step.startsWith('npx');
                                    return (
                                        <div key={i} className="relative pl-8 group">
                                            {/* Centered Circle: top-3 perfectly aligns with py-4 padding */}
                                            <div className="absolute -left-[17px] top-3 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background text-foreground font-semibold text-sm shadow-sm ring-4 ring-background">
                                                {i + 1}
                                            </div>
                                            <div 
                                                className={`bg-card border border-border/50 px-5 py-4 rounded-xl shadow-sm w-full transition-all ${isCommand ? 'cursor-pointer hover:border-border/80 hover:bg-muted/30 active:scale-[0.99]' : ''}`}
                                                onClick={() => isCommand && handleCopy(step, `install-${i}`)}
                                                role={isCommand ? "button" : undefined}
                                                tabIndex={isCommand ? 0 : undefined}
                                            >
                                                {isCommand ? (
                                                    <div className="flex items-center justify-between gap-6">
                                                        <code className="text-sm font-mono text-foreground/90">{step}</code>
                                                        <div className={`shrink-0 p-2 rounded-md transition-all ${copiedSection === `install-${i}` ? 'bg-green-500/10 text-green-500 opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`}>
                                                            <AnimatePresence mode="wait">
                                                                {copiedSection === `install-${i}` ? (
                                                                    <motion.div key="check" initial={{ scale: 0, opacity: 0, rotate: -45 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                                                                        <Check className="w-4 h-4" />
                                                                    </motion.div>
                                                                ) : (
                                                                    <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                                        <Copy className="w-4 h-4" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-foreground/90 leading-relaxed">{step}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {component.installation.nativeSetup && component.installation.nativeSetup.length > 0 && (
                                <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 flex gap-3">
                                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                                    <div>
                                        <p className="font-medium text-amber-600 dark:text-amber-400 mb-1 text-sm">Native Setup Required</p>
                                        <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-amber-600/80 dark:text-amber-400/80">
                                            {component.installation.nativeSetup.map((step, i) => <li key={i}>{step}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Full Code */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Source Code</h2>

                            {/* Native Files Tabs */}
                            {component.nativeFiles && Object.keys(component.nativeFiles).length > 0 ? (
                                <div className="space-y-8">
                                    {Object.entries(component.nativeFiles).map(([fileName, content], idx) => (
                                        <div key={fileName} className="bg-[#0d1117] rounded-xl overflow-hidden border border-border/50 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                                    </div>
                                                    <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded-md">{fileName}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopy(content, `code-${fileName}`)} 
                                                    className={`p-2 rounded-md transition-all ${copiedSection === `code-${fileName}` ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                                                    title="Copy code"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {copiedSection === `code-${fileName}` ? (
                                                            <motion.div key="check" initial={{ scale: 0, opacity: 0, rotate: -45 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                                                                <Check className="w-4 h-4" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                                <Copy className="w-4 h-4" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                            <pre className="overflow-x-auto p-5 text-sm text-slate-300 max-h-[400px] custom-scrollbar"><code>{content}</code></pre>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="flex p-1 mb-4 bg-muted/50 rounded-lg w-fit border border-border/50">
                                        <button onClick={() => handleTabSwitch('typescript')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'typescript' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>TypeScript</button>
                                        <button onClick={() => handleTabSwitch('javascript')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'javascript' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>JavaScript</button>
                                    </div>
                                    <div className="bg-[#0d1117] rounded-xl overflow-hidden border border-border/50 shadow-sm">
                                        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border/10">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                                </div>
                                                <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded-md">
                                                    {component.name.replace(/\s+/g, '')}.{activeTab === 'typescript' ? 'tsx' : 'jsx'}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleCopy(component.fullCode[activeTab], `code-${activeTab}`)} 
                                                className={`p-2 rounded-md transition-all ${copiedSection === `code-${activeTab}` ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                                                title="Copy code"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {copiedSection === `code-${activeTab}` ? (
                                                        <motion.div key="check" initial={{ scale: 0, opacity: 0, rotate: -45 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                                                            <Check className="w-4 h-4" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                            <Copy className="w-4 h-4" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                        <pre className="overflow-x-auto p-5 text-sm text-slate-300 max-h-[600px] custom-scrollbar"><code>{component.fullCode[activeTab]}</code></pre>
                                    </div>
                                </>
                            )}
                        </motion.section>

                        {/* Usage Examples */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Usage Examples</h2>
                            <div className="space-y-8">
                                {component.usage.map((example, i) => (
                                    <div key={i} className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{example.title}</h3>
                                            {example.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
                                            )}
                                        </div>
                                        <div className="bg-[#0d1117] rounded-xl overflow-hidden border border-border/50 shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-border/10">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                                </div>
                                                <button 
                                                    onClick={() => handleCopy(example.code, `example-${i}`)} 
                                                    className={`p-2 rounded-md transition-all ${copiedSection === `example-${i}` ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                                                    title="Copy code"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {copiedSection === `example-${i}` ? (
                                                            <motion.div key="check" initial={{ scale: 0, opacity: 0, rotate: -45 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                                                                <Check className="w-4 h-4" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div key="copy" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                                                <Copy className="w-4 h-4" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </div>
                                            <pre className="overflow-x-auto p-5 text-sm text-slate-300 custom-scrollbar"><code>{example.code}</code></pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Props Documentation */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Props</h2>
                            <div className="border border-border/50 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead className="bg-muted/50 border-b border-border/50">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Prop</th>
                                            <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Type</th>
                                            <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Default</th>
                                            <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50 bg-card/30">
                                        {component.props.map((prop, i) => (
                                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{prop.name}</code>
                                                        {prop.required && <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Required</span>}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4"><code className="text-xs font-mono text-muted-foreground">{prop.type}</code></td>
                                                <td className="px-5 py-4">
                                                    {prop.default ? <code className="text-xs font-mono text-muted-foreground">{prop.default}</code> : <span className="text-muted-foreground/50">-</span>}
                                                </td>
                                                <td className="px-5 py-4 text-muted-foreground leading-relaxed">{prop.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="sticky top-24 space-y-6">

                            {/* Features */}
                            <div className="bg-card border border-border/40 shadow-sm rounded-2xl p-6">
                                <h3 className="font-semibold tracking-tight text-foreground mb-4">Features</h3>
                                <ul className="space-y-3">
                                    {component.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Native Capabilities */}
                            {component.dependencies.optional.includes('native-haptics') && (
                                <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                                    <h3 className="font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-indigo-400" /> Native Capabilities
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed relative z-10">
                                        Includes a zero-dependency native haptic feedback implementation for premium feel.
                                    </p>
                                    <Link href="/components/native-haptics" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 relative z-10">
                                        View Implementation <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}

                            {/* Dependencies */}
                            <div className="bg-card border border-border/40 shadow-sm rounded-2xl p-6">
                                <h3 className="font-semibold tracking-tight text-foreground mb-4">Dependencies</h3>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Required</p>
                                        {component.dependencies.required.length === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/20">
                                                <Check className="w-3.5 h-3.5" />Zero Dependencies
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {component.dependencies.required.map((dep, i) => (
                                                    <code key={i} className="text-xs font-mono bg-muted px-2 py-1 rounded-md border border-border/50 text-foreground/80">{dep}</code>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {component.dependencies.optional.filter(d => d !== 'native-haptics').length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Optional</p>
                                            <div className="flex flex-wrap gap-2">
                                                {component.dependencies.optional
                                                    .filter(d => d !== 'native-haptics')
                                                    .map((dep, i) => (
                                                        <code key={i} className="text-xs font-mono bg-muted/50 px-2 py-1 rounded-md border border-border/50 text-muted-foreground">{dep}</code>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Related Components */}
                            {relatedComponents.length > 0 && (
                                <div className="bg-card border border-border/40 shadow-sm rounded-2xl p-6">
                                    <h3 className="font-semibold tracking-tight text-foreground mb-4">Related Components</h3>
                                    <div className="space-y-2">
                                        {relatedComponents.map(related => (
                                            <Link key={related.id} href={`/components/${related.id}`} className="flex items-center gap-3 p-2.5 -mx-2 hover:bg-muted/50 rounded-xl transition-colors group">
                                                <div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm group-hover:border-border transition-colors">
                                                    {(() => {
                                                        const Icon = categoryIcons[related.category] || Layers;
                                                        return <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />;
                                                    })()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-foreground truncate">{related.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{related.category}</p>
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
