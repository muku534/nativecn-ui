import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';
import { footerLinks, siteConfig } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 dark:border-white/10 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center group mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-foreground transition-transform group-hover:scale-105 shrink-0">
                                <path d="M2 22 L8 2 L14 2 L22 22 L16 22 L11.43 10.57 L8 22 Z" fill="currentColor"/>
                                <path d="M16 2 L22 2 L22 19 L16 4 Z" fill="currentColor"/>
                            </svg>
                            <span className="font-bold text-xl text-foreground tracking-tight leading-none ml-[1px]">
                                ativecn-ui
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                            {siteConfig.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href={siteConfig.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-foreground transition-colors duration-200"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href={siteConfig.socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-foreground transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href={siteConfig.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-foreground transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href={siteConfig.socials.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-foreground transition-colors duration-200"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a
                                href={siteConfig.socials.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-foreground transition-colors duration-200"
                                aria-label="Portfolio"
                            >
                                <Globe className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-400">
                        &copy; {new Date().getFullYear()} nativecn-ui. All rights reserved.
                    </p>
                    <p className="text-sm text-neutral-400">
                        Built for React Native developers
                    </p>
                </div>
            </div>
        </footer>
    );
}
