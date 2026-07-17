'use client';

import { motion, useAnimation } from 'framer-motion';
import { CreditCard, Moon, Sun, Zap, LayoutTemplate, Activity, Fingerprint } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Features() {
    return (
        <section className="py-32 px-4 relative overflow-hidden bg-white dark:bg-black">
            
            {/* The Blueprint Canvas Grid */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mb-24 text-center mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6 text-neutral-900 dark:text-neutral-50 leading-[1.05]">
                        Ship mobile apps at <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-800 dark:from-neutral-300 dark:to-neutral-500">lightning speed.</span>
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl px-4 tracking-wide leading-relaxed">
                        A curated collection of highly customizable React Native components. Built with best practices to accelerate your mobile development workflow.
                    </p>
                </motion.div>

                {/* Highly Visual Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Card 1: Animations (Span 2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="col-span-1 lg:col-span-2 relative group overflow-hidden bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 hover:shadow-2xl transition-all duration-300 min-h-[400px]"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-40 h-40 text-primary" />
                        </div>
                        
                        <div className="relative z-20 max-w-sm mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-sm font-medium mb-6 shadow-sm">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Silky Smooth Animations
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-white">Fluid like water.</h3>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                Stop wrestling with complex Reanimated configs. Our components come with perfectly tuned physics-based animations out of the box.
                            </p>
                        </div>

                        {/* Interactive UI Showcase: Draggable Physics Card */}
                        <div className="absolute -bottom-8 right-8 md:right-24 md:-bottom-12 w-[280px] h-[340px] perspective-[1200px]">
                            <motion.div
                                drag
                                dragConstraints={{ top: 0, left: -50, right: 50, bottom: 0 }}
                                dragElastic={0.2}
                                whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                                className="w-full h-full bg-white dark:bg-black rounded-3xl border border-neutral-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 cursor-grab relative z-30"
                            >
                                <div className="w-full h-32 bg-neutral-100 dark:bg-neutral-900 rounded-2xl mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                                </div>
                                <div className="h-4 w-2/3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-3" />
                                <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6" />
                                <div className="flex gap-2">
                                    <div className="h-10 flex-1 bg-primary text-primary-foreground flex items-center justify-center rounded-xl text-sm font-bold shadow-sm">Follow</div>
                                    <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center rounded-xl"><Fingerprint className="w-5 h-5 text-neutral-500" /></div>
                                </div>
                                <p className="text-[10px] text-neutral-400 text-center mt-4 uppercase tracking-widest font-mono">Try Dragging Me</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Card 2: Dark Mode First (Span 1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="col-span-1 relative group overflow-hidden bg-neutral-900 text-white border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col justify-between"
                    >
                        <div className="relative z-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
                                <Moon className="w-4 h-4 text-blue-400" />
                                Built for the night
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4">Dark mode first.</h3>
                            <p className="text-neutral-400">
                                Every single component is meticulously designed to look stunning in both light and dark environments automatically.
                            </p>
                        </div>

                        {/* Interactive UI Showcase: Theme Toggle Mockup */}
                        <div className="w-full h-32 mt-8 rounded-2xl bg-black border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-white/20 transition-colors">
                             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
                             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                <Sun className="w-8 h-8 text-neutral-300 opacity-50 group-hover:opacity-0 absolute transition-opacity duration-500" />
                                <Moon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 absolute transition-opacity duration-500 rotate-90 group-hover:rotate-0" />
                             </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Form Elements (Span 1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="col-span-1 relative group overflow-hidden bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 hover:shadow-2xl transition-all duration-300 min-h-[400px]"
                    >
                         <div className="relative z-20 mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-sm font-medium mb-6 shadow-sm">
                                <LayoutTemplate className="w-4 h-4 text-emerald-500" />
                                Accessible Inputs
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-white">Form & Function.</h3>
                        </div>
                        
                        {/* Interactive UI Showcase: Animated Input Fields */}
                        <div className="space-y-4">
                            <div className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-4 flex items-center shadow-sm group-hover:border-emerald-500/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse" />
                                <div className="h-2 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                            </div>
                            <div className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-4 flex items-center shadow-sm relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                                <div className="h-2 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-full ml-2" />
                            </div>
                             <div className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-4 flex items-center shadow-sm opacity-50">
                                <div className="h-2 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded-full ml-2" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4: Production Ready (Span 2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="col-span-1 lg:col-span-2 relative group overflow-hidden bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col md:flex-row items-center gap-8"
                    >
                        
                        <div className="relative z-20 flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-sm font-medium mb-6 shadow-sm">
                                <CreditCard className="w-4 h-4 text-indigo-500" />
                                Production Ready
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-white">Complex layouts, simplified.</h3>
                            <p className="text-neutral-500 dark:text-neutral-400">
                                Don't start from a blank canvas. Drop in complete, complex UI patterns like digital wallets, settings menus, and social feeds in seconds.
                            </p>
                        </div>

                        {/* Interactive UI Showcase: Digital Wallet Card Replica */}
                        <div className="flex-1 w-full flex justify-end perspective-[1000px]">
                             <motion.div 
                                whileHover={{ rotateY: -10, rotateX: 10, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-full max-w-[300px] h-[200px] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/20 transform-style-3d cursor-pointer bg-gradient-to-br from-neutral-900 to-black"
                             >
                                 {/* Card Glass Glare */}
                                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 
                                 <div className="flex justify-between items-start relative z-10">
                                     <div className="w-10 h-8 rounded-md bg-white/20 backdrop-blur-md" />
                                     <div className="text-white/50 text-xs font-mono tracking-widest">NATIVECN</div>
                                 </div>

                                 <div className="relative z-10">
                                     <div className="text-white/70 text-xs mb-1">Total Balance</div>
                                     <div className="text-3xl font-bold text-white tracking-tight">$12,450.00</div>
                                 </div>

                                 <div className="flex gap-1 relative z-10">
                                     {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/30" />)}
                                     <div className="w-4" />
                                     <div className="text-white text-xs font-mono tracking-widest">3421</div>
                                 </div>
                             </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
