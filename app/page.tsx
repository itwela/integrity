'use client'

import Image from "next/image";
import HeroText from "./components/slideOne/heroText";
import IntegrityHeader from "./components/header";
import ProductDisplay from "./components/slideTwo/productDisplay";
import PurchaseInformation from "./components/slideTwo/purchaseInformation";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useState, useEffect } from "react";
import { colors } from "./tokens/colors";
import HowItWorksCards from "./components/slideThree/howItWorksCards";
import { animationTokens } from "@/app/tokens/animationTokens";

export default function Home() {
  const [opacity, setOpacity] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setOpacity(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const styles = {
    hIWHeader: {
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center' as const,
      fontFamily: 'boldMain',
    },
    hIWSubHeader: {
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center' as const,
    }
  }

  return (
    // NOTE - SLIDE ONE
    <>
    {/* NOTE - HEADER */}
    <IntegrityHeader/>

    {/* NOTE - BACKGROUND IMAGE */}
    <div className="fixed top-0 left-0 w-full h-full -z-10">

        <div className="bg-black w-full h-full absolute top-0 left-0 z-[1]" style={{ opacity: opacity }}></div>
        <Image fill className="object-cover w-full h-full" src="/assets/images/integrity-albumn-cover.png" alt="integrity-cover" priority />
    
    </div>

    {/* NOTE - HERO TEXT */}
    <div className="flex relative  h-screen w-full place-content-center">
      <HeroText />
    </div>

    {/* NOTE - PRODUCT DISPLAY */}
    <div className="flex gap-[30px] relative flex-col h-screen w-full place-content-center">
      <div id="product-page-marker" className="absolute top-0 left-0 z-[-1] w-[100px] h-[100px]"></div>
      <ProductDisplay />
      <PurchaseInformation />
    </div>

    {/* NOTE - HOW IT WORKS */}
    <div className="flex relative gap-[15px] flex-col h-screen w-full place-content-center">
      
        <div className="flex flex-col relative items-center justify-center">
          <div id="how-it-works-marker" className="absolute top-0 left-0 z-[-1] w-[100px] h-[100px]"></div>
          <motion.h1 
          className="lg:text-[5rem] leading-none"
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration2 * 1.25, delay: animationTokens.duration2 * 1.25 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
          <motion.h2 initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>
      
      <HowItWorksCards/>
    </div>

    </>
  );
}
