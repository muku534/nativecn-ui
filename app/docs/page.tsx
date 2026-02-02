'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Book, Rocket, Settings, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { components } from '@/lib/components-data';
import { useState } from 'react';

const quickLinks = [
    {
        icon: Rocket,
        title: 'Getting Started',
        description: 'Set up ComponentHub in your project in minutes.',
        href: '/docs/getting-started',
    },
    {
        icon: Book,
        title: 'Installation',
        description: 'Learn how to install and configure components.',
        href: '/docs/installation',
    },
    {
        icon: Settings,
        title: 'Customization',
        description: 'Customize components to match your design system.',
        href: '/docs/customization',
    },
];

// Group components by category
const componentsByCategory = components.reduce((acc, component) => {
    if (!acc[component.category]) {
        acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
}, {} as Record<string, typeof components>);

export default function DocsPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (component: typeof components[0]) => {
        await navigator.clipboard.writeText(component.codePreview);
        setCopiedId(component.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-sm mb-4">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    Documentation
                </div>
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ComponentHub
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Learn how to use our premium React Native components to build beautiful mobile apps.
                </p>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 mb-12">
                {quickLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                        <motion.div
                            key={link.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted transition-all duration-200"
                            >
                                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-border">
                                    <Icon className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1">{link.title}</h3>
                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Components Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-3xl">📦</span>
                    All Components
                    <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {components.length}
                    </span>
                </h2>

                {/* Components by Category */}
                {Object.entries(componentsByCategory).map(([category, categoryComponents]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-muted-foreground">{category}</h3>
                        <div className="space-y-3">
                            {categoryComponents.map((component, index) => (
                                <motion.div
                                    key={component.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-all"
                                >
                                    {/* Emoji Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${component.gradient} flex items-center justify-center text-2xl shadow-md`}>
                                        {component.emoji}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/components/${component.id}`}>
                                            <h4 className="font-semibold hover:text-blue-500 transition-colors cursor-pointer">
                                                {component.name}
                                            </h4>
                                        </Link>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {component.description}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        {component.dependencies.required.length === 0 ? (
                                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-medium">
                                                Zero deps
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                                                {component.dependencies.required.length} deps
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-muted rounded-md text-xs">
                                            v{component.version}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopy(component)}
                                            className="p-2 rounded-lg bg-muted hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all"
                                            title="Copy code"
                                        >
                                            {copiedId === component.id ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/components/${component.id}`}
                                            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all"
                                            title="View details"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Overview */}
            <section className="prose prose-neutral dark:prose-invert max-w-none">
                <h2>Overview</h2>
                <p>
                    ComponentHub is a collection of premium React Native UI components designed for
                    developers who want full control over their code. Unlike traditional component
                    libraries, we use a copy-paste approach – you copy the components into your
                    project and customize them to your needs.
                </p>

                <h3>Why ComponentHub?</h3>
                <ul>
                    <li><strong>Zero Dependencies</strong> – No external runtime packages to manage</li>
                    <li><strong>Full Ownership</strong> – The code is yours to modify and extend</li>
                    <li><strong>TypeScript First</strong> – Complete type definitions for everything</li>
                    <li><strong>Production Ready</strong> – Battle-tested in real applications</li>
                </ul>

                <h3>How It Works</h3>
                <ol>
                    <li>Browse our collection of components</li>
                    <li>Copy the component code to your clipboard</li>
                    <li>Paste it into your project</li>
                    <li>Customize the styling and behavior</li>
                </ol>

                <p>
                    Ready to get started?{' '}
                    <Link href="/docs/getting-started" className="text-blue-500 hover:underline">
                        Follow our getting started guide →
                    </Link>
                </p>
            </section>
        </motion.div>
    );
}
