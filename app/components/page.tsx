'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, ExternalLink, ArrowRight, Sparkles, Compass, Sliders, MousePointer2, Layers, Loader2, LayoutGrid } from 'lucide-react';
import { components } from '@/lib/components-data';

// Category data with icons
const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Navigation', icon: Compass },
    { name: 'Input', icon: Sliders },
    { name: 'Button', icon: MousePointer2 },
    { name: 'Modal', icon: Layers },
    { name: 'Loading', icon: Loader2 },
];

export default function ComponentsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Update sliding indicator position
    useEffect(() => {
        const activeIndex = categories.findIndex(c => c.name === selectedCategory);
        const activeButton = buttonRefs.current[activeIndex];
        if (activeButton) {
            setIndicatorStyle({
                left: activeButton.offsetLeft,
                width: activeButton.offsetWidth,
            });
        }
    }, [selectedCategory]);

    const filteredComponents = components.filter(component => {
        const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
        const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCopyPreview = async (component: typeof components[0]) => {
        await navigator.clipboard.writeText(component.codePreview);
        setCopiedId(component.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{components.length} Components Available</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Component <span className="text-gradient">Library</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Premium React Native components. Copy, paste, and ship faster.
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-12 space-y-6"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Category Filter with Sliding Indicator */}
                    <div className="flex justify-center">
                        <div className="relative inline-flex p-1.5 bg-muted/50 rounded-full border border-border/50">
                            {/* Sliding Background Indicator */}
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/25"
                                initial={false}
                                animate={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />

                            {/* Filter Buttons */}
                            {categories.map((cat, index) => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        ref={el => { buttonRefs.current[index] = el; }}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors duration-200 ${isActive
                                                ? 'text-white'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                                        <span className="hidden sm:inline">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-center text-sm text-muted-foreground">
                        Showing {filteredComponents.length} of {components.length} components
                    </div>
                </motion.div>

                {/* Component Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredComponents.map((component, index) => (
                            <motion.div
                                key={component.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                layout
                                className="group relative"
                            >
                                {/* Card with glassmorphism effect */}
                                <div className="relative h-full bg-gradient-to-br from-background via-background to-muted/30 border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Content Container with fixed structure */}
                                    <div className="relative p-6 flex flex-col h-full">
                                        {/* Header Row - Fixed Height */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${component.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}>
                                                {component.emoji}
                                            </div>
                                            {/* Category Badge */}
                                            <span className="px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full text-xs font-medium shrink-0">
                                                {component.category}
                                            </span>
                                        </div>

                                        {/* Title - Fixed */}
                                        <Link href={`/components/${component.id}`}>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300 cursor-pointer">
                                                {component.name}
                                            </h3>
                                        </Link>

                                        {/* Description - Fixed Height with line-clamp */}
                                        <p className="text-muted-foreground text-sm mb-5 line-clamp-2 min-h-[40px]">
                                            {component.description}
                                        </p>

                                        {/* Features - Fixed Height Section */}
                                        <div className="mb-5 min-h-[72px]">
                                            <div className="flex flex-wrap gap-1.5">
                                                {component.features.slice(0, 2).map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 bg-muted/60 rounded-lg text-xs text-muted-foreground"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                                {component.features.length > 2 && (
                                                    <span className="px-3 py-1.5 text-xs text-muted-foreground/70">
                                                        +{component.features.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Spacer to push footer to bottom */}
                                        <div className="flex-grow" />

                                        {/* Footer - Always at bottom */}
                                        <div className="pt-4 border-t border-border/50">
                                            {/* Dependencies Row */}
                                            <div className="flex items-center justify-between mb-4">
                                                {component.dependencies.required.length === 0 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium">
                                                        <Check className="w-3 h-3" />
                                                        Zero dependencies
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1.5 bg-muted/60 rounded-lg text-xs font-mono text-muted-foreground">
                                                        {component.dependencies.required[0]}
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground/60">
                                                    v{component.version}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleCopyPreview(component)}
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                                                >
                                                    {copiedId === component.id ? (
                                                        <><Check className="w-4 h-4" />Copied!</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4" />Copy Code</>
                                                    )}
                                                </button>
                                                <Link
                                                    href={`/components/${component.id}`}
                                                    className="px-4 py-3 bg-muted/60 hover:bg-muted rounded-xl transition-all duration-300 flex items-center justify-center group/btn"
                                                >
                                                    <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredComponents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold mb-2">No components found</p>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your search or category filter
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('All');
                                setSearchQuery('');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-24 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl" />
                    <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Need a specific component?</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                            Can&apos;t find what you&apos;re looking for? Let me know and I&apos;ll build it for you.
                        </p>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                        >
                            Request a Component
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
