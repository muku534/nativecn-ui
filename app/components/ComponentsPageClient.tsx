'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Package } from 'lucide-react';
import Link from 'next/link';

export default function ComponentsPageClient() {
    return (
        <div className="min-h-[calc(100vh-4rem)] p-8 lg:p-12 xl:p-16 relative">
            <div className="absolute inset-0 z-0 bg-dot-pattern opacity-[0.4] dark:opacity-[0.2]" />
            <div className="max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground drop-shadow-sm">
                        Introduction
                    </h1>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        Welcome to nativecn-ui. Beautiful, premium React Native components that you can copy and paste into your apps.
                        Accessible, customizable, and open source.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid sm:grid-cols-2 gap-6 mb-16"
                >
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Beautifully Designed</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Every component is crafted with attention to detail, using the latest design trends and smooth animations.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">GPU Accelerated</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Built with Reanimated and Skia for buttery smooth 60fps animations that feel completely native.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Copy & Paste</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            No npm installs for our core components. Just copy the code and paste it into your project. You own the code.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold mb-6">How to use</h2>
                    <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                        <ol className="space-y-4">
                            <li><strong>1. Find a component</strong> - Browse the sidebar to find the component you need.</li>
                            <li><strong>2. Review dependencies</strong> - Some components require packages like <code className="bg-muted px-1 py-0.5 rounded">react-native-reanimated</code>.</li>
                            <li><strong>3. Copy the code</strong> - Copy the source code provided in the component documentation.</li>
                            <li><strong>4. Paste into your app</strong> - Create a new file in your project and paste the code. Customize it as needed!</li>
                        </ol>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 rounded-3xl bg-muted/50 border border-border text-center"
                >
                    <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                    <p className="text-muted-foreground mb-6">Select a component from the sidebar to view its documentation and source code.</p>
                </motion.div>
            </div>
        </div>
    );
}
