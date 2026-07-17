'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroShowcase from './HeroShowcase';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-24 px-4 bg-transparent border-b border-dashed border-neutral-200 dark:border-neutral-800">
            {/* The Blueprint Canvas Grid (Optional: just relying on borders for now) */}
            
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">

                    {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/components"
                        className="group inline-flex items-center gap-2 rounded-full bg-white dark:bg-neutral-900 py-1.5 pr-4 pl-3 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm"
                    >
                        <span>Open Source</span>
                        <span className="inline-block h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                        <span>React Native Components</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8 text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-balance text-neutral-900 dark:text-neutral-50 max-w-5xl leading-[1.1] md:leading-[1.1]"
                >
                    Production-ready components{' '}
                    <span className="inline-block bg-primary text-primary-foreground px-4 py-1 -rotate-1 mt-2 lg:mt-0 shadow-lg">you actually own.</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed tracking-wide antialiased"
                >
                    Zero dependencies. Zero lock-in. A curated collection of meticulously designed React Native components you can copy and paste directly into your project.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
                >
                    <Link
                        href="/studio/builder"
                        className="flex h-12 w-full sm:w-48 items-center justify-center rounded-md bg-primary text-base font-medium text-primary-foreground shadow-md transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    >
                        Try Studio Builder
                    </Link>
                    <Link
                        href="/components"
                        className="flex h-12 w-full sm:w-48 items-center justify-center rounded-md border border-neutral-300 bg-white text-base font-medium text-neutral-900 shadow-sm transition duration-150 active:scale-[0.98] hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                    >
                        Browse Components
                    </Link>
                </motion.div>

                {/* Visual Anchor: The Component Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
                    className="w-full relative z-10"
                >
                    <HeroShowcase />
                    {/* Fading mask at the bottom to blend it into the page seamlessly */}
                    <div className="absolute -bottom-24 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
                </motion.div>
            </div>
        </section>
    );
}
