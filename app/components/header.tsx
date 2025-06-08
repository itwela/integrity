'use client'

import { colors } from "../tokens/colors"
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

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
            gap: '20px',
            border: '1px solid #977B49',
            padding: '10px 20px',
        }
    }

    const headerItems = [
        {
            text: 'Purchase',
            link: '#product-page-marker'
        },
        {
            text: 'How It Works',
            link: '#how-it-works-marker'
        },
        // {
        //     text: 'Listen',
        //     link: '/unlock'
        // }
    ]

    return (
        <div className="z-10 px-6 lg:px-[10%] fixed top-0 left-0 w-full flex flex-row justify-between items-center p-6">

            {/* NOTE - SMALL BLACK FADED DIV FROM TOP OF PAGE */}
            <div className="absolute top-0 left-0 w-full select-none h-[155%] bg-gradient-to-b from-black via-transparent to-transparent z-[-1]"></div>

            <Link href="/">
                <motion.h1
                    className="
                    lg:text-[1rem] 
                    sm:text-[0.80rem] 
                    text-[1.60rem]
                    cursor-pointer"
                    style={styles.headerLogoText}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                    INTEGRITY
                </motion.h1>
            </Link>

            {showHeader && (
                <div className="hidden sm:flex">
                    <motion.div className="rounded-lg" style={styles.headerItemContainer} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                        {headerItems.map((item, index) => (
                            <Link href={item.link} key={index}>
                            <motion.p
                                className="
                                lg:text-[0.75rem] 
                                sm:text-[0.65rem] 
                                text-[0.55rem]
                                cursor-pointer"
                                key={index} style={styles.headerItemText} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration2, delay: animationTokens.duration2 / headerItems.length + index * 0.1 }}>{item.text}</motion.p>
                                </Link>
                        ))}
                    </motion.div>
                </div>
            )}

            {showHeader && (
                <motion.div className="sm:hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                    <FaBars style={{ color: colors.primary, fontSize: '1.5rem' }} className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
                    {menuOpen && (
                        <motion.div style={{ backgroundColor: colors.primary }} className="absolute top-full w-full h-[150px] justify-between flex flex-col right-0 mt-2 shadow-lg rounded-md w-[200px]" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                            {headerItems.map((item, index) => (
                                <motion.a
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 + index * 0.1 }}
                                    className="
                                    text-[1rem] 
                                    block px-4 py-2 text-white select-none cursor-pointer
                                    "
                                    href={item.link}
                                    key={index}
                                    style={{fontFamily: 'boldMain'}}
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