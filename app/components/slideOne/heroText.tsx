'use client'

import { animationTokens } from "@/app/tokens/animationTokens";
import { colors } from "@/app/tokens/colors";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import IntegrityButton from "../IntegrityButton";


export default function HeroText({ setFirstPurchaseButtonInView }: { 
    firstPurchaseButtonInView: boolean,
    setFirstPurchaseButtonInView: (value: boolean) => void 

}) {
    const buttonRef = React.useRef(null);
    const isInView = useInView(buttonRef, {
        margin: "-10px 0px 0px 0px" // This will trigger 100px before the button hits the top
    });

    // Update the parent state when visibility changes
    useEffect(() => {
        setFirstPurchaseButtonInView(isInView);
    }, [isInView, setFirstPurchaseButtonInView]);

    const styles = {
        text: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'boldMain',
        },
        subText: {
            fontWeight: 'bold',
            color: colors.white,
            fontFamily: 'secondary',
        },
        button: {
            backgroundColor: colors.white,
            color: colors.white,
            padding: '10px 20px',
            borderRadius: '200px',
        },
        buttonText: {
            fontWeight: 'bold',
            color: colors.primary,
            fontFamily: 'secondary',
        }
    }

    const albumTextParts = [
        'New Album',
        'Fragrance',
        'Audiobook',
    ]
 
    return (
        <>
            <div id="product-display-image" className="leading-none absolute bottom-[15%] z-1 flex flex-col items-center justify-center gap-[10px]">
                <motion.div className="w-max h-max" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: animationTokens.duration1, delay: animationTokens.delay1 }}>
                    <Image 
                        width={50} 
                        height={50} 
                        className="object-cover 
                        sm:w-[45px] sm:h-[20px] 
                        md:w-[55px] md:h-[35px] 
                        lg:w-[70px] lg:h-[45px]
                        " 
                        src="/assets/images/parental-guidance.png" 
                        alt="integrity-cover" 
                        priority 
                    />
                </motion.div>
                <div className="flex flex-row gap-2">
                    {albumTextParts.map((part, index) => (
                        <React.Fragment key={index}>
                            <motion.h1 
                                className="sm:text-[1rem] lg:text-[1.5rem] text-[1rem] select-none" 
                                style={styles.subText} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: animationTokens.duration2, delay: index * animationTokens.delay2 / 3 }}
                            >
                                {part}{index !== albumTextParts.length - 1 ? ' |' : ''}
                            </motion.h1>
                        </React.Fragment>
                    ))}
                </div>
                <motion.h1 
                    className="sm:text-[4rem] lg:text-[7rem] text-[3rem] select-none"
                    style={styles.text} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: animationTokens.duration3, delay: animationTokens.delay3 }}
                >
                    INTEGRITY
                </motion.h1>
                <Link href="#product-page-marker">
                    <motion.div
                        ref={buttonRef}
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: animationTokens.duration4, delay: animationTokens.delay4 }}
                    >
                        <IntegrityButton
                            backgroundColor={colors.white}
                            borderColor={colors.primary}
                            textColor={colors.primary}
                            className="sm:text-[0.75rem] lg:text-[1rem] text-[1.15rem] select-none"
                        >
                            PURCHASE
                        </IntegrityButton>
                    </motion.div>
                </Link>
            </div>
        </>
    )
}
