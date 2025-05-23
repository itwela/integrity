'use client'

import Image from "next/image";
import { motion } from "framer-motion"
import { animationTokens } from "@/app/tokens/animationTokens";
import { colors } from "@/app/tokens/colors"

export default function ProductDisplay() {

    const styles = {
        productDisplayText: {
            color: colors.primary,
            textAlign: 'center' as const,
            fontFamily: 'boldMain',
        }
    }

    const productDisplayText = [
        'INTEGRITY is a 3-in-1 cultural experience.',
        'The Album: Unfiltered, underground, revolutionary sound.',
        'The Audiobook: A journey into the mind and mission.',
        'The Fragrance: Earthy, bold — the smell of legacy.',
    ]

    return (
        <div className="flex flex-col h-[70%] gap-[10px] items-center justify-center">
            
            {/* NOTE - PRODUCT DISPLAY IMAGE */}
            <div  className="w-[500px] relative  aspect-[4/3] -z-10 flex flex-row items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full">
                    <Image fill className="object-contain" src="/assets/images/integrity-product-shot.png" alt="integrity-cover" priority />
                </div>
            </div>

            {/* NOTE - PRODUCT DISPLAY TEXT */}
            <div className="flex flex-col">
           {productDisplayText.map((text, index) => (
            <motion.h2
            className="lg:text-[0.8rem]" 
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
    )
}