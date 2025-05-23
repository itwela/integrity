'use client'

import { colors } from "@/app/tokens/colors"
import { style } from "framer-motion/client"
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens"

export default function PurchaseInformation() {

    const styles = {
        container: {
            padding: '0 5%',
            width: '100%',
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
        },
        priceText: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'boldMain',
        },
        priceSubText: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'boldMain',
        },
        priceNotes: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'boldMain',
        },
        button: {
            backgroundColor: colors.white,
            color: colors.white,
            padding: '10px 20px',
            width: '100%',
            borderRadius: '200px',
            cursor: 'pointer',
        },
        buttonText: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'secondary',
        }
    }

    const priceText = [
        'NOT SOLD SEPARATELY.',
        'ALL BUNDLED TOGETHER.',
        'LIMITED RELEASE. ONCE IT\'S GONE, IT\'S GONE.',
    ]
 
    return (
        <>
        {/* NOTE - DESKTOP PURCHASE INFORMATION */}
        <div className="sm:flex hidden h-[10%]" style={styles.container}>
            
            <div className="w-[65%]  h-max flex flex-row gap-4 items-center">
                <motion.h1
                className="lg:text-[5rem] select-none"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                style={styles.priceText}>$60</motion.h1>
            
                <div className="flex flex-col">
                    {priceText.map((text, index) => (
                        <motion.h1
                        className="lg:text-[0.80rem] select-none"
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 + index * 0.1 }}
                        style={styles.priceNotes}>{text}</motion.h1>
                    ))}
                </div>
            </div>


            <div className=" w-[35%] flex flex-col h-max gap-[10px] items-center">
                <motion.h1 
                className="lg:text-[0.75rem] select-none"
                initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }} style={styles.priceSubText}>{`Not just an album. Not just a scent. Not just a story.`}</motion.h1>
                <motion.button id="product-buy-now-button" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 * 1.25, delay: animationTokens.duration1 * 1.25 }} style={styles.button}>
                    <p className="select-none" style={styles.buttonText}>BUY NOW</p>
                </motion.button>
            </div>

        </div>

        {/* NOTE - MOBILE PURCHASE INFORMATION */}
        <div className="sm:hidden flex flex-col h-[10%] gap-[10px] items-center">

        </div>

        </>
    )
}