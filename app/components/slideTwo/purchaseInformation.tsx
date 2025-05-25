'use client'

import { animationTokens } from "@/app/tokens/animationTokens"
import { colors } from "@/app/tokens/colors"
import { motion } from "framer-motion"
import Link from "next/link"
import IntegrityButton from "../IntegrityButton"

export default function PurchaseInformation({ firstPurchaseButtonInView }: { firstPurchaseButtonInView: boolean }) {

    const styles = {
        container: {
            padding: '0 5%',
            width: '100%',
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
        mobileButton: {
            backgroundColor: colors.white,
            color: colors.white,
            padding: '10px 20px',
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

    // const paymentLink = process.env.NODE_ENV === 'production' 
    //     ? 'https://buy.stripe.com/14A8wO7fO5Wq5Rg5zcbwk00'
    //     : 'https://buy.stripe.com/test_cNi4gy0YM8mi6GpajYgUM00';

    const paymentLink = 'https://buy.stripe.com/test_cNi4gy0YM8mi6GpajYgUM00';

    return (
        <>
            {/* NOTE - DESKTOP PURCHASE INFORMATION */}
            <div className="lg:flex hidden h-[10%]  max-w-[1200px]" style={styles.container}>

                <div className="w-[60%]  h-max flex flex-row gap-4 items-center">
                    {/* NOTE - PRICE TEXT $60 */}
                    <motion.h1 className=" lg:text-[4rem] text-[3rem] select-none"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                        style={styles.priceText}>$60</motion.h1>
                    {/* NOTE - PRICE SUB TEXT */}
                    <div className="flex flex-col">
                        {priceText.map((text, index) => (
                            <motion.h1 className="lg:text-[0.70rem] text-[0.60rem] select-none"
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 + index * 0.1 }}
                                style={styles.priceNotes}>{text}</motion.h1>
                        ))}
                    </div>
                </div>


                <div className=" w-[40%] flex flex-col h-max gap-[10px] items-center">
                    <motion.h1
                        className="
                            text-[0.5rem]
                            text-center
                            select-none"
                        initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }} style={styles.priceSubText}>{`
                            INTEGRITY — The album, fragrance, and companion book of principles, stories, and insights that shaped the creative process.
                        `}</motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1 / 4 }}
                        className="w-full"
                    >
                        <Link href={paymentLink} target="_blank">
                            <IntegrityButton
                                id="product-buy-now-button"
                                backgroundColor={colors.white}
                                borderColor={colors.primary}
                                textColor={colors.primary}
                                className="lg:text-[0.85rem] text-[0.60rem] select-none !w-full"
                            >
                                PURCHASE
                            </IntegrityButton>
                        </Link>
                    </motion.div>
                </div>

            </div>

            {/* NOTE - TABLET PURCHASE INFORMATION */}
            {/* NOTE - INTEGRITY TEXT on the top of the button */}
            <div className="hidden sm:flex lg:hidden flex-col h-max gap-[20px] items-center w-full max-w-[800px] overflow-hidden">
                <div className="w-[90%] flex flex-col h-max gap-[15px] items-center">

                    <div className="flex flex-col h-max gap-[1px] items-center">

                        <motion.h1 initial={{ opacity: 0, y: -10 }}
                            animate={{
                                opacity: !firstPurchaseButtonInView ? 1 : 0,
                                y: !firstPurchaseButtonInView ? 0 : -10
                            }}
                            viewport={{ once: false }}
                            transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                            className="
                            text-[0.75rem]
                            text-center
                            select-none" style={styles.priceSubText}>{`
                                INTEGRITY — The album, fragrance, and companion book
                            `}</motion.h1>

                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{
                                opacity: !firstPurchaseButtonInView ? 1 : 0,
                                y: !firstPurchaseButtonInView ? 0 : -10
                            }}
                            viewport={{ once: false }}
                            transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                            className="
                            text-[0.75rem]
                            text-center
                            select-none" style={styles.priceSubText}>{`
                                of principles, stories, and insights that shaped the creative process.
                            `}</motion.h1>
                    </div>

                </div>
            </div>
            {/* NOTE - PURCHASE BUTTON */}
            <div className="hidden sm:flex lg:hidden flex-col h-max gap-[20px]  sticky bottom-0 items-center w-full max-w-[800px] overflow-hidden">
                <div className="w-[90%] flex flex-col h-max gap-[15px] items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: !firstPurchaseButtonInView ? 1 : 0,
                            y: !firstPurchaseButtonInView ? 0 : -10
                        }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                    >
                        <Link href={paymentLink} target="_blank">
                            <IntegrityButton
                                id="product-buy-now-button"
                                backgroundColor={colors.white}
                                borderColor={colors.primary}
                                textColor={colors.primary}
                                className="text-[1.15rem] select-none"
                            >
                                PURCHASE
                            </IntegrityButton>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* NOTE - MOBILE PURCHASE INFORMATION */}
            <div className="sm:hidden flex-col h-max gap-[20px] items-center w-[95%] overflow-hidden">
                <div className="w-full flex flex-col h-max gap-[15px] items-center">

                    {/* NOTE - INTEGRITY TEXT on the top of the button */}
                    <div className="flex flex-col w-full  h-max gap-[1px] place-content-center place-items-center">

                        <motion.h1 initial={{ opacity: 0, y: -10 }}
                            animate={{
                                opacity: !firstPurchaseButtonInView ? 1 : 0,
                                y: !firstPurchaseButtonInView ? 0 : -10
                            }}
                            viewport={{ once: false }}
                            transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                            className="
                            text-[0.9rem]
                            text-center
                            w-[90%]
                            select-none" style={styles.priceSubText}>{`
                                INTEGRITY — The album, fragrance, and companion book of principles, stories, and insights that shaped the creative process.
                            `}</motion.h1>

                    </div>

                </div>
            </div>
            <div className="sm:hidden flex flex-col h-[10%] flex-col h-max gap-[20px]  sticky bottom-0 items-center w-full max-w-[300px] overflow-hidden">
                <div className="w-[90%] flex flex-col h-max gap-[15px] items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: !firstPurchaseButtonInView ? 1 : 0,
                            y: !firstPurchaseButtonInView ? 0 : -10
                        }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                    >
                        <Link href={paymentLink} target="_blank">
                            <IntegrityButton
                                id="product-buy-now-button"
                                backgroundColor={colors.white}
                                borderColor={colors.primary}
                                textColor={colors.primary}
                                className="text-[1.15rem] select-none"
                            >
                                PURCHASE
                            </IntegrityButton>
                        </Link>
                    </motion.div>

                </div>
            </div>

        </>
    )
}