'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutGrid, Compass, Sliders, MousePointer2, Layers, Loader2 } from 'lucide-react';
import type { ComponentMetadata } from '@/lib/types';

const categoryIcons: Record<string, any> = {
    'All': LayoutGrid,
    'Navigation': Compass,
    'Input': Sliders,
    'Button': MousePointer2,
    'Modal': Layers,
    'Loading': Loader2,
};

export default function ComponentsSidebar({ components }: { components: ComponentMetadata[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Group components by category
    const grouped = components.reduce((acc, comp) => {
        if (!acc[comp.category]) acc[comp.category] = [];
        acc[comp.category].push(comp);
        return acc;
    }, {} as Record<string, ComponentMetadata[]>);

    const categories = Object.keys(grouped).sort();

    const SidebarContent = () => (
        <div className="py-6 px-4 space-y-8">
            <div>
                <h4 className="px-2 mb-2 text-sm font-semibold tracking-tight text-foreground">
                    Getting Started
                </h4>
                <div className="space-y-1">
                    <Link
                        href="/components"
                        className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                            pathname === '/components'
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        onClick={() => setIsOpen(false)}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Introduction
                    </Link>
                </div>
            </div>

            {categories.map((category) => {
                const Icon = categoryIcons[category] || LayoutGrid;
                return (
                    <div key={category}>
                        <h4 className="flex items-center gap-2 px-2 mb-2 text-sm font-semibold tracking-tight text-foreground">
                            <Icon className="w-4 h-4" />
                            {category}
                        </h4>
                        <div className="space-y-1">
                            {grouped[category].map((comp) => {
                                const isActive = pathname === `/components/${comp.slug}`;
                                return (
                                    <Link
                                        key={comp.id}
                                        href={`/components/${comp.slug}`}
                                        className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-muted-foreground/30'}`} />
                                        {comp.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border overflow-y-auto lg:hidden pt-16"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 xl:w-72 border-r border-border bg-card/50 backdrop-blur-sm sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0">
                <SidebarContent />
            </aside>
        </>
    );
}
