'use client'

import { colors } from "../tokens/colors"
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens";

export default function IntegrityHeader() {

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
        }
    ]

    return (
        <div className="z-10 fixed top-0 left-0 w-full flex flex-row justify-between items-center p-4">
            <motion.h1 
            className="lg:text-[1rem] text-[1.5rem] cursor-pointer"
            style={styles.headerLogoText} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>INTEGRITY</motion.h1>

            <motion.div style={styles.headerItemContainer} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}>
                {headerItems.map((item, index) => (
                    <motion.a 
                    className="cursor-pointer"
                    href={item.link}
                    key={index} style={styles.headerItemText} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration2, delay: animationTokens.duration2 / headerItems.length + index * 0.1 }}>{item.text}</motion.a>
                ))}
            </motion.div>
        </div>
    )
}