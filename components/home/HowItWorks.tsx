'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Browse',
        description: 'Explore our collection of premium React Native components built for production.',
    },
    {
        number: '02',
        title: 'Copy',
        description: 'Select a component and copy the source code directly to your clipboard.',
    },
    {
        number: '03',
        title: 'Ship',
        description: 'Paste into your project, customize to match your brand, and deploy.',
    },
];

export default function HowItWorks() {
    return (
        <section className="relative py-32 px-4 bg-transparent border-t border-dashed border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 opacity-50 blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6 text-neutral-900 dark:text-neutral-50 leading-[1.1]">
                        No npm install.<br />
                        <span className="inline-block bg-primary text-primary-foreground px-4 py-1 -rotate-1 mt-3 shadow-lg">No vendor lock-in.</span>
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-xl mx-auto tracking-wide">
                        We provide the raw source code. You own it completely.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group p-8 rounded-3xl bg-white dark:bg-zinc-900/50 border border-neutral-200 dark:border-white/10 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                                {step.number}
                            </div>
                            <h3 className="text-2xl font-bold mt-4 mb-3 text-neutral-900 dark:text-neutral-100 tracking-tight">{step.title}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
