'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronLeft, Code2, Package, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { components } from '@/lib/components-data';

export default function ComponentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const component = components.find(c => c.id === id);
    const [activeTab, setActiveTab] = useState<'typescript' | 'javascript'>('typescript');
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    if (!component) {
        notFound();
    }

    const handleCopy = async (text: string, section: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const relatedComponents = components
        .filter(c => c.category === component.category && c.id !== component.id)
        .slice(0, 3);

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Header */}
            <div className="border-b border-border bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Link href="/components" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Components
                        </Link>

                        <div className="flex items-start gap-6">
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${component.gradient} flex items-center justify-center text-4xl shadow-xl`}>
                                {component.emoji}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h1 className="text-4xl md:text-5xl font-bold">{component.name}</h1>
                                    <span className={`px-3 py-1 rounded-full text-sm ${component.difficulty === 'Easy' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                                        component.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                            'bg-red-500/20 text-red-600 dark:text-red-400'
                                        }`}>
                                        {component.difficulty}
                                    </span>
                                </div>
                                <p className="text-xl text-muted-foreground mb-4">{component.longDescription}</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-2 bg-muted rounded-lg text-sm">{component.category}</span>
                                    <span className="px-4 py-2 bg-muted rounded-lg text-sm">v{component.version}</span>
                                    <span className="px-4 py-2 bg-muted rounded-lg text-sm">Updated {component.lastUpdated}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Quick Preview */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-6 h-6" />Quick Preview
                            </h2>
                            <div className="bg-muted/50 border border-border rounded-xl p-6">
                                <pre className="overflow-x-auto text-sm"><code>{component.codePreview}</code></pre>
                                <button onClick={() => handleCopy(component.codePreview, 'preview')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
                                    {copiedSection === 'preview' ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Preview</>}
                                </button>
                            </div>
                        </motion.section>

                        {/* Installation */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Package className="w-6 h-6" />Installation
                            </h2>
                            <div className="space-y-4">
                                {component.installation.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                                        <div className="flex-1 pt-1"><p>{step}</p></div>
                                    </div>
                                ))}
                            </div>
                            {component.installation.nativeSetup && component.installation.nativeSetup.length > 0 && (
                                <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                                    <p className="font-semibold mb-2">⚠️ Native Setup Required:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {component.installation.nativeSetup.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                </div>
                            )}
                        </motion.section>

                        {/* Full Code */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Code2 className="w-6 h-6" />Full Code
                            </h2>
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setActiveTab('typescript')} className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'typescript' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>TypeScript</button>
                                <button onClick={() => setActiveTab('javascript')} className={`px-6 py-3 rounded-lg font-medium transition ${activeTab === 'javascript' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>JavaScript</button>
                            </div>
                            <div className="bg-slate-900 rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
                                    <span className="text-sm text-slate-300">{component.name}.{activeTab === 'typescript' ? 'tsx' : 'jsx'}</span>
                                    <button onClick={() => handleCopy(component.fullCode[activeTab], `code-${activeTab}`)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-sm transition text-white">
                                        {copiedSection === `code-${activeTab}` ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Code</>}
                                    </button>
                                </div>
                                <pre className="overflow-x-auto p-6 text-sm text-slate-300"><code>{component.fullCode[activeTab]}</code></pre>
                            </div>
                        </motion.section>

                        {/* Usage Examples */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />Usage Examples
                            </h2>
                            <div className="space-y-6">
                                {component.usage.map((example, i) => (
                                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                                        <div className="px-6 py-4 bg-muted border-b border-border">
                                            <h3 className="font-bold text-lg">{example.title}</h3>
                                            <p className="text-sm text-muted-foreground">{example.description}</p>
                                        </div>
                                        <div className="bg-slate-900">
                                            <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
                                                <span className="text-sm text-slate-300">Example {i + 1}</span>
                                                <button onClick={() => handleCopy(example.code, `example-${i}`)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-sm transition text-white">
                                                    {copiedSection === `example-${i}` ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                                                </button>
                                            </div>
                                            <pre className="overflow-x-auto p-6 text-sm text-slate-300"><code>{example.code}</code></pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Props Documentation */}
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                            <h2 className="text-2xl font-bold mb-4">Props</h2>
                            <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">Prop</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">Default</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {component.props.map((prop, i) => (
                                            <tr key={i} className="hover:bg-muted/50 transition">
                                                <td className="px-6 py-4">
                                                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                                        {prop.name}{prop.required && <span className="text-red-500 ml-1">*</span>}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-4"><code className="text-sm font-mono text-muted-foreground">{prop.type}</code></td>
                                                <td className="px-6 py-4">
                                                    {prop.default ? <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{prop.default}</code> : <span className="text-muted-foreground">-</span>}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{prop.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="sticky top-24">
                            {/* Features */}
                            <div className="bg-background border border-border rounded-xl p-6">
                                <h3 className="font-bold mb-4">Features</h3>
                                <ul className="space-y-2">
                                    {component.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Dependencies */}
                            <div className="bg-background border border-border rounded-xl p-6 mt-6">
                                <h3 className="font-bold mb-4">Dependencies</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Required:</p>
                                        {component.dependencies.required.length === 0 ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm">
                                                <Check className="w-4 h-4" />None
                                            </span>
                                        ) : (
                                            <div className="space-y-2">
                                                {component.dependencies.required.map((dep, i) => (
                                                    <code key={i} className="block text-sm font-mono bg-muted px-3 py-2 rounded">{dep}</code>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {component.dependencies.optional.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Optional:</p>
                                            <div className="space-y-2">
                                                {component.dependencies.optional.map((dep, i) => (
                                                    <code key={i} className="block text-sm font-mono bg-muted px-3 py-2 rounded">{dep}</code>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Related Components */}
                            {relatedComponents.length > 0 && (
                                <div className="bg-background border border-border rounded-xl p-6 mt-6">
                                    <h3 className="font-bold mb-4">Related Components</h3>
                                    <div className="space-y-3">
                                        {relatedComponents.map(related => (
                                            <Link key={related.id} href={`/components/${related.id}`} className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 rounded-lg transition group">
                                                <span className="text-2xl">{related.emoji}</span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm group-hover:text-gradient">{related.name}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{related.description}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
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
