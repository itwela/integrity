'use client'

import Image from "next/image";
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens";
import { colors } from "@/app/tokens/colors"
import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function ProductDisplay() {

    const styles = {
        productDisplayText: {
            color: colors.primary,
            fontFamily: 'boldMain',
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
    }

    const productDisplayText = [
        'INTEGRITY is a 3-in-1 release:',
        '• The Album – 11 gritty, grown, and grateful gems from Stic of dead prez and Young Noble of the Outlawz.',
        '• The Audiobook – A deep dive into the vibe, vision, and values behind the bars.',
        '• The Fragrance – Rustic, refreshing, and bold—crafted to complement the power of your presence.',
    ]

    const priceText = [
        '$60 Bundle – Album, Book & Fragrance.',
        'Limited Drop. Not sold separately.',
        'Once it\'s gone, it\'s gone.',
    ]


    const [isOpen, setIsOpen] = React.useState(false);

    const DetailsAccordion = ({ title, children }: { title: string, children: React.ReactNode }) => {

        const toggleAccordion = () => setIsOpen(!isOpen);

        const styles = {
            accordionButton: {
                border: `1px solid ${colors.primary}`,
                borderRadius: '4px',
                padding: '10px 20px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: colors.primary,
                cursor: 'pointer',
                fontFamily: 'boldMain',
                marginTop: '20px'
            },
            content: {
                maxHeight: isOpen ? '500px' : '0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '10px',
                color: colors.primary,
                fontFamily: 'boldMain',
                fontSize: '0.8rem',
            }
        };

        return (
            <div className="w-full h-max">
                <button 
                    onClick={() => toggleAccordion()}
                    style={styles.accordionButton}
                >
                    <span>{title}</span>
                    {isOpen ? (
                        <FaChevronDown
                            size={12}
                            color={colors.primary}
                        />
                    ) : (
                        <FaChevronRight
                            size={12}
                            color={colors.primary}
                        />
                    )}
                </button>

                {isOpen && (
                    <div 
                        style={styles.content}
                    >
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>

            {/* NOTE - DESKTOP PRODUCT DISPLAY */}
            <div className="lg:flex hidden flex-col h-[70%] gap-[10px] items-center justify-center  max-w-[1200px]">

                {/* NOTE - PRODUCT DISPLAY IMAGE */}
                <div className="
                w-[500px] 
                before:absolute before:inset-0 before:bg-[#FFD700] before:opacity-20 before:blur-[2000px]
                relative aspect-[4/3] -z-10 flex flex-row items-center justify-center
                before:absolute before:inset-0 
                ">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <Image fill className="object-cover w-full h-full" src="/assets/images/covernobg.png" alt="integrity-new" priority />
                    </div>
                </div>

                {/* NOTE - PRODUCT DISPLAY TEXT */}
                <div className="flex flex-col">
                    {productDisplayText.map((text, index) => (
                        <motion.h2
                            className="
                            lg:text-[0.8rem]
                            text-[0.60rem]
                            "
                            key={index}
                            style={styles.productDisplayText}
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{
                                duration: animationTokens.duration2,
                                delay: animationTokens.duration2 / productDisplayText.length + index * 0.1
                            }}
                        >
                            {text}
                        </motion.h2>
                    ))}
                </div>

            </div>

            {/* NOTE - TABLET PRODUCT DISPLAY */}
            <div className="hidden sm:flex lg:hidden  flex-col h-[80%] gap-[20px] w-full max-w-[800px] items-center justify-evenly">

                {/* NOTE - PRICE TEXT */}

                {/* NOTE - PRODUCT DISPLAY IMAGE */}
                <div className="w-[450px] relative aspect-[4/3] -z-10 flex items-center justify-center before:absolute before:inset-0 before:bg-[#FFD700] before:opacity-20 before:blur-[2000px]">
                    <div className="w-[450px] relative aspect-[4/3] z-10 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image fill className="object-cover" src="/assets/images/covernobg.png" alt="integrity-cover" priority />
                        </div>
                    </div>
                </div>

                {/* NOTE - PRODUCT DISPLAY TEXT */}
                <div className="flex flex-col w-[90%]">
                {/* <div className="flex flex-col w-[90%] bg-red-400 h-[10px] overflow-hidden"> */}
                    <DetailsAccordion title="Product Details">
                        <p>
                            {productDisplayText[0]}
                        </p>
                        <p>
                            {productDisplayText[1]}
                        </p>
                        <p>
                            {productDisplayText[2]}
                        </p>
                        <p>
                            {productDisplayText[3]}
                        </p>
                    </DetailsAccordion>
                </div>

                <div className="w-[100%] relative justify-between px-8  h-max flex flex-row leading-none gap-[10px] items-center">
                    
                    {/* NOTE - PRICE SUB TEXT */}
                    <div className="flex flex-col gap-[5px]">
                        {priceText.map((text, index) => (
                            <motion.h1
                                className="
                            text-[0.9rem]
                            select-none"
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 + index * 0.1 }}
                                style={styles.priceNotes}>{text}</motion.h1>
                        ))}
                    </div>

                    {/* NOTE - PRICE TEXT $60 */}
                    <motion.h1
                        className="
                            lg:text-[4rem] 
                            text-[3rem]
                            "
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: animationTokens.duration1, delay: animationTokens.duration1 }}
                        style={styles.priceText}>$60</motion.h1>

                </div>

            </div>

            {/* NOTE - MOBILE PRODUCT DISPLAY */}
            <div className="sm:hidden w-full flex flex-col h-[70%] gap-[10px] items-center justify-center">

                {/* NOTE - PRODUCT DISPLAY IMAGE */}
                <div className="w-[300px] relative aspect-[4/3] -z-10 flex flex-row items-center justify-center before:absolute before:inset-0 before:bg-[#FFD700] before:opacity-20 before:blur-[2000px]">
                    <div className="w-[300px] relative aspect-[4/3] z-10 flex flex-row items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-full">
                            <Image fill className="object-contain" src="/assets/images/covernobg.png" alt="integrity-cover" priority />
                        </div>
                    </div>
                </div>

                {/* NOTE - PRODUCT DISPLAY TEXT */}
                <div className="flex flex-col w-[90%]">
                {/* <div className="flex flex-col w-[90%] bg-red-400 h-[10px] overflow-hidden"> */}
                    <DetailsAccordion title="Product Details">
                        <p>
                            {productDisplayText[0]}
                        </p>
                        <p>
                            {productDisplayText[1]}
                        </p>
                        <p>
                            {productDisplayText[2]}
                        </p>
                        <p>
                            {productDisplayText[3]}
                        </p>
                    </DetailsAccordion>
                </div>

            </div>

        </>
    )
}