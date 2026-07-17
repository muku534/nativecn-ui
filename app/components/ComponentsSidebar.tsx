'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { ComponentMetadata } from '@/lib/types';

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
        <div className="py-8 px-6 space-y-6">
            <div className="space-y-2">
                <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Getting Started
                </h4>
                <div className="space-y-1 border-l border-zinc-100 dark:border-zinc-900 ml-3.5">
                    <Link
                        href="/components"
                        className={`block pl-4 py-1.5 text-[13px] transition-colors relative border-l -ml-[1px] ${
                            pathname === '/components'
                                ? 'text-zinc-950 dark:text-zinc-50 font-medium border-zinc-900 dark:border-zinc-100'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                        onClick={() => setIsOpen(false)}
                    >
                        Introduction
                    </Link>
                </div>
            </div>

            {categories.map((category) => {
                return (
                    <div key={category} className="space-y-2">
                        <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            {category}
                        </h4>
                        <div className="space-y-1 border-l border-zinc-100 dark:border-zinc-900 ml-3.5">
                            {grouped[category].map((comp) => {
                                const isActive = pathname === `/components/${comp.slug}`;
                                return (
                                    <Link
                                        key={comp.id}
                                        href={`/components/${comp.slug}`}
                                        className={`block pl-4 py-1.5 text-[13px] transition-colors relative border-l -ml-[1px] ${
                                            isActive
                                                ? 'text-zinc-950 dark:text-zinc-50 font-medium border-zinc-900 dark:border-zinc-100'
                                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
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
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
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
                            className="fixed inset-0 z-40 bg-zinc-950/20 dark:bg-zinc-950/50 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto lg:hidden pt-16"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 xl:w-72 border-r border-zinc-200 dark:border-zinc-800 bg-transparent sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 select-none">
                <SidebarContent />
            </aside>
        </>
    );
}
