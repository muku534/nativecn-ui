'use client';

import { motion } from 'framer-motion';
import { Search, Copy, Rocket } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Browse',
        description: 'Explore our collection of premium React Native components.',
        icon: Search,
    },
    {
        number: '02',
        title: 'Copy',
        description: 'Select a component and copy the code to your clipboard.',
        icon: Copy,
    },
    {
        number: '03',
        title: 'Ship',
        description: 'Paste into your project and customize to your needs.',
        icon: Rocket,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        How It{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Works
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Get started in seconds, not hours. No installations, no configurations.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
                    {/* Connector line - equal spacing on both sides */}
                    <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5">
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-50 rounded-full" />
                    </div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="text-center">
                                    {/* Step number with icon */}
                                    <div className="relative inline-flex mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30" />
                                        <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        {/* Step number badge */}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-background border-2 border-border rounded-full text-sm font-bold">
                                            {step.number}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
