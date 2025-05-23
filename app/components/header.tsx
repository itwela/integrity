'use client'

import { colors } from "../tokens/colors"
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

interface IntegrityHeaderProps {
    showHeader: boolean;
}

export default function IntegrityHeader({ showHeader }: IntegrityHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const styles = {
        headerLogoText: {
            fontWeight: 'bold',
            fontFamily: 'boldMain',
            color: colors.primary,
        },
        headerItemText: {
            fontWeight: 'bold',
            color: colors.primary,
        },
        headerItemContainer: {
            display: 'flex',
            flexDirection: 'row' as const,
            gap: '10px',
            border: '1px solid #977B49',
            padding: '10px 20px',
        }
    }

    const headerItems = [
        {
            text: 'Buy Now',
            link: '#product-page-marker'
        },
        {
            text: 'How It Works',
            link: '#how-it-works-marker'
        },
        {
            text: 'Listen',
            link: '/unlock'
        }
    ]

    return (
        <div className="z-10 px-6 lg:px-[10%] fixed top-0 left-0 w-full flex flex-row justify-between items-center p-6">

            {/* NOTE - SMALL BLACK FADED DIV FROM TOP OF PAGE */}
            <div className="absolute top-0 left-0 w-full select-none h-[155%] bg-gradient-to-b from-black via-transparent to-transparent z-[-1]"></div>

            <a href="/">
                <motion.h1
                    className="lg:text-[1rem] sm:text-[1.5rem] text-[1rem] cursor-pointer"
                    style={styles.headerLogoText}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                    INTEGRITY
                </motion.h1>
            </a>

            {showHeader && (
                <div className="hidden sm:flex">
                    <motion.div style={styles.headerItemContainer} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                        {headerItems.map((item, index) => (
                            <motion.a
                                className="cursor-pointer"
                                href={item.link}
                                key={index} style={styles.headerItemText} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration2, delay: animationTokens.duration2 / headerItems.length + index * 0.1 }}>{item.text}</motion.a>
                        ))}
                    </motion.div>
                </div>
            )}

            {showHeader && (
                <motion.div className="sm:hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                    <FaBars style={{ color: colors.primary, fontSize: '1.5rem' }} className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
                    {menuOpen && (
                        <motion.div style={{ backgroundColor: colors.primary }} className="absolute top-full right-0 mt-2 shadow-lg rounded-md w-[200px]" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                            {headerItems.map((item, index) => (
                                <motion.a
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 + index * 0.1 }}
                                    className="block px-4 py-2 text-white select-none cursor-pointer"
                                    href={item.link}
                                    key={index}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.text}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}

        </div>
    )
}