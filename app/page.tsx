'use client'

import Image from "next/image";
import HeroText from "./components/slideOne/heroText";
import IntegrityHeader from "./components/header";
import ProductDisplay from "./components/slideTwo/productDisplay";
import PurchaseInformation from "./components/slideTwo/purchaseInformation";
import { useScroll, motion, useTransform } from "framer-motion";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { colors } from "./tokens/colors";
import HowItWorksCards from "./components/slideThree/howItWorksCards";
import { animationTokens } from "@/app/tokens/animationTokens";

export default function Home() {
  const [opacity, setOpacity] = useState(0);
  const { scrollYProgress } = useScroll();

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    scrollToTop();
    
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setOpacity(latest * 1.66);
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
    <IntegrityHeader showHeader={true} />

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
    <div className="flex relative gap-[15px] flex-col h-max sm:h-screen pt-8 w-full place-content-center">
      
      {/* NOTE - DESKTOP HOW IT WORKS */}
        <div className="flex flex-col hidden sm:flex relative items-center justify-center">
          <div id="how-it-works-marker" className="absolute top-0 left-0 z-[-1] w-[100px] h-[100px]"></div>
          <motion.h1 
          className="lg:text-[5rem] leading-none select-none"
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 , delay: animationTokens.duration1 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
          <motion.h2 className="select-none" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>

        {/* NOTE - MOBILE HOW IT WORKS */}
        <div className="sm:hidden w-full flex flex-col absolute top-0 place-self-center py-4 h-[30vh]  z-[1]  items-center justify-center">
          <motion.h1 
          className="text-[1.75rem] leading-none select-none"
          initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration1 , delay: animationTokens.duration1 }} style={styles.hIWHeader}>HOW IT WORKS</motion.h1>
          <motion.h2 className="select-none" initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: animationTokens.duration3 * 1.25, delay: animationTokens.duration3 * 1.25 }} style={styles.hIWSubHeader}>In Three Steps</motion.h2>
        </div>
      
      <div className="sm:hidden h-[100px]"/>
        <HowItWorksCards/>


    </div>

    </>
  );
}
