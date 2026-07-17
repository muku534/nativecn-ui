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
                ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + subtitle on playground */}
                    <Link href="/" className="flex flex-col justify-center group">
                        <div className="flex items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-foreground transition-transform group-hover:scale-105 shrink-0">
                                <path d="M2 22 L8 2 L14 2 L22 22 L16 22 L11.43 10.57 L8 22 Z" fill="currentColor"/>
                                <path d="M16 2 L22 2 L22 19 L16 4 Z" fill="currentColor"/>
                            </svg>
                            <span className="font-bold text-xl text-foreground tracking-tight leading-none ml-[1px]">
                                ativecn-ui
                            </span>
                        </div>
                        {isStudioBuilder && (
                            <span className="text-[10px] text-muted-foreground leading-tight ml-[19px] mt-1">
                                Drag, configure, export - build screens visually
                            </span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-0.5">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors duration-150 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 ${pathname === item.href ? 'text-foreground font-medium' : ''
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isStudioBuilder && studio ? (
                            /* ─── Studio Controls ─── */
                            <>
                                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2.5 py-1.5 border border-border">
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
                                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${studio.showCode
                                        ? 'bg-muted text-foreground shadow-sm border border-border'
                                        : 'bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        }`}
                                >
                                    {studio.showCode ? '← Builder' : 'View Code →'}
                                </button>

                                {studio.hasNodes && (
                                    <button
                                        onClick={studio.onClearAll}
                                        className="px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        Clear
                                    </button>
                                )}
                            </>
                        ) : (
                            /* ─── Default: Get Started ─── */
                            <>
                                <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                                <Link
                                    href="/components"
                                    className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-lg font-medium text-sm transition-all duration-200 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)_inset] ring ring-white/20 ring-inset ring-offset-0 hover:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.4)_inset] hover:ring-white/40 active:scale-[0.98] dark:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)_inset] dark:ring-black/20 dark:hover:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.3)_inset] dark:hover:ring-black/50"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                                    className="block w-full px-4 py-3 bg-foreground text-background rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
                                >
                                    {studio.showCode ? '← Back to Builder' : 'View Code →'}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/components"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 bg-foreground text-background rounded-lg font-medium text-center mt-4 hover:opacity-90 transition-opacity"
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
