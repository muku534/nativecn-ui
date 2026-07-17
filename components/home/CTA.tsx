'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2 } from 'lucide-react';

export default function CTA() {
    return (
        <section className="relative py-32 px-4 overflow-hidden border-t border-dashed border-neutral-200 dark:border-neutral-800">
            {/* Background elements */}
            <div className="absolute inset-0 bg-neutral-50 dark:bg-zinc-950/50" />
            
            {/* The Blueprint Canvas Grid */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                        <Code2 className="w-8 h-8 text-primary" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 tracking-tight text-balance leading-[1.05]">
                        Start building today.
                    </h2>
                    
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl max-w-xl mx-auto mb-10 tracking-wide leading-relaxed">
                        Stop reinventing the wheel. Ship beautiful, highly interactive React Native applications <span className="font-semibold text-neutral-900 dark:text-neutral-100">faster</span>.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <Link
                            href="/components"
                            className="flex h-14 w-full sm:w-56 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]"
                        >
                            Browse Components
                        </Link>
                        <Link
                            href="/docs"
                            className="group flex h-14 w-full sm:w-56 items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white text-base font-semibold text-neutral-900 transition-all duration-150 active:scale-[0.98] dark:border-neutral-700 dark:bg-zinc-900 dark:text-white hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-zinc-800"
                        >
                            Read Documentation
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
