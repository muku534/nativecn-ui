'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { navigation } from '@/lib/constants';
import { useStudio } from '@/lib/studio/context';
import { trackStudioCodeView } from '@/lib/analytics';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const studio = useStudio();

    const isStudioBuilder = pathname === '/studio/builder';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + subtitle on playground */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo-v1.png"
                                alt="nativecn-ui logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                                nativecn-ui
                            </span>
                            {isStudioBuilder && (
                                <span className="text-[10px] text-muted-foreground leading-tight -mt-0.5">
                                    Drag, configure, export — build screens visually
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted/50 ${pathname === item.href ? 'text-foreground bg-muted/50' : ''
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        <ThemeToggle />

                        {isStudioBuilder && studio ? (
                            /* ─── Studio Controls ─── */
                            <>
                                <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2.5 py-1.5 border border-border/50">
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Screen</span>
                                    <input
                                        type="text"
                                        value={studio.screenName}
                                        onChange={(e) => studio.setScreenName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                                        className="bg-transparent text-sm font-mono font-semibold w-24 focus:outline-none text-foreground"
                                        placeholder="ScreenName"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const newState = !studio.showCode;
                                        studio.setShowCode(newState);
                                        if (newState) trackStudioCodeView();
                                    }}
                                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${studio.showCode
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                        }`}
                                >
                                    {studio.showCode ? '← Builder' : 'View Code →'}
                                </button>

                                {studio.hasNodes && (
                                    <button
                                        onClick={studio.onClearAll}
                                        className="px-3 py-2 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                                    >
                                        Clear
                                    </button>
                                )}
                            </>
                        ) : (
                            /* ─── Default: Get Started ─── */
                            <Link
                                href="/components"
                                className="relative group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <Menu
                                    className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                                        }`}
                                />
                                <X
                                    className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="bg-background/95 backdrop-blur-xl border-t border-border">
                    <div className="px-4 py-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {isStudioBuilder && studio ? (
                            <div className="pt-2 space-y-2">
                                <button
                                    onClick={() => {
                                        const newState = !studio.showCode;
                                        studio.setShowCode(newState);
                                        if (newState) trackStudioCodeView();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center"
                                >
                                    {studio.showCode ? '← Back to Builder' : 'View Code →'}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/components"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center mt-4"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
