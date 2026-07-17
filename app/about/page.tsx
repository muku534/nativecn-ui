'use client';

import { motion } from 'framer-motion';
import {
    XCircle, CheckCircle, Shield, Zap, LayoutTemplate
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background relative">
            <div className="absolute inset-0 z-0 bg-dot-pattern opacity-[0.4] dark:opacity-[0.2]" />

            <div className="max-w-4xl mx-auto relative z-10 space-y-32">
                {/* Hero Section */}
                <section className="text-center pt-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
                    >
                        Elevating the standard of <br className="hidden md:block" />
                        <span className="text-muted-foreground">React Native UI.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground font-light leading-relaxed max-w-2xl text-left md:text-center"
                    >
                        <p>
                            We recognized a persistent gap in the React Native ecosystem. Developers spend countless hours rebuilding foundational components-wrestling with gesture handlers, fighting animation performance, and struggling to achieve fluid, native-feeling interactions across platforms.
                        </p>
                        <p className="mt-4">
                            <strong>nativecn-ui</strong> was created to solve this. It is a meticulously crafted collection of production-ready components designed to give developers absolute control, zero vendor lock-in, and uncompromising aesthetic quality out of the box.
                        </p>
                    </motion.div>
                </section>

                {/* The Problem & Solution */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight mb-4">The Fragmentation Problem</h2>
                        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                            The current landscape of mobile UI solutions forces developers to compromise.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* The Old Way */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="p-8 rounded-[24px] bg-red-500/5 border border-red-500/10 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
                                <XCircle className="w-5 h-5" />
                                The Old Paradigm
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'Heavy UX packages with tight vendor lock-in',
                                    'Bloated dependencies causing version conflicts',
                                    'Generic snippets that fail in production edge cases',
                                    'Inflexible styling architectures',
                                    'Subpar animation performance on low-end devices'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                                        <div className="w-1 h-1 rounded-full bg-red-500/50 mt-2 shrink-0" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* The nativecn-ui Way */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="p-8 rounded-[24px] bg-emerald-500/5 border border-emerald-500/10 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold mb-6 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                The nativecn-ui Paradigm
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'Copy-paste ownership. You own the code completely.',
                                    'Zero hidden dependencies.',
                                    'Battle-tested in real production environments',
                                    'Fully customizable via standard React Native styles',
                                    'Silky smooth 60fps animations via Reanimated'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-foreground text-sm">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* Core Principles */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Core Principles</h2>
                        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                            Every component is engineered around three non-negotiable pillars.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: 'Absolute Ownership',
                                desc: 'We do not distribute opaque packages. You inherit the raw source code. It lives in your repository, maintained by your team.'
                            },
                            {
                                icon: Zap,
                                title: 'Uncompromising Performance',
                                desc: 'Every micro-interaction and layout shift is profiled to ensure flawless 60fps execution on all devices.'
                            },
                            {
                                icon: LayoutTemplate,
                                title: 'Aesthetic Excellence',
                                desc: 'Our components embody modern design language-subtle spacing, crisp typography, and fluid natural motion.'
                            }
                        ].map((principle, index) => {
                            const Icon = principle.icon;
                            return (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 rounded-[24px] bg-card border border-border/40 hover:border-border/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
                                >
                                    <div className="w-12 h-12 rounded-[14px] bg-muted/60 flex items-center justify-center text-foreground mb-6 border border-border/40">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 tracking-tight">{principle.title}</h3>
                                    <p className="text-muted-foreground font-light text-sm leading-relaxed">{principle.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
