'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Package, XCircle, CheckCircle, Clock, Bug, Search, Zap, Code2,
    FileCode, Copy, BookOpen, Users, Sparkles, Target, Rocket,
    MessageSquare, Star, Github, Twitter, Linkedin, MapPin, Heart,
    Calendar, TrendingUp, ArrowRight, Mail
} from 'lucide-react';
import { siteConfig } from '@/lib/constants';

// ============================================================================
// Section 1: Hero/Introduction
// ============================================================================
function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 mb-6">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium">The Story Behind ComponentHub</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-8"
                >
                    {/* Profile */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50" />
                            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-background">
                                MP
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hey, I'm Mukesh 👋</h1>
                            <p className="text-lg text-muted-foreground">React Native Developer from India</p>
                        </div>
                    </div>

                    {/* The Story */}
                    <div className="relative p-8 rounded-2xl bg-muted/30 border border-border">
                        <div className="absolute top-0 left-8 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                        <blockquote className="pl-8 space-y-6 text-lg md:text-xl leading-relaxed">
                            <p className="text-foreground">
                                I was building a production app and spent
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> 3 days </span>
                                perfecting a bottom sheet with drag gestures. Then I moved to the next screen and spent
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> 2 more days </span>
                                on an animated tab bar.
                            </p>
                            <p className="text-foreground">
                                I realized something: <span className="font-semibold">I was rebuilding the same components every developer rebuilds.</span>
                            </p>
                            <p className="text-muted-foreground">
                                That's when it hit me. We're all solving the same problems. Fighting the same bugs.
                                Optimizing the same animations. What if we could just... <span className="text-foreground font-medium">copy and paste solutions that actually work?</span>
                            </p>
                        </blockquote>
                    </div>

                    {/* The Answer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="p-8 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 text-center"
                    >
                        <p className="text-xl md:text-2xl font-semibold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ComponentHub</span> is my answer.
                        </p>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Every component here is extracted from real production apps.
                            These aren't toy examples or weekend projects. They're <span className="text-foreground font-medium">battle-tested solutions to real problems.</span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 2: The Problem
// ============================================================================
function TheProblem() {
    const painPoints = [
        { icon: Clock, text: 'Spending days on a "simple" animated component' },
        { icon: Bug, text: 'Fighting with Reanimated 2 syntax and gesture conflicts' },
        { icon: Search, text: 'Googling the same issues over and over' },
        { icon: XCircle, text: 'Finding examples that don\'t actually work in production' },
        { icon: Package, text: 'Installing 10 packages for one feature' },
    ];

    const badSolutions = [
        { label: 'NPM Packages', problem: 'Heavy, opinionated, version conflicts, abandoned projects' },
        { label: 'UI Libraries', problem: 'Lock you in, hard to customize, one-size-fits-none' },
        { label: 'Code Snippets', problem: 'Half-finished, no error handling, breaks in edge cases' },
        { label: 'AI-Generated Code', problem: 'Generic, doesn\'t handle React Native specifics, performance issues' },
    ];

    const goodSolutions = [
        'Production-ready code you can understand and modify',
        'Components that handle edge cases and platform differences',
        'Solutions that are proven in real apps with real users',
        'Zero vendor lock-in - you own the code completely',
    ];

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">The Problem with React Native Development</h2>
                    <p className="text-xl text-muted-foreground">We waste too much time rebuilding basics.</p>
                </motion.div>

                {/* Pain Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3 className="text-xl font-semibold mb-6 text-center">Every React Native developer knows this pain:</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {painPoints.map((point, index) => {
                            const Icon = point.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border"
                                >
                                    <Icon className="w-5 h-5 text-red-500 shrink-0" />
                                    <span className="text-sm">{point.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Solutions Comparison */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Bad Solutions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-red-500">❌ Current solutions aren't good enough:</h3>
                        <div className="space-y-4">
                            {badSolutions.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.problem}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Good Solutions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-green-500">✅ What developers actually need:</h3>
                        <div className="space-y-4">
                            {goodSolutions.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 3: The Journey
// ============================================================================
function TheJourney() {
    const lessons = [
        'The bug where the bottom sheet broke on Android 13',
        'The performance issue with the skeleton loader on low-end devices',
        'The gesture conflict between the tab bar and scroll view',
        'The haptic feedback that makes everything feel premium',
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How ComponentHub Started</h2>
                    <p className="text-xl text-muted-foreground">From Frustration to Solution</p>
                </motion.div>

                <div className="space-y-12">
                    {/* Origin Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-lg leading-relaxed"
                    >
                        <p className="text-muted-foreground">
                            ComponentHub didn't start as a business idea. It started as a folder on my computer labeled
                            <code className="px-2 py-1 rounded bg-muted text-foreground mx-1">reusable-components</code>.
                        </p>
                        <p className="text-muted-foreground">
                            While building production apps over the years,
                            I found myself copying components between projects. A bottom sheet here. A tab bar there.
                            Each time, I'd tweak them, fix bugs, add features.
                        </p>
                        <p className="text-muted-foreground">
                            After the 10th time copying the same range slider, I thought:
                            <span className="text-foreground font-medium italic"> "Other developers must be doing this too. What if I just... shared these?"</span>
                        </p>
                    </motion.div>

                    {/* The Realization */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                    >
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            The Realization
                        </h3>
                        <p className="text-lg text-muted-foreground mb-4">
                            These components weren't just code - they were <span className="text-foreground font-medium">lessons learned</span>:
                        </p>
                        <ul className="space-y-2">
                            {lessons.map((lesson, index) => (
                                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                    {lesson}
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-4 italic">
                            These aren't things you find in tutorials. They're the details you only discover after
                            shipping to production and getting user feedback.
                        </p>
                    </motion.div>

                    {/* Quote */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="relative p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
                        <p className="relative text-2xl md:text-3xl font-bold">
                            "I'm not selling you a product. I'm sharing what actually works."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 4: Why Free
// ============================================================================
function WhyFree() {
    const freeForever = [
        'All basic UI components (9 components and growing)',
        'Documentation and guides',
        'Community support',
    ];

    const futurePremium = [
        'Advanced screen templates (auth flows, onboarding sequences)',
        'Figma design system',
        'Video tutorials and courses',
        'Priority feature requests',
    ];

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Free? Why Now?</h2>
                    <p className="text-xl text-muted-foreground">Building in Public, Growing Together</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                        ComponentHub starts free because I believe in the React Native community.
                        We share knowledge on Twitter. We help each other on Discord. We contribute to open source.
                        <span className="text-foreground font-medium"> This is my contribution.</span>
                    </p>

                    {/* Pricing Comparison */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Free Forever */}
                        <div className="p-6 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <h3 className="text-lg font-semibold">Free Forever</h3>
                            </div>
                            <ul className="space-y-3">
                                {freeForever.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Future Premium */}
                        <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                                <h3 className="text-lg font-semibold">Premium (6-12 months)</h3>
                            </div>
                            <ul className="space-y-3">
                                {futurePremium.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                        <div className="w-4 h-4 rounded-full border border-purple-500/50 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* The Deal */}
                    <div className="p-8 rounded-2xl bg-background border border-border text-center">
                        <h3 className="text-xl font-semibold mb-4">The Deal</h3>
                        <p className="text-muted-foreground mb-6">
                            Right now, I'm asking for your time, not your money:
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">Try these components</span>
                            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">Give me feedback</span>
                            <span className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium">Tell me what you need</span>
                            <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">Share if they helped</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 italic">
                            If ComponentHub saves you even 2 hours, that's worth it.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 5: What's Different
// ============================================================================
function WhyDifferent() {
    const differentiators = [
        {
            icon: Target,
            title: 'Production-Tested, Not Tutorial Code',
            description: 'Every component is extracted from real production apps. These aren\'t "what if" examples - they\'re "what works" solutions.',
        },
        {
            icon: Zap,
            title: 'Performance First',
            description: '60fps animations, optimized re-renders, minimal bundle size. Because your users don\'t care about your code - they care about how it feels.',
        },
        {
            icon: Code2,
            title: 'Own Your Code',
            description: 'No npm package. No version conflicts. No waiting for maintainers to fix bugs. Copy it, customize it, make it yours.',
        },
        {
            icon: BookOpen,
            title: 'Properly Documented',
            description: 'Full TypeScript definitions, prop documentation, usage examples, customization guides, and dependencies clearly listed.',
        },
        {
            icon: Users,
            title: 'Community-Driven',
            description: 'Built by a developer, for developers. Your feedback shapes the roadmap. Your needs determine what gets built next.',
        },
        {
            icon: Sparkles,
            title: 'AI Era Ready',
            description: 'While AI generates generic code, ComponentHub provides the proven solutions you can trust. Use AI to customize these components, not build from scratch.',
        },
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ComponentHub Stands Out</h2>
                    <p className="text-xl text-muted-foreground">Not Just Another Component Library</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {differentiators.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-blue-500/50 transition-all duration-300"
                            >
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 w-fit mb-4">
                                    <Icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 6: About Creator
// ============================================================================
function AboutCreator() {
    const projects = [
        { icon: Rocket, label: 'Mobile Apps', description: 'Building production React Native apps' },
        { icon: Code2, label: 'ComponentHub', description: 'This platform you\'re on' },
        { icon: Github, label: 'Open Source', description: 'Contributing to React Native ecosystem' },
        { icon: Twitter, label: 'Twitter', description: 'Sharing daily learnings and builds' },
    ];

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Built by Mukesh Prajapati</h2>
                    <p className="text-xl text-muted-foreground">Developer, Designer, Problem Solver</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    {/* Bio */}
                    <div className="p-8 rounded-2xl bg-background border border-border">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                MP
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold">Mukesh Prajapati</h3>
                                <p className="text-blue-500 font-medium">React Native Developer</p>
                                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                                    <MapPin className="w-4 h-4" />
                                    India
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Hey! I'm Mukesh, a React Native developer who's been building mobile apps for 2+ years.
                            I'm passionate about creating delightful mobile experiences with smooth animations and intuitive UIs.
                            I believe the best way to learn is to share. ComponentHub is
                            my experiment in documenting what I learn and building a community of makers.
                        </p>
                    </div>

                    {/* What I'm Working On */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">What I'm Working On</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {projects.map((project) => {
                                const Icon = project.icon;
                                return (
                                    <div
                                        key={project.label}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border"
                                    >
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                                            <Icon className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{project.label}</p>
                                            <p className="text-sm text-muted-foreground">{project.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4">
                        <a
                            href={siteConfig.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-background border border-border hover:border-blue-500/50 transition-all duration-200"
                        >
                            <Github className="w-6 h-6" />
                        </a>
                        <a
                            href={siteConfig.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-background border border-border hover:border-blue-500/50 transition-all duration-200"
                        >
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a
                            href={siteConfig.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-background border border-border hover:border-blue-500/50 transition-all duration-200"
                        >
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 7: Roadmap
// ============================================================================
function Roadmap() {
    const phases = [
        {
            title: 'Month 1-3',
            label: 'Current Phase',
            status: 'current',
            items: [
                { done: true, text: 'Launch website with 9 core components' },
                { done: true, text: 'Complete documentation for all components' },
                { done: false, text: 'Gather feedback from first 1,000 users' },
                { done: false, text: 'Add 5 more community-requested components' },
            ],
        },
        {
            title: 'Month 4-6',
            label: 'Coming Soon',
            status: 'upcoming',
            items: [
                { done: false, text: 'Add advanced components (date range picker, charts)' },
                { done: false, text: 'Create video tutorials for each component' },
                { done: false, text: 'Build Figma design system' },
                { done: false, text: 'Reach 5,000 monthly active users' },
            ],
        },
        {
            title: 'Month 7-12',
            label: 'Future',
            status: 'future',
            items: [
                { done: false, text: 'Launch premium tier (screen templates)' },
                { done: false, text: 'Create React Native course' },
                { done: false, text: 'Open source contribution guidelines' },
                { done: false, text: 'Community showcase page' },
            ],
        },
    ];

    const helpItems = [
        { icon: MessageSquare, label: 'Share', description: 'If ComponentHub helps you, tell other devs' },
        { icon: MessageSquare, label: 'Feedback', description: 'Tell me what components you need' },
        { icon: Bug, label: 'Report Issues', description: 'Found a bug? Let me know' },
        { icon: Star, label: 'Star on GitHub', description: 'Help others discover this' },
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Next</h2>
                    <p className="text-xl text-muted-foreground">Building in Public - Here's the Plan</p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-6 mb-16"
                >
                    {phases.map((phase, index) => (
                        <div
                            key={phase.title}
                            className={`p-6 rounded-2xl border ${phase.status === 'current'
                                ? 'bg-blue-500/5 border-blue-500/30'
                                : 'bg-muted/30 border-border'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">{phase.title}</h3>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${phase.status === 'current'
                                        ? 'bg-blue-500/20 text-blue-500'
                                        : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {phase.label}
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {phase.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                                        {item.done ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0 mt-0.5" />
                                        )}
                                        <span className={item.done ? 'text-muted-foreground line-through' : ''}>
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </motion.div>

                {/* How You Can Help */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20"
                >
                    <h3 className="text-xl font-semibold mb-6 text-center">How You Can Help</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {helpItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="text-center p-4">
                                    <div className="p-3 rounded-xl bg-background border border-border w-fit mx-auto mb-3">
                                        <Icon className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="font-medium mb-1">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================================
// Section 8: Final CTA
// ============================================================================
function FinalCTA() {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Journey</h2>
                    <p className="text-xl text-muted-foreground mb-4">Let's Build Better Apps, Together</p>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        ComponentHub is just getting started. Every component added, every bug fixed,
                        every piece of feedback makes it better. This isn't a solo project - it's a community effort.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/components"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
                        >
                            Browse Components
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/docs"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border rounded-xl font-semibold hover:bg-muted transition-all duration-300"
                        >
                            <BookOpen className="w-5 h-5" />
                            Read Documentation
                        </Link>
                    </div>

                    {/* Contact */}
                    <div className="p-6 rounded-2xl bg-background border border-border inline-block">
                        <p className="text-muted-foreground mb-4">
                            Questions? Feedback? Just want to chat?
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href={siteConfig.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                                DM on Twitter
                            </a>
                            <a
                                href={siteConfig.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                Open an Issue
                            </a>
                        </div>
                    </div>

                    {/* Sign-off */}
                    <p className="mt-12 text-lg">
                        Let's ship something amazing. 🚀
                    </p>
                    <p className="text-muted-foreground mt-2">
                        – Mukesh
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================================
// Main About Page
// ============================================================================
export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <TheProblem />
            <TheJourney />
            <WhyFree />
            <WhyDifferent />
            <AboutCreator />
            <FinalCTA />
        </div>
    );
}
