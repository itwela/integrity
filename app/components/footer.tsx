'use client'

import Link from 'next/link';
import { colors } from '../tokens/colors';

const IntegrityFooter = () => {
    const footerLinks = [
        { name: 'Landing', href: '/' },
        { name: 'Product', href: '#product-page-marker' },
        { name: 'How It Works', href: '#how-it-works-marker' },
        // { name: 'Listen', href: '/unlock' },
    ];

    return (
        <footer className="w-full bg-black border-t border-[#333] py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* Logo Section */}
                    <div className="flex flex-col">
                        <h2 
                            className="text-2xl select-none font-bold mb-2"
                            style={{ 
                                color: colors.primary,
                                fontFamily: 'boldMain'
                            }}
                        >
                            INTEGRITY
                        </h2>
                        <p 
                            className="text-xs select-none opacity-60"
                            style={{ 
                                color: colors.white,
                                fontFamily: 'main'
                            }}
                        >
                            New Album | Fragrance | Audiobook
                        </p>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex flex-col">
                        <h3 
                            className="text-sm select-none font-bold mb-4"
                            style={{ 
                                color: colors.primary,
                                fontFamily: 'boldMain'
                            }}
                        >
                            Pages
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {footerLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm select-none opacity-60 hover:opacity-100 transition-colors duration-200"
                                    style={{ 
                                        color: colors.white,
                                        fontFamily: 'main'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Copyright Section */}
                <div 
                    className="pt-8 mt-8 border-t select-none border-[#333] text-xs"
                    style={{ 
                        color: colors.primary,
                        fontFamily: 'main'
                    }}
                >
                    © Integrity - {new Date().getFullYear()} All Rights Reserved. Powered by Caveman Creative
                </div>
            </div>
        </footer>
    );
};

export default IntegrityFooter; 