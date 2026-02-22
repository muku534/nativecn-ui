'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Box, Code2, LayoutTemplate, Sparkles, Wand2 } from 'lucide-react';
import { trackStudioLandingView } from '@/lib/analytics';

export default function StudioLandingClient() {
    useEffect(() => {
        trackStudioLandingView();
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ y: [0, 50, 0], scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24"
            >
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        Introducing Form Studio
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Build native screens<br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            at the speed of thought.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                        Stop wrestling with boilerplate. Drag and drop premium native components into a realistic device mockup, configure properties, and export production-ready JSX instantly.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/studio/builder"
                            className="group flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] active:scale-95 w-full sm:w-auto"
                        >
                            Open Studio Builder
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/components"
                            className="flex items-center justify-center px-8 py-4 bg-muted/50 text-foreground border border-border rounded-full font-semibold text-lg hover:bg-muted transition-colors w-full sm:w-auto backdrop-blur-sm"
                        >
                            Browse Components
                        </Link>
                    </motion.div>
                </div>

                {/* Animated Demo GIF/Webp Section */}
                <motion.div variants={itemVariants} className="mb-32">
                    <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl">
                        {/* Browser simulated header */}
                        <div className="bg-muted/30 border-b border-border/50 px-4 py-3 flex items-center gap-2 backdrop-blur-md">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
                            </div>
                            <div className="mx-auto bg-background/50 text-muted-foreground text-xs px-3 py-1.5 rounded-md font-mono flex items-center gap-2">
                                <Wand2 className="w-3 h-3" /> nativecn-ui / studio
                            </div>
                        </div>

                        {/* Demo Media */}
                        <div className="relative aspect-video w-full bg-muted/20 flex items-center justify-center group overflow-hidden">
                            <video
                                src="/studio-demo.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover md:object-contain transform transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            {/* Stylish overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative group rounded-3xl border border-border/50 bg-card/50 p-8 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                    <feature.icon className="w-7 h-7 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action Footer Note */}
                <motion.div variants={itemVariants} className="text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/50 backdrop-blur-sm shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-sm font-medium text-foreground">
                            Studio saves your designs locally. Cloud syncing coming soon.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

const features = [
    {
        title: 'Drag & Drop Canvas',
        description: 'Access a curated palette of premium inputs, buttons, layout blocks, and interactive elements. Just drag them where you need them.',
        icon: LayoutTemplate,
    },
    {
        title: 'Instant JSX Export',
        description: 'Export clean, robust React Native code wrapped in standard SafeArea and KeyboardAvoiding configurations with a single click.',
        icon: Code2,
    },
    {
        title: 'Live Device Visualizer',
        description: 'See exactly how components look before running a simulator. Switch between iOS and Android form factors instantly.',
        icon: Box,
    },
];
